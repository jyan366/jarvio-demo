
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blocksData } from '@/components/jarvi-flows/data/blocksData';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap, Database, Brain } from 'lucide-react';

export default function PitchDeck() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'collect':
        return Database;
      case 'think':
        return Brain;
      case 'act':
        return Zap;
      default:
        return Database;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collect':
        return 'from-blue-500 to-blue-600';
      case 'think':
        return 'from-purple-500 to-purple-600';
      case 'act':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'collect':
        return 'Retrieves data from Amazon, scraped sites, or files';
      case 'think':
        return 'Interprets data using AI or logic';
      case 'act':
        return 'Performs an action like messaging, updating listings, or creating tasks';
      default:
        return '';
    }
  };

  const totalBlocks = blocksData.collect.length + blocksData.think.length + blocksData.act.length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Jarvio Flow Blocks
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Build powerful automation workflows with our comprehensive collection of {totalBlocks} blocks
              </p>
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">{blocksData.collect.length}</div>
                  <div className="text-blue-200">Collect Blocks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{blocksData.think.length}</div>
                  <div className="text-purple-200">Think Blocks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{blocksData.act.length}</div>
                  <div className="text-green-200">Act Blocks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {Object.entries(blocksData).map(([category, blocks]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Card key={category} className="relative overflow-hidden border-0 shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-10`}></div>
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(category)}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl capitalize">{category}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {blocks.length} blocks
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {getCategoryDescription(category)}
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* All Blocks Grid */}
          <div className="space-y-16">
            {Object.entries(blocksData).map(([category, blocks]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(category)}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold capitalize">{category} Blocks</h2>
                      <p className="text-muted-foreground">{getCategoryDescription(category)}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocks.map((block) => {
                      const BlockIcon = block.icon;
                      return (
                        <Card key={block.name} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {block.logo ? (
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                                      <img 
                                        src={block.logo} 
                                        alt={`${block.name} logo`}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center`}>
                                      <BlockIcon className="h-6 w-6 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {block.name}
                                  </CardTitle>
                                  {block.needsConnection && (
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      Requires {block.connectionService}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                              {block.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="capitalize">
                                {category}
                              </Badge>
                              <Button variant="outline" size="sm" className="text-xs">
                                Learn more
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your First Flow?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Combine these powerful blocks to create automated workflows that save time and boost productivity
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
