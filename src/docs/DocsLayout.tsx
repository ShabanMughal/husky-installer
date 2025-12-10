import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { DocsLayout as FumadocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

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
    <RootProvider>
      <FumadocsLayout
        tree={docsTree}
        nav={{
          title: 'Husky Installer',
        }}
      >
        {children}
      </FumadocsLayout>
    </RootProvider>
  );
}
