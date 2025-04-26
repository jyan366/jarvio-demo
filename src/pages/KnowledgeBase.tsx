import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyKnowledgeBase } from '@/components/knowledge-base/EmptyKnowledgeBase';
import { KnowledgeBaseWalkthrough } from '@/components/knowledge-base/KnowledgeBaseWalkthrough';
import { KnowledgeBaseHeader } from '@/components/knowledge-base/KnowledgeBaseHeader';
import { KnowledgeBaseStats } from '@/components/knowledge-base/KnowledgeBaseStats';
import { DocumentFilters } from '@/components/knowledge-base/DocumentFilters';
import { DocumentList } from '@/components/knowledge-base/DocumentList';

export default function KnowledgeBase() {
  const [hasDocuments, setHasDocuments] = React.useState(false);
  const [isWalkthrough, setIsWalkthrough] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'brand', label: 'Brand Assets' },
    { id: 'market', label: 'Market Intelligence' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'customer', label: 'Customer Insights' },
    { id: 'operations', label: 'Operations' },
  ];

  const documents = [
    {
      id: '1',
      title: 'Brand Guidelines 2024',
      description: 'Complete visual identity and brand voice guidelines',
      category: 'brand',
      createdAt: '2024-04-26',
      fileType: 'pdf',
      metrics: { views: 128, downloads: 45 }
    },
    {
      id: '2',
      title: 'Q1 Market Analysis',
      description: 'Comprehensive market trends and competitor insights',
      category: 'market',
      createdAt: '2024-04-20',
      fileType: 'doc',
      metrics: { views: 89, downloads: 32 }
    },
    {
      id: '3',
      title: 'Product Launch Strategy',
      description: 'Go-to-market strategy for new product line',
      category: 'strategy',
      createdAt: '2024-04-18',
      fileType: 'pdf',
      metrics: { views: 156, downloads: 67 }
    },
    {
      id: '4',
      title: 'Customer Feedback Analysis',
      description: 'Voice of customer insights and recommendations',
      category: 'customer',
      createdAt: '2024-04-15',
      fileType: 'doc',
      metrics: { views: 92, downloads: 28 }
    },
    {
      id: '5',
      title: 'Operational Efficiency Report',
      description: 'Detailed analysis of operational processes and improvements',
      category: 'operations',
      createdAt: '2024-04-10',
      fileType: 'pdf',
      metrics: { views: 76, downloads: 22 }
    },
    {
      id: '6',
      title: 'Marketing Campaign Playbook',
      description: 'Comprehensive guide to our marketing strategies',
      category: 'market',
      createdAt: '2024-04-05',
      fileType: 'doc',
      metrics: { views: 112, downloads: 41 }
    },
    {
      id: '7',
      title: 'Customer Persona Deep Dive',
      description: 'In-depth research on our target customer segments',
      category: 'customer',
      createdAt: '2024-03-30',
      fileType: 'pdf',
      metrics: { views: 98, downloads: 35 }
    },
    {
      id: '8',
      title: 'Financial Forecast 2024-2025',
      description: 'Detailed financial projections and strategic recommendations',
      category: 'strategy',
      createdAt: '2024-03-25',
      fileType: 'doc',
      metrics: { views: 85, downloads: 29 }
    },
    {
      id: '9',
      title: 'Brand Positioning Whitepaper',
      description: 'Comprehensive exploration of our brand identity',
      category: 'brand',
      createdAt: '2024-03-20',
      fileType: 'pdf',
      metrics: { views: 105, downloads: 38 }
    },
    {
      id: '10',
      title: 'Product Development Roadmap',
      description: 'Strategic plan for product innovation and growth',
      category: 'strategy',
      createdAt: '2024-03-15',
      fileType: 'doc',
      metrics: { views: 93, downloads: 33 }
    },
    {
      id: '11',
      title: 'Competitive Landscape Analysis',
      description: 'Comprehensive review of market competitors',
      category: 'market',
      createdAt: '2024-03-10',
      fileType: 'pdf',
      metrics: { views: 87, downloads: 26 }
    },
    {
      id: '12',
      title: 'Operational Risk Management',
      description: 'Strategies for mitigating operational risks',
      category: 'operations',
      createdAt: '2024-03-05',
      fileType: 'doc',
      metrics: { views: 79, downloads: 24 }
    },
    {
      id: '13',
      title: 'Customer Success Metrics',
      description: 'Key performance indicators for customer satisfaction',
      category: 'customer',
      createdAt: '2024-02-28',
      fileType: 'pdf',
      metrics: { views: 102, downloads: 37 }
    }
  ];

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

  const filteredDocuments = documents.filter(doc => 
    (selectedCategory === 'all' || doc.category === selectedCategory) &&
    (searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
