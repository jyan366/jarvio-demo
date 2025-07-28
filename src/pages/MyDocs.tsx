import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentHome } from '@/components/docs/DocumentHome';
import { CollapsibleSidebar } from '@/components/docs/CollapsibleSidebar';
import { TiptapEditor } from '@/components/docs/TiptapEditor';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export default function MyDocs() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);
  
  const {
    documents,
    currentDocument,
    isLoading,
    isSaving,
    lastSaved,
    createDocument,
    loadDocument,
    saveDocument,
    deleteDocument,
    searchDocuments,
  } = useDocuments();

  // Handle URL parameter for opening specific document
  useEffect(() => {
    const docId = searchParams.get('doc');
    if (docId && documents.some(doc => doc.id === docId)) {
      handleSelectDocument(docId);
    }
  }, [searchParams, documents]);

  const handleCreateDocument = (title?: string, type?: any, category?: any) => {
    const doc = createDocument(title, type, category);
    setShowHome(false);
    return doc;
  };

  const handleSelectDocument = (id: string) => {
    if (currentDocument?.id !== id) {
      loadDocument(id);
      setShowHome(false);
      setSidebarOpen(false);
    }
  };

  const handleSaveDocument = (doc: any) => {
    saveDocument(doc);
  };

  const handleBackToHome = () => {
    setShowHome(true);
    setSidebarOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    if (currentDocument?.id === id) {
      setShowHome(true);
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden -m-6">
        {/* Desktop Sidebar - Always visible on lg+ screens */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:bg-background lg:flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className={showHome ? "bg-secondary" : ""}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Documents</h3>
            <div className="space-y-1">
              {documents.slice(0, 10).map((doc) => (
                <Button
                  key={doc.id}
                  variant={currentDocument?.id === doc.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleSelectDocument(doc.id)}
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
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Collapsible */}
        <CollapsibleSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          documents={documents}
          currentDocumentId={currentDocument?.id}
          onSelectDocument={handleSelectDocument}
          onHome={handleBackToHome}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {showHome ? (
            // Home view
            <div className="flex-1 flex flex-col">
              {/* Mobile header */}
              <div className="lg:hidden flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto">
                <DocumentHome
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
          onCreateDocument={handleCreateDocument}
          onDeleteDocument={handleDeleteDocument}
          onSearchDocuments={searchDocuments}
          onViewFlow={(flowId) => {
            // Navigate to flows page
            window.open('/jarvi-flows', '_blank');
          }}
                />
              </div>
            </div>
          ) : (
            // Document editor view
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile header */}
              <div className="lg:hidden flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToHome}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TiptapEditor
                  document={currentDocument}
                  onSave={handleSaveDocument}
                  isSaving={isSaving}
                  lastSaved={lastSaved}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}