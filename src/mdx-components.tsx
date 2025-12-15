import type { MDXComponents } from 'mdx/types';
import { PackageManagerTabs } from './components/PackageManagerTabs';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PackageManagerTabs,
    ...components,
  };
}
