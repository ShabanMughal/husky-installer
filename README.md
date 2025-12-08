# Husky Installer - Web Interface

Interactive web application for setting up Husky git hooks with Prettier, ESLint, and conventional commit prefixes.

## Features

- **Interactive Configuration**: Choose which tools to integrate (Prettier, ESLint)
- **Commit Conventions**: Auto-prefix commits with emojis, shortcodes, or tags
- **Multiple Package Managers**: Support for npm, yarn, pnpm, and bun
- **Command Generation**: Get ready-to-run terminal commands
- **Config File Downloads**: Download pre-configured .prettierrc, .eslintrc.json, and commit-msg.js
- **Modern UI**: Clean, responsive interface with dark theme

## What It Does

This web app generates all the commands and configuration files needed to:

1. Install Husky and optional dev dependencies (Prettier, ESLint)
2. Set up git hooks for pre-commit checks
3. Configure commit message prefixes based on conventional commit types
4. Create configuration files for Prettier and ESLint

## Usage

### Development

```bash
npm run dev
# or
bun dev
```

### Build

```bash
npm run build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
bun preview
```

## How to Use the App

1. **Configure Your Setup**:
   - Check/uncheck Prettier and ESLint options
   - Enable commit prefixes if desired
   - Choose your preferred prefix style (shortcodes, tags, or emoji characters)
   - Select your package manager

2. **Generate Commands**:
   - Click "Generate Commands" button
   - Copy the commands and run them in your project terminal

3. **Download Config Files**:
   - Download the generated configuration files
   - Place them in your project root
   - Place `commit-msg.js` in the `.husky/` folder

4. **Test Your Setup**:
   - Make a commit with a conventional type (e.g., "feat: add new feature")
   - Watch as hooks automatically format code and add prefixes!

## Commit Prefix Examples

### Shortcodes (`:sparkles:`)
```
feat: add user authentication → :sparkles: feat: add user authentication
fix: resolve login bug → :bug: fix: resolve login bug
```

### Plain Tags (`[feat]`)
```
feat: add user authentication → [feat] feat: add user authentication
fix: resolve login bug → [fix] fix: resolve login bug
```

### Emoji Characters (✨)
```
feat: add user authentication → ✨ feat: add user authentication
fix: resolve login bug → 🐛 fix: resolve login bug
```

## Supported Commit Types

- `feat` - New features
- `fix` - Bug fixes
- `chore` - Maintenance tasks
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Test additions/changes
- `style` - Code style changes
- `perf` - Performance improvements
- `build` - Build system changes
- `ci` - CI/CD changes

## Tech Stack

- React 19
- TypeScript
- Vite
- Lucide React (icons)

## Related

This web interface is based on the [husky-installar](../packages/husky-installer) CLI package in this monorepo.

## License

MIT
