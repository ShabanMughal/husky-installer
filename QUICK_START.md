# Quick Start - Husky Installer

## 🚀 Fastest Way to Use Locally

### CLI Version (Interactive Terminal)

```bash
# From any project directory where you want Husky:
node D:\JSM\husky\husky-installer\bin\husky-installer.js

```

Or use npm link for easier access:

```bash
# One-time setup:
cd D:\JSM\husky\packages\husky-installer
npm link

# Then use anywhere:
cd your-project
husky-installar
```

---

### Web Version (Visual Interface)

```bash
# Start the web app:
cd D:\JSM\husky\husky-installer
bun dev

# Open: http://localhost:5173
```

---

## 📦 What Each Package Does

### 1. CLI Package (`packages/husky-installer/`)

- **Interactive terminal prompts** with arrow key navigation
- Automatically installs dependencies
- Creates hooks and config files
- Best for: Quick setup, automation, CI/CD

### 2. Web App (`husky-installer/`)

- **Visual interface** in your browser
- Generates commands to copy/paste
- Download config files
- Best for: Learning, customization, sharing with team

---

## 💡 Common Use Cases

### Use Case 1: Setup Husky in an existing project

```bash
cd your-existing-project
node D:\JSM\husky\packages\husky-installer\bin\husky-installar.js
```

### Use Case 2: Try different configurations

```bash
cd D:\JSM\husky\husky-installer
bun dev
# Play with options in browser, copy commands
```

### Use Case 3: Share with team

Deploy the web app to Vercel/Netlify so your team can generate their own setup commands.

---

## 🎯 Quick Test

After installation, test it:

```bash
# Make a commit with conventional type
git commit -m "feat: add awesome feature"

# Should auto-format and add prefix:
# ✨ feat: add awesome feature
```

---

## 📝 Summary

| Method           | Command                                                | Best For      |
| ---------------- | ------------------------------------------------------ | ------------- |
| **CLI Direct**   | `node packages/husky-installer/bin/husky-installar.js` | One-time use  |
| **CLI Linked**   | `npm link` then `husky-installar`                      | Frequent use  |
| **Web Local**    | `cd husky-installer && bun dev`                        | Visual config |
| **Web Deployed** | Deploy to Vercel/Netlify                               | Team sharing  |

Choose the method that fits your workflow! 🎉
