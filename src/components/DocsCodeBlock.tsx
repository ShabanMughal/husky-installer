'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface DocsCodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
}

export function DocsCodeBlock({
  code,
  lang = 'text',
  title,
}: DocsCodeBlockProps) {
  return (
    <div className="my-6 border border-border rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
      )}
      <div className="relative bg-muted/30 dark:bg-muted/20">
        <div className="p-4 overflow-x-auto">
          <DynamicCodeBlock lang={lang} code={code} />
        </div>
      </div>
    </div>
  );
}
