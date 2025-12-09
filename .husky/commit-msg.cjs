const fs = require('fs');
const msgFile = process.argv[2];
const msg = fs.readFileSync(msgFile, 'utf-8').trim();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};

console.log('');
console.log(
  colors.cyan +
    '╔═══════════════════════════════════════════════╗' +
    colors.reset
);
console.log(
  colors.cyan +
    '║     🐕 Husky Installer Commit Message Hook      ║' +
    colors.reset
);
console.log(
  colors.cyan +
    '╚═══════════════════════════════════════════════╝' +
    colors.reset
);
console.log('');

// If message already has prefix, skip
if (/^(\[[a-z]+\]|:[a-z0-9_+-]+: |[\p{Emoji}])/u.test(msg)) {
  console.log(
    colors.gray + '→ Message already has prefix, skipping...' + colors.reset
  );
  console.log(colors.white + '→ ' + msg + colors.reset);
  console.log('');
  process.exit(0);
}

// Extract conventional commit type
const match = msg.match(/^([a-z][a-z0-9_-]*)/);
if (!match) {
  console.log(
    colors.yellow + '⚠ No conventional commit type found' + colors.reset
  );
  console.log(colors.gray + '→ ' + msg + colors.reset);
  console.log('');
  process.exit(0);
}

const type = match[1];
const emojiMap = {
  feat: '🚀',
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
  release: '🔖',
};

const prefix = emojiMap[type];
if (prefix) {
  const newMsg = `${prefix} ${msg}`;
  fs.writeFileSync(msgFile, newMsg, 'utf-8');
  console.log(colors.green + '✓ Added emoji prefix!' + colors.reset);
  console.log(colors.gray + '  Before: ' + colors.reset + msg);
  console.log(colors.white + '  After:  ' + colors.reset + newMsg);
  console.log('');
} else {
  console.log(
    colors.gray + '→ No emoji mapping for type: ' + type + colors.reset
  );
  console.log(colors.white + '→ ' + msg + colors.reset);
  console.log('');
}
