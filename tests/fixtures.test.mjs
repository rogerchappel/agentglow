import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createAgentGlowAudioSmoother,
  createAgentGlowController,
  createAgentGlowTimeline,
  normalizeAgentGlowTheme,
  readAgentGlowAnalyserFrame,
  renderAgentGlowToSvg,
} from '../packages/core/src/index.ts';

const loadJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

test('presence fixture replays to expected final state', () => {
  const fixture = loadJson('tests/fixtures/presence-run.json');
  const timeline = createAgentGlowTimeline(fixture.events, { theme: fixture.theme, now: () => 1700000000000 });
  assert.equal(timeline.steps.length, fixture.events.length);
  assert.equal(timeline.final.state, fixture.expectedFinalState);
  assert.equal(timeline.final.theme.shape, 'console-pulse');
  assert.equal(timeline.steps.at(-2).snapshot.state, 'waiting');
});

test('audio fixture smooths without microphone permissions', () => {
  const frames = loadJson('tests/fixtures/audio-frames.json');
  const smoother = createAgentGlowAudioSmoother({ attack: 0.9, release: 0.4, silenceFrames: 2 });
  const output = frames.map((frame) => smoother.push(frame));
  assert.ok(output.some((frame) => frame.level > 0.5));
  assert.equal(output.at(-1).level < output.at(-3).level, true);
});

test('theme fixture normalizes product presets', () => {
  const themes = loadJson('tests/fixtures/themes.json');
  assert.equal(normalizeAgentGlowTheme(themes.crewcmd).palette.accent, '#8B5CF6');
  assert.equal(normalizeAgentGlowTheme(themes.incident).motion.tempo, 'rapid');
});

test('analyser-like adapter converts frequency data to local input frames', () => {
  const analyser = {
    frequencyBinCount: 4,
    getByteFrequencyData(array) { array.set([0, 64, 128, 255]); },
    getFloatTimeDomainData(array) { array.set([0.2, -0.2, 0.4, -0.4]); },
  };
  const frame = readAgentGlowAnalyserFrame(analyser);
  assert.deepEqual(frame.frequencyBands, [0, 0.25098039215686274, 0.5019607843137255, 1]);
  assert.ok(Math.abs(frame.speechLevel - 0.3) < 0.00001);
  assert.equal(frame.activityLevel, 1);
});


test('canonical state matrix renders accessible distinct frames', () => {
  const fixture = JSON.parse(readFileSync('tests/fixtures/state-matrix.json', 'utf8'));
  const rendered = new Set();
  const terminal = [];
  for (const state of fixture.states) {
    const controller = createAgentGlowController({ state });
    const snapshot = controller.getSnapshot();
    const frame = renderAgentGlowToSvg(snapshot, { title: snapshot.label });
    assert.match(frame.svg, /role="img"/);
    assert.match(frame.svg, new RegExp(snapshot.label));
    rendered.add(frame.svg.replace(/updatedAt="[^"]+"/g, ''));
    if (snapshot.isTerminal) terminal.push(state);
  }
  assert.ok(rendered.size >= fixture.minimumDistinctSvgCount);
  assert.deepEqual(terminal, fixture.requiredTerminalStates);
});
