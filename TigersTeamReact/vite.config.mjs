import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(root, 'src');

function findIconImports(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return findIconImports(file);
    if (!/\.[jt]sx?$/.test(entry.name)) return [];
    return [...fs.readFileSync(file, 'utf8').matchAll(/from\s*['"](@mui\/icons-material\/[^'"]+)['"]/g)].map(match => match[1]);
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, 'REACT_APP_');
  const proxyTarget = process.env.BACKEND_PROXY_TARGET || 'http://127.0.0.1:8081';
  const alias = Object.fromEntries(fs.readdirSync(source).map(name => [name.replace(/\.js$/, ''), path.join(source, name)]));
  return {
    resolve: { alias },
    define: {
      'process.env': JSON.stringify({ ...env, NODE_ENV: mode === 'production' ? 'production' : 'development' }),
      ...Object.fromEntries(Object.entries(env).map(([name, value]) => [`process.env.${name}`, JSON.stringify(value)])),
    },
    plugins: [{
      name: 'existing-jsx-files',
      enforce: 'pre',
      async transform(code, id) {
        if (id.replaceAll('\\', '/').includes('/src/') && id.endsWith('.js')) {
          return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
        }
      },
    }],
    optimizeDeps: { include: [...new Set(findIconImports(source))].sort(), esbuildOptions: { loader: { '.js': 'jsx' } } },
    server: {
      strictPort: true,
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true, rewrite: value => value.replace(/^\/api/, '') },
        '/static/images': { target: proxyTarget, changeOrigin: true },
        '/hls': {
          target: process.env.SRS_HTTP_PROXY_TARGET || 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: value => value.replace(/^\/hls/, ''),
        },
        '/rtc/v1/whep': {
          target: process.env.SRS_API_PROXY_TARGET || 'http://127.0.0.1:1985',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'build',
      rollupOptions: { onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning);
      }, output: {
        entryFileNames: 'static/js/[name]-[hash].js',
        chunkFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: asset => asset.names?.[0]?.endsWith('.css') ? 'static/css/[name]-[hash][extname]' : 'static/media/[name]-[hash][extname]',
      } },
    },
  };
});
