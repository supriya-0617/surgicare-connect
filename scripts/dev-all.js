#!/usr/bin/env node
// Simple dev orchestrator: runs `npm run start:server` and `npm run dev` in parallel
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function run(cmd, args, name) {
  // spawn in project root so npm looks up the correct package.json
  const ps = spawn(cmd, args, { cwd: projectRoot, stdio: 'inherit', shell: true });

  ps.on('exit', (code) => {
    console.log(`${name} exited with ${code}`);
  });

  return ps;
}

const server = run('npm', ['run', 'start:server'], 'server');
const vite = run('npm', ['run', 'dev'], 'vite');

function shutdown() {
  [server, vite].forEach((p) => {
    try { p.kill(); } catch (e) {}
  });
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
