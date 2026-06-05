import { spawn } from 'child_process';

const PORT = 5173;
const url = `http://localhost:${PORT}`;

const vite = spawn('npm', ['run', 'dev', '--', '--port', PORT, '--strictPort'], {
  shell: true,
  stdio: 'ignore'
});

setTimeout(() => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [`--app=${url}`], {
    stdio: 'ignore'
  });

  chrome.on('exit', () => {
    vite.kill('SIGTERM');
    process.exit();
  });
}, 5000);
