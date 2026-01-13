#!/usr/bin/env node

import { select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get package version dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// Create centered header
const title = `🐕 Husky Installer CLI v${version}`;
const boxWidth = 42;
const padding = Math.floor((boxWidth - title.length - 2) / 2);
const paddedTitle =
  ' '.repeat(padding) +
  title +
  ' '.repeat(boxWidth - title.length - padding - 2);

console.log(chalk.green.bold('\n╔════════════════════════════════════════╗'));
console.log(chalk.green.bold(`║${paddedTitle}║`));
console.log(chalk.green.bold('╚════════════════════════════════════════╝\n'));

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

  // Framework detection with ignore patterns
  const frameworks = {
    next: {
      check: () => deps['next'],
      ignorePatterns: ['.next', 'out', '.vercel'],
      name: 'Next.js',
    },
    react: {
      check: () => deps['react'] && !deps['next'] && !deps['gatsby'],
      ignorePatterns: ['build', 'dist'],
      name: 'React',
    },
    vue: {
      check: () => deps['vue'] || deps['nuxt'],
      ignorePatterns: ['.nuxt', 'dist', '.output'],
      name: deps['nuxt'] ? 'Nuxt' : 'Vue',
    },
    angular: {
      check: () => deps['@angular/core'],
      ignorePatterns: ['dist', '.angular'],
      name: 'Angular',
    },
    svelte: {
      check: () => deps['svelte'] || deps['@sveltejs/kit'],
      ignorePatterns: ['.svelte-kit', 'build'],
      name: deps['@sveltejs/kit'] ? 'SvelteKit' : 'Svelte',
    },
    astro: {
      check: () => deps['astro'],
      ignorePatterns: ['dist', '.astro'],
      name: 'Astro',
    },
    gatsby: {
      check: () => deps['gatsby'],
      ignorePatterns: ['.cache', 'public'],
      name: 'Gatsby',
    },
    vite: {
      check: () => deps['vite'] && !deps['astro'] && !deps['@sveltejs/kit'],
      ignorePatterns: ['dist'],
      name: 'Vite',
    },
  };

  for (const [key, framework] of Object.entries(frameworks)) {
    if (framework.check()) {
      return {
        name: framework.name,
        ignorePatterns: framework.ignorePatterns,
      };
    }
  }

  return { name: 'Node.js', ignorePatterns: ['dist', 'build'] };
}

async function main() {
  try {
    // Check if in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      console.log(chalk.red.bold('\n❌ Git repository not found!\n'));
      console.log(chalk.yellow('Husky requires a Git repository to work.\n'));
      console.log(chalk.cyan('Please run these commands first:\n'));
      console.log(chalk.white('  1. Initialize Git:'));
      console.log(chalk.green('     git init\n'));
      console.log(chalk.white('  2. Then run husky-installer again:'));
      console.log(chalk.green('     npx husky-installer\n'));
      process.exit(1);
    }

    // Check if package.json exists
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      console.log(chalk.red.bold('\n❌ package.json not found!\n'));
      console.log(chalk.yellow('This tool requires a Node.js project.\n'));
      console.log(chalk.cyan('Please run these commands first:\n'));
      console.log(chalk.white('  1. Initialize npm project:'));
      console.log(chalk.green('     npm init -y\n'));
      console.log(chalk.white('  2. Then run husky-installer again:'));
      console.log(chalk.green('     npx husky-installer\n'));
      process.exit(1);
    }

    // Auto-detect package manager and framework
    const packageManager = detectPackageManager();
    const framework = detectFramework();

    console.log(
      chalk.cyan(`📦 Detected package manager: ${chalk.bold(packageManager)}`)
    );
    console.log(
      chalk.cyan(`🎯 Detected framework: ${chalk.bold(framework.name)}\n`)
    );

    // Ask about Prettier
    const usePrettier = await select({
      message: 'Do you want to add Prettier (code formatting)?',
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      theme: {
        style: {
          highlight: (text) => chalk.underline.cyan(text),
        },
      },
    });

    // Ask about ESLint
    const useEslint = await select({
      message: 'Do you want to add ESLint (code linting)?',
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      theme: {
        style: {
          highlight: (text) => chalk.underline.cyan(text),
        },
      },
    });

    // Commit prefix configuration
    const useEmoji = await select({
      message: 'Enable automatic commit prefixes?',
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      theme: {
        style: {
          highlight: (text) => chalk.underline.cyan(text),
        },
      },
    });

    // Default to emoji characters style
    const emojiStyle = 'emoji';

    // Show emoji preview if enabled
    if (useEmoji) {
      console.log(chalk.cyan('\n📋 Commit prefix examples:\n'));
      console.log(chalk.white('  feat: add login     →  🚀 feat: add login'));
      console.log(chalk.white('  fix: button bug     →  🐛 fix: button bug'));
      console.log(
        chalk.white('  docs: update readme →  📝 docs: update readme')
      );
      console.log(
        chalk.white('  style: format code  →  🎨 style: format code')
      );
      console.log(chalk.white('  test: add tests     →  ✅ test: add tests'));
      console.log(chalk.white('  perf: optimize      →  ⚡ perf: optimize'));
      console.log(
        chalk.white('  refactor: cleanup   →  ♻️  refactor: cleanup')
      );
      console.log(
        chalk.white('  chore: update deps  →  🔧 chore: update deps\n')
      );
    }

    console.log(chalk.cyan('\n📦 Installing dependencies...\n'));

    // Install dependencies
    const devDeps = ['husky'];
    if (usePrettier) devDeps.push('prettier');
    if (useEslint) devDeps.push('eslint');

    const installCmd =
      packageManager === 'pnpm'
        ? `pnpm add -D ${devDeps.join(' ')}`
        : packageManager === 'yarn'
          ? `yarn add -D ${devDeps.join(' ')}`
          : packageManager === 'bun'
            ? `bun add -D ${devDeps.join(' ')}`
            : `npm install -D ${devDeps.join(' ')}`;

    execSync(installCmd, { stdio: 'inherit' });

    console.log(chalk.cyan('\n⚙️  Configuring Husky...\n'));

    // Initialize Husky (new API)
    execSync('npx husky init', { stdio: 'inherit' });

    const huskyDir = path.join(process.cwd(), '.husky');

    // Create pre-commit hook
    if (usePrettier || useEslint) {
      console.log(chalk.cyan('\n🪝 Creating pre-commit hook...\n'));

      let preCommitContent = '';

      // Build ignore patterns
      const ignorePatterns = [
        'node_modules',
        '.husky',
        ...framework.ignorePatterns,
      ];

      if (usePrettier) {
        const prettierIgnores = ignorePatterns
          .map((p) => `--ignore-path .gitignore`)
          .join(' ');
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
      console.log(
        chalk.green(
          `✓ Created .husky/pre-commit (ignoring: ${ignorePatterns.join(', ')})`
        )
      );
    }

    // Create commit-msg hook
    if (useEmoji) {
      console.log(chalk.cyan('\n📝 Creating commit-msg hook...\n'));

      const commitMsgScript = generateCommitMsgScript(emojiStyle);
      fs.writeFileSync(path.join(huskyDir, 'commit-msg.cjs'), commitMsgScript);

      const commitMsgHook = `node .husky/commit-msg.cjs $1
`;

      fs.writeFileSync(path.join(huskyDir, 'commit-msg'), commitMsgHook, {
        mode: 0o755,
      });
      console.log(chalk.green('✓ Created .husky/commit-msg'));
    }

    // Create config files
    if (usePrettier) {
      console.log(chalk.cyan('\n📄 Creating .prettierrc...\n'));
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
      console.log(
        chalk.green(`✓ Created .prettierignore (${framework.name} optimized)`)
      );
    }

    if (useEslint) {
      console.log(chalk.cyan('\n📄 Configuring ESLint...\n'));

      const eslintConfigPath = 'eslint.config.js';
      const eslintConfigMjsPath = 'eslint.config.mjs';

      // Check if flat config exists
      if (
        fs.existsSync(eslintConfigPath) ||
        fs.existsSync(eslintConfigMjsPath)
      ) {
        console.log(
          chalk.yellow('⚠ ESLint config already exists, skipping creation')
        );
        console.log(
          chalk.cyan(
            '💡 Make sure to add .husky to ignores in your eslint.config.js:'
          )
        );
        console.log(
          chalk.gray('   ignores: ["dist", ".husky", "node_modules"]')
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
        console.log(chalk.green('✓ Created eslint.config.js with flat config'));
      }
    }

    // Add husky enable/disable scripts to package.json
    console.log(chalk.cyan('\n📝 Adding Husky control scripts...\n'));
    execSync(
      'npm pkg set scripts.husky:disable="git config core.hooksPath /dev/null"',
      { stdio: 'inherit' }
    );
    execSync(
      'npm pkg set scripts.husky:enable="git config core.hooksPath .husky"',
      { stdio: 'inherit' }
    );
    console.log(chalk.green('✓ Added husky:disable and husky:enable scripts'));

    console.log(
      chalk.green.bold('\n╔════════════════════════════════════════╗')
    );
    console.log(chalk.green.bold('║  ✅ Installation Complete!            ║'));
    console.log(
      chalk.green.bold('╚════════════════════════════════════════╝\n')
    );

    console.log(chalk.cyan('📝 What was installed:\n'));
    console.log(chalk.white(`   ✓ Framework: ${framework.name}`));
    if (usePrettier)
      console.log(chalk.white('   ✓ Prettier (code formatting)'));
    if (useEslint) console.log(chalk.white('   ✓ ESLint (code linting)'));
    if (useEmoji) console.log(chalk.white('   ✓ Commit emoji prefixes'));
    console.log(chalk.white('   ✓ Git hooks configured'));
    if (framework.ignorePatterns.length > 0) {
      console.log(
        chalk.gray(
          `   ✓ Auto-ignoring: ${framework.ignorePatterns.join(', ')}\n`
        )
      );
    } else {
      console.log('');
    }

    console.log(chalk.yellow('🚀 Try it now:\n'));
    console.log(chalk.white('   1. Stage some files:'));
    console.log(chalk.green('      git add .\n'));
    console.log(chalk.white('   2. Make a commit:'));
    console.log(chalk.green('      git commit -m "feat: test husky hooks"\n'));

    console.log(chalk.cyan('💡 Useful commands:\n'));
    console.log(
      chalk.white(
        `   ${packageManager} run husky:disable  ${chalk.gray('# Temporarily disable hooks')}`
      )
    );
    console.log(
      chalk.white(
        `   ${packageManager} run husky:enable   ${chalk.gray('# Re-enable hooks')}\n`
      )
    );
  } catch (error) {
    if (error.message.includes('User force closed')) {
      console.log(chalk.yellow('\n⚠️  Installation cancelled by user.\n'));
      process.exit(0);
    }

    console.log(chalk.red.bold('\n❌ Installation failed!\n'));
    console.log(chalk.yellow('Error details:'));
    console.log(chalk.white(`  ${error.message}\n`));

    if (
      error.message.includes('EACCES') ||
      error.message.includes('permission')
    ) {
      console.log(chalk.cyan('💡 Try running with elevated permissions:\n'));
      console.log(chalk.green('   sudo npx husky-installer\n'));
    } else if (
      error.message.includes('ENOENT') ||
      error.message.includes('not found')
    ) {
      console.log(
        chalk.cyan('💡 Make sure you have the required tools installed:\n')
      );
      console.log(chalk.white('   - Node.js >= 18.0.0'));
      console.log(chalk.white('   - Git'));
      console.log(chalk.white('   - npm/yarn/pnpm/bun\n'));
    } else {
      console.log(chalk.cyan('💡 For help, please report this issue:\n'));
      console.log(
        chalk.green(
          '   https://github.com/ShabanMughal/husky-installer/issues\n'
        )
      );
    }

    process.exit(1);
  }
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
const colors = {
  reset: '\\x1b[0m',
  green: '\\x1b[32m',
  cyan: '\\x1b[36m',
  yellow: '\\x1b[33m',
  gray: '\\x1b[90m',
  white: '\\x1b[37m',
};

console.log('');
console.log(colors.cyan + '╔═══════════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║     🐕 Husky Installer Commit Message Hook      ║' + colors.reset);
console.log(colors.cyan + '╚═══════════════════════════════════════════════╝' + colors.reset);
console.log('');

// If message already has prefix, skip
if (/^(\\[[a-z]+\\]|:[a-z0-9_+-]+: |[\\p{Emoji}])/u.test(msg)) {
  console.log(colors.gray + '→ Message already has prefix, skipping...' + colors.reset);
  console.log(colors.white + '→ ' + msg + colors.reset);
  console.log('');
  process.exit(0);
}

// Extract conventional commit type
const match = msg.match(/^([a-z][a-z0-9_-]*)/);
if (!match) {
  console.log(colors.yellow + '⚠ No conventional commit type found' + colors.reset);
  console.log(colors.gray + '→ ' + msg + colors.reset);
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
  console.log(colors.green + '✓ Added emoji prefix!' + colors.reset);
  console.log(colors.gray + '  Before: ' + colors.reset + msg);
  console.log(colors.white + '  After:  ' + colors.reset + newMsg);
  console.log('');
} else {
  console.log(colors.gray + '→ No emoji mapping for type: ' + type + colors.reset);
  console.log(colors.white + '→ ' + msg + colors.reset);
  console.log('');
}`;
}

main();
