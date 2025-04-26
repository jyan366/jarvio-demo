
import { useState, useMemo } from 'react';
import { Document, ViewMode } from '@/types/knowledge-base';

interface UseDocumentFilterProps {
  documents: Document[];
}

interface UseDocumentFilterReturn {
  filteredDocuments: Document[];
  searchTerm: string;
  selectedCategory: string;
  viewMode: ViewMode;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export function useDocumentFilter({ documents }: UseDocumentFilterProps): UseDocumentFilterReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      (selectedCategory === 'all' || doc.category === selectedCategory) &&
      (searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [documents, selectedCategory, searchTerm]);

  return {
    filteredDocuments,
    searchTerm,
    selectedCategory,
    viewMode,
    setSearchTerm,
    setSelectedCategory,
    setViewMode,
  };
}
