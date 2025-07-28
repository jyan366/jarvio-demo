import React, { useState } from 'react';
import { Plus, Search, FileText, Table, TrendingUp, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentGrid } from './DocumentGrid';
import { FlowOutputsSection } from './FlowOutputsSection';
import { FlowActivityFeed } from './FlowActivityFeed';
import { QuickActions } from './QuickActions';
import { DocumentMetadata, DocumentCategory } from '@/types/docs';

interface DocumentHomeProps {
  documents: DocumentMetadata[];
  onSelectDocument: (id: string) => void;
  onCreateDocument: (title?: string, type?: any, category?: any) => void;
  onDeleteDocument: (id: string) => void;
  onSearchDocuments: (query: string) => DocumentMetadata[];
  onViewFlow?: (flowId: string) => void;
}

export function DocumentHome({
  documents,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  onSearchDocuments,
  onViewFlow,
}: DocumentHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = searchQuery ? onSearchDocuments(searchQuery) : documents;
  
  // Get recent documents (last 5, sorted by updatedAt)
  const recentDocuments = [...filteredDocuments]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Group documents by category
  const documentsByCategory = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, DocumentMetadata[]>);

  // Get outputs for special handling
  const outputDocuments = documentsByCategory.outputs || [];
  const nonOutputCategories = Object.entries(documentsByCategory).filter(([category]) => category !== 'outputs');

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'documents': return FileText;
      case 'outputs': return TrendingUp;
      case 'templates': return Layout;
      default: return FileText;
    }
  };

  const getCategoryTitle = (category: DocumentCategory) => {
    switch (category) {
      case 'documents': return 'My Documents';
      case 'outputs': return 'Workflow Outputs';
      case 'templates': return 'Templates';
      default: return category;
    }
  };

  // Temporary debug function to clear and reload sample data
  const resetSampleData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">My Docs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, organize, and manage your documents
            </p>
          </div>
          <div className="flex items-center gap-4">
            <QuickActions onCreateDocument={onCreateDocument} />
            {/* Temporary debug button */}
            <Button variant="outline" size="sm" onClick={resetSampleData}>
              Reset Sample Data
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-6 pb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Flow Activity Feed */}
        <div id="activity">
          <FlowActivityFeed 
            onViewFlow={onViewFlow}
            onViewDocument={onSelectDocument}
          />
        </div>

        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <section id="recent">
            <h2 className="text-lg font-medium text-foreground mb-4">Recent</h2>
            <DocumentGrid
              documents={recentDocuments}
              onSelectDocument={onSelectDocument}
              onDeleteDocument={onDeleteDocument}
              onViewFlow={onViewFlow}
            />
          </section>
        )}

        {/* Other Categories */}
        {nonOutputCategories.map(([category, docs]) => {
          if (docs.length === 0) return null;
          
          const Icon = getCategoryIcon(category as DocumentCategory);
          
          return (
            <div id={category} key={category}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">
                  {getCategoryTitle(category as DocumentCategory)}
                </h2>
                <span className="text-sm text-muted-foreground">({docs.length})</span>
              </div>
              <DocumentGrid
                documents={docs}
                onSelectDocument={onSelectDocument}
                onDeleteDocument={onDeleteDocument}
                onViewFlow={onViewFlow}
              />
            </div>
          );
        })}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first document to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => onCreateDocument()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}