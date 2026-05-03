import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('agentglow-render CLI renders fixture SVG locally', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agentglow-'));
  const out = join(dir, 'frame.svg');
  const stdout = execFileSync(process.execPath, ['bin/agentglow-render.mjs', '--fixture', 'tests/fixtures/presence-run.json', '--out', out], { encoding: 'utf8' });
  const result = JSON.parse(stdout);
  assert.equal(result.ok, true);
  assert.equal(result.state, 'success');
  assert.equal(result.preset, 'console-pulse');
  assert.equal(existsSync(out), true);
  assert.match(readFileSync(out, 'utf8'), /CrewCmd approval run/);
});
