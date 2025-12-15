import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { DocsLayout as FumadocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { Github } from 'lucide-react';

const docsTree = {
  name: 'Documentation',
  children: [
    {
      type: 'page' as const,
      name: 'Introduction',
      url: '/docs',
    },
    {
      type: 'page' as const,
      name: 'Installation',
      url: '/docs/installation',
    },
    {
      type: 'page' as const,
      name: 'Usage',
      url: '/docs/usage',
    },
    {
      type: 'page' as const,
      name: 'Configuration',
      url: '/docs/configuration',
    },
  ],
};

export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        enabled: true,
      }}
    >
      <FumadocsLayout
        tree={docsTree}
        nav={{
          title: 'Husky Installer',
        }}
        sidebar={{
          footer: (
            <div className="px-4 py-3 absolute bottom-1 left-0 right-0 w-fit">
              <a
                href="https://github.com/ShabanMughal/husky-installer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          ),
        }}
      >
        {children}
      </FumadocsLayout>
    </RootProvider>
  );
}
