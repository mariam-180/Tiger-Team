import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from 'vite';

const frontend = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const root = path.dirname(frontend);
const api = 'http://127.0.0.1:8081';
let backend;
let server;
let stopping = false;

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  await server?.close();
  backend?.kill();
}

process.on('SIGINT', () => void stop());
process.on('SIGTERM', () => void stop());

async function ready() {
  try {
    const response = await fetch(`${api}/branches/`, {
      signal: AbortSignal.timeout(1000),
    });
    return response.ok && Array.isArray(await response.json());
  } catch {
    return false;
  }
}

try {
  if (!(await ready())) {
    const portable = path.join(root, '.tools', 'python', 'python.exe');
    const python =
      process.env.PYTHON || (existsSync(portable) ? portable : 'python');
    console.log('Starting local API; waiting for the database and branches...');
    backend = spawn(python, ['TigersTeamPython/scripts/local_server.py'], {
      cwd: root,
      stdio: 'inherit',
      windowsHide: true,
    });
    let failure;
    backend.on('error', (error) => {
      failure = error;
    });
    backend.on('exit', (code) => {
      failure = new Error(
        `Local API exited (${code}). See the API error above.`,
      );
      if (server && !stopping) {
        console.error(failure.message);
        void stop(1);
      }
    });
    const deadline = Date.now() + 60000;
    while (!(await ready())) {
      if (failure) throw failure;
      if (stopping) break;
      if (Date.now() > deadline)
        throw new Error('Local API did not become ready within 60 seconds.');
      await delay(300);
    }
    if (failure) throw failure;
  } else {
    console.log('Using the running local API on port 8081.');
  }

  if (!stopping) {
    console.log(
      'Development admin credentials: open ' +
        path.join(root, '.local', 'admin-access.txt') +
        ". Each computer generates its own password; another developer's password will not work.",
    );
    // The local launcher always pairs Vite with the local API, even if a shell
    // retains an old Docker proxy override. start:frontend supports custom APIs.
    process.env.BACKEND_PROXY_TARGET = api;
    server = await createServer({
      root: frontend,
      server: { host: '127.0.0.1', port: 3000, strictPort: true },
    });
    await server.listen();
    server.printUrls();
    console.log(
      'Frontend and API are ready. Keep this terminal open; Ctrl+C stops them.',
    );
  }
} catch (error) {
  console.error(error.message);
  if (error.message.includes('3000')) {
    console.error(
      'Another server uses port 3000. Stop its terminal with Ctrl+C, then run npm.cmd start again.',
    );
  }
  await stop(1);
}
