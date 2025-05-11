
import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;
  
  // Ensure the content is a string
  const safeContent = typeof content === 'string' ? content : String(content);
  
  return (
    <div className={`markdown-content ${className}`}>
      <Markdown>{safeContent}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
