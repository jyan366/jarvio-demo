
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, Edit, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the flow types and their properties
type TriggerType = 'manual' | 'scheduled' | 'event';

type FlowBlock = {
  id: string;
  type: 'collect' | 'think' | 'act';
  option: string;
  config?: Record<string, any>;
};

type Flow = {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  blocks: FlowBlock[];
};

// Predefined flows
const predefinedFlows: Flow[] = [
  {
    id: 'listing-launch',
    name: 'Listing Launch',
    description: 'Automates the process of launching new product listings with optimized content and keyword strategy',
    trigger: 'manual',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Upload Sheet' },
      { id: 'c2', type: 'collect', option: 'Get Keywords' },
      { id: 't1', type: 'think', option: 'Listing Analysis' },
      { id: 'a1', type: 'act', option: 'Push to Amazon' },
      { id: 'a2', type: 'act', option: 'Send Email' }
    ]
  },
  {
    id: 'inventory-restock',
    name: 'Inventory Restock',
    description: 'Analyzes sales velocity and inventory levels to create timely restock recommendations',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info' },
      { id: 'c2', type: 'collect', option: 'Estimate Sales' },
      { id: 't1', type: 'think', option: 'Basic AI Analysis' },
      { id: 'a1', type: 'act', option: 'AI Summary' },
      { id: 'a2', type: 'act', option: 'Send Email' }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Report',
    description: 'Aggregates and analyzes customer reviews and feedback across all products',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Review Information' },
      { id: 'c2', type: 'collect', option: 'Seller Account Feedback' },
      { id: 't1', type: 'think', option: 'Review Analysis' },
      { id: 'a1', type: 'act', option: 'AI Summary' },
      { id: 'a2', type: 'act', option: 'Human in the Loop' }
    ]
  },
  {
    id: 'quarterly-optimization',
    name: 'Quarterly Listing Optimisation',
    description: 'Performs deep analysis of listing performance and suggests optimizations every quarter',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info' },
      { id: 'c2', type: 'collect', option: 'Review Information' },
      { id: 't1', type: 'think', option: 'Insights Generation' },
      { id: 'a1', type: 'act', option: 'Push to Amazon' },
      { id: 'a2', type: 'act', option: 'Human in the Loop' }
    ]
  }
];

// Helper function to get a trigger icon
const getTriggerIcon = (trigger: TriggerType) => {
  switch (trigger) {
    case 'manual':
      return <Play className="h-4 w-4" />;
    case 'scheduled':
      return <Clock className="h-4 w-4" />;
    case 'event':
      return <Zap className="h-4 w-4" />;
    default:
      return <Play className="h-4 w-4" />;
  }
};

// Helper function to generate block type count
const getBlockCounts = (blocks: FlowBlock[]) => {
  const counts = {
    collect: 0,
    think: 0,
    act: 0
  };
  
  blocks.forEach(block => {
    counts[block.type]++;
  });
  
  return counts;
};

export default function JarviFlows() {
  const navigate = useNavigate();
  const [flows] = useState<Flow[]>(predefinedFlows);
  
  // Function to handle editing a flow
  const handleEditFlow = (flowId: string) => {
    navigate(`/jarvi-flows/builder/${flowId}`);
  };
  
  // Function to handle running a flow
  const handleRunFlow = (flowId: string) => {
    console.log(`Running flow: ${flowId}`);
    // In a real implementation, this would trigger the flow execution
  };
  
  // Function to create a new flow
  const handleCreateNewFlow = () => {
    navigate('/jarvi-flows/builder');
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">JarviFlows</h1>
            <p className="text-muted-foreground">
              Create and manage automated workflows for your Amazon business
            </p>
          </div>
          <Button onClick={handleCreateNewFlow} size="default" className="bg-[#4457ff] hover:bg-[#4457ff]/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Flow
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Flows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {flows.map((flow) => {
              const blockCounts = getBlockCounts(flow.blocks);
              
              return (
                <Card key={flow.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">{flow.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{flow.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 rounded-md bg-secondary p-1 text-secondary-foreground">
                        {getTriggerIcon(flow.trigger)}
                        <span className="text-xs capitalize">{flow.trigger}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="rounded-full w-2.5 h-2.5 bg-blue-500 mr-1.5" />
                        <span>{blockCounts.collect} Collect</span>
                      </div>
                      <div className="flex items-center">
                        <div className="rounded-full w-2.5 h-2.5 bg-purple-500 mr-1.5" />
                        <span>{blockCounts.think} Think</span>
                      </div>
                      <div className="flex items-center">
                        <div className="rounded-full w-2.5 h-2.5 bg-green-500 mr-1.5" />
                        <span>{blockCounts.act} Act</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditFlow(flow.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Flow
                    </Button>
                    
                    {flow.trigger === 'manual' && (
                      <Button 
                        size="sm"
                        onClick={() => handleRunFlow(flow.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
