
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Grid, List, Plus, TrendingUp, Users, BookOpen, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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
        {/* Hero Section */}
        <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Knowledge Hub</h1>
            <p className="text-lg opacity-90 mb-6 max-w-2xl">
              Transform your business knowledge into actionable insights. Upload, organize, and share 
              your most valuable documents with your team.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Documents
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6">
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
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6">
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
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6">
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

        {/* Search and Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search documents..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className={cn(
          "grid gap-6", 
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {documents.map((doc) => (
            <Card
              key={doc.id} 
              className={cn(
                "group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden",
                viewMode === 'list' ? "flex items-center" : ""
              )}
            >
              <div className={cn(
                "p-6",
                viewMode === 'list' ? "flex items-center flex-1 gap-6" : "space-y-4"
              )}>
                <div className={cn(
                  "flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900",
                  viewMode === 'list' ? "w-16 h-16" : "w-full h-32 mb-4"
                )}>
                  <FileText className={cn(
                    "transition-transform group-hover:scale-110",
                    doc.fileType === 'pdf' ? "text-red-500" : "text-blue-500",
                    viewMode === 'list' ? "w-8 h-8" : "w-12 h-12"
                  )} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {doc.category}
                    </span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {doc.metrics.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {doc.metrics.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
