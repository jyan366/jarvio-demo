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
import { Underline } from '@tiptap/extension-underline';
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

export function TiptapEditor({ document, onSave, isSaving, lastSaved }: TiptapEditorProps) {
  const [title, setTitle] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
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
    content: document?.content || '',
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
      if (editor.getHTML() !== document.content) {
        editor.commands.setContent(document.content);
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
    <div className="flex-1 flex flex-col bg-background">
      {/* Document Header */}
      <div className="border-b border-border p-6 bg-background">
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
          
          <div className="prose prose-stone dark:prose-invert max-w-none min-h-[500px]">
            <EditorContent 
              editor={editor} 
              className="outline-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:border [&_.ProseMirror]:border-border [&_.ProseMirror]:rounded-lg [&_.ProseMirror]:bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
}