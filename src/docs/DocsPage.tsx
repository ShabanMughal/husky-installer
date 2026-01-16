import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { DocsPage as FumadocsPage, DocsBody } from 'fumadocs-ui/page';
import { DocsLayout } from './DocsLayout';
import { useMDXComponents } from '../mdx-components';

const docs = {
  index: lazy(() => import('../../content/docs/index.mdx')),
  installation: lazy(() => import('../../content/docs/installation.mdx')),
  usage: lazy(() => import('../../content/docs/usage.mdx')),
  configuration: lazy(() => import('../../content/docs/configuration.mdx')),
  examples: lazy(() => import('../../content/docs/examples.mdx')),
  advanced: lazy(() => import('../../content/docs/advanced.mdx')),
  troubleshooting: lazy(() => import('../../content/docs/troubleshooting.mdx')),
  faq: lazy(() => import('../../content/docs/faq.mdx')),
};

// Extract TOC from headings in the rendered content
function extractTOC(
  container: HTMLElement | null
): { title: string; url: string; depth: number }[] {
  if (!container) return [];

  const headings = container.querySelectorAll(
    'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
  );
  const toc: { title: string; url: string; depth: number }[] = [];

  headings.forEach((heading) => {
    const id = heading.id;
    const depth = parseInt(heading.tagName.charAt(1));
    const title = heading.textContent?.trim() || '';

    if (id && title) {
      toc.push({
        title,
        url: `#${id}`,
        depth,
      });
    }
  });

  return toc;
}

export function DocsPage() {
  const { slug } = useParams();
  const docKey = (slug || 'index') as keyof typeof docs;
  const Content = docs[docKey];
  const [toc, setToc] = useState<
    { title: string; url: string; depth: number }[]
  >([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const mdxComponents = useMDXComponents({});

  useEffect(() => {
    // Extract TOC after content is rendered with multiple attempts
    const extractWithRetry = (attempts = 0) => {
      const extractedTOC = extractTOC(contentRef.current);

      if (extractedTOC.length > 0 || attempts >= 5) {
        setToc(extractedTOC);
      } else {
        // Retry after a short delay
        setTimeout(() => extractWithRetry(attempts + 1), 200);
      }
    };

    // Initial delay to let content render
    const timer = setTimeout(() => {
      extractWithRetry();
    }, 300);

    // Also listen for DOM changes
    const observer = new MutationObserver(() => {
      const extractedTOC = extractTOC(contentRef.current);
      if (extractedTOC.length > 0) {
        setToc(extractedTOC);
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [slug]);

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
            <MDXProvider components={mdxComponents}>
              <div
                ref={contentRef}
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-0 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-7 prose-p:mb-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-strong:font-semibold prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-li:leading-7 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 prose-hr:my-8 prose-table:my-4 prose-th:font-semibold prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2"
              >
                <Content />
              </div>
            </MDXProvider>
          </Suspense>
        </DocsBody>
      </FumadocsPage>
    </DocsLayout>
  );
}
