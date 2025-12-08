import { useState } from 'react';
import { Check, X, Download, Terminal, Sparkles } from 'lucide-react';
import './App.css';

type EmojiStyle = 'shortcode' | 'tag' | 'emoji';
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

interface Config {
  usePrettier: boolean;
  useEslint: boolean;
  useEmoji: boolean;
  emojiStyle: EmojiStyle;
  packageManager: PackageManager;
}

function App() {
  const [config, setConfig] = useState<Config>({
    usePrettier: true,
    useEslint: true,
    useEmoji: true,
    emojiStyle: 'shortcode',
    packageManager: 'npm',
  });

  const [showCommands, setShowCommands] = useState(false);

  const generateCommands = (): string[] => {
    const commands: string[] = [];
    const { usePrettier, useEslint, packageManager } = config;

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

    commands.push(`# Install dependencies\n${installCmd}`);

    // Add prepare script
    commands.push(
      `\n# Add prepare script to package.json\nnpm pkg set scripts.prepare="husky install"`
    );

    // Initialize husky
    commands.push(`\n# Initialize Husky\nnpx husky install`);

    // Create pre-commit hook
    if (usePrettier || useEslint) {
      commands.push(`\n# Create pre-commit hook`);
      if (usePrettier) {
        commands.push(
          `npx husky add .husky/pre-commit "npx --no-install prettier --write . && git add ."`
        );
      }
      if (useEslint) {
        commands.push(
          `npx husky add .husky/pre-commit "npx --no-install eslint . --fix && git add ."`
        );
      }
    }

    // Create commit-msg hook
    if (config.useEmoji) {
      commands.push(`\n# Create commit-msg hook for emoji/tag prefixes`);
      commands.push(`npx husky add .husky/commit-msg "node .husky/commit-msg.js"`);
    }

    return commands;
  };

  const generateCommitMsgScript = (): string => {
    const { emojiStyle } = config;

    let mapping = '';
    if (emojiStyle === 'shortcode') {
      mapping = `  feat: ':sparkles:',
  fix: ':bug:',
  chore: ':wrench:',
  docs: ':memo:',
  refactor: ':recycle:',
  test: ':white_check_mark:',
  style: ':art:',
  perf: ':zap:',
  build: ':package:',
  ci: ':gear:'`;
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
  ci: '[ci]'`;
    } else {
      mapping = `  feat: '✨',
  fix: '🐛',
  chore: '🔧',
  docs: '📝',
  refactor: '♻️',
  test: '✅',
  style: '🎨',
  perf: '⚡',
  build: '📦',
  ci: '⚙️'`;
    }

    return `const fs = require('fs');
const msgFile = process.argv[2];
const msg = fs.readFileSync(msgFile, 'utf-8');

// If message already has prefix, skip
if (/^(\\[[a-z]+\\]|:[a-z0-9_+-]+: |[\\p{Emoji}])/u.test(msg)) {
  process.exit(0);
}

// Extract conventional commit type
const match = msg.match(/^([a-z][a-z0-9_-]*)/);
if (!match) process.exit(0);

const type = match[1];
const emojiMap = {
${mapping}
};

const prefix = emojiMap[type];
if (prefix) {
  fs.writeFileSync(msgFile, \`\${prefix} \${msg}\`, 'utf-8');
}`;
  };

  const generatePrettierConfig = (): string => {
    return JSON.stringify(
      {
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 80,
      },
      null,
      2
    );
  };

  const generateEslintConfig = (): string => {
    return JSON.stringify(
      {
        env: {
          browser: true,
          node: true,
          es2021: true,
        },
        extends: ['eslint:recommended'],
        parserOptions: {
          ecmaVersion: 12,
          sourceType: 'module',
        },
        rules: {},
      },
      null,
      2
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Sparkles className="logo-icon" />
          <h1>Husky Installer</h1>
        </div>
        <p className="subtitle">
          Interactive setup for Husky hooks with Prettier, ESLint, and commit conventions
        </p>
      </header>

      <main className="main">
        <div className="config-section">
          <h2>Configuration</h2>

          <div className="option-group">
            <label className="option">
              <input
                type="checkbox"
                checked={config.usePrettier}
                onChange={(e) =>
                  setConfig({ ...config, usePrettier: e.target.checked })
                }
              />
              <span className="option-label">
                <Check className="icon" />
                Add Prettier (formatting)
              </span>
            </label>

            <label className="option">
              <input
                type="checkbox"
                checked={config.useEslint}
                onChange={(e) =>
                  setConfig({ ...config, useEslint: e.target.checked })
                }
              />
              <span className="option-label">
                <Check className="icon" />
                Add ESLint (linting)
              </span>
            </label>

            <label className="option">
              <input
                type="checkbox"
                checked={config.useEmoji}
                onChange={(e) =>
                  setConfig({ ...config, useEmoji: e.target.checked })
                }
              />
              <span className="option-label">
                <Check className="icon" />
                Enable commit prefixes
              </span>
            </label>
          </div>

          {config.useEmoji && (
            <div className="sub-option">
              <label>Commit Prefix Style:</label>
              <select
                value={config.emojiStyle}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    emojiStyle: e.target.value as EmojiStyle,
                  })
                }
              >
                <option value="shortcode">Shortcodes (:sparkles:)</option>
                <option value="tag">Plain tags ([feat])</option>
                <option value="emoji">Emoji characters (✨)</option>
              </select>
            </div>
          )}

          <div className="sub-option">
            <label>Package Manager:</label>
            <select
              value={config.packageManager}
              onChange={(e) =>
                setConfig({
                  ...config,
                  packageManager: e.target.value as PackageManager,
                })
              }
            >
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
              <option value="pnpm">pnpm</option>
              <option value="bun">bun</option>
            </select>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCommands(!showCommands)}
          >
            <Terminal className="btn-icon" />
            {showCommands ? 'Hide Commands' : 'Generate Commands'}
          </button>
        </div>

        {showCommands && (
          <div className="output-section">
            <div className="output-header">
              <h3>Installation Commands</h3>
              <button
                className="btn btn-small"
                onClick={() => copyToClipboard(generateCommands().join('\n'))}
              >
                Copy All
              </button>
            </div>
            <pre className="code-block">{generateCommands().join('\n')}</pre>

            {config.useEmoji && (
              <>
                <div className="output-header">
                  <h3>commit-msg.js</h3>
                  <button
                    className="btn btn-small"
                    onClick={() =>
                      downloadFile('commit-msg.js', generateCommitMsgScript())
                    }
                  >
                    <Download className="btn-icon" />
                    Download
                  </button>
                </div>
                <pre className="code-block">{generateCommitMsgScript()}</pre>
              </>
            )}

            {config.usePrettier && (
              <>
                <div className="output-header">
                  <h3>.prettierrc</h3>
                  <button
                    className="btn btn-small"
                    onClick={() =>
                      downloadFile('.prettierrc', generatePrettierConfig())
                    }
                  >
                    <Download className="btn-icon" />
                    Download
                  </button>
                </div>
                <pre className="code-block">{generatePrettierConfig()}</pre>
              </>
            )}

            {config.useEslint && (
              <>
                <div className="output-header">
                  <h3>.eslintrc.json</h3>
                  <button
                    className="btn btn-small"
                    onClick={() =>
                      downloadFile('.eslintrc.json', generateEslintConfig())
                    }
                  >
                    <Download className="btn-icon" />
                    Download
                  </button>
                </div>
                <pre className="code-block">{generateEslintConfig()}</pre>
              </>
            )}

            <div className="info-box">
              <h4>Next Steps:</h4>
              <ol>
                <li>Copy and run the commands in your terminal</li>
                <li>Download the configuration files if needed</li>
                <li>
                  Place <code>commit-msg.js</code> in <code>.husky/</code> folder
                </li>
                <li>Make your first commit to test the hooks!</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Based on{' '}
          <a
            href="https://github.com/typicode/husky"
            target="_blank"
            rel="noopener noreferrer"
          >
            Husky
          </a>{' '}
          • Interactive web interface for easy setup
        </p>
      </footer>
    </div>
  );
}

export default App;
