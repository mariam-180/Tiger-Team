import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

test('admin tables render with search and populated rows without a global regenerator runtime', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const source = path.join(root, 'src');
  const folder = await mkdtemp(path.join(tmpdir(), 'tigers-admin-render-'));
  const output = path.join(folder, 'table.cjs');
  try {
    const alias = Object.fromEntries(
      (await readdir(source)).map((name) => [
        name.replace(/\.js$/, ''),
        path.join(source, name),
      ]),
    );
    await build({
      stdin: {
        resolveDir: root,
        loader: 'jsx',
        contents: `
        import React from 'react';
        import { renderToString } from 'react-dom/server';
        import { ThemeProvider } from '@mui/material/styles';
        import theme from './src/assets/theme';
        import Table from './src/components/ThisEnhancedTable';
        import Notice from './src/components/NotificationToast';
        import PageFailure from './src/components/PageFailure';
        import {ConfigValue} from './src/pages/admin/streaming';
        export const renderNotice = (message, severity) => renderToString(<ThemeProvider theme={theme}><Notice message={message} severity={severity} /></ThemeProvider>);
        export const notificationTransitionContract = () => {
          const ref = React.createRef();
          const style = {opacity:0,transform:'scale(0.75)'};
          const element = Notice.render({message:'Transition check',style},ref);
          return {supportsRef: Notice.$$typeof === Symbol.for('react.forward_ref'), forwardsRef:element.ref===ref, forwardsStyle:element.props.style===style};
        };
        export const renderConfig = (secret) => renderToString(<ThemeProvider theme={theme}><ConfigValue label="Publish key" value="test-stream-secret" secret={secret} /></ThemeProvider>);
        export const renderFailure = () => renderToString(<PageFailure />);
        export function render(rows) {
          return renderToString(<ThemeProvider theme={theme}><Table title="Customers" columns={[{Header:'Name',accessor:'name'}]} rows={rows} canSearch /></ThemeProvider>);
        }
      `,
      },
      jsx: 'automatic',
      jsxDev: true,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      outfile: output,
      loader: { '.js': 'jsx', '.css': 'empty' },
      alias,
      logLevel: 'silent',
    });
    const require = createRequire(import.meta.url);
    const table = require(output);
    const originalError = console.error;
    const warnings = [];
    try {
      console.error = (...args) => {
        if (
          !String(args[0]).includes(
            'useLayoutEffect does nothing on the server',
          )
        )
          warnings.push(args.map(String).join(' '));
      };
      assert.match(table.render([{ name: 'Test Driver' }]), /Test Driver/);
      assert.match(table.render([]), /No records yet/);
      assert.match(
        table.render([{ name: 'Long category and customer name' }]),
        /data-label="Name"/,
      );
      for (const [severity, label] of Object.entries({
        info: 'Update',
        success: 'Completed',
        warning: 'Please check',
        error: 'Something needs attention',
      })) {
        const html = table.renderNotice('<script>alert(1)</script>', severity);
        assert.ok(html.includes(label));
        assert.ok(
          html.includes(
            severity === 'error' ? 'role="alert"' : 'role="status"',
          ),
        );
        assert.ok(!html.includes('<script>'));
      }
      assert.deepEqual(table.notificationTransitionContract(), {
        supportsRef: true,
        forwardsRef: true,
        forwardsStyle: true,
      });
      assert.ok(table.renderConfig(false).includes('test-stream-secret'));
      assert.ok(!table.renderConfig(true).includes('test-stream-secret'));
      assert.match(table.renderFailure(), /Reload page/);
      assert.match(table.renderFailure(), /Back to start/);
      assert.deepEqual(warnings, [], 'Table must not emit React prop warnings');
    } finally {
      console.error = originalError;
    }
  } finally {
    const allowed = path.resolve(tmpdir()) + path.sep;
    if (!path.resolve(folder).startsWith(allowed))
      throw new Error('Unexpected test directory');
    await rm(folder, { recursive: true, force: true });
  }
});

test('all eight admin sections render without prop warnings before data selection', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const source = path.join(root, 'src');
  const folder = await mkdtemp(path.join(tmpdir(), 'tigers-admin-pages-'));
  const output = path.join(folder, 'pages.cjs');
  const names = [
    'users',
    'products',
    'orders',
    'reservation',
    'events',
    'controllers',
    'streaming',
    'reports',
  ];
  try {
    const alias = Object.fromEntries(
      (await readdir(source)).map((name) => [
        name.replace(/\.js$/, ''),
        path.join(source, name),
      ]),
    );
    await build({
      stdin: {
        resolveDir: root,
        loader: 'jsx',
        contents: `
        import React from 'react';
        import {renderToString} from 'react-dom/server';
        import {MemoryRouter} from 'react-router-dom';
        import {ThemeProvider} from '@mui/material/styles';
        import theme from './src/assets/theme';
        import AdminWorkspace from './src/pages/admin/AdminWorkspace';
        import {SnackbarProvider} from './src/context/SnackbarContext';
        ${names.map((name) => `import ${name} from './src/pages/admin/${name}';`).join('\n')}
        const pages={${names.join(',')}};
        export const render = (name) => {
          const Page=pages[name];
          return renderToString(<ThemeProvider theme={theme}><MemoryRouter><SnackbarProvider><AdminWorkspace><Page/></AdminWorkspace></SnackbarProvider></MemoryRouter></ThemeProvider>);
        };
      `,
      },
      jsx: 'automatic',
      jsxDev: true,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      outfile: output,
      loader: {
        '.js': 'jsx',
        '.css': 'empty',
        '.png': 'dataurl',
        '.webp': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.svg': 'dataurl',
        '.mp3': 'dataurl',
        '.avif': 'dataurl',
      },
      alias,
      logLevel: 'silent',
      plugins: [
        {
          name: 'isolated-test-session',
          setup(builder) {
            builder.onResolve({ filter: /^authContext$/ }, () => ({
              path: 'auth',
              namespace: 'test',
            }));
            builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
              contents: `export const useAuth=()=>({userRole:'SUPER_USER',logout:()=>{},loading:false,tokenValid:true,accessToken:'test-only'}); export const AuthProvider=({children})=>children;`,
              loader: 'jsx',
            }));
          },
        },
      ],
    });
    const require = createRequire(import.meta.url);
    const pages = require(output);
    const originalError = console.error;
    const warnings = [];
    try {
      console.error = (...args) => {
        if (
          !String(args[0]).includes(
            'useLayoutEffect does nothing on the server',
          )
        )
          warnings.push(args.map(String).join(' '));
      };
      for (const name of names) {
        assert.match(
          pages.render(name),
          /admin-workspace/,
          `${name} must render`,
        );
      }
      assert.deepEqual(
        warnings,
        [],
        'Admin sections must not emit React prop warnings',
      );
    } finally {
      console.error = originalError;
    }
  } finally {
    if (!path.resolve(folder).startsWith(path.resolve(tmpdir()) + path.sep))
      throw new Error('Unexpected test directory');
    await rm(folder, { recursive: true, force: true });
  }
});
