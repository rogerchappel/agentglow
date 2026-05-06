#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { createAgentGlowTimeline, renderAgentGlowToSvg } from '../dist/core/src/index.js';

function usage(exitCode = 0) {
  const out = exitCode === 0 ? console.log : console.error;
  out(`Usage: agentglow-render --fixture tests/fixtures/presence-run.json [--out frame.svg] [--quality balanced]\n\nRenders the final AgentGlow snapshot from a local JSON fixture. No network calls, no microphone access.`);
  process.exit(exitCode);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) usage(0);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const fixturePath = valueAfter('--fixture');
if (!fixturePath) usage(1);
const outPath = valueAfter('--out');
const quality = valueAfter('--quality') ?? 'balanced';

const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
const timeline = createAgentGlowTimeline(fixture.events ?? [], { theme: fixture.theme, state: fixture.state, input: fixture.input });
const frame = renderAgentGlowToSvg(timeline.final, { quality, title: `${fixture.name ?? 'AgentGlow fixture'}: ${timeline.final.label}` });

if (outPath) {
  writeFileSync(outPath, frame.svg);
  console.log(JSON.stringify({ ok: true, out: outPath, state: timeline.final.state, preset: frame.preset, fpsTarget: frame.fpsTarget }));
} else {
  process.stdout.write(frame.svg);
}
