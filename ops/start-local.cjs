const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const portable = path.join(root, '.tools/python/python.exe');
const python = process.env.PYTHON || (fs.existsSync(portable) ? portable : 'python');
const children = [];
function start(command, args) {
  const child = spawn(command, args, { cwd: root, stdio: 'inherit', windowsHide: true });
  children.push(child);
  child.on('error', error => { console.error(error.message); stop(1); });
  child.on('exit', code => stop(code || 0));
}
let stopping = false;
function stop(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
start(python, ['TigersTeamPython/scripts/local_server.py']);
start(process.execPath, ['ops/preview.cjs']);
