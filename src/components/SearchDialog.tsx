'use client';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogFooter,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

// Type definitions
type PageNode = {
  type: 'page';
  name: string;
  url: string;
};

type TreeNode = {
  name: string;
  children?: (PageNode | TreeNode)[];
};

type SearchResult = {
  title: string;
  url: string;
  type: 'page';
};

// Docs tree - matches the one in DocsLayout
const docsTree: TreeNode = {
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

// Simple search function
function searchPages(tree: TreeNode, query: string): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  function traverse(node: PageNode | TreeNode) {
    if ('type' in node && node.type === 'page' && node.name) {
      if (node.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          title: node.name,
          url: node.url,
          type: 'page',
        });
      }
    }
    if ('children' in node && node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(tree);
  return results;
}

// Custom search list component that works with BrowserRouter
function CustomSearchList({
  items,
  onSelect,
}: {
  items: SearchResult[] | null;
  onSelect: () => void;
}) {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="p-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.url);
              onSelect(); // Close the dialog
            }}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.url}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DefaultSearchDialog(props: SharedProps) {
  const [search, setSearch] = useState('');

  const results = useMemo(() => {
    if (!search.trim()) return null;
    const items = searchPages(docsTree, search);
    return items.length > 0 ? items : null;
  }, [search]);

  const handleSelect = () => {
    // The dialog should close automatically when navigating
    // But we can also trigger close by clicking outside or pressing escape
    if (props.onOpenChange) {
      props.onOpenChange(false);
    }
  };

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={false}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <CustomSearchList items={results} onSelect={handleSelect} />
      </SearchDialogContent>
      <SearchDialogFooter>{/* footer items */}</SearchDialogFooter>
    </SearchDialog>
  );
}
