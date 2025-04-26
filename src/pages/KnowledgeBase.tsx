
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyKnowledgeBase } from '@/components/knowledge-base/EmptyKnowledgeBase';
import { KnowledgeBaseWalkthrough } from '@/components/knowledge-base/KnowledgeBaseWalkthrough';
import { KnowledgeBaseHeader } from '@/components/knowledge-base/KnowledgeBaseHeader';
import { KnowledgeBaseStats } from '@/components/knowledge-base/KnowledgeBaseStats';
import { DocumentFilters } from '@/components/knowledge-base/DocumentFilters';
import { DocumentList } from '@/components/knowledge-base/DocumentList';
import { documents, categories } from '@/data/knowledge-base';
import { useDocumentFilter } from '@/hooks/use-document-filter';

export default function KnowledgeBase() {
  const [hasDocuments, setHasDocuments] = React.useState(false);
  const [isWalkthrough, setIsWalkthrough] = React.useState(false);
  
  const {
    filteredDocuments,
    searchTerm,
    selectedCategory,
    viewMode,
    setSearchTerm,
    setSelectedCategory,
    setViewMode,
  } = useDocumentFilter({ documents });

  const handleGetStarted = () => {
    setIsWalkthrough(true);
  };

  const handleWalkthroughComplete = () => {
    setIsWalkthrough(false);
    setHasDocuments(true);
  };

  if (!hasDocuments) {
    if (isWalkthrough) {
      return (
        <MainLayout>
          <KnowledgeBaseWalkthrough onComplete={handleWalkthroughComplete} />
        </MainLayout>
      );
    }
    return (
      <MainLayout>
        <EmptyKnowledgeBase onGetStarted={handleGetStarted} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <KnowledgeBaseHeader />
        <KnowledgeBaseStats />
        <div className="space-y-6">
          <DocumentFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={categories}
          />
          <DocumentList documents={filteredDocuments} viewMode={viewMode} />
        </div>
      </div>
    </MainLayout>
  );
}
