import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HeroSection } from '@/components/jarvi-flows/HeroSection';
import { FlowsSection } from '@/components/jarvi-flows/FlowsSection';
import { FlowTemplatesSection } from '@/components/jarvi-flows/FlowTemplatesSection';
import { MyBlocksSection } from '@/components/jarvi-flows/MyBlocksSection';
import { Flow } from '@/components/jarvi-flows/FlowsGrid';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertFlowToUnifiedTask } from '@/lib/unifiedTasks';
import { supabase } from '@/integrations/supabase/client';

// Predefined flows as fallbacks
const predefinedFlows: Flow[] = [
  {
    id: 'listing-launch',
    name: 'Listing Launch',
    description: 'Automates the process of launching new product listings with optimized content and keyword strategy',
    trigger: 'manual',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Upload Sheet', name: 'Import Product Specifications Sheet', steps: [] },
      { id: 'c2', type: 'collect', option: 'Get Keywords', name: 'Research Competitive Keywords for Category', steps: [] },
      { id: 't1', type: 'think', option: 'Listing Analysis', name: 'Create Optimized Product Description', steps: [] },
      { id: 'a1', type: 'act', option: 'Push to Amazon', name: 'Publish New Listings to Amazon', steps: [] },
      { id: 'a2', type: 'act', option: 'Send Email', name: 'Notify Team of Successful Launch', steps: [] }
    ]
  },
  {
    id: 'inventory-restock',
    name: 'Inventory Restock',
    description: 'Analyzes sales velocity and inventory levels to create timely restock recommendations',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info', name: 'Retrieve Current Inventory Levels', steps: [] },
      { id: 'c2', type: 'collect', option: 'Estimate Sales', name: 'Calculate 30-Day Sales Projections', steps: [] },
      { id: 't1', type: 'think', option: 'Basic AI Analysis', name: 'Determine Optimal Restock Quantities', steps: [] },
      { id: 'a1', type: 'act', option: 'AI Summary', name: 'Generate Inventory Restock Report', steps: [] },
      { id: 'a2', type: 'act', option: 'Send Email', name: 'Send Restock Alert to Supply Chain Team', steps: [] }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Report',
    description: 'Aggregates and analyzes customer reviews and feedback across all products',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Review Information', name: 'Gather Last 30 Days of Product Reviews', steps: [] },
      { id: 'c2', type: 'collect', option: 'Seller Account Feedback', name: 'Collect Seller Rating Metrics', steps: [] },
      { id: 't1', type: 'think', option: 'Review Analysis', name: 'Identify Common Customer Pain Points', steps: [] },
      { id: 'a1', type: 'act', option: 'AI Summary', name: 'Generate Actionable Feedback Report', steps: [] },
      { id: 'a2', type: 'act', option: 'Human in the Loop', name: 'Request Product Manager Review', steps: [] }
    ]
  },
  {
    id: 'quarterly-optimization',
    name: 'Quarterly Listing Optimisation',
    description: 'Performs deep analysis of listing performance and suggests optimizations every quarter',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info', name: 'Extract Quarterly Performance Data', steps: [] },
      { id: 'c2', type: 'collect', option: 'Review Information', name: 'Gather Quarterly Customer Feedback', steps: [] },
      { id: 't1', type: 'think', option: 'Insights Generation', name: 'Create Listing Enhancement Strategy', steps: [] },
      { id: 'a1', type: 'act', option: 'Push to Amazon', name: 'Apply Optimizations to Key Listings', steps: [] },
      { id: 'a2', type: 'act', option: 'Human in the Loop', name: 'Get Marketing Approval for Changes', steps: [] }
    ]
  }
];

// Load flows from localStorage or use predefined ones
const loadSavedFlows = (): Flow[] => {
  const savedFlowsString = localStorage.getItem('jarviFlows');
  if (savedFlowsString) {
    try {
      return JSON.parse(savedFlowsString);
    } catch (error) {
      console.error("Error parsing saved flows:", error);
    }
  }
  return predefinedFlows; // Default to predefined flows if none are saved
};

// Save flows to localStorage
const saveFlowsToStorage = (flows: Flow[]): void => {
  try {
    localStorage.setItem('jarviFlows', JSON.stringify(flows));
  } catch (error) {
    console.error("Error saving flows:", error);
  }
};

export default function JarviFlows() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);
  const [isRunningFlow, setIsRunningFlow] = useState(false);
  const [runningFlowId, setRunningFlowId] = useState<string | null>(null);
  
  // Load flows on component mount
  useEffect(() => {
    const savedFlows = loadSavedFlows();
    setFlows(savedFlows);
  }, []);
  
  // Function to handle editing a flow
  const handleEditFlow = (flowId: string) => {
    navigate(`/jarvi-flows/builder/${flowId}`);
  };
  
  // Function to handle running a flow - updated to use unified tasks
  const handleRunFlow = async (flowId: string) => {
    try {
      setIsRunningFlow(true);
      setRunningFlowId(flowId);
      
      const flowToRun = flows.find(flow => flow.id === flowId);
      
      if (!flowToRun) {
        throw new Error('Flow not found');
      }
      
      toast({
        title: "Starting flow",
        description: "Creating unified task from flow steps..."
      });
      
      // Convert flow to unified task structure
      const task = await convertFlowToUnifiedTask(flowToRun);
      
      if (!task) {
        throw new Error('Failed to create task from flow');
      }
      
      toast({
        title: "Flow started successfully",
        description: "Flow is now running as a unified task. Opening task view..."
      });
      
      // Navigate to task view with the new task ID
      navigate(`/task/${task.id}`);
      
    } catch (error) {
      console.error('Error running flow:', error);
      toast({
        title: "Error starting flow",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      
      // Reset running state on error
      setIsRunningFlow(false);
      setRunningFlowId(null);
    }
  };
  
  // Function to handle deleting a flow
  const handleDeleteFlow = (flowId: string) => {
    setFlowToDelete(flowId);
  };
  
  // Function to confirm deletion of a flow
  const confirmDeleteFlow = () => {
    if (flowToDelete) {
      const flowName = flows.find(f => f.id === flowToDelete)?.name || "Flow";
      const updatedFlows = flows.filter(flow => flow.id !== flowToDelete);
      setFlows(updatedFlows);
      saveFlowsToStorage(updatedFlows);
      
      toast({
        title: "Flow deleted",
        description: `${flowName} has been removed.`
      });
      
      setFlowToDelete(null);
    }
  };
  
  // Function to create a new flow
  const handleCreateNewFlow = () => {
    navigate('/jarvi-flows/builder');
  };
  
  // Function to handle AI prompt submission - updated to use the generate-flow edge function
  const handleAIPromptSubmit = async (prompt: string) => {
    try {
      setIsCreating(true);
      
      // Display a toast notification
      toast({
        title: "Creating your flow",
        description: "Please wait while we generate your custom flow..."
      });
      
      // Call the generate-flow function
      const response = await supabase.functions.invoke("generate-flow", {
        body: {
          prompt: prompt
        }
      });
      
      if (!response.data || response.data.success === false) {
        const errorMsg = response.data?.error || "Unknown error occurred";
        console.error("Flow generation error:", errorMsg);
        throw new Error(errorMsg);
      }
      
      // If successful, navigate to builder with the generated flow encoded in query params
      const generatedFlow = response.data.generatedFlow;
      if (generatedFlow) {
        console.log("Generated flow:", generatedFlow);
        const flowParam = encodeURIComponent(JSON.stringify(generatedFlow));
        navigate(`/jarvi-flows/builder?generatedFlow=${flowParam}`);
      } else {
        throw new Error("No flow was generated");
      }
    } catch (error) {
      console.error("Error creating flow:", error);
      toast({
        title: "Error creating flow",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section with AI Prompt */}
        <HeroSection onAIPromptSubmit={handleAIPromptSubmit} />

        {/* Flows Section with Tabs */}
        <Tabs defaultValue="your-flows" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="your-flows">Your Flows</TabsTrigger>
            <TabsTrigger value="flow-templates">Flow Templates</TabsTrigger>
            <TabsTrigger value="my-blocks">My Blocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="your-flows">
            <FlowsSection
              flows={flows}
              onEditFlow={handleEditFlow}
              onRunFlow={handleRunFlow}
              onDeleteFlow={handleDeleteFlow}
              onCreateNewFlow={handleCreateNewFlow}
              isCreating={isCreating}
              isRunningFlow={isRunningFlow}
              runningFlowId={runningFlowId}
            />
          </TabsContent>
          
          <TabsContent value="flow-templates">
            <FlowTemplatesSection />
          </TabsContent>
          
          <TabsContent value="my-blocks">
            <MyBlocksSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation dialog for deleting flows */}
      <AlertDialog open={!!flowToDelete} onOpenChange={(open) => !open && setFlowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the flow
              and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFlow}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
