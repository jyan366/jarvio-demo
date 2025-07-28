import React from 'react';
import { Plus, FileText, Table, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DocumentType, DocumentCategory } from '@/types/docs';

interface QuickActionsProps {
  onCreateDocument: (title?: string, type?: DocumentType, category?: DocumentCategory) => void;
}

export function QuickActions({ onCreateDocument }: QuickActionsProps) {
  const createDocument = (type: DocumentType, category: DocumentCategory, title: string) => {
    onCreateDocument(title, type, category);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => createDocument('text', 'documents', 'Untitled Document')}>
          <FileText className="h-4 w-4 mr-2" />
          Text Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => createDocument('table', 'documents', 'Untitled Table')}>
          <Table className="h-4 w-4 mr-2" />
          Table Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => createDocument('template', 'templates', 'Untitled Template')}>
          <Layout className="h-4 w-4 mr-2" />
          Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}