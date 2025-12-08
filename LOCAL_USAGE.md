# Using Husky Installer Locally

This guide explains how to use both the CLI package and web interface locally.

---

## Option 1: CLI Package (packages/husky-installer)

### Method A: Direct Execution with Node

From any project where you want to install Husky:

```bash
# Run from your target project directory
node /path/to/this/repo/packages/husky-installer/bin/husky-installar.js

# Example if this repo is in D:\JSM\husky:
node D:\JSM\husky\packages\husky-installer\bin\husky-installar.js
```

### Method B: Using npm link (Recommended for CLI)

1. **Link the package globally** (run once from the husky-installer package):
```bash
cd packages/husky-installer
npm link
```

2. **Use it anywhere**:
```bash
# Now you can run from any project directory
husky-installar
```

3. **Unlink when done**:
```bash
npm unlink -g husky-installar
```

### Method C: Using npx with local path

```bash
# From your target project directory
npx /path/to/this/repo/packages/husky-installer

# Example:
npx D:\JSM\husky\packages\husky-installer
```

---

## Option 2: Web Interface (husky-installer/)

### Start the Development Server

```bash
# Navigate to the web app
cd husky-installer

# Install dependencies (if not already done)
npm install
# or
bun install

# Start the dev server
npm run dev
# or
bun dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

### Using the Web Interface

1. Open the app in your browser
2. Configure your preferences (Prettier, ESLint, commit style, etc.)
3. Click "Generate Commands"
4. Copy the commands and run them in your project terminal
5. Download any config files you need
6. Place `commit-msg.js` in your project's `.husky/` folder

---

## Option 3: Build and Deploy Web Interface

### Build for Production

```bash
cd husky-installer
npm run build
# or
bun run build
```

This creates a `dist/` folder with static files.

### Preview Production Build

```bash
npm run preview
# or
bun preview
```

### Deploy Options

The built files in `dist/` can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Push `dist` to gh-pages branch
- **Any static host**: Upload the `dist` folder

---

## Quick Start Examples

### Example 1: Use CLI in a new project

```bash
# Create a new project
mkdir my-project
cd my-project
npm init -y
git init

# Run the installer from this repo
node D:\JSM\husky\packages\husky-installer\bin\husky-installar.js
```

### Example 2: Use CLI with npm link

```bash
# One-time setup (from this repo)
cd D:\JSM\husky\packages\husky-installer
npm link

# Now use anywhere
cd ~/my-other-project
husky-installar
```

### Example 3: Use Web Interface

```bash
# Start the web app (from this repo)
cd D:\JSM\husky\husky-installer
bun dev

# Open browser to http://localhost:5173
# Configure and copy commands
# Run commands in your target project
```

---

## Testing the Setup

After running the installer in your project:

1. **Test pre-commit hook**:
```bash
# Make a change
echo "console.log('test')" > test.js
git add test.js
git commit -m "test: add test file"
# Prettier/ESLint should run automatically
```

2. **Test commit-msg hook**:
```bash
git commit -m "feat: add new feature"
# Should auto-prefix with emoji/tag
```

3. **View the commit**:
```bash
git log -1
# Should show: ✨ feat: add new feature (or :sparkles: or [feat])
```

---

## Troubleshooting

### CLI: "command not found"

Make sure you're using the full path or have linked the package:
```bash
node D:\JSM\husky\packages\husky-installer\bin\husky-installar.js
```

### Web: Port already in use

Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Hooks not running

Make sure:
1. You're in a git repository (`git init` if needed)
2. Hooks have execute permissions (should be automatic)
3. You ran `npx husky install` or `npm install` (which runs the prepare script)

---

## Package Locations

- **CLI Package**: `packages/husky-installer/`
- **Web Interface**: `husky-installer/` (root level)
- **CLI Entry Point**: `packages/husky-installer/bin/husky-installar.js`
