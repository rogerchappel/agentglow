import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'docs/architecture.md',
  'docs/acceptance-examples.md',
  'packages/core/src/types.ts',
  'packages/core/src/index.ts',
  'packages/react/src/index.ts',
];

const states = [
  'idle',
  'listening',
  'thinking',
  'speaking',
  'tool-running',
  'waiting',
  'blocked',
  'error',
  'success',
  'interrupted',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing contract file: ${file}`);
  }
}

const architecture = readFileSync('docs/architecture.md', 'utf8');
const examples = readFileSync('docs/acceptance-examples.md', 'utf8');
const types = readFileSync('packages/core/src/types.ts', 'utf8');

for (const state of states) {
  for (const [label, content] of [
    ['architecture', architecture],
    ['acceptance examples', examples],
    ['core types', types],
  ]) {
    if (!content.includes(state)) {
      throw new Error(`Missing state "${state}" in ${label}`);
    }
  }
}

for (const token of [
  'AgentGlowEvent',
  'AgentGlowTheme',
  'AgentGlowSnapshot',
  'createAgentGlowController',
  'normalizeAgentGlowTheme',
  'AgentGlowProps',
  'useAgentGlowController',
]) {
  const haystack = `${architecture}\n${types}\n${readFileSync('packages/react/src/index.ts', 'utf8')}`;
  if (!haystack.includes(token)) {
    throw new Error(`Missing public API token: ${token}`);
  }
}

console.log('Contract check passed');
