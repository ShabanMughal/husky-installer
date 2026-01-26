import * as esbuild from 'esbuild';
import fs from 'fs';

// Read package.json to get dependencies
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

await esbuild.build({
  entryPoints: ['src/cli/index.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'bin/husky-installer.js',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external,
  treeShaking: true,
  legalComments: 'none',
  drop: ['debugger'],
  mangleProps: /^_/,
});

// Get file sizes
const srcSize = fs.statSync('src/cli/index.js').size;
const outSize = fs.statSync('bin/husky-installer.js').size;
const reduction = ((1 - outSize / srcSize) * 100).toFixed(1);

console.log('');
console.log('┌─────────────────────────────────────┐');
console.log('│  ✓ CLI built successfully!          │');
console.log('├─────────────────────────────────────┤');
console.log(
  `│  Source:  ${(srcSize / 1024).toFixed(2).padStart(7)} KB              │`
);
console.log(
  `│  Output:  ${(outSize / 1024).toFixed(2).padStart(7)} KB              │`
);
console.log(`│  Reduced: ${reduction.padStart(7)}%               │`);
console.log('└─────────────────────────────────────┘');
console.log('');
