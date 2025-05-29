
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blocksData } from '@/components/jarvi-flows/data/blocksData';
import { Separator } from '@/components/ui/separator';
import { Workflow, Zap, Target, Brain } from 'lucide-react';

export function BlocksPitchDeckContent() {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'collect':
        return Target;
      case 'think':
        return Brain;
      case 'act':
        return Zap;
      default:
        return Workflow;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'collect':
        return 'Retrieves data from Amazon, scraped sites, or files';
      case 'think':
        return 'Interprets data using AI or logic';
      case 'act':
        return 'Performs actions like messaging, updating listings, or creating tasks';
      default:
        return '';
    }
  };

  const totalBlocks = blocksData.collect.length + blocksData.think.length + blocksData.act.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flow Blocks Library
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive collection of <span className="font-semibold text-blue-600">{totalBlocks} powerful blocks</span> to automate your Amazon business workflows
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {Object.entries(blocksData).map(([category, blocks]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Card key={category} className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-10 h-10 ${getCategoryColor(category)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{blocks.length}</div>
                    <div className="text-sm font-medium text-gray-600 capitalize">{category} Blocks</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Separator className="max-w-6xl mx-auto" />

      {/* Blocks Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {Object.entries(blocksData).map(([category, blocks]) => {
          const IconComponent = getCategoryIcon(category);
          
          return (
            <div key={category} className="mb-20">
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-8 h-8 ${getCategoryColor(category)} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">{category} Blocks</h2>
                  <Badge variant="outline" className="ml-2 text-lg px-3 py-1">
                    {blocks.length} blocks
                  </Badge>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  {getCategoryDescription(category)}
                </p>
              </div>

              {/* Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {blocks.map((block) => {
                  const IconComponent = block.icon;
                  
                  return (
                    <Card key={block.name} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {block.logo ? (
                              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 group-hover:bg-gray-100 transition-colors">
                                <img 
                                  src={block.logo} 
                                  alt={`${block.name} logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <IconComponent className="h-6 w-6 text-gray-700" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                              {block.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                          {block.summary}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`} />
                            <Badge variant="secondary" className="text-xs capitalize bg-gray-100">
                              {category}
                            </Badge>
                          </div>
                          
                          {block.needsConnection && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Integration
                            </Badge>
                          )}
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

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-2xl font-bold mb-4">Ready to Automate Your Workflows?</h3>
          <p className="text-blue-100 text-lg">
            Choose from {totalBlocks} powerful blocks across Collect, Think, and Act categories to build sophisticated automation flows.
          </p>
        </div>
      </div>
    </div>
  );
}
