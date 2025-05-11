import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HeroSection } from '@/components/jarvi-flows/HeroSection';
import { FlowsSection } from '@/components/jarvi-flows/FlowsSection';
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
import { createTask } from '@/lib/supabaseTasks';
import { supabase } from '@/integrations/supabase/client';

// Predefined flows as fallbacks
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

// Function to convert a flow to a task
const convertFlowToTask = async (flow: Flow) => {
  try {
    // Create subtasks from flow blocks
    const subtasks = flow.blocks.map(block => ({
      title: block.name || `${block.type}: ${block.option}`,
      description: `Flow step: ${block.option}`
    }));
    
    // Create the main task with subtasks
    const task = await createTask({
      title: `Flow: ${flow.name}`,
      description: flow.description,
      status: 'In Progress', // Start as In Progress
      priority: 'MEDIUM',
      category: 'FLOW',
      data: { flowId: flow.id, flowTrigger: flow.trigger }
    }, subtasks); // Pass subtasks directly to createTask
    
    return task;
  } catch (error) {
    console.error('Error converting flow to task:', error);
    throw error;
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
  
  // Function to handle running a flow
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
        description: "Creating tasks from flow steps..."
      });
      
      // Convert flow to task and get the task ID
      const task = await convertFlowToTask(flowToRun);
      
      if (!task) {
        throw new Error('Failed to create task from flow');
      }
      
      toast({
        title: "Flow started successfully",
        description: "Flow is now running. Opening task view..."
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

        {/* Your Flows Section */}
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
