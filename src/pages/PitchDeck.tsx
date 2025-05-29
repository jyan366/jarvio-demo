
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blocksData } from '@/components/jarvi-flows/data/blocksData';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap, Database, Brain, ShoppingCart, Workflow } from 'lucide-react';

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
        return 'from-slate-600 to-slate-700';
      case 'think':
        return 'from-slate-700 to-slate-800';
      case 'act':
        return 'from-slate-800 to-slate-900';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'collect':
        return 'Connect with Amazon, marketplaces, and data sources to gather product, order, and customer data';
      case 'think':
        return 'Process and analyze ecommerce data using AI to generate insights and make intelligent decisions';
      case 'act':
        return 'Execute actions like updating listings, managing inventory, sending notifications, and automating tasks';
      default:
        return '';
    }
  };

  const totalBlocks = blocksData.collect.length + blocksData.think.length + blocksData.act.length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <ShoppingCart className="h-12 w-12 text-blue-400" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Complete eCommerce Automation
                </h1>
              </div>
              <p className="text-xl text-gray-200 mb-4 max-w-4xl mx-auto">
                Every tool and integration you need to build end-to-end ecommerce workflows
              </p>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                Connect your Amazon store, analyze data with AI, and automate everything from inventory to customer service with our comprehensive collection of {totalBlocks} specialized blocks
              </p>
              <div className="flex justify-center gap-8 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400">{blocksData.collect.length}</div>
                  <div className="text-gray-200">Data Collection</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400">{blocksData.think.length}</div>
                  <div className="text-gray-200">AI Processing</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">{blocksData.act.length}</div>
                  <div className="text-gray-200">Automation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* eCommerce Focus Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for eCommerce Excellence</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From Amazon seller tools to marketplace integrations, inventory management to customer insights - 
              we've got every piece of the ecommerce puzzle covered.
            </p>
          </div>

          {/* Categories Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {Object.entries(blocksData).map(([category, blocks]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Card key={category} className="relative overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(category)}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl capitalize text-gray-900">{category}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {blocks.length} blocks
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
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
                      <h2 className="text-3xl font-bold capitalize text-gray-900">{category} Blocks</h2>
                      <p className="text-gray-600">{getCategoryDescription(category)}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocks.map((block) => {
                      const BlockIcon = block.icon;
                      return (
                        <Card key={block.name} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {block.logo ? (
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 border">
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
                                    <Badge variant="outline" className="mt-1 text-xs border-blue-200 text-blue-700">
                                      {block.connectionService}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
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
                              <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">
                                {category}
                              </Badge>
                              <Button variant="outline" size="sm" className="text-xs border-gray-300 hover:border-gray-400">
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
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Workflow className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl font-bold">
                Start Building Your eCommerce Empire
              </h2>
            </div>
            <p className="text-xl text-gray-200 mb-8">
              Connect your Amazon store, automate your workflows, and scale your business with intelligent automation
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Connect Amazon Store
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                View Demo Workflows
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
