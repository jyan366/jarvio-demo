import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyKnowledgeBase } from '@/components/knowledge-base/EmptyKnowledgeBase';
import { KnowledgeBaseWalkthrough } from '@/components/knowledge-base/KnowledgeBaseWalkthrough';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Grid, List, Plus, TrendingUp, Users, Brain, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentCard } from '@/components/knowledge-base/DocumentCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

export default function KnowledgeBase() {
  const [hasDocuments, setHasDocuments] = React.useState(false);
  const [isWalkthrough, setIsWalkthrough] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const isMobile = useIsMobile();

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'brand', label: 'Brand Assets' },
    { id: 'market', label: 'Market Intelligence' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'customer', label: 'Customer Insights' },
    { id: 'operations', label: 'Operations' },
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

  const filteredDocuments = documents.filter(doc => 
    (selectedCategory === 'all' || doc.category === selectedCategory) &&
    (searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <p className="text-lg opacity-90 mb-8 max-w-3xl leading-relaxed">
              Transform your business knowledge into actionable insights. Your centralized knowledge base 
              trains Jarvio AI and empowers your team with unified access to critical business information.
              We analyze your documents to generate valuable insights and enhance decision-making.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Documents
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
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Insights Generated</p>
                  <h3 className="text-2xl font-bold">184</h3>
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
                  <h3 className="text-2xl font-bold">7</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-green-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Knowledge Base Docs</p>
                  <h3 className="text-2xl font-bold">13</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-10 w-full bg-gray-50 dark:bg-gray-900 border-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs 
                defaultValue="all" 
                className="w-full sm:max-w-3xl overflow-x-auto" 
                onValueChange={setSelectedCategory}
              >
                <TabsList className="w-full justify-start bg-gray-100/50 dark:bg-gray-800 p-1 gap-2 flex-nowrap">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 whitespace-nowrap"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="bg-gray-50 dark:bg-gray-900 text-sm sm:text-base flex-1 sm:flex-none"
                  size={isMobile ? "sm" : "default"}
                >
                  {viewMode === 'grid' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base flex-1 sm:flex-none"
                  size={isMobile ? "sm" : "default"}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </div>
            </div>
          </div>

          <div className={cn(
            "grid gap-6", 
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
