import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HeroSection } from '@/components/jarvi-flows/HeroSection';
import { FlowsSection } from '@/components/jarvi-flows/FlowsSection';
import { FlowTemplatesSection } from '@/components/jarvi-flows/FlowTemplatesSection';
import { MyBlocksSection } from '@/components/jarvi-flows/MyBlocksSection';
import { Flow } from '@/components/jarvi-flows/FlowsGrid';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertFlowToUnifiedTask, fetchSavedFlows, deleteUnifiedTask } from '@/lib/unifiedTasks';
import { supabase } from '@/integrations/supabase/client';
export default function JarviFlows() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);
  const [isRunningFlow, setIsRunningFlow] = useState(false);
  const [runningFlowId, setRunningFlowId] = useState<string | null>(null);

  // Load flows from unified tasks that are saved to flows
  useEffect(() => {
    const loadFlows = async () => {
      try {
        const savedFlows = await fetchSavedFlows();

        // Convert unified tasks back to Flow format for the UI
        const flowsData = savedFlows.map(task => ({
          id: task.id,
          name: task.title,
          description: task.description,
          trigger: task.trigger || 'manual',
          blocks: task.data?.flowBlocks || [],
          steps: task.data?.flowSteps || []
        }));
        setFlows(flowsData);
      } catch (error) {
        console.error('Error loading flows:', error);
        toast({
          title: "Error loading flows",
          description: "Failed to load your saved flows",
          variant: "destructive"
        });
      }
    };
    loadFlows();
  }, [toast]);

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

      // Since the flow is already a unified task, just navigate to it
      navigate(`/task/${flowId}`);
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
  const confirmDeleteFlow = async () => {
    if (flowToDelete) {
      try {
        const flowName = flows.find(f => f.id === flowToDelete)?.name || "Flow";

        // Delete the unified task
        await deleteUnifiedTask(flowToDelete);

        // Update local state
        const updatedFlows = flows.filter(flow => flow.id !== flowToDelete);
        setFlows(updatedFlows);
        toast({
          title: "Flow deleted",
          description: `${flowName} has been removed.`
        });
        setFlowToDelete(null);
      } catch (error) {
        toast({
          title: "Error deleting flow",
          description: "Failed to delete the flow",
          variant: "destructive"
        });
      }
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
  return <MainLayout>
      <div className="space-y-12">
        {/* Hero Section with AI Prompt */}
        <HeroSection onAIPromptSubmit={handleAIPromptSubmit} />

        {/* Flows Section with Tabs */}
        <Tabs defaultValue="your-flows" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="your-flows">My Templates</TabsTrigger>
            <TabsTrigger value="flow-templates">Flow Templates</TabsTrigger>
            <TabsTrigger value="my-blocks">My Blocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="your-flows">
            <FlowsSection flows={flows} onEditFlow={handleEditFlow} onRunFlow={handleRunFlow} onDeleteFlow={handleDeleteFlow} onCreateNewFlow={handleCreateNewFlow} isCreating={isCreating} isRunningFlow={isRunningFlow} runningFlowId={runningFlowId} />
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
      <AlertDialog open={!!flowToDelete} onOpenChange={open => !open && setFlowToDelete(null)}>
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
            <AlertDialogAction onClick={confirmDeleteFlow} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>;
}