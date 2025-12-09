export const Header = () => {
  return (
    <header className="bg-black border-b border-green-500">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="font-mono text-sm space-y-1">
          <div className="text-green-400">
            <span className="text-green-500">user@terminal</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~/husky-installer</span>
            <span className="text-white">$</span>
            <span className="text-white ml-2">
              ./husky-installer --interactive
            </span>
          </div>
          <div className="text-slate-400">
            Husky Installer v1.0.0 - Interactive Git Hooks Configuration
          </div>
          <div className="text-slate-500 text-xs">
            Configure Prettier, ESLint, and commit conventions for your project
          </div>
        </div>
      </div>
    </header>
  );
};
