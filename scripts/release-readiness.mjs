#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const checks = [
  ['Contract check', ['run', 'check']],
  ['Unit and fixture tests', ['test']],
  ['Runtime build and smoke', ['run', 'build']],
  ['CLI fixture smoke', ['run', 'smoke']],
  ['Package smoke', ['run', 'package:smoke']],
];

for (const [name, args] of checks) {
  console.log(`\n==> ${name}`);
  const result = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) {
    console.error(`${name} could not start: ${result.error.message}`);
    process.exit(result.status ?? 1);
  }
  if (result.status !== 0) {
    console.error(`${name} failed${result.signal ? ` (${result.signal})` : ` with exit code ${result.status}`}.`);
    process.exit(result.status ?? 1);
  }
}
console.log('\nRelease readiness checks passed. No release or publication was performed.');
