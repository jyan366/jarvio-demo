import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentSidebar } from '@/components/docs/DocumentSidebar';
import { TiptapEditor } from '@/components/docs/TiptapEditor';
import { useDocuments } from '@/hooks/useDocuments';

export default function MyDocs() {
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

  // Load first document if none selected and documents exist
  useEffect(() => {
    if (!currentDocument && documents.length > 0 && !isLoading) {
      loadDocument(documents[0].id);
    }
  }, [currentDocument, documents, isLoading, loadDocument]);

  const handleCreateDocument = () => {
    createDocument();
  };

  const handleSelectDocument = (id: string) => {
    if (currentDocument?.id !== id) {
      loadDocument(id);
    }
  };

  const handleSaveDocument = (doc: any) => {
    saveDocument(doc);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <DocumentSidebar
          documents={documents}
          currentDocumentId={currentDocument?.id}
          onCreateDocument={handleCreateDocument}
          onSelectDocument={handleSelectDocument}
          onDeleteDocument={deleteDocument}
          onSearchDocuments={searchDocuments}
        />
        
        <TiptapEditor
          document={currentDocument}
          onSave={handleSaveDocument}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </div>
    </MainLayout>
  );
}