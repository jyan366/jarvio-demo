
import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
