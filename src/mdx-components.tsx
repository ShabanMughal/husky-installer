import type { MDXComponents } from 'mdx/types';
import { PackageManagerTabs } from './components/PackageManagerTabs';
import {
  DocsTable,
  DocsTableHeader,
  DocsTableBody,
  DocsTableRow,
  DocsTableHead,
  DocsTableCell,
} from './components/DocsTable';
import { DocsCodeBlock } from './components/DocsCodeBlock';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PackageManagerTabs,
    DocsTable,
    DocsTableHeader,
    DocsTableBody,
    DocsTableRow,
    DocsTableHead,
    DocsTableCell,
    DocsCodeBlock,
    Accordions,
    Accordion,
    Steps,
    Step,
    ...components,
  };
}
