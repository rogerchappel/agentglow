import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url);
const tempDir = mkdtempSync(join(tmpdir(), 'agentglow-pack-'));
const packDir = join(tempDir, 'pack');
const consumerDir = join(tempDir, 'consumer');

execFileSync('mkdir', ['-p', packDir, consumerDir]);

const packJson = execFileSync('npm', ['pack', '--json', '--pack-destination', packDir, repoRoot.pathname], { encoding: 'utf8' });
const [pack] = JSON.parse(packJson);
const packedFiles = new Set(pack.files.map((file) => file.path));

for (const required of [
  'package.json',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/core/src/index.js',
  'dist/core/src/index.d.ts',
  'dist/core/src/types.js',
  'dist/react/src/index.js',
  'dist/react/src/index.d.ts',
  'packages/core/src/index.ts',
  'packages/react/src/index.ts',
  'bin/agentglow-render.mjs',
]) {
  assert.ok(packedFiles.has(required), `packed tarball should include ${required}`);
}

for (const excluded of ['AGENTS.md', 'src/index.js', 'tests/core.test.mjs', 'scripts/pack-smoke.mjs']) {
  assert.equal(packedFiles.has(excluded), false, `packed tarball should not include ${excluded}`);
}

const tarball = join(packDir, pack.filename);
execFileSync('npm', ['init', '-y'], { cwd: consumerDir, stdio: 'pipe' });
execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], { cwd: consumerDir, stdio: 'pipe' });

const importSmoke = `
  import assert from 'node:assert/strict';
  import { createAgentGlowController as createRootController } from 'agentglow';
  import { createAgentGlowController, renderAgentGlowToSvg } from 'agentglow/core';
  import { AgentGlow, renderAgentGlowElementHtml } from 'agentglow/react';
  const root = createRootController({ state: 'idle' });
  assert.equal(root.getSnapshot().state, 'idle');
  const core = createAgentGlowController({ state: 'thinking', preset: 'console-pulse' });
  assert.match(renderAgentGlowToSvg(core.getSnapshot()).svg, /Agent thinking/);
  const element = AgentGlow({ state: 'speaking', ariaLabel: 'Pack smoke speaking' });
  assert.match(renderAgentGlowElementHtml(element), /Pack smoke speaking/);
`;
execFileSync(process.execPath, ['--input-type=module', '--eval', importSmoke], { cwd: consumerDir, stdio: 'pipe' });

const fixturePath = join(consumerDir, 'presence-run.json');
const svgPath = join(consumerDir, 'frame.svg');
writeFileSync(fixturePath, JSON.stringify({
  name: 'Pack smoke run',
  theme: { shape: 'orb' },
  events: [
    { type: 'presence.turn.started', source: 'agent', message: 'Planning' },
    { type: 'presence.tool.completed', toolName: 'pack.smoke', message: 'Done' },
  ],
}, null, 2));

const cliPath = join(consumerDir, 'node_modules/.bin/agentglow-render');
const cliOutput = JSON.parse(execFileSync(cliPath, ['--fixture', fixturePath, '--out', svgPath], { cwd: consumerDir, encoding: 'utf8' }));
assert.equal(cliOutput.ok, true);
assert.equal(cliOutput.state, 'success');

console.log(`Pack smoke passed (${pack.entryCount} files, ${pack.filename})`);
