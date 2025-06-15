
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Heart, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Enhanced flow templates with community feel
const flowTemplates = [
  {
    id: 'weekly-performance-summary',
    name: "Weekly Performance Dashboard",
    description: 'Automated weekly performance reports with sales metrics, inventory alerts, and competitor insights delivered straight to your inbox',
    steps: 4,
    trigger: 'Scheduled',
    author: 'John Martinez',
    upvotes: 127,
    category: 'Analytics',
    difficulty: 'Beginner'
  },
  {
    id: 'smart-restock-alerts',
    name: "30-Day Stockout Predictor",
    description: 'AI-powered inventory monitoring that predicts stockouts 30 days in advance and automatically creates purchase orders',
    steps: 6,
    trigger: 'Event',
    author: 'Sarah Chen',
    upvotes: 89,
    category: 'Inventory',
    difficulty: 'Intermediate'
  },
  {
    id: 'dynamic-repricing-engine',
    name: "Dynamic Repricing Engine",
    description: 'Real-time competitor price tracking with automatic repricing suggestions and profit margin protection',
    steps: 5,
    trigger: 'Scheduled',
    author: 'Mike Thompson',
    upvotes: 156,
    category: 'Pricing',
    difficulty: 'Advanced'
  },
  {
    id: 'keyword-discovery-machine',
    name: "Keyword Discovery Machine",
    description: 'Daily keyword discovery and ranking optimization that finds hidden search terms and updates listings automatically',
    steps: 7,
    trigger: 'Scheduled',
    author: 'Emma Rodriguez',
    upvotes: 203,
    category: 'SEO',
    difficulty: 'Intermediate'
  },
  {
    id: 'review-response-automation',
    name: "Auto Review Response",
    description: 'Intelligent review monitoring with AI-generated responses for negative reviews and thank you messages for positive ones',
    steps: 4,
    trigger: 'Event',
    author: 'Alex Kumar',
    upvotes: 74,
    category: 'Customer Service',
    difficulty: 'Beginner'
  },
  {
    id: 'ppc-bid-optimizer',
    name: "PPC Bid Optimizer",
    description: 'Advanced advertising optimization that adjusts bids, pauses underperforming keywords, and scales winning campaigns',
    steps: 8,
    trigger: 'Scheduled',
    author: 'Lisa Wang',
    upvotes: 142,
    category: 'Advertising',
    difficulty: 'Advanced'
  },
  {
    id: 'listing-compliance-checker',
    name: "Listing Compliance Checker",
    description: 'Comprehensive listing audit that checks for policy violations, missing images, and optimization opportunities',
    steps: 5,
    trigger: 'Manual',
    author: 'David Johnson',
    upvotes: 98,
    category: 'Compliance',
    difficulty: 'Beginner'
  },
  {
    id: 'supplier-sync-automation',
    name: "Supplier Sync Automation",
    description: 'Automated supplier communication system that sends inventory forecasts and handles reorder notifications',
    steps: 6,
    trigger: 'Scheduled',
    author: 'Maria Gonzalez',
    upvotes: 67,
    category: 'Supply Chain',
    difficulty: 'Intermediate'
  }
];

export function FlowTemplatesSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filterCategory, setFilterCategory] = useState('all');
  const [upvotedTemplates, setUpvotedTemplates] = useState<Set<string>>(new Set());

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(flowTemplates.map(t => t.category)))];

  // Filter and sort templates
  const filteredAndSortedTemplates = flowTemplates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.upvotes - a.upvotes;
        case 'newest':
          return a.name.localeCompare(b.name); // Simulating newest
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleUpvote = (templateId: string) => {
    setUpvotedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Community Flow Templates</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredAndSortedTemplates.length} templates
        </Badge>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates, authors, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedTemplates.map((template) => {
          const isUpvoted = upvotedTemplates.has(template.id);
          const displayUpvotes = template.upvotes + (isUpvoted ? 1 : 0);
          
          return (
            <Card key={template.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold break-words mb-1">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">by {template.author}</span>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3 break-words text-sm">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <span>{template.steps} steps</span>
                    <div className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-full">
                      <Play className="h-3 w-3" />
                      <span className="text-xs">{template.trigger}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 ${isUpvoted ? 'text-red-600' : 'text-gray-600'}`}
                    onClick={() => handleUpvote(template.id)}
                  >
                    <Heart className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
                    <span className="text-sm">{displayUpvotes}</span>
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1 mr-2">
                  View Template
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
