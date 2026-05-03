import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENT_GLOW_STATES,
  createAgentGlowAudioSmoother,
  createAgentGlowController,
  createAgentGlowCssVars,
  createAgentGlowMockAnalyser,
  getAgentGlowStateMeta,
  normalizeAgentGlowTheme,
  renderPresetFixture,
} from '../packages/core/src/index.ts';

test('valid states expose metadata and invalid states throw', () => {
  assert.equal(AGENT_GLOW_STATES.length, 10);
  assert.equal(getAgentGlowStateMeta('tool-running').ariaLabel, 'Agent running a tool');
  assert.throws(() => getAgentGlowStateMeta('loading'), /Unknown AgentGlow state/);
});

test('controller maps events to deterministic snapshots', () => {
  let time = 100;
  const glow = createAgentGlowController({ now: () => time });
  glow.send({ type: 'presence.turn.started', source: 'user', runId: 'run_1' });
  assert.equal(glow.getSnapshot().state, 'listening');
  glow.setInput({ inputLevel: 1, frequencyBands: [0.2, 2, -1] });
  assert.deepEqual(glow.getSnapshot().input.frequencyBands, [0.2, 1, 0]);
  time = 101;
  glow.send({ type: 'presence.tool.started', toolName: 'github.createPullRequest', runId: 'run_1' });
  assert.equal(glow.getSnapshot().state, 'tool-running');
  assert.equal(glow.getSnapshot().meta.toolName, 'github.createPullRequest');
  assert.equal(glow.getSnapshot().updatedAt, 101);
});

test('theme normalization handles defaults, contrast, and reduced motion', () => {
  const theme = normalizeAgentGlowTheme({ palette: { accent: '#000000' }, contrast: 'high', motion: { reduced: true, intensity: 9 }, glow: -1 });
  assert.equal(theme.palette.accent, '#000000');
  assert.equal(theme.palette.text, '#FFFFFF');
  assert.equal(theme.motion.reduced, true);
  assert.equal(theme.motion.intensity, 1);
  assert.equal(theme.glow, 0);
});

test('audio smoothing attacks, releases, and marks silence', () => {
  const smoother = createAgentGlowAudioSmoother({ attack: 1, release: 1, silenceThreshold: 0.1, silenceFrames: 2 });
  assert.equal(smoother.push({ speechLevel: 0.8 }).level, 0.8);
  assert.equal(smoother.push({ speechLevel: 0 }).silent, false);
  assert.equal(smoother.push({ speechLevel: 0 }).silent, true);
});

test('mock analyser and renderer presets work offline with visible distinctions', () => {
  const analyser = createAgentGlowMockAnalyser([{ inputLevel: 0.5, frequencyBands: [0.1, 0.5, 0.9] }]);
  assert.equal(analyser.next().inputLevel, 0.5);
  const frames = ['orb', 'waveform-halo', 'constellation', 'console-pulse', 'minimal-dot-field'].map((preset) => renderPresetFixture(preset, 'speaking'));
  assert.equal(new Set(frames.map((frame) => frame.svg)).size, 5);
  for (const frame of frames) {
    assert.match(frame.svg, /<svg role="img"/);
    assert.equal(frame.fpsTarget, 60);
  }
});


test('CSS variable helper exposes normalized theme tokens', () => {
  const vars = createAgentGlowCssVars({ palette: { accent: '#111111' }, motion: { reduced: true }, shape: 'constellation' });
  assert.equal(vars['--agentglow-accent'], '#111111');
  assert.equal(vars['--agentglow-motion-reduced'], 'true');
  assert.equal(vars['--agentglow-shape'], 'constellation');
});
