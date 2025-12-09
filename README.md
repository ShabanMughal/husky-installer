# 🐕 Husky Installer

Interactive CLI and web interface for setting up Husky git hooks with Prettier, ESLint, and commit conventions.

[![npm version](https://img.shields.io/npm/v/husky-installer.svg)](https://www.npmjs.com/package/husky-installer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Interactive CLI** - Beautiful terminal prompts with auto-detection
- 🌐 **Web Interface** - Modern web UI for visual configuration
- 🚀 **Auto-detect Package Manager** - Detects npm, yarn, pnpm, or bun from lock files
- 🎨 **Prettier Integration** - Auto-format code on commit
- 🔍 **ESLint Integration** - Auto-fix linting issues on commit
- 🎭 **Commit Prefixes** - Auto-add emojis to conventional commits
- ⚙️ **Easy Control** - Enable/disable hooks with simple commands

## 📦 Usage

### Recommended: Use with npx (no installation needed)

```bash
npx husky-installer
```

### Alternative: Global Installation

```bash
npm install -g husky-installer
husky-installer
```

> **Note:** Don't use `npm install husky-installer` in your project - use `npx` instead!

## 🚀 Quick Start

### CLI Usage

Simply run in your project directory:

```bash
husky-installer
```

The CLI will:

1. ✅ Auto-detect your package manager
2. ✅ Ask if you want Prettier (code formatting)
3. ✅ Ask if you want ESLint (code linting)
4. ✅ Ask if you want commit prefixes
5. ✅ Install and configure everything automatically!

### Web Interface

```bash
npm run dev
```

Then open your browser to configure visually and copy the commands.

## 🎭 Commit Prefix Examples

When enabled, your commits get automatic emoji prefixes:

```bash
git commit -m "feat: add login"     → 🚀 feat: add login
git commit -m "fix: button bug"     → 🐛 fix: button bug
git commit -m "docs: update readme" → 📝 docs: update readme
git commit -m "style: format code"  → 🎨 style: format code
git commit -m "test: add tests"     → ✅ test: add tests
git commit -m "perf: optimize"      → ⚡ perf: optimize
git commit -m "refactor: cleanup"   → ♻️ refactor: cleanup
git commit -m "chore: update deps"  → 🔧 chore: update deps
```

### Supported Commit Types

| Type       | Emoji | Description      |
| ---------- | ----- | ---------------- |
| `feat`     | 🚀    | New features     |
| `fix`      | 🐛    | Bug fixes        |
| `docs`     | 📝    | Documentation    |
| `style`    | 🎨    | Code style       |
| `refactor` | ♻️    | Code refactoring |
| `perf`     | ⚡    | Performance      |
| `test`     | ✅    | Tests            |
| `chore`    | 🔧    | Maintenance      |
| `build`    | 📦    | Build system     |
| `ci`       | ⚙️    | CI/CD            |
| `breaking` | 💥    | Breaking changes |
| `hotfix`   | 🔥    | Urgent fixes     |
| `wip`      | 🚧    | Work in progress |
| `release`  | 🔖    | Releases         |

## 🎮 Control Commands

After installation, you get these npm scripts:

```bash
# Temporarily disable Husky hooks
npm run husky:disable

# Re-enable Husky hooks
npm run husky:enable
```

## 🛠️ What Gets Installed

The installer sets up:

- ✅ Husky git hooks
- ✅ Pre-commit hook (runs Prettier/ESLint)
- ✅ Commit-msg hook (adds emoji prefixes)
- ✅ Configuration files (.prettierrc, eslint.config.js)
- ✅ Control scripts (enable/disable hooks)

## 📋 Requirements

- Node.js >= 18.0.0
- **Git repository initialized** (`git init` must be run first)
- npm, yarn, pnpm, or bun

## 🎨 CLI Preview

```
╔════════════════════════════════════════╗
║     🐕 Husky Installer CLI v1.0.0     ║
╚════════════════════════════════════════╝

📦 Detected package manager: npm

? Do you want to add Prettier (code formatting)?
  ❯ Yes
    No

? Do you want to add ESLint (code linting)?
  ❯ Yes
    No

? Enable automatic commit prefixes?
  ❯ Yes
    No

📋 Commit prefix examples:

  feat: add login     →  🚀 feat: add login
  fix: button bug     →  🐛 fix: button bug
  docs: update readme →  📝 docs: update readme
  ...

📦 Installing dependencies...
⚙️  Configuring Husky...
🪝 Creating pre-commit hook...
📝 Creating commit-msg hook...

✅ Husky installation complete!
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Shaban Mughal

## 🔗 Links

- [GitHub Repository](https://github.com/ShabanMughal/husky-installer)
- [npm Package](https://www.npmjs.com/package/husky-installer)
- [Report Issues](https://github.com/ShabanMughal/husky-installer/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
