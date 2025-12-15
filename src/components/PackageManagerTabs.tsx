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

  return (
    <div className="my-6 border border-border rounded-lg overflow-hidden">
      <div className="flex border-b border-border bg-muted/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-foreground border-b-2 border-primary bg-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative bg-muted/30">
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm font-mono">{currentCommand}</code>
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
