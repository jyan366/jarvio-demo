
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Grid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  createdAt: string;
  fileType: 'pdf' | 'doc' | 'txt' | 'image';
}

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Company Overview',
      description: 'Annual business strategy and goals',
      category: 'Company Documents',
      createdAt: '2024-04-26',
      fileType: 'pdf'
    },
    {
      id: '2',
      title: 'Brand Guidelines',
      description: 'Visual and communication standards',
      category: 'Brand Guidelines',
      createdAt: '2024-04-20',
      fileType: 'doc'
    },
    {
      id: '3',
      title: 'Marketing Plan',
      description: 'Annual marketing strategy',
      category: 'Marketing',
      createdAt: '2024-04-18',
      fileType: 'pdf'
    },
    {
      id: '4',
      title: 'Sales Projections',
      description: 'Q2 2024 sales forecasts',
      category: 'Sales',
      createdAt: '2024-04-15',
      fileType: 'doc'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDocumentIcon = (fileType: Document['fileType']) => {
    const iconMap = {
      'pdf': <FileText className="w-8 h-8 text-red-500" />,
      'doc': <FileText className="w-8 h-8 text-blue-500" />,
      'txt': <FileText className="w-8 h-8 text-gray-500" />,
      'image': <FileText className="w-8 h-8 text-green-500" />
    };
    return iconMap[fileType];
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={cn(
          "grid gap-4", 
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredDocuments.map(doc => (
            <div 
              key={doc.id} 
              className={cn(
                "border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer",
                viewMode === 'list' ? "flex items-center space-x-4" : "flex flex-col text-center items-center"
              )}
            >
              {renderDocumentIcon(doc.fileType)}
              <div className={viewMode === 'grid' ? "text-center mt-2 w-full" : "flex-1"}>
                <h3 className="font-semibold">{doc.title}</h3>
                {doc.description && (
                  <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-2">
                    {doc.category}
                  </span>
                  <span>Created {doc.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No documents found
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
