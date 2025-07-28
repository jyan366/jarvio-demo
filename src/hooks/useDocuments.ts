import { useState, useEffect, useCallback } from 'react';
import { Document, DocumentMetadata } from '@/types/docs';

const STORAGE_KEY = 'tiptap-documents';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  // Load documents from localStorage
  const loadDocuments = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const docs = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        }));
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  }, []);

  // Save documents to localStorage
  const saveDocuments = useCallback((docs: DocumentMetadata[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error('Failed to save documents:', error);
    }
  }, []);

  // Create new document
  const createDocument = useCallback((title: string = 'Untitled Document') => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      characterCount: 0,
    };

    const newMetadata: DocumentMetadata = {
      id: newDoc.id,
      title: newDoc.title,
      createdAt: newDoc.createdAt,
      updatedAt: newDoc.updatedAt,
      wordCount: 0,
      characterCount: 0,
    };

    const updatedDocs = [newMetadata, ...documents];
    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);
    setCurrentDocument(newDoc);

    // Save full document content
    localStorage.setItem(`${STORAGE_KEY}-${newDoc.id}`, JSON.stringify(newDoc));

    return newDoc;
  }, [documents, saveDocuments]);

  // Load document content
  const loadDocument = useCallback((id: string) => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${id}`);
      if (stored) {
        const doc = JSON.parse(stored);
        const parsedDoc: Document = {
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        };
        setCurrentDocument(parsedDoc);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save document
  const saveDocument = useCallback((doc: Document) => {
    setIsSaving(true);
    try {
      const updatedDoc = {
        ...doc,
        updatedAt: new Date(),
      };

      // Save full document
      localStorage.setItem(`${STORAGE_KEY}-${doc.id}`, JSON.stringify(updatedDoc));

      // Update metadata list
      const updatedDocs = documents.map(d => 
        d.id === doc.id 
          ? { 
              ...d, 
              title: doc.title, 
              updatedAt: updatedDoc.updatedAt,
              wordCount: doc.wordCount,
              characterCount: doc.characterCount
            }
          : d
      );
      setDocuments(updatedDocs);
      saveDocuments(updatedDocs);
      setCurrentDocument(updatedDoc);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  }, [documents, saveDocuments]);

  // Delete document
  const deleteDocument = useCallback((id: string) => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}-${id}`);
      const updatedDocs = documents.filter(d => d.id !== id);
      setDocuments(updatedDocs);
      saveDocuments(updatedDocs);
      
      if (currentDocument?.id === id) {
        setCurrentDocument(null);
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  }, [documents, currentDocument, saveDocuments]);

  // Search documents
  const searchDocuments = useCallback((query: string) => {
    if (!query.trim()) return documents;
    
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [documents]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
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
  };
}