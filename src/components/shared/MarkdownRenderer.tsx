import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom components for markdown elements
const CustomTable = (props: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full divide-y divide-gray-200 border" {...props} />
  </div>
);

const CustomTableHead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-gray-50" {...props} />
);

const CustomTableCell = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-3 py-2 border text-sm" {...props} />
);

const CustomTableHeaderCell = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="px-3 py-2 border text-sm font-medium text-gray-700 bg-gray-50" {...props} />
);

const CustomTableRow = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="even:bg-gray-50" {...props} />
);

const CustomTableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-gray-200 bg-white" {...props} />
);

const CustomList = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="list-disc pl-5 space-y-1 my-2" {...props} />
);

const CustomOrderedList = (props: React.OlHTMLAttributes<HTMLOListElement>) => (
  <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />
);

const CustomListItem = (props: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className="text-gray-700" {...props} />
);

const CustomParagraph = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="my-2 text-gray-700" {...props} />
);

const CustomHeading1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />
);

const CustomHeading2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="text-lg font-bold mt-3 mb-2 text-gray-900" {...props} />
);

const CustomHeading3 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="text-md font-bold mt-3 mb-1 text-gray-900" {...props} />
);

const CustomCode = (props: React.HTMLAttributes<HTMLElement>) => (
  <code className="px-1 py-0.5 rounded bg-gray-100 text-sm font-mono text-gray-800" {...props} />
);

const CustomBlockquote = (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
  <blockquote className="pl-4 border-l-4 border-gray-200 text-gray-700 italic my-3" {...props} />
);

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;
  
  // Ensure the content is a string
  const safeContent = typeof content === 'string' ? content : String(content);
  
  // Options for markdown-to-jsx
  const options = {
    overrides: {
      table: CustomTable,
      thead: CustomTableHead,
      tbody: CustomTableBody,
      tr: CustomTableRow,
      td: CustomTableCell,
      th: CustomTableHeaderCell,
      ul: CustomList,
      ol: CustomOrderedList,
      li: CustomListItem,
      p: CustomParagraph,
      h1: CustomHeading1,
      h2: CustomHeading2,
      h3: CustomHeading3,
      code: CustomCode,
      blockquote: CustomBlockquote,
    },
  };
  
  return (
    <div className={`markdown-content prose prose-sm max-w-none ${className}`}>
      <Markdown options={options}>{safeContent}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
