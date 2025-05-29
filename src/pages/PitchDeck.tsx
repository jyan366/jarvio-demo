import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blocksData } from '@/components/jarvi-flows/data/blocksData';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
export default function PitchDeck() {
  // Get popular blocks organized by Amazon, then Jarvio, then other services
  const popularBlocks = [
  // Amazon blocks
  {
    ...blocksData.collect[0],
    category: 'collect'
  },
  // Pull from Amazon
  {
    ...blocksData.collect[1],
    category: 'collect'
  },
  // Amazon Sales Summary
  {
    ...blocksData.collect[3],
    category: 'collect'
  },
  // Amazon Listing Summary
  {
    ...blocksData.act[0],
    category: 'act'
  },
  // Push to Amazon
  {
    ...blocksData.think[1],
    category: 'think'
  },
  // Price Optimization
  // Find and add Run Zapier Workflow
  ...blocksData.act.filter(block => block.name === 'Run Zapier Workflow').map(block => ({
    ...block,
    category: 'act'
  })),
  // Find and add Notion block
  ...blocksData.act.filter(block => block.name === 'Notion').map(block => ({
    ...block,
    category: 'act'
  })),
  // Jarvio blocks
  {
    ...blocksData.act[5],
    category: 'act'
  },
  // Create Jarvio Task
  // Other service blocks
  {
    ...blocksData.collect[6],
    category: 'collect'
  } // Scrape Shopify Product Pages
  ].filter(Boolean);
  const totalBlocks = blocksData.collect.length + blocksData.think.length + blocksData.act.length;
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collect':
        return 'bg-blue-500';
      case 'think':
        return 'bg-purple-500';
      case 'act':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'collect':
        return 'Collect';
      case 'think':
        return 'Think';
      case 'act':
        return 'Act';
      default:
        return category;
    }
  };
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'collect':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'think':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'act':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  return <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Automate Your eCommerce Stack</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Every tool and integration you need to build end-to-end eCommerce workflows.
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{blocksData.collect.length} Data Collection blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{blocksData.think.length} AI Processing blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{blocksData.act.length} Automation blocks</span>
              </div>
            </div>
          </div>

          {/* Popular Blocks Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Popular blocks & integrations</h2>
              <Badge variant="secondary" className="text-xs">Most used tools</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {popularBlocks.map(block => {
              const IconComponent = block.icon;
              return <Card key={block.name} className="group hover:shadow-md transition-all duration-200 border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {block.logo ? <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 border">
                                <img src={block.logo} alt={`${block.name} logo`} className="w-full h-full object-contain" />
                              </div> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-gray-600" />
                              </div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {block.name}
                            </CardTitle>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {block.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(block.category)}`}></div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${getCategoryBadgeColor(block.category)}`}>
                            {getCategoryLabel(block.category)}
                          </span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
                          Learn more
                        </Button>
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>

          {/* All Categories */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">All Categories</h2>
              <p className="text-gray-600">Browse all {totalBlocks} blocks organized by category</p>
            </div>

            {Object.entries(blocksData).map(([category, blocks]) => {
            const categoryColors = {
              collect: 'border-blue-200 bg-blue-50',
              think: 'border-purple-200 bg-purple-50',
              act: 'border-green-200 bg-green-50'
            };
            const categoryLabels = {
              collect: 'Data Collection',
              think: 'AI Processing',
              act: 'Automation'
            };
            return <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-lg border ${categoryColors[category as keyof typeof categoryColors]}`}>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </span>
                    </div>
                    <Badge variant="secondary">{blocks.length} blocks</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blocks.map(block => {
                  const IconComponent = block.icon;
                  return <Card key={block.name} className="group hover:shadow-md transition-all duration-200 border border-gray-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {block.logo ? <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center p-2 border">
                                      <img src={block.logo} alt={`${block.name} logo`} className="w-full h-full object-contain" />
                                    </div> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                      <IconComponent className="h-5 w-5 text-gray-600" />
                                    </div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {block.name}
                                  </CardTitle>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {block.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${getCategoryBadgeColor(category)}`}>
                                  {getCategoryLabel(category)}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
                                Learn more
                              </Button>
                            </div>
                          </CardContent>
                        </Card>;
                })}
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>
    </MainLayout>;
}