import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAgentGlowController, renderAgentGlowToSvg } from '../packages/core/src/index.ts';

const glow = createAgentGlowController({ state: 'speaking', preset: 'orb', input: { speechLevel: 0.62 } });
const frame = renderAgentGlowToSvg(glow.getSnapshot(), { quality: 'balanced' });
assert.match(frame.svg, /Agent speaking/);
assert.equal(frame.fpsTarget, 60);
for (const file of ['README.md', 'docs/API.md', 'docs/PERFORMANCE.md', 'docs/ACCESSIBILITY.md']) {
  assert.ok(readFileSync(file, 'utf8').length > 200, `${file} should be substantive`);
}
console.log('Build smoke passed');
