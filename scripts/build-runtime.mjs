import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';

execFileSync('tsc', [
  '--module', 'NodeNext',
  '--moduleResolution', 'NodeNext',
  '--target', 'ES2022',
  '--rootDir', 'packages',
  '--outDir', 'dist',
  '--declaration',
  '--declarationMap', 'false',
  '--sourceMap', 'false',
  '--rewriteRelativeImportExtensions',
  'packages/core/src/index.ts',
  'packages/core/src/types.ts',
  'packages/react/src/index.ts',
], { stdio: 'inherit' });

function walkFiles(dir) {
  const entries = readdirSync(dir).map((entry) => `${dir}/${entry}`);
  return entries.flatMap((entry) => statSync(entry).isDirectory() ? walkFiles(entry) : [entry]);
}

for (const file of walkFiles('dist').filter((file) => file.endsWith('.d.ts'))) {
  const content = readFileSync(file, 'utf8').replaceAll('.ts', '.js');
  writeFileSync(file, content);
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.js', "export * from './core/src/index.js';\n");
writeFileSync('dist/index.d.ts', "export * from './core/src/index.js';\n");

console.log('Runtime build emitted dist/ entrypoints');
