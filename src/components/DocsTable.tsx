import { ReactNode } from 'react';

interface DocsTableProps {
  children: ReactNode;
}

export function DocsTable({ children }: DocsTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border border-border rounded-lg">
        {children}
      </table>
    </div>
  );
}

export function DocsTableHeader({ children }: DocsTableProps) {
  return <thead className="bg-muted/50">{children}</thead>;
}

export function DocsTableBody({ children }: DocsTableProps) {
  return <tbody>{children}</tbody>;
}

export function DocsTableRow({ children }: DocsTableProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      {children}
    </tr>
  );
}

export function DocsTableHead({ children }: DocsTableProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-r border-border last:border-r-0">
      {children}
    </th>
  );
}

export function DocsTableCell({ children }: DocsTableProps) {
  return (
    <td className="px-4 py-3 text-sm text-muted-foreground border-r border-border last:border-r-0">
      {children}
    </td>
  );
}
