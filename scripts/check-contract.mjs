import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'docs/architecture.md',
  'docs/acceptance-examples.md',
  'packages/core/src/types.ts',
  'packages/core/src/index.ts',
  'packages/react/src/index.ts',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/core/src/index.js',
  'dist/core/src/index.d.ts',
  'dist/react/src/index.js',
  'dist/react/src/index.d.ts',
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
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

for (const path of [pkg.main, pkg.types, pkg.bin?.['agentglow-render']]) {
  if (!path || !existsSync(path)) {
    throw new Error(`Package metadata points at missing path: ${path}`);
  }
}

const expectedExports = {
  '.': './dist/index.js',
  './core': './dist/core/src/index.js',
  './react': './dist/react/src/index.js',
};

for (const [key, expectedDefault] of Object.entries(expectedExports)) {
  const value = pkg.exports?.[key];
  const actualDefault = typeof value === 'string' ? value : value?.default;
  if (actualDefault !== expectedDefault) {
    throw new Error(`Package export ${key} should default to ${expectedDefault}, got ${actualDefault}`);
  }
}

for (const [key, value] of Object.entries(pkg.exports ?? {})) {
  const targets = typeof value === 'string' ? [value] : Object.values(value);
  for (const target of targets) {
    if (typeof target === 'string' && target.startsWith('./') && !existsSync(target)) {
      throw new Error(`Package export ${key} points at missing path: ${target}`);
    }
  }
}


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
