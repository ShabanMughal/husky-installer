export const Footer = () => {
  return (
    <footer className="bg-black border-t border-slate-800 py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <div className="font-mono text-xs text-slate-500 space-y-1">
          <div>
            <span className="text-green-500">user@terminal</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~/husky-installer</span>
            <span className="text-white">$</span>
            <span className="text-slate-600 ml-2">
              # Powered by{' '}
              <a
                href="https://github.com/typicode/husky"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                husky
              </a>
            </span>
          </div>
          <div className="text-slate-600">
            <span className="terminal-blink">▊</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
