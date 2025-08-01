import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentHome } from '@/components/docs/DocumentHome';
import { CategorySidebar } from '@/components/docs/CategorySidebar';
import { TiptapEditor } from '@/components/docs/TiptapEditor';
import { DocumentPreviewDialog } from '@/components/docs/DocumentPreviewDialog';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function MyDocs() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('activity');
  const [previewDocument, setPreviewDocument] = useState<{id: string, title: string, content: string} | null>(null);
  
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

  const handleCategoryClick = (categoryId: string) => {
    // If we're viewing a document, first go back to home
    if (!showHome) {
      setShowHome(true);
      // Use setTimeout to ensure DOM has updated before scrolling
      setTimeout(() => {
        const element = document.getElementById(categoryId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(categoryId);
        }
      }, 100);
    } else {
      // We're already on home, just scroll to category
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(categoryId);
      }
    }
    setSidebarOpen(false); // Close mobile sidebar after click
  };

  const handleViewFlowOutput = (documentId: string) => {
    const documentMetadata = documents.find(doc => doc.id === documentId);
    if (documentMetadata) {
      // Load full document content from localStorage
      try {
        const stored = localStorage.getItem(`tiptap-documents-${documentId}`);
        if (stored) {
          const fullDocument = JSON.parse(stored);
          setPreviewDocument({
            id: fullDocument.id,
            title: fullDocument.title,
            content: fullDocument.content || '# Flow Output\n\nThis is a sample flow output document.'
          });
        } else {
          // Fallback if no content found
          setPreviewDocument({
            id: documentMetadata.id,
            title: documentMetadata.title,
            content: '# Flow Output\n\nThis is a sample flow output document.'
          });
        }
      } catch (error) {
        console.error('Failed to load document content:', error);
        setPreviewDocument({
          id: documentMetadata.id,
          title: documentMetadata.title,
          content: '# Flow Output\n\nThis is a sample flow output document.'
        });
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden -m-6">
        {/* Desktop Category Sidebar - Sticky */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:bg-background lg:flex-shrink-0 lg:h-screen lg:sticky lg:top-0">
          <CategorySidebar
            documents={documents}
            activeSection={activeSection}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Mobile Category Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-lg">
              <CategorySidebar
                documents={documents}
                activeSection={activeSection}
                onCategoryClick={handleCategoryClick}
              />
            </div>
          </div>
        )}

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {showHome ? (
            // Home view - Full height scrollable
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Mobile header - Fixed */}
              <div className="lg:hidden flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Scrollable content */}
              <div className="flex-1 overflow-auto scrollbar-hide">
                <DocumentHome
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                  onCreateDocument={handleCreateDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onSearchDocuments={searchDocuments}
                  onViewFlow={(flowId) => {
                    // This could open a flow details modal or navigate to flow builder
                    // For now, we'll keep it simple and just log
                    console.log('View flow:', flowId);
                  }}
                  onViewFlowOutput={handleViewFlowOutput}
                />
              </div>
            </div>
          ) : (
            // Document editor view - Full height
            <div className="flex-1 flex flex-col h-full overflow-hidden">
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
              
              {/* Desktop header for document view */}
              <div className="hidden lg:flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToHome}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Documents
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
      
      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreviewDialog
          isOpen={true}
          onClose={() => setPreviewDocument(null)}
          documentId={previewDocument.id}
          title={previewDocument.title}
          content={previewDocument.content}
        />
      )}
    </MainLayout>
  );
}