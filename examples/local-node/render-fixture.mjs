#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { createAgentGlowTimeline, renderAgentGlowToSvg } from '../../packages/core/src/index.ts';

const fixture = JSON.parse(readFileSync(new URL('../../tests/fixtures/presence-run.json', import.meta.url), 'utf8'));
const timeline = createAgentGlowTimeline(fixture.events, { theme: fixture.theme });
const frame = renderAgentGlowToSvg(timeline.final, { title: `${fixture.name}: ${timeline.final.label}` });
writeFileSync(new URL('./crewcmd-approval.svg', import.meta.url), frame.svg);
console.log(`Rendered ${timeline.final.state} ${frame.preset} frame`);
