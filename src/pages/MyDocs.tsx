import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentHome } from '@/components/docs/DocumentHome';
import { CollapsibleSidebar } from '@/components/docs/CollapsibleSidebar';
import { TiptapEditor } from '@/components/docs/TiptapEditor';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft } from 'lucide-react';

export default function MyDocs() {
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
      <div className="flex-1 flex flex-col min-h-0 -m-6">
        <CollapsibleSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          documents={documents}
          currentDocumentId={currentDocument?.id}
          onSelectDocument={handleSelectDocument}
          onHome={handleBackToHome}
        />

        {showHome ? (
          // Home view - full width
          <div className="h-full flex flex-col">
            {/* Top bar with menu button */}
            <div className="flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              />
            </div>
          </div>
        ) : (
          // Document editor view - full width
          <div className="h-full flex flex-col">
            {/* Top bar with back button */}
            <div className="flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
    </MainLayout>
  );
}