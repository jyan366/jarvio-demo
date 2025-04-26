import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Grid, List, Plus, TrendingUp, Users, BookOpen, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentCard } from '@/components/knowledge-base/DocumentCard';

export default function KnowledgeBase() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');

  const documents = [
    {
      id: '1',
      title: 'Brand Guidelines 2024',
      description: 'Complete visual identity and brand voice guidelines',
      category: 'Brand Assets',
      createdAt: '2024-04-26',
      fileType: 'pdf',
      metrics: { views: 128, downloads: 45 }
    },
    {
      id: '2',
      title: 'Q1 Market Analysis',
      description: 'Comprehensive market trends and competitor insights',
      category: 'Market Intelligence',
      createdAt: '2024-04-20',
      fileType: 'doc',
      metrics: { views: 89, downloads: 32 }
    },
    {
      id: '3',
      title: 'Product Launch Strategy',
      description: 'Go-to-market strategy for new product line',
      category: 'Strategy',
      createdAt: '2024-04-18',
      fileType: 'pdf',
      metrics: { views: 156, downloads: 67 }
    },
    {
      id: '4',
      title: 'Customer Feedback Analysis',
      description: 'Voice of customer insights and recommendations',
      category: 'Customer Insights',
      createdAt: '2024-04-15',
      fileType: 'doc',
      metrics: { views: 92, downloads: 28 }
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold">Knowledge Hub</h1>
            </div>
            <p className="text-lg opacity-90 mb-8 max-w-2xl leading-relaxed">
              Transform your business knowledge into actionable insights. Access, organize, and share 
              your team's most valuable documents in one central location.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Documents
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-purple-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Documents</p>
                  <h3 className="text-2xl font-bold">247</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-blue-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <h3 className="text-2xl font-bold">34</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-green-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Views</p>
                  <h3 className="text-2xl font-bold">1,893</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="relative flex-1 max-w-2xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search documents..." 
              className="pl-10 w-full bg-gray-50 dark:bg-gray-900 border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-gray-50 dark:bg-gray-900"
            >
              {viewMode === 'grid' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        <div className={cn(
          "grid gap-6", 
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
