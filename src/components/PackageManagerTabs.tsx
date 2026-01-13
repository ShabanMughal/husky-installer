import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface PackageManagerTabsProps {
  commands: {
    npm: string;
    pnpm: string;
    yarn: string;
    bun: string;
  };
}

export function PackageManagerTabs({ commands }: PackageManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>('npm');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tabs: { id: PackageManager; label: string }[] = [
    { id: 'npm', label: 'npm' },
    { id: 'pnpm', label: 'pnpm' },
    { id: 'yarn', label: 'yarn' },
    { id: 'bun', label: 'bun' },
  ];

  const currentCommand = commands[activeTab];

  // Parse command for syntax highlighting
  const highlightCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const manager = parts[0];
    const rest = parts.slice(1).join(' ');

    return (
      <>
        <span className="text-blue-400 dark:text-blue-300">{manager}</span>
        {rest && (
          <span className="text-green-400 dark:text-green-300"> {rest}</span>
        )}
      </>
    );
  };

  return (
    <div className="my-6 border border-border rounded-lg overflow-hidden">
      <div className="flex border-b border-border bg-muted/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 dark:text-blue-300 border-b-2 border-blue-500 dark:border-blue-300 bg-background'
                : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative bg-muted/30 dark:bg-muted/20">
        <pre className="p-4 overflow-x-auto">
          <span className="text-sm font-mono">
            {highlightCommand(currentCommand)}
          </span>
        </pre>
        <button
          onClick={() => copyToClipboard(currentCommand)}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
