#!/usr/bin/env node
import * as t from '@clack/prompts';
import { execSync as w, spawn as F } from 'child_process';
import c from 'fs';
import a from 'path';
import { fileURLToPath as E } from 'url';
import e from 'picocolors';
var N = E(import.meta.url),
  M = a.dirname(N),
  _ = a.join(M, '..', 'package.json'),
  A = JSON.parse(c.readFileSync(_, 'utf-8')),
  I = A.version;
function G() {
  let o = `
${e.cyan('\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510')}
${e.cyan('\u2502')}                                                           ${e.cyan('\u2502')}
${e.cyan('\u2502')}   ${e.bold(e.magenta('\u2566 \u2566\u2566 \u2566\u2554\u2550\u2557\u2566\u2554\u2550\u2566 \u2566'))}  ${e.bold(e.cyan('\u2566\u2554\u2557\u2554\u2554\u2550\u2557\u2554\u2566\u2557\u2554\u2550\u2557\u2566  \u2566  \u2554\u2550\u2557\u2566\u2550\u2557'))}   ${e.cyan('\u2502')}
${e.cyan('\u2502')}   ${e.bold(e.magenta('\u2560\u2550\u2563\u2551 \u2551\u255A\u2550\u2557\u2560\u2569\u2557\u255A\u2566\u255D'))}  ${e.bold(e.cyan('\u2551\u2551\u2551\u2551\u255A\u2550\u2557 \u2551 \u2560\u2550\u2563\u2551  \u2551  \u2551\u2563 \u2560\u2566\u255D'))}   ${e.cyan('\u2502')}
${e.cyan('\u2502')}   ${e.bold(e.magenta('\u2569 \u2569\u255A\u2550\u255D\u255A\u2550\u255D\u2569 \u2569 \u2569'))}   ${e.bold(e.cyan('\u2569\u255D\u255A\u255D\u255A\u2550\u255D \u2569 \u2569 \u2569\u2569\u2550\u255D\u2569\u2550\u255D\u255A\u2550\u255D\u2569\u255A\u2550'))}   ${e.cyan('\u2502')}
${e.cyan('\u2502')}                                                           ${e.cyan('\u2502')}
${e.cyan('\u2502')}   ${e.dim('\u{1F415} Set up Git hooks in seconds')}               ${e.yellow(`v${I}`)}   ${e.cyan('\u2502')}
${e.cyan('\u2502')}                                                           ${e.cyan('\u2502')}
${e.cyan('\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518')}
`;
  console.log(o);
}
function $(o) {
  return new Promise((i) => setTimeout(i, o));
}
function H() {
  let o = process.cwd();
  return c.existsSync(a.join(o, 'bun.lockb')) ||
    c.existsSync(a.join(o, 'bun.lock'))
    ? 'bun'
    : c.existsSync(a.join(o, 'pnpm-lock.yaml'))
      ? 'pnpm'
      : c.existsSync(a.join(o, 'yarn.lock'))
        ? 'yarn'
        : (c.existsSync(a.join(o, 'package-lock.json')), 'npm');
}
function J() {
  let o = process.cwd(),
    i = a.join(o, 'package.json');
  if (!c.existsSync(i)) return { name: 'unknown', ignorePatterns: [] };
  let d = JSON.parse(c.readFileSync(i, 'utf-8')),
    n = { ...d.dependencies, ...d.devDependencies },
    f = {
      'react-native-expo': {
        check: () => n.expo,
        ignorePatterns: ['.expo', 'dist', 'node_modules', '.expo-shared'],
        name: 'Expo (React Native)',
        icon: '\u{1F4F1}',
      },
      'react-native': {
        check: () => n['react-native'] && !n.expo,
        ignorePatterns: ['android/app/build', 'ios/build', 'node_modules'],
        name: 'React Native',
        icon: '\u{1F4F1}',
      },
      next: {
        check: () => n.next,
        ignorePatterns: ['.next', 'out', '.vercel'],
        name: 'Next.js',
        icon: '\u25B2',
      },
      remix: {
        check: () => n['@remix-run/react'],
        ignorePatterns: ['build', '.cache', 'public/build'],
        name: 'Remix',
        icon: '\u{1F4BF}',
      },
      gatsby: {
        check: () => n.gatsby,
        ignorePatterns: ['.cache', 'public'],
        name: 'Gatsby',
        icon: '\u{1F49C}',
      },
      nuxt: {
        check: () => n.nuxt,
        ignorePatterns: ['.nuxt', 'dist', '.output'],
        name: 'Nuxt',
        icon: '\u{1F49A}',
      },
      vue: {
        check: () => n.vue && !n.nuxt,
        ignorePatterns: ['dist'],
        name: 'Vue',
        icon: '\u{1F49A}',
      },
      angular: {
        check: () => n['@angular/core'],
        ignorePatterns: ['dist', '.angular'],
        name: 'Angular',
        icon: '\u{1F170}\uFE0F',
      },
      sveltekit: {
        check: () => n['@sveltejs/kit'],
        ignorePatterns: ['.svelte-kit', 'build'],
        name: 'SvelteKit',
        icon: '\u{1F525}',
      },
      svelte: {
        check: () => n.svelte && !n['@sveltejs/kit'],
        ignorePatterns: ['build', 'dist'],
        name: 'Svelte',
        icon: '\u{1F525}',
      },
      astro: {
        check: () => n.astro,
        ignorePatterns: ['dist', '.astro'],
        name: 'Astro',
        icon: '\u{1F680}',
      },
      solid: {
        check: () => n['solid-js'],
        ignorePatterns: ['dist'],
        name: 'SolidJS',
        icon: '\u{1F499}',
      },
      qwik: {
        check: () => n['@builder.io/qwik'],
        ignorePatterns: ['dist', 'server', '.qwik'],
        name: 'Qwik',
        icon: '\u26A1',
      },
      electron: {
        check: () => n.electron,
        ignorePatterns: ['dist', 'out', 'build'],
        name: 'Electron',
        icon: '\u269B\uFE0F',
      },
      tauri: {
        check: () => n['@tauri-apps/api'],
        ignorePatterns: ['src-tauri/target', 'dist'],
        name: 'Tauri',
        icon: '\u{1F980}',
      },
      react: {
        check: () =>
          n.react && !n.next && !n.gatsby && !n['react-native'] && !n.expo,
        ignorePatterns: ['build', 'dist'],
        name: 'React',
        icon: '\u269B\uFE0F',
      },
      vite: {
        check: () => n.vite && !n.astro && !n['@sveltejs/kit'],
        ignorePatterns: ['dist'],
        name: 'Vite',
        icon: '\u26A1',
      },
      express: {
        check: () => n.express,
        ignorePatterns: ['dist', 'build'],
        name: 'Express',
        icon: '\u{1F682}',
      },
      fastify: {
        check: () => n.fastify,
        ignorePatterns: ['dist', 'build'],
        name: 'Fastify',
        icon: '\u{1F680}',
      },
      nest: {
        check: () => n['@nestjs/core'],
        ignorePatterns: ['dist'],
        name: 'NestJS',
        icon: '\u{1F431}',
      },
    };
  for (let [, s] of Object.entries(f))
    if (s.check())
      return { name: s.name, ignorePatterns: s.ignorePatterns, icon: s.icon };
  return {
    name: 'Node.js',
    ignorePatterns: ['dist', 'build'],
    icon: '\u{1F4E6}',
  };
}
async function P(o, i, d) {
  let n = t.spinner();
  return (
    n.start(i),
    new Promise((f, s) => {
      let k = F(o, { shell: !0, stdio: 'pipe' }),
        p = '';
      (k.stdout?.on('data', (r) => {
        p += r.toString();
      }),
        k.stderr?.on('data', (r) => {
          p += r.toString();
        }),
        k.on('close', (r) => {
          r === 0
            ? (n.stop(d || i), f(p))
            : (n.stop(e.red(`Failed: ${i}`)), s(new Error(p)));
        }),
        k.on('error', (r) => {
          (n.stop(e.red(`Failed: ${i}`)), s(r));
        }));
    })
  );
}
async function O() {
  (console.clear(), G(), t.intro(e.cyan("Let's set up your Git hooks")));
  let o = t.spinner();
  (o.start('Checking Git repository...'), await $(400));
  try {
    (w('git rev-parse --git-dir', { stdio: 'ignore' }),
      o.stop(e.green('Git repository found')));
  } catch {
    (o.stop(e.red('Git repository not found')),
      t.cancel('Git repository not found!'),
      t.note(
        `${e.yellow('Husky requires a Git repository to work.')}

Run these commands first:
  ${e.cyan('git init')}
  ${e.cyan('npx husky-installer')}`,
        'Next Steps'
      ),
      process.exit(1));
  }
  let i = t.spinner();
  (i.start('Checking package.json...'),
    await $(300),
    c.existsSync(a.join(process.cwd(), 'package.json')) ||
      (i.stop(e.red('package.json not found')),
      t.cancel('package.json not found!'),
      t.note(
        `${e.yellow('This tool requires a Node.js project.')}

Run these commands first:
  ${e.cyan('npm init -y')}
  ${e.cyan('npx husky-installer')}`,
        'Next Steps'
      ),
      process.exit(1)),
    i.stop(e.green('package.json found')));
  let d = t.spinner();
  (d.start('Detecting package manager...'), await $(500));
  let n = H();
  d.stop(`Package manager: ${e.cyan(e.bold(n))}`);
  let f = t.spinner();
  (f.start('Detecting framework...'), await $(500));
  let s = J();
  (f.stop(`Framework: ${s.icon} ${e.cyan(e.bold(s.name))}`), console.log(''));
  let k = await t.group(
      {
        prettier: () =>
          t.confirm({
            message: 'Add Prettier for code formatting?',
            initialValue: !0,
          }),
        eslint: () =>
          t.confirm({
            message: 'Add ESLint for code linting?',
            initialValue: !0,
          }),
        emoji: () =>
          t.confirm({
            message: 'Enable automatic commit emoji prefixes?',
            initialValue: !0,
          }),
      },
      {
        onCancel: () => {
          (t.cancel('Installation cancelled.'), process.exit(0));
        },
      }
    ),
    { prettier: p, eslint: r, emoji: x } = k;
  x &&
    t.note(
      `${e.dim('feat:')} add login     ${e.dim('\u2192')}  \u{1F680} feat: add login
${e.dim('fix:')} button bug    ${e.dim('\u2192')}  \u{1F41B} fix: button bug
${e.dim('docs:')} update readme ${e.dim('\u2192')}  \u{1F4DD} docs: update readme
${e.dim('style:')} format code  ${e.dim('\u2192')}  \u{1F3A8} style: format code
${e.dim('test:')} add tests     ${e.dim('\u2192')}  \u2705 test: add tests
${e.dim('perf:')} optimize      ${e.dim('\u2192')}  \u26A1 perf: optimize
${e.dim('refactor:')} cleanup   ${e.dim('\u2192')}  \u267B\uFE0F  refactor: cleanup
${e.dim('chore:')} update deps  ${e.dim('\u2192')}  \u{1F527} chore: update deps`,
      'Commit Prefix Examples'
    );
  let g = ['husky'];
  (p && g.push('prettier'), r && g.push('eslint', '@eslint/js'));
  let v =
    n === 'pnpm'
      ? `pnpm add -D ${g.join(' ')}`
      : n === 'yarn'
        ? `yarn add -D ${g.join(' ')}`
        : n === 'bun'
          ? `bun add -D ${g.join(' ')}`
          : `npm install -D ${g.join(' ')}`;
  (await P(
    v,
    'Installing dependencies...',
    `Installed ${e.cyan(g.join(', '))}`
  ),
    await P('npx husky init', 'Initializing Husky...', 'Husky initialized'));
  let b = a.join(process.cwd(), '.husky');
  if (p || r) {
    let l = t.spinner();
    l.start('Creating pre-commit hook...');
    let m = '',
      y = ['node_modules', '.husky', ...s.ignorePatterns];
    if (
      (p &&
        (m += `npx prettier --write . --ignore-path .gitignore || true
git add .
`),
      r)
    ) {
      let h = y.map((j) => `--ignore-pattern "${j}"`).join(' ');
      m += `npx eslint . --fix ${h} || true
git add .
`;
    }
    (c.writeFileSync(a.join(b, 'pre-commit'), m, { mode: 493 }),
      l.stop(
        `Created ${e.cyan('.husky/pre-commit')} ${e.dim(`(ignoring: ${y.join(', ')})`)}`
      ));
  }
  if (x) {
    let l = t.spinner();
    l.start('Creating commit-msg hook...');
    let y = T('emoji');
    (c.writeFileSync(a.join(b, 'commit-msg.cjs'), y),
      c.writeFileSync(
        a.join(b, 'commit-msg'),
        `node .husky/commit-msg.cjs $1
`,
        { mode: 493 }
      ),
      l.stop(`Created ${e.cyan('.husky/commit-msg')}`));
  }
  if (p) {
    let l = t.spinner();
    l.start('Creating Prettier config...');
    let m = {
      semi: !0,
      singleQuote: !0,
      trailingComma: 'es5',
      tabWidth: 2,
      printWidth: 80,
    };
    c.writeFileSync('.prettierrc', JSON.stringify(m, null, 2));
    let y = [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lockb',
      ...s.ignorePatterns,
    ].join(`
`);
    (c.writeFileSync(
      '.prettierignore',
      y +
        `
`
    ),
      l.stop(
        `Created ${e.cyan('.prettierrc')} and ${e.cyan('.prettierignore')}`
      ));
  }
  if (r) {
    let l = t.spinner();
    l.start('Configuring ESLint...');
    let m = 'eslint.config.js';
    if (c.existsSync(m) || c.existsSync('eslint.config.mjs'))
      (l.stop(
        `${e.yellow('ESLint config exists')} ${e.dim('- skipped creation')}`
      ),
        t.log.warn(
          `Add ${e.cyan('.husky')} to ignores in your eslint.config.js`
        ));
    else {
      let h = ['node_modules', '.husky', ...s.ignorePatterns],
        j = `import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ${JSON.stringify(h)},
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // Add your custom rules here
    },
  },
];
`;
      (c.writeFileSync(m, j), l.stop(`Created ${e.cyan('eslint.config.js')}`));
    }
  }
  let S = t.spinner();
  (S.start('Adding Husky control scripts...'),
    w(
      'npm pkg set scripts.husky:disable="git config core.hooksPath /dev/null"',
      { stdio: 'pipe' }
    ),
    w('npm pkg set scripts.husky:enable="git config core.hooksPath .husky"', {
      stdio: 'pipe',
    }),
    S.stop(
      `Added ${e.cyan('husky:disable')} and ${e.cyan('husky:enable')} scripts`
    ));
  let u = [];
  (u.push(`${e.green('\u2713')} Framework: ${s.icon} ${e.cyan(s.name)}`),
    p && u.push(`${e.green('\u2713')} Prettier (code formatting)`),
    r && u.push(`${e.green('\u2713')} ESLint (code linting)`),
    x && u.push(`${e.green('\u2713')} Commit emoji prefixes`),
    u.push(`${e.green('\u2713')} Git hooks configured`),
    s.ignorePatterns.length > 0 &&
      u.push(
        `${e.green('\u2713')} Auto-ignoring: ${e.dim(s.ignorePatterns.join(', '))}`
      ),
    t.note(
      u.join(`
`),
      'Installed'
    ));
  let C = [
    `${e.cyan('1.')} Stage some files:`,
    `   ${e.dim('$')} ${e.cyan('git add .')}`,
    '',
    `${e.cyan('2.')} Make a commit:`,
    `   ${e.dim('$')} ${e.cyan('git commit -m "feat: test husky hooks"')}`,
    '',
    `${e.yellow('\u{1F4A1}')} Useful commands:`,
    `   ${e.dim('$')} ${e.cyan(`${n} run husky:disable`)} ${e.dim('# Temporarily disable hooks')}`,
    `   ${e.dim('$')} ${e.cyan(`${n} run husky:enable`)} ${e.dim('# Re-enable hooks')}`,
  ];
  (t.note(
    C.join(`
`),
    'Next Steps'
  ),
    t.outro(
      `${e.green('\u2728')} ${e.bold('Setup complete!')} Happy coding! \u{1F389}`
    ));
}
function T(o) {
  let i = '';
  return (
    o === 'shortcode'
      ? (i = `  feat: ':rocket:',
  fix: ':bug:',
  chore: ':wrench:',
  docs: ':memo:',
  refactor: ':recycle:',
  test: ':white_check_mark:',
  style: ':art:',
  perf: ':zap:',
  build: ':package:',
  ci: ':gear:',
  breaking: ':boom:',
  hotfix: ':fire:',
  wip: ':construction:',
  release: ':bookmark:'`)
      : o === 'tag'
        ? (i = `  feat: '[feat]',
  fix: '[fix]',
  chore: '[chore]',
  docs: '[docs]',
  refactor: '[refactor]',
  test: '[test]',
  style: '[style]',
  perf: '[perf]',
  build: '[build]',
  ci: '[ci]',
  breaking: '[breaking]',
  hotfix: '[hotfix]',
  wip: '[wip]',
  release: '[release]'`)
        : (i = `  feat: '\u{1F680}',
  fix: '\u{1F41B}',
  chore: '\u{1F527}',
  docs: '\u{1F4DD}',
  refactor: '\u267B\uFE0F',
  test: '\u2705',
  style: '\u{1F3A8}',
  perf: '\u26A1',
  build: '\u{1F4E6}',
  ci: '\u2699\uFE0F',
  breaking: '\u{1F4A5}',
  hotfix: '\u{1F525}',
  wip: '\u{1F6A7}',
  release: '\u{1F516}'`),
    `const fs = require('fs');
const msgFile = process.argv[2];
const msg = fs.readFileSync(msgFile, 'utf-8').trim();

// Colors for terminal output
const c = {
  reset: '\\x1b[0m',
  bold: '\\x1b[1m',
  dim: '\\x1b[2m',
  green: '\\x1b[32m',
  cyan: '\\x1b[36m',
  magenta: '\\x1b[35m',
  yellow: '\\x1b[33m',
  gray: '\\x1b[90m',
  white: '\\x1b[37m',
  bgCyan: '\\x1b[46m',
  black: '\\x1b[30m',
};

// Print styled header
console.log('');
console.log(c.cyan + '\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510' + c.reset);
console.log(c.cyan + '\u2502' + c.reset + '  \u{1F415} ' + c.bold + c.magenta + 'HUSKY' + c.reset + ' ' + c.bold + c.cyan + 'COMMIT HOOK' + c.reset + '             ' + c.cyan + '\u2502' + c.reset);
console.log(c.cyan + '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518' + c.reset);
console.log('');

// If message already has prefix, skip
if (/^(\\[[a-z]+\\]|:[a-z0-9_+-]+: |[\\p{Emoji}])/u.test(msg)) {
  console.log(c.cyan + '\u25C7' + c.reset + '  ' + c.dim + 'Already has prefix, skipping...' + c.reset);
  console.log(c.cyan + '\u2502' + c.reset);
  console.log(c.cyan + '\u2514' + c.reset + '  ' + c.white + msg + c.reset);
  console.log('');
  process.exit(0);
}

// Extract conventional commit type
const match = msg.match(/^([a-z][a-z0-9_-]*)/);
if (!match) {
  console.log(c.yellow + '\u25C7' + c.reset + '  ' + c.yellow + 'No conventional commit type detected' + c.reset);
  console.log(c.cyan + '\u2502' + c.reset);
  console.log(c.cyan + '\u2514' + c.reset + '  ' + c.dim + msg + c.reset);
  console.log('');
  process.exit(0);
}

const type = match[1];
const emojiMap = {
${i}
};

const prefix = emojiMap[type];
if (prefix) {
  const newMsg = \`\${prefix} \${msg}\`;
  fs.writeFileSync(msgFile, newMsg, 'utf-8');
  console.log(c.green + '\u25C6' + c.reset + '  ' + c.green + c.bold + 'Emoji prefix added!' + c.reset);
  console.log(c.cyan + '\u2502' + c.reset);
  console.log(c.cyan + '\u2502' + c.reset + '  ' + c.dim + 'Before: ' + c.reset + c.gray + msg + c.reset);
  console.log(c.cyan + '\u2502' + c.reset + '  ' + c.dim + 'After:  ' + c.reset + c.white + c.bold + newMsg + c.reset);
  console.log(c.cyan + '\u2502' + c.reset);
  console.log(c.cyan + '\u2514' + c.reset + '  ' + c.dim + 'Commit type: ' + c.reset + c.cyan + type + c.reset);
  console.log('');
} else {
  console.log(c.yellow + '\u25C7' + c.reset + '  ' + c.dim + 'No emoji mapping for: ' + c.reset + c.yellow + type + c.reset);
  console.log(c.cyan + '\u2502' + c.reset);
  console.log(c.cyan + '\u2514' + c.reset + '  ' + c.white + msg + c.reset);
  console.log('');
}`
  );
}
O().catch((o) => {
  ((o.message?.includes('User force closed') ||
    o.message?.includes('cancelled')) &&
    (t.cancel('Installation cancelled.'), process.exit(0)),
    t.cancel('Installation failed!'),
    t.log.error(o.message),
    o.message?.includes('EACCES') || o.message?.includes('permission')
      ? t.note(
          `Try running with elevated permissions:
  ${e.cyan('sudo npx husky-installer')}`,
          'Tip'
        )
      : o.message?.includes('ENOENT') || o.message?.includes('not found')
        ? t.note(
            `Make sure you have the required tools installed:
  ${e.dim('\u2022')} Node.js >= 18.0.0
  ${e.dim('\u2022')} Git
  ${e.dim('\u2022')} npm/yarn/pnpm/bun`,
            'Requirements'
          )
        : t.note(
            `For help, please report this issue:
  ${e.cyan('https://github.com/ShabanMughal/husky-installer/issues')}`,
            'Help'
          ),
    process.exit(1));
});
