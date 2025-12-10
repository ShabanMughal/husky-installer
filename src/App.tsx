import { Github, BookOpen } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">Husky Installer</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive CLI and web interface for setting up Husky git hooks
            with Prettier, ESLint, and commit conventions
          </p>
        </div>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          <a
            href="/docs"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Documentation
          </a>
          <a
            href="https://github.com/ShabanMughal/husky-installer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground text-sm mb-3">Quick Start</p>
          <code className="text-primary text-lg font-mono">
            npx husky-installer
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;
