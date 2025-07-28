import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { Document } from '@/types/docs';
import { EditorToolbar } from './EditorToolbar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TiptapEditorProps {
  document: Document | null;
  onSave: (doc: Document) => void;
  isSaving: boolean;
  lastSaved?: Date;
}

// Convert markdown-like content to HTML
const convertMarkdownToHTML = (content: string): string => {
  // First handle tables
  let htmlContent = content.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    return cells.map((cell: string) => `<td>${cell}</td>`).join('');
  });

  // Convert table headers (lines with dashes)
  htmlContent = htmlContent.replace(/\|[-\s|]+\|/g, '');

  // Wrap table rows
  htmlContent = htmlContent.replace(/(<td>.+<\/td>)/g, '<tr>$1</tr>');

  // Find table blocks and wrap them
  htmlContent = htmlContent.replace(/(<tr>.+<\/tr>(?:\s*<tr>.+<\/tr>)*)/gs, (match) => {
    const rows = match.split('<tr>').filter(row => row.trim());
    const headerRow = rows[0] ? `<thead><tr>${rows[0]}</tr></thead>` : '';
    const bodyRows = rows.slice(1).map(row => `<tr>${row}`).join('');
    const tbody = bodyRows ? `<tbody>${bodyRows}</tbody>` : '';
    return `<table>${headerRow}${tbody}</table>`;
  });

  return htmlContent
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap in paragraphs (but not tables)
    .replace(/^(?!<h|<li|<table|<p|<tr)(.*?)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p><br><\/p>/g, '<br>');
};

export function TiptapEditor({ document, onSave, isSaving, lastSaved }: TiptapEditorProps) {
  const [title, setTitle] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default link extension to avoid conflicts
        link: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      CharacterCount,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (document) {
        setHasUnsavedChanges(true);
      }
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!document || !editor || !hasUnsavedChanges) return;

    const saveTimer = setTimeout(() => {
      const content = editor.getHTML();
      const text = editor.getText();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = text.length;

      const updatedDoc: Document = {
        ...document,
        title: title || 'Untitled Document',
        content,
        wordCount,
        characterCount,
      };

      onSave(updatedDoc);
      setHasUnsavedChanges(false);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(saveTimer);
  }, [document, editor, title, hasUnsavedChanges, onSave]);

  // Update editor content when document changes
  useEffect(() => {
    if (document && editor) {
      setTitle(document.title);
      
      // Convert markdown content to HTML if needed
      let htmlContent = document.content;
      if (htmlContent && !htmlContent.includes('<')) {
        // Likely markdown content, convert it
        htmlContent = convertMarkdownToHTML(htmlContent);
      }
      
      if (editor.getHTML() !== htmlContent) {
        editor.commands.setContent(htmlContent || '');
      }
      setHasUnsavedChanges(false);
    }
  }, [document, editor]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            📝
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select a document to start editing
          </h3>
          <p className="text-muted-foreground">
            Choose a document from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      {/* Document Header */}
      <div className="border-b border-border p-6 bg-background flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Document title..."
            className="text-2xl font-bold border-none p-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{characterCount} characters</span>
              </div>
              
              {lastSaved && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Save className="h-3 w-3 animate-spin" />
                  Saving...
                </Badge>
              )}
              
              {hasUnsavedChanges && !isSaving && (
                <Badge variant="outline">Unsaved changes</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <EditorToolbar editor={editor} />
          
          <div className="prose prose-sm max-w-none min-h-[500px]">
            <EditorContent 
              editor={editor} 
              className="outline-none focus:outline-none 
                [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:border [&_.ProseMirror]:border-border [&_.ProseMirror]:rounded-lg [&_.ProseMirror]:bg-background
                [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h1]:text-gray-900
                [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-gray-900
                [&_.ProseMirror_h3]:text-md [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_h3]:text-gray-900
                [&_.ProseMirror_p]:my-2 [&_.ProseMirror_p]:text-gray-700 [&_.ProseMirror_p]:leading-relaxed
                [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_ul]:my-2
                [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:space-y-1 [&_.ProseMirror_ol]:my-2
                [&_.ProseMirror_li]:text-gray-700
                [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-gray-800
                [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-200 [&_.ProseMirror_blockquote]:text-gray-700 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:my-3
                [&_.ProseMirror_table]:min-w-full [&_.ProseMirror_table]:divide-y [&_.ProseMirror_table]:divide-gray-200 [&_.ProseMirror_table]:border [&_.ProseMirror_table]:my-4
                [&_.ProseMirror_thead]:bg-gray-50
                [&_.ProseMirror_tbody]:divide-y [&_.ProseMirror_tbody]:divide-gray-200 [&_.ProseMirror_tbody]:bg-white
                [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:text-sm [&_.ProseMirror_th]:font-medium [&_.ProseMirror_th]:text-gray-700 [&_.ProseMirror_th]:bg-gray-50
                [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:text-sm
                [&_.ProseMirror_tr:nth-child(even)]:bg-gray-50
                [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_strong]:text-gray-900
                [&_.ProseMirror_em]:italic"
            />
          </div>
        </div>
      </div>
    </div>
  );
}