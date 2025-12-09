import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

type EmojiStyle = 'shortcode' | 'tag' | 'emoji';
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

interface Config {
  usePrettier: boolean;
  useEslint: boolean;
  useEmoji: boolean;
  emojiStyle: EmojiStyle;
  packageManager: PackageManager;
}

interface OutputSectionProps {
  config: Config;
}

interface CodeBlockProps {
  title: string;
  content: string;
  id: string;
  onDownload?: () => void;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

const CodeBlock = ({
  title,
  content,
  id,
  onDownload,
  copied,
  onCopy,
}: CodeBlockProps) => (
  <div className="bg-black border border-green-900 mb-4">
    <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-green-900">
      <div className="font-mono text-xs text-green-400">
        <span className="text-slate-600">$</span> cat {title}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onCopy(content, id)}
          className="font-mono text-xs px-2 py-1 border border-slate-700 text-slate-400 hover:text-green-400 hover:border-green-500 transition-colors"
        >
          {copied === id ? (
            <>
              <CheckCircle2 className="w-3 h-3 inline mr-1" />
              copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 inline mr-1" />
              copy
            </>
          )}
        </button>
        {onDownload && (
          <button
            onClick={onDownload}
            className="font-mono text-xs px-2 py-1 border border-slate-700 text-slate-400 hover:text-green-400 hover:border-green-500 transition-colors"
          >
            download
          </button>
        )}
      </div>
    </div>
    <pre className="p-3 overflow-x-auto text-xs font-mono text-slate-300 max-h-80 overflow-y-auto">
      {content}
    </pre>
  </div>
);

export const OutputSection = ({ config }: OutputSectionProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const generateCommands = (): string[] => {
    const commands: string[] = [];
    const { usePrettier, useEslint, packageManager } = config;

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
    commands.push(
      `\n# Add prepare script to package.json\nnpm pkg set scripts.prepare="husky install"`
    );
    commands.push(`\n# Initialize Husky\nnpx husky install`);

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

    if (config.useEmoji) {
      commands.push(`\n# Create commit-msg hook for emoji/tag prefixes`);
      commands.push(
        `npx husky add .husky/commit-msg "node .husky/commit-msg.cjs"`
      );
    }

    return commands;
  };

  const generateCommitMsgScript = (): string => {
    const { emojiStyle } = config;

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
      mapping = `  feat: '🚀',
  fix: '🐛',
  chore: '🔧',
  docs: '📝',
  refactor: '♻️',
  test: '✅',
  style: '🎨',
  perf: '⚡',
  build: '�',
  ci: '⚙️',
  breaking: '💥',
  hotfix: '🔥',
  wip: '🚧',
  release: '🔖'`;
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
    <div className="space-y-4 slide-up">
      {/* Installation Commands */}
      <CodeBlock
        title="installation-commands.sh"
        content={generateCommands().join('\n')}
        id="commands"
        copied={copied}
        onCopy={copyToClipboard}
      />

      {/* Commit Message Script */}
      {config.useEmoji && (
        <CodeBlock
          title=".husky/commit-msg.cjs"
          content={generateCommitMsgScript()}
          id="commit-msg"
          copied={copied}
          onCopy={copyToClipboard}
          onDownload={() =>
            downloadFile('commit-msg.cjs', generateCommitMsgScript())
          }
        />
      )}

      {/* Prettier Config */}
      {config.usePrettier && (
        <CodeBlock
          title=".prettierrc"
          content={generatePrettierConfig()}
          id="prettier"
          copied={copied}
          onCopy={copyToClipboard}
          onDownload={() =>
            downloadFile('.prettierrc', generatePrettierConfig())
          }
        />
      )}

      {/* ESLint Config */}
      {config.useEslint && (
        <CodeBlock
          title=".eslintrc.json"
          content={generateEslintConfig()}
          id="eslint"
          copied={copied}
          onCopy={copyToClipboard}
          onDownload={() =>
            downloadFile('.eslintrc.json', generateEslintConfig())
          }
        />
      )}

      {/* Next Steps */}
      <div className="bg-black border border-yellow-900/50 p-4">
        <div className="font-mono text-xs space-y-2">
          <div className="text-yellow-400 mb-3">
            <span className="text-white">!</span> Next steps:
          </div>
          <div className="text-slate-400 space-y-1.5 ml-4">
            <div>
              <span className="text-green-400">1.</span> Copy and run the
              commands in your terminal
            </div>
            <div>
              <span className="text-green-400">2.</span> Download the
              configuration files if needed
            </div>
            <div>
              <span className="text-green-400">3.</span> Place{' '}
              <code className="px-1.5 py-0.5 bg-slate-900 text-yellow-400 border border-slate-800">
                commit-msg.cjs
              </code>{' '}
              in{' '}
              <code className="px-1.5 py-0.5 bg-slate-900 text-yellow-400 border border-slate-800">
                .husky/
              </code>{' '}
              folder
            </div>
            <div>
              <span className="text-green-400">4.</span> Make your first commit
              to test the hooks! 🚀
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
