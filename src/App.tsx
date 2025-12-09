import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Header, Footer, ConfigSection, OutputSection } from './components';
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

  return (
    <div className="min-h-screen bg-black flex flex-col font-mono">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <ConfigSection config={config} setConfig={setConfig} />

        <div className="mt-6">
          <button
            onClick={() => setShowCommands(!showCommands)}
            className="w-full bg-black border border-green-500 text-green-400 px-4 py-2 text-sm hover:bg-green-500 hover:text-black transition-all"
          >
            <Terminal className="w-4 h-4 inline mr-2" />
            {showCommands ? '[ Hide Output ]' : '[ Generate Commands ]'}
          </button>
        </div>

        {showCommands && (
          <div className="mt-6">
            <OutputSection config={config} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
