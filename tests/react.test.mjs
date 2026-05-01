import test from 'node:test';
import assert from 'node:assert/strict';
import { AgentGlow, useAgentGlowController } from '../packages/react/src/index.ts';

test('AgentGlow smoke covers controlled state, theme, audio, and aria', () => {
  const snapshots = [];
  const element = AgentGlow({
    state: 'speaking',
    preset: 'waveform-halo',
    theme: { palette: { accent: '#8B5CF6' }, contrast: 'high' },
    input: { speechLevel: 0.62 },
    agent: { name: 'Neo' },
    ariaLabel: 'Neo is speaking',
    liveRegion: 'polite',
    onSnapshot: (snapshot) => snapshots.push(snapshot),
  });
  assert.equal(element.role, 'img');
  assert.equal(element.ariaLabel, 'Neo is speaking');
  assert.equal(element.liveRegion, 'polite');
  assert.equal(element.snapshot.state, 'speaking');
  assert.match(element.svg, /Neo is speaking/);
  assert.equal(snapshots.length, 1);
});

test('controller hook helper supports updates and cleanup', () => {
  let count = 0;
  const controller = useAgentGlowController({ state: 'idle', onSnapshot: () => count++ });
  const unsubscribe = controller.subscribe(() => count++);
  controller.setState('waiting', { reason: 'approval-required' });
  assert.equal(controller.getSnapshot().state, 'waiting');
  unsubscribe();
  controller.destroy();
  controller.setState('success');
  assert.equal(controller.getSnapshot().state, 'success');
  assert.ok(count >= 3);
});

test('reduced motion emits renderer warning and low-power target', () => {
  const warnings = [];
  const element = AgentGlow({ state: 'thinking', reducedMotion: true, quality: 'low-power', onRendererWarning: (warning) => warnings.push(warning) });
  assert.equal(element.snapshot.reducedMotion, true);
  assert.ok(warnings.some((warning) => warning.code === 'reduced-motion'));
});
