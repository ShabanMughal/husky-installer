import * as p from '@clack/prompts';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import color from 'picocolors';

// Get package version dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// Create ASCII banner with gradient-like colors
function printBanner() {
  const banner = `
${color.cyan('┌─────────────────────────────────────────────────────────┐')}
${color.cyan('│')}                                                           ${color.cyan('│')}
${color.cyan('│')}   ${color.bold(color.magenta('╦ ╦╦ ╦╔═╗╦╔═╦ ╦'))}  ${color.bold(color.cyan('╦╔╗╔╔═╗╔╦╗╔═╗╦  ╦  ╔═╗╦═╗'))}   ${color.cyan('│')}
${color.cyan('│')}   ${color.bold(color.magenta('╠═╣║ ║╚═╗╠╩╗╚╦╝'))}  ${color.bold(color.cyan('║║║║╚═╗ ║ ╠═╣║  ║  ║╣ ╠╦╝'))}   ${color.cyan('│')}
${color.cyan('│')}   ${color.bold(color.magenta('╩ ╩╚═╝╚═╝╩ ╩ ╩'))}   ${color.bold(color.cyan('╩╝╚╝╚═╝ ╩ ╩ ╩╩═╝╩═╝╚═╝╩╚═'))}   ${color.cyan('│')}
${color.cyan('│')}                                                           ${color.cyan('│')}
${color.cyan('│')}   ${color.dim('🐕 Set up Git hooks in seconds')}               ${color.yellow(`v${version}`)}   ${color.cyan('│')}
${color.cyan('│')}                                                           ${color.cyan('│')}
${color.cyan('└─────────────────────────────────────────────────────────┘')}
`;
  console.log(banner);
}

// Simulate async detection with delay for visual feedback
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function detectPackageManager() {
  const cwd = process.cwd();

  if (
    fs.existsSync(path.join(cwd, 'bun.lockb')) ||
    fs.existsSync(path.join(cwd, 'bun.lock'))
  ) {
    return 'bun';
  }
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  return 'npm'; // default
}

function detectFramework() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return { name: 'unknown', ignorePatterns: [] };
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Framework detection with ignore patterns (order matters - more specific first)
  const frameworks = {
    'react-native-expo': {
      check: () => deps['expo'],
      ignorePatterns: ['.expo', 'dist', 'node_modules', '.expo-shared'],
      name: 'Expo (React Native)',
      icon: '📱',
    },
    'react-native': {
      check: () => deps['react-native'] && !deps['expo'],
      ignorePatterns: ['android/app/build', 'ios/build', 'node_modules'],
      name: 'React Native',
      icon: '📱',
    },
    next: {
      check: () => deps['next'],
      ignorePatterns: ['.next', 'out', '.vercel'],
      name: 'Next.js',
      icon: '▲',
    },
    remix: {
      check: () => deps['@remix-run/react'],
      ignorePatterns: ['build', '.cache', 'public/build'],
      name: 'Remix',
      icon: '💿',
    },
    gatsby: {
      check: () => deps['gatsby'],
      ignorePatterns: ['.cache', 'public'],
      name: 'Gatsby',
      icon: '💜',
    },
    nuxt: {
      check: () => deps['nuxt'],
      ignorePatterns: ['.nuxt', 'dist', '.output'],
      name: 'Nuxt',
      icon: '💚',
    },
    vue: {
      check: () => deps['vue'] && !deps['nuxt'],
      ignorePatterns: ['dist'],
      name: 'Vue',
      icon: '💚',
    },
    angular: {
      check: () => deps['@angular/core'],
      ignorePatterns: ['dist', '.angular'],
      name: 'Angular',
      icon: '🅰️',
    },
    sveltekit: {
      check: () => deps['@sveltejs/kit'],
      ignorePatterns: ['.svelte-kit', 'build'],
      name: 'SvelteKit',
      icon: '🔥',
    },
    svelte: {
      check: () => deps['svelte'] && !deps['@sveltejs/kit'],
      ignorePatterns: ['build', 'dist'],
      name: 'Svelte',
      icon: '🔥',
    },
    astro: {
      check: () => deps['astro'],
      ignorePatterns: ['dist', '.astro'],
      name: 'Astro',
      icon: '🚀',
    },
    solid: {
      check: () => deps['solid-js'],
      ignorePatterns: ['dist'],
      name: 'SolidJS',
      icon: '💙',
    },
    qwik: {
      check: () => deps['@builder.io/qwik'],
      ignorePatterns: ['dist', 'server', '.qwik'],
      name: 'Qwik',
      icon: '⚡',
    },
    electron: {
      check: () => deps['electron'],
      ignorePatterns: ['dist', 'out', 'build'],
      name: 'Electron',
      icon: '⚛️',
    },
    tauri: {
      check: () => deps['@tauri-apps/api'],
      ignorePatterns: ['src-tauri/target', 'dist'],
      name: 'Tauri',
      icon: '🦀',
    },
    react: {
      check: () =>
        deps['react'] &&
        !deps['next'] &&
        !deps['gatsby'] &&
        !deps['react-native'] &&
        !deps['expo'],
      ignorePatterns: ['build', 'dist'],
      name: 'React',
      icon: '⚛️',
    },
    vite: {
      check: () => deps['vite'] && !deps['astro'] && !deps['@sveltejs/kit'],
      ignorePatterns: ['dist'],
      name: 'Vite',
      icon: '⚡',
    },
    express: {
      check: () => deps['express'],
      ignorePatterns: ['dist', 'build'],
      name: 'Express',
      icon: '🚂',
    },
    fastify: {
      check: () => deps['fastify'],
      ignorePatterns: ['dist', 'build'],
      name: 'Fastify',
      icon: '🚀',
    },
    nest: {
      check: () => deps['@nestjs/core'],
      ignorePatterns: ['dist'],
      name: 'NestJS',
      icon: '🐱',
    },
  };

  for (const [, framework] of Object.entries(frameworks)) {
    if (framework.check()) {
      return {
        name: framework.name,
        ignorePatterns: framework.ignorePatterns,
        icon: framework.icon,
      };
    }
  }

  return { name: 'Node.js', ignorePatterns: ['dist', 'build'], icon: '📦' };
}

// Execute command with spinner
async function execWithSpinner(command, message, successMessage) {
  const s = p.spinner();
  s.start(message);

  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: 'pipe' });
    let output = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.stderr?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        s.stop(successMessage || message);
        resolve(output);
      } else {
        s.stop(color.red(`Failed: ${message}`));
        reject(new Error(output));
      }
    });

    child.on('error', (err) => {
      s.stop(color.red(`Failed: ${message}`));
      reject(err);
    });
  });
}

async function main() {
  console.clear();

  // Print stylish banner
  printBanner();

  // Start the CLI flow
  p.intro(color.cyan("Let's set up your Git hooks"));

  // Check if in a git repository
  const gitSpinner = p.spinner();
  gitSpinner.start('Checking Git repository...');
  await sleep(400);

  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    gitSpinner.stop(color.green('Git repository found'));
  } catch {
    gitSpinner.stop(color.red('Git repository not found'));
    p.cancel('Git repository not found!');
    p.note(
      `${color.yellow('Husky requires a Git repository to work.')}\n\n` +
        `Run these commands first:\n` +
        `  ${color.cyan('git init')}\n` +
        `  ${color.cyan('npx husky-installer')}`,
      'Next Steps'
    );
    process.exit(1);
  }

  // Check if package.json exists
  const pkgSpinner = p.spinner();
  pkgSpinner.start('Checking package.json...');
  await sleep(300);

  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    pkgSpinner.stop(color.red('package.json not found'));
    p.cancel('package.json not found!');
    p.note(
      `${color.yellow('This tool requires a Node.js project.')}\n\n` +
        `Run these commands first:\n` +
        `  ${color.cyan('npm init -y')}\n` +
        `  ${color.cyan('npx husky-installer')}`,
      'Next Steps'
    );
    process.exit(1);
  }
  pkgSpinner.stop(color.green('package.json found'));

  // Auto-detect package manager with spinner
  const pmSpinner = p.spinner();
  pmSpinner.start('Detecting package manager...');
  await sleep(500);
  const packageManager = detectPackageManager();
  pmSpinner.stop(`Package manager: ${color.cyan(color.bold(packageManager))}`);

  // Auto-detect framework with spinner
  const fwSpinner = p.spinner();
  fwSpinner.start('Detecting framework...');
  await sleep(500);
  const framework = detectFramework();
  fwSpinner.stop(
    `Framework: ${framework.icon} ${color.cyan(color.bold(framework.name))}`
  );

  console.log(''); // Add spacing before prompts

  // Group all prompts together
  const config = await p.group(
    {
      prettier: () =>
        p.confirm({
          message: 'Add Prettier for code formatting?',
          initialValue: true,
        }),
      eslint: () =>
        p.confirm({
          message: 'Add ESLint for code linting?',
          initialValue: true,
        }),
      emoji: () =>
        p.confirm({
          message: 'Enable automatic commit emoji prefixes?',
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel('Installation cancelled.');
        process.exit(0);
      },
    }
  );

  const { prettier: usePrettier, eslint: useEslint, emoji: useEmoji } = config;

  // Show emoji preview if enabled
  if (useEmoji) {
    p.note(
      `${color.dim('feat:')} add login     ${color.dim('→')}  🚀 feat: add login\n` +
        `${color.dim('fix:')} button bug    ${color.dim('→')}  🐛 fix: button bug\n` +
        `${color.dim('docs:')} update readme ${color.dim('→')}  📝 docs: update readme\n` +
        `${color.dim('style:')} format code  ${color.dim('→')}  🎨 style: format code\n` +
        `${color.dim('test:')} add tests     ${color.dim('→')}  ✅ test: add tests\n` +
        `${color.dim('perf:')} optimize      ${color.dim('→')}  ⚡ perf: optimize\n` +
        `${color.dim('refactor:')} cleanup   ${color.dim('→')}  ♻️  refactor: cleanup\n` +
        `${color.dim('chore:')} update deps  ${color.dim('→')}  🔧 chore: update deps`,
      'Commit Prefix Examples'
    );
  }

  // Build dependencies list
  const devDeps = ['husky'];
  if (usePrettier) devDeps.push('prettier');
  if (useEslint) devDeps.push('eslint', '@eslint/js');

  // Install dependencies with spinner
  const installCmd =
    packageManager === 'pnpm'
      ? `pnpm add -D ${devDeps.join(' ')}`
      : packageManager === 'yarn'
        ? `yarn add -D ${devDeps.join(' ')}`
        : packageManager === 'bun'
          ? `bun add -D ${devDeps.join(' ')}`
          : `npm install -D ${devDeps.join(' ')}`;

  await execWithSpinner(
    installCmd,
    'Installing dependencies...',
    `Installed ${color.cyan(devDeps.join(', '))}`
  );

  // Initialize Husky
  await execWithSpinner(
    'npx husky init',
    'Initializing Husky...',
    'Husky initialized'
  );

  const huskyDir = path.join(process.cwd(), '.husky');

  // Create pre-commit hook
  if (usePrettier || useEslint) {
    const s = p.spinner();
    s.start('Creating pre-commit hook...');

    let preCommitContent = '';

    // Build ignore patterns
    const ignorePatterns = [
      'node_modules',
      '.husky',
      ...framework.ignorePatterns,
    ];

    if (usePrettier) {
      preCommitContent += `npx prettier --write . --ignore-path .gitignore || true
git add .
`;
    }

    if (useEslint) {
      const eslintIgnores = ignorePatterns
        .map((p) => `--ignore-pattern "${p}"`)
        .join(' ');
      preCommitContent += `npx eslint . --fix ${eslintIgnores} || true
git add .
`;
    }

    fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitContent, {
      mode: 0o755,
    });
    s.stop(
      `Created ${color.cyan('.husky/pre-commit')} ${color.dim(`(ignoring: ${ignorePatterns.join(', ')})`)}`
    );
  }

  // Create commit-msg hook
  if (useEmoji) {
    const s = p.spinner();
    s.start('Creating commit-msg hook...');

    const emojiStyle = 'emoji';
    const commitMsgScript = generateCommitMsgScript(emojiStyle);
    fs.writeFileSync(path.join(huskyDir, 'commit-msg.cjs'), commitMsgScript);

    const commitMsgHook = `node .husky/commit-msg.cjs $1
`;

    fs.writeFileSync(path.join(huskyDir, 'commit-msg'), commitMsgHook, {
      mode: 0o755,
    });
    s.stop(`Created ${color.cyan('.husky/commit-msg')}`);
  }

  // Create config files
  if (usePrettier) {
    const s = p.spinner();
    s.start('Creating Prettier config...');

    const prettierConfig = {
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      printWidth: 80,
    };
    fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));

    // Create .prettierignore with framework-specific patterns
    const prettierIgnore = [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lockb',
      ...framework.ignorePatterns,
    ].join('\n');

    fs.writeFileSync('.prettierignore', prettierIgnore + '\n');
    s.stop(
      `Created ${color.cyan('.prettierrc')} and ${color.cyan('.prettierignore')}`
    );
  }

  if (useEslint) {
    const s = p.spinner();
    s.start('Configuring ESLint...');

    const eslintConfigPath = 'eslint.config.js';
    const eslintConfigMjsPath = 'eslint.config.mjs';

    // Check if flat config exists
    if (fs.existsSync(eslintConfigPath) || fs.existsSync(eslintConfigMjsPath)) {
      s.stop(
        `${color.yellow('ESLint config exists')} ${color.dim('- skipped creation')}`
      );
      p.log.warn(
        `Add ${color.cyan('.husky')} to ignores in your eslint.config.js`
      );
    } else {
      // Create basic flat config with framework-specific ignores
      const eslintIgnores = [
        'node_modules',
        '.husky',
        ...framework.ignorePatterns,
      ];

      const eslintFlatConfig = `import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ${JSON.stringify(eslintIgnores)},
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
      fs.writeFileSync(eslintConfigPath, eslintFlatConfig);
      s.stop(`Created ${color.cyan('eslint.config.js')}`);
    }
  }

  // Add husky enable/disable scripts to package.json
  const s = p.spinner();
  s.start('Adding Husky control scripts...');
  execSync(
    'npm pkg set scripts.husky:disable="git config core.hooksPath /dev/null"',
    { stdio: 'pipe' }
  );
  execSync(
    'npm pkg set scripts.husky:enable="git config core.hooksPath .husky"',
    { stdio: 'pipe' }
  );
  s.stop(
    `Added ${color.cyan('husky:disable')} and ${color.cyan('husky:enable')} scripts`
  );

  // Summary
  const installed = [];
  installed.push(
    `${color.green('✓')} Framework: ${framework.icon} ${color.cyan(framework.name)}`
  );
  if (usePrettier)
    installed.push(`${color.green('✓')} Prettier (code formatting)`);
  if (useEslint) installed.push(`${color.green('✓')} ESLint (code linting)`);
  if (useEmoji) installed.push(`${color.green('✓')} Commit emoji prefixes`);
  installed.push(`${color.green('✓')} Git hooks configured`);
  if (framework.ignorePatterns.length > 0) {
    installed.push(
      `${color.green('✓')} Auto-ignoring: ${color.dim(framework.ignorePatterns.join(', '))}`
    );
  }

  p.note(installed.join('\n'), 'Installed');

  // Next steps
  const nextSteps = [
    `${color.cyan('1.')} Stage some files:`,
    `   ${color.dim('$')} ${color.cyan('git add .')}`,
    '',
    `${color.cyan('2.')} Make a commit:`,
    `   ${color.dim('$')} ${color.cyan('git commit -m "feat: test husky hooks"')}`,
    '',
    `${color.yellow('💡')} Useful commands:`,
    `   ${color.dim('$')} ${color.cyan(`${packageManager} run husky:disable`)} ${color.dim('# Temporarily disable hooks')}`,
    `   ${color.dim('$')} ${color.cyan(`${packageManager} run husky:enable`)} ${color.dim('# Re-enable hooks')}`,
  ];

  p.note(nextSteps.join('\n'), 'Next Steps');

  p.outro(
    `${color.green('✨')} ${color.bold('Setup complete!')} Happy coding! 🎉`
  );
}

function generateCommitMsgScript(emojiStyle) {
  let mapping = '';

  if (emojiStyle === 'shortcode') {
    mapping = `  feat: ':rocket:',
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
  release: ':bookmark:'`;
  } else if (emojiStyle === 'tag') {
    mapping = `  feat: '[feat]',
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
  release: '[release]'`;
  } else {
    mapping = `  feat: '🚀',
  fix: '🐛',
  chore: '🔧',
  docs: '📝',
  refactor: '♻️',
  test: '✅',
  style: '🎨',
  perf: '⚡',
  build: '📦',
  ci: '⚙️',
  breaking: '💥',
  hotfix: '🔥',
  wip: '🚧',
  release: '🔖'`;
  }

  return `const fs = require('fs');
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
console.log(c.cyan + '┌────────────────────────────────────────┐' + c.reset);
console.log(c.cyan + '│' + c.reset + '  🐕 ' + c.bold + c.magenta + 'HUSKY' + c.reset + ' ' + c.bold + c.cyan + 'COMMIT HOOK' + c.reset + '             ' + c.cyan + '│' + c.reset);
console.log(c.cyan + '└────────────────────────────────────────┘' + c.reset);
console.log('');

// If message already has prefix, skip
if (/^(\\[[a-z]+\\]|:[a-z0-9_+-]+: |[\\p{Emoji}])/u.test(msg)) {
  console.log(c.cyan + '◇' + c.reset + '  ' + c.dim + 'Already has prefix, skipping...' + c.reset);
  console.log(c.cyan + '│' + c.reset);
  console.log(c.cyan + '└' + c.reset + '  ' + c.white + msg + c.reset);
  console.log('');
  process.exit(0);
}

// Extract conventional commit type
const match = msg.match(/^([a-z][a-z0-9_-]*)/);
if (!match) {
  console.log(c.yellow + '◇' + c.reset + '  ' + c.yellow + 'No conventional commit type detected' + c.reset);
  console.log(c.cyan + '│' + c.reset);
  console.log(c.cyan + '└' + c.reset + '  ' + c.dim + msg + c.reset);
  console.log('');
  process.exit(0);
}

const type = match[1];
const emojiMap = {
${mapping}
};

const prefix = emojiMap[type];
if (prefix) {
  const newMsg = \`\${prefix} \${msg}\`;
  fs.writeFileSync(msgFile, newMsg, 'utf-8');
  console.log(c.green + '◆' + c.reset + '  ' + c.green + c.bold + 'Emoji prefix added!' + c.reset);
  console.log(c.cyan + '│' + c.reset);
  console.log(c.cyan + '│' + c.reset + '  ' + c.dim + 'Before: ' + c.reset + c.gray + msg + c.reset);
  console.log(c.cyan + '│' + c.reset + '  ' + c.dim + 'After:  ' + c.reset + c.white + c.bold + newMsg + c.reset);
  console.log(c.cyan + '│' + c.reset);
  console.log(c.cyan + '└' + c.reset + '  ' + c.dim + 'Commit type: ' + c.reset + c.cyan + type + c.reset);
  console.log('');
} else {
  console.log(c.yellow + '◇' + c.reset + '  ' + c.dim + 'No emoji mapping for: ' + c.reset + c.yellow + type + c.reset);
  console.log(c.cyan + '│' + c.reset);
  console.log(c.cyan + '└' + c.reset + '  ' + c.white + msg + c.reset);
  console.log('');
}`;
}

main().catch((error) => {
  if (
    error.message?.includes('User force closed') ||
    error.message?.includes('cancelled')
  ) {
    p.cancel('Installation cancelled.');
    process.exit(0);
  }

  p.cancel('Installation failed!');
  p.log.error(error.message);

  if (
    error.message?.includes('EACCES') ||
    error.message?.includes('permission')
  ) {
    p.note(
      `Try running with elevated permissions:\n  ${color.cyan('sudo npx husky-installer')}`,
      'Tip'
    );
  } else if (
    error.message?.includes('ENOENT') ||
    error.message?.includes('not found')
  ) {
    p.note(
      `Make sure you have the required tools installed:\n` +
        `  ${color.dim('•')} Node.js >= 18.0.0\n` +
        `  ${color.dim('•')} Git\n` +
        `  ${color.dim('•')} npm/yarn/pnpm/bun`,
      'Requirements'
    );
  } else {
    p.note(
      `For help, please report this issue:\n  ${color.cyan('https://github.com/ShabanMughal/husky-installer/issues')}`,
      'Help'
    );
  }

  process.exit(1);
});
