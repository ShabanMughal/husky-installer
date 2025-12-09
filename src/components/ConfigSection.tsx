type EmojiStyle = 'shortcode' | 'tag' | 'emoji';
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

interface Config {
  usePrettier: boolean;
  useEslint: boolean;
  useEmoji: boolean;
  emojiStyle: EmojiStyle;
  packageManager: PackageManager;
}

interface ConfigSectionProps {
  config: Config;
  setConfig: (config: Config) => void;
}

export const ConfigSection = ({ config, setConfig }: ConfigSectionProps) => {
  return (
    <div className="bg-black border border-green-900 p-4">
      <div className="font-mono text-sm space-y-3">
        {/* Header */}
        <div className="text-green-400 mb-4">
          <span className="text-white">?</span> Select tools to install (use
          space to select, enter to confirm)
        </div>

        {/* Options */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-900/50 p-2 -mx-2 transition-colors group">
          <input
            type="checkbox"
            checked={config.usePrettier}
            onChange={(e) =>
              setConfig({ ...config, usePrettier: e.target.checked })
            }
            className="sr-only peer"
          />
          <span className="text-green-400 peer-checked:text-green-400 text-slate-600">
            {config.usePrettier ? '◉' : '◯'}
          </span>
          <span className="text-slate-300 group-hover:text-white transition-colors">
            Prettier <span className="text-slate-600">(code formatting)</span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-900/50 p-2 -mx-2 transition-colors group">
          <input
            type="checkbox"
            checked={config.useEslint}
            onChange={(e) =>
              setConfig({ ...config, useEslint: e.target.checked })
            }
            className="sr-only peer"
          />
          <span className="text-green-400 peer-checked:text-green-400 text-slate-600">
            {config.useEslint ? '◉' : '◯'}
          </span>
          <span className="text-slate-300 group-hover:text-white transition-colors">
            ESLint <span className="text-slate-600">(code linting)</span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-900/50 p-2 -mx-2 transition-colors group">
          <input
            type="checkbox"
            checked={config.useEmoji}
            onChange={(e) =>
              setConfig({ ...config, useEmoji: e.target.checked })
            }
            className="sr-only peer"
          />
          <span className="text-green-400 peer-checked:text-green-400 text-slate-600">
            {config.useEmoji ? '◉' : '◯'}
          </span>
          <span className="text-slate-300 group-hover:text-white transition-colors">
            Commit prefixes{' '}
            <span className="text-slate-600">(auto emoji/tags)</span>
          </span>
        </label>

        {/* Conditional Options */}
        {config.useEmoji && (
          <div className="ml-6 mt-3 space-y-2 slide-up border-l-2 border-slate-800 pl-4">
            <div className="text-green-400">
              <span className="text-white">?</span> Select commit prefix style:
            </div>
            <select
              value={config.emojiStyle}
              onChange={(e) =>
                setConfig({
                  ...config,
                  emojiStyle: e.target.value as EmojiStyle,
                })
              }
              className="w-full bg-black text-slate-300 border border-slate-700 px-3 py-1.5 font-mono text-sm focus:outline-none focus:border-green-500 hover:border-slate-600 transition-colors"
            >
              <option value="emoji">✨ Emoji characters</option>
              <option value="shortcode">:sparkles: Shortcodes</option>
              <option value="tag">[feat] Plain tags</option>
            </select>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-green-400 mb-2">
            <span className="text-white">?</span> Select your package manager:
          </div>
          <select
            value={config.packageManager}
            onChange={(e) =>
              setConfig({
                ...config,
                packageManager: e.target.value as PackageManager,
              })
            }
            className="w-full bg-black text-slate-300 border border-slate-700 px-3 py-1.5 font-mono text-sm focus:outline-none focus:border-green-500 hover:border-slate-600 transition-colors"
          >
            <option value="npm">npm</option>
            <option value="yarn">yarn</option>
            <option value="pnpm">pnpm</option>
            <option value="bun">bun</option>
          </select>
        </div>
      </div>
    </div>
  );
};
