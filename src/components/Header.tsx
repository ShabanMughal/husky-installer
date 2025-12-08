import { Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Sparkles className="logo-icon" />
        <h1>Husky Installer</h1>
      </div>
      <p className="subtitle">
        Interactive setup for Husky hooks with Prettier, ESLint, and commit conventions
      </p>
    </header>
  );
};
