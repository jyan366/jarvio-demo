import React from 'react';
import { X, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentMetadata } from '@/types/docs';
import { format } from 'date-fns';

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentMetadata[];
  currentDocumentId?: string;
  onSelectDocument: (id: string) => void;
  onHome: () => void;
}

export function CollapsibleSidebar({
  isOpen,
  onClose,
  documents,
  currentDocumentId,
  onSelectDocument,
  onHome,
}: CollapsibleSidebarProps) {
  if (!isOpen) return null;

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="font-semibold">My Docs</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Button
            variant={!currentDocumentId ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={onHome}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Recent Documents */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Documents</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="px-4 space-y-1">
              {recentDocuments.map((doc) => (
                <Button
                  key={doc.id}
                  variant={currentDocumentId === doc.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{doc.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
              
              {recentDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No documents yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}