import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, Edit, Clock, Zap, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TypedPrompts } from '@/components/jarvi-flows/TypedPrompts';
import { GradientBackground } from '@/components/jarvi-flows/GradientBackground';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [flows] = useState<Flow[]>(predefinedFlows);
  const [isCreating, setIsCreating] = useState(false);
  
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
  
  // Function to handle AI prompt submission
  const handleAIPromptSubmit = async (prompt: string) => {
    try {
      setIsCreating(true);
      
      // Display a toast notification
      toast({
        title: "Creating your flow",
        description: "Please wait while we generate your custom flow..."
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to the builder page with the prompt
      navigate(`/jarvi-flows/builder?prompt=${encodeURIComponent(prompt)}`);
    } catch (error) {
      console.error("Error creating flow:", error);
      toast({
        title: "Error creating flow",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Enhanced Hero Section */}
        <GradientBackground>
          <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <div className="max-w-3xl text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Your Amazon business has 
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> never flowed like this</span>
              </h1>
              
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Create powerful automation flows with AI that streamline your Amazon operations
              </p>
            </div>

            <div className="w-full max-w-2xl transition-all duration-500 hover:scale-[1.02]">
              <TypedPrompts onSubmit={handleAIPromptSubmit} />
            </div>
          </div>
        </GradientBackground>

        {/* Your Flows Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Flows</h2>
            <Button 
              onClick={handleCreateNewFlow} 
              variant="outline" 
              size="sm"
              className="border-[#4457ff] text-[#4457ff]"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Flow
            </Button>
          </div>

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
