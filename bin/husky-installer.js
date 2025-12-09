#!/usr/bin/env node

import { select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

console.log(chalk.green.bold('\n╔════════════════════════════════════════╗'));
console.log(chalk.green.bold('║     🐕 Husky Installer CLI v1.0.0     ║'));
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

async function main() {
  try {
    // Check if in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      console.log(
        chalk.red('❌ Not a git repository. Please run this in a git project.')
      );
      process.exit(1);
    }

    // Auto-detect package manager
    const packageManager = detectPackageManager();
    console.log(
      chalk.cyan(`📦 Detected package manager: ${chalk.bold(packageManager)}\n`)
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

      let preCommitContent = `echo ""
echo "\\033[36m╔════════════════════════════════════════╗\\033[0m"
echo "\\033[36m║     🐕 Husky Pre-commit Hook          ║\\033[0m"
echo "\\033[36m╚════════════════════════════════════════╝\\033[0m"
echo ""
`;

      if (usePrettier) {
        preCommitContent += `echo "\\033[33m→ Running Prettier...\\033[0m"
npx prettier --write . --ignore-path .gitignore && git add .
echo "\\033[32m✓ Prettier completed\\033[0m"
echo ""
`;
      }

      if (useEslint) {
        preCommitContent += `echo "\\033[33m→ Running ESLint...\\033[0m"
npx eslint . --fix --ignore-pattern ".husky/*" && git add .
echo "\\033[32m✓ ESLint completed\\033[0m"
echo ""
`;
      }

      preCommitContent += `echo "\\033[32m✓ All checks passed!\\033[0m"
echo ""
`;

      fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitContent, {
        mode: 0o755,
      });
      console.log(chalk.green('✓ Created .husky/pre-commit'));
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
        // Create basic flat config
        const eslintFlatConfig = `import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', '.husky', 'node_modules', 'build'],
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

    console.log(chalk.green.bold('\n✅ Husky installation complete!\n'));
    console.log(chalk.yellow('Next steps:'));
    console.log(chalk.white('  1. Review the generated configuration files'));
    console.log(chalk.white('  2. Make your first commit to test the hooks'));
    console.log(
      chalk.white('  3. Customize the hooks in .husky/ directory as needed')
    );
    console.log(chalk.cyan('\n💡 Useful commands:'));
    console.log(
      chalk.white(
        `  ${packageManager} run husky:disable  - Temporarily disable Husky hooks`
      )
    );
    console.log(
      chalk.white(
        `  ${packageManager} run husky:enable   - Re-enable Husky hooks\n`
      )
    );
  } catch (error) {
    if (error.message.includes('User force closed')) {
      console.log(chalk.yellow('\n⚠️  Installation cancelled by user.\n'));
      process.exit(0);
    }
    console.error(chalk.red('\n❌ Error:'), error.message);
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
console.log(colors.cyan + '╔════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║     🐕 Husky Installer Commit Message Hook      ║' + colors.reset);
console.log(colors.cyan + '╚════════════════════════════════════════╝' + colors.reset);
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
