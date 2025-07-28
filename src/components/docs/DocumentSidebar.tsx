import React, { useState } from 'react';
import { DocumentMetadata } from '@/types/docs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Search,
  FileText,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface DocumentSidebarProps {
  documents: DocumentMetadata[];
  currentDocumentId?: string;
  onCreateDocument: () => void;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onSearchDocuments: (query: string) => DocumentMetadata[];
}

export function DocumentSidebar({
  documents,
  currentDocumentId,
  onCreateDocument,
  onSelectDocument,
  onDeleteDocument,
  onSearchDocuments,
}: DocumentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDocuments = searchQuery ? onSearchDocuments(searchQuery) : documents;
  const sortedDocuments = filteredDocuments.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDeleteDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDeleteDocument(id);
    }
  };

  return (
    <div className="w-80 border-r border-border bg-background p-4 flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Documents</h2>
          <Button onClick={onCreateDocument} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Documents List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {sortedDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No documents found' : 'No documents yet'}
              </p>
              {!searchQuery && (
                <Button onClick={onCreateDocument} variant="ghost" className="mt-2">
                  Create your first document
                </Button>
              )}
            </div>
          ) : (
            sortedDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent group ${
                  currentDocumentId === doc.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => onSelectDocument(doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {doc.title || 'Untitled Document'}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Updated {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{doc.wordCount} words</span>
                      <span>{doc.characterCount} chars</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteDocument(doc.id, e)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}