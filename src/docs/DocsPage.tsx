import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { DocsPage as FumadocsPage, DocsBody } from 'fumadocs-ui/page';
import { DocsLayout } from './DocsLayout';

const docs = {
  index: lazy(() => import('../../content/docs/index.mdx')),
  installation: lazy(() => import('../../content/docs/installation.mdx')),
  usage: lazy(() => import('../../content/docs/usage.mdx')),
  configuration: lazy(() => import('../../content/docs/configuration.mdx')),
};

const tocData: Record<string, { title: string; url: string; depth: number }[]> =
  {
    index: [
      { title: 'Husky Installer', url: '#husky-installer', depth: 1 },
      { title: 'Features', url: '#features', depth: 2 },
      { title: 'Getting Started', url: '#getting-started', depth: 2 },
    ],
    installation: [
      { title: 'Installation', url: '#installation', depth: 1 },
      {
        title: 'Using npx (Recommended)',
        url: '#using-npx-recommended',
        depth: 2,
      },
      { title: 'Global Installation', url: '#global-installation', depth: 2 },
      { title: 'Using Bun', url: '#using-bun', depth: 2 },
      { title: 'Requirements', url: '#requirements', depth: 2 },
    ],
    usage: [
      { title: 'Usage', url: '#usage', depth: 1 },
      { title: 'CLI Mode', url: '#cli-mode', depth: 2 },
      { title: 'Web Interface', url: '#web-interface', depth: 2 },
      { title: 'Available Hooks', url: '#available-hooks', depth: 2 },
      { title: 'Pre-commit Hook', url: '#pre-commit-hook', depth: 3 },
      { title: 'Commit Message Hook', url: '#commit-message-hook', depth: 3 },
    ],
    configuration: [
      { title: 'Configuration', url: '#configuration', depth: 1 },
      { title: 'Husky Configuration', url: '#husky-configuration', depth: 2 },
      {
        title: 'Prettier Configuration',
        url: '#prettier-configuration',
        depth: 2,
      },
      { title: 'ESLint Configuration', url: '#eslint-configuration', depth: 2 },
      {
        title: 'Commit Message Formats',
        url: '#commit-message-formats',
        depth: 2,
      },
      { title: 'Conventional Commits', url: '#conventional-commits', depth: 3 },
      { title: 'Emoji Commits', url: '#emoji-commits', depth: 3 },
    ],
  };

export function DocsPage() {
  const { slug } = useParams();
  const docKey = (slug || 'index') as keyof typeof docs;
  const Content = docs[docKey];
  const toc = tocData[docKey] || [];

  if (!Content) {
    return (
      <DocsLayout>
        <div className="p-8">Page not found</div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout>
      <FumadocsPage toc={toc}>
        <DocsBody>
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <div className="prose dark:prose-invert max-w-none">
              <Content />
            </div>
          </Suspense>
        </DocsBody>
      </FumadocsPage>
    </DocsLayout>
  );
}
