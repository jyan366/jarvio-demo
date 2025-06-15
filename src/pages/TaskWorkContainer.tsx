import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskWorkMain } from "@/components/tasks/TaskWorkMain";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";
import { SubtaskDialog } from "@/components/tasks/SubtaskDialog";
import { CollapseNavButton } from "@/components/tasks/CollapseNavButton";
import { useUnifiedTaskWork } from "@/hooks/useUnifiedTaskWork";
import { Workflow } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}

export interface TaskInsight {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  date: string;
  status: 'new' | 'viewed' | 'actioned' | 'dismissed';
}

export interface Product {
  image: string;
  name: string;
  asin: string;
  sku: string;
  price: string;
  units: string;
  last30Sales: string;
  last30Units: string;
}

export interface TaskWorkType {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  date: string;
  products: Product[];
  subtasks: Subtask[];
  comments: {
    user: string;
    text: string;
    ago: string;
    subtaskId?: string;
  }[];
  insights?: TaskInsight[];
  data?: {
    flowId?: string;
    flowTrigger?: string;
  };
}

interface TaskWorkContainerProps {
  taskId: string;
}

const PRODUCT_IMAGE = "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png";

export default function TaskWorkContainer({
  taskId
}: TaskWorkContainerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    task,
    childTasks,
    loading,
    error,
    updateTask,
    addChild,
    removeChild,
    refresh
  } = useUnifiedTaskWork(taskId);

  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [focusedSubtaskIdx, setFocusedSubtaskIdx] = React.useState<number | null>(0);
  const [selectedTab, setSelectedTab] = React.useState<"comments" | "ai">("ai");
  const [commentValue, setCommentValue] = React.useState("");
  const [subtaskDialogIdx, setSubtaskDialogIdx] = React.useState<number | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading task...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !task) {
    return (
      <MainLayout>
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Task not found</p>
        </div>
      </MainLayout>
    );
  }

  // Enhanced conversion to legacy format with flow execution data
  const taskState: TaskWorkType = {
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    category: task.category || "",
    date: task.date,
    products: [
      {
        image: PRODUCT_IMAGE,
        name: "Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by The Cultured Food Company",
        asin: "B08P5P3QGC",
        sku: "KM1000",
        price: "16.99",
        units: "111",
        last30Sales: "1155.32",
        last30Units: "68",
      }
    ],
    subtasks: childTasks.map((child, index) => ({
      id: child.id,
      title: child.title,
      done: child.status === 'Done',
      description: child.description || "",
      status: child.status,
      priority: child.priority,
      category: child.category || "",
      // Include block execution data for flow steps
      blockData: child.data?.blockData,
      executionOrder: child.data?.blockData?.executionOrder ?? index,
    })),
    comments: [{ user: "you", text: "Ready to work on this task", ago: "now" }],
    insights: [],
    data: {
      ...task.data,
      // Ensure flow data is preserved
      isFlowTask: task.task_type === 'flow',
      flowBlocks: task.data?.blocks || [],
      flowExecutionMetadata: task.data?.executionMetadata || {}
    },
  };

  const isFlowTask = task.task_type === 'flow' || task.category === 'FLOW';

  const handleUpdateTask = (field: keyof TaskWorkType, value: any) => {
    if (field === 'title') {
      updateTask({ title: value });
    } else if (field === 'description') {
      updateTask({ description: value });
    } else if (field === 'status') {
      updateTask({ status: value });
    } else if (field === 'priority') {
      updateTask({ priority: value });
    } else if (field === 'category') {
      updateTask({ category: value });
    }
  };

  const handleToggleSubtask = async (idx: number) => {
    const subtask = taskState.subtasks[idx];
    if (!subtask) return;
    
    const newStatus = subtask.done ? 'Not Started' : 'Done';
    await updateTask({ status: newStatus });
    await refresh();
  };

  const handleAddSubtask = async (title: string) => {
    await addChild(title);
    await refresh();
  };

  const handleRemoveSubtask = async (idx: number) => {
    const subtask = taskState.subtasks[idx];
    if (!subtask) return;
    
    await removeChild(subtask.id);
    await refresh();
  };

  const handleGenerateSteps = async () => {
    if (!task) return;
    
    setIsGenerating(true);
    try {
      console.log("Generating steps for task:", task.title, task.description);
      
      // Call the generate-task-steps edge function
      const response = await supabase.functions.invoke('generate-task-steps', {
        body: {
          title: task.title,
          description: task.description || ""
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || !response.data.steps) {
        throw new Error("No steps were generated");
      }

      const generatedSteps = response.data.steps;
      console.log("Generated steps:", generatedSteps);

      // Create child tasks for each generated step
      for (let i = 0; i < generatedSteps.length; i++) {
        const step = generatedSteps[i];
        await addChild(step.title, step.description || "");
      }

      // Refresh to get the updated child tasks
      await refresh();
      
      toast({
        title: "Steps generated",
        description: `Generated ${generatedSteps.length} steps successfully`,
      });
    } catch (error) {
      console.error("Error generating steps:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error generating steps",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFocusSubtask = (idx: number) => {
    setFocusedSubtaskIdx(idx);
  };

  const handleUpdateSubtask = (field: keyof Subtask, value: any) => {
    // Handle subtask updates
  };

  const handleOpenSubtask = (idx: number) => {
    setSubtaskDialogIdx(idx);
  };

  const handleCloseSubtask = () => {
    setSubtaskDialogIdx(null);
  };

  const handleAddComment = async (text: string) => {
    setCommentValue("");
  };

  const dialogSubtask = subtaskDialogIdx !== null ? taskState.subtasks[subtaskDialogIdx] : null;

  return (
    <MainLayout>
      <div className="w-full h-full max-w-none flex flex-row gap-0 bg-background">
        <main className="flex-1 min-w-0 bg-white border-r-[1.5px] border-[#F4F4F8] flex flex-col h-screen overflow-hidden">
          <div className="w-full max-w-3xl mx-auto flex flex-col h-full p-6 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <CollapseNavButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              {isFlowTask && <Workflow className="h-5 w-5 text-blue-600" />}
            </div>
            <TaskWorkMain 
              task={taskState} 
              onUpdateTask={handleUpdateTask} 
              onToggleSubtask={handleToggleSubtask} 
              onAddSubtask={handleAddSubtask} 
              onRemoveSubtask={handleRemoveSubtask} 
              onOpenSidebarMobile={() => setSidebarOpen(true)} 
              onGenerateSteps={handleGenerateSteps} 
              isGenerating={isGenerating} 
              focusedSubtaskIdx={focusedSubtaskIdx} 
              onFocusSubtask={handleFocusSubtask} 
              onUpdateSubtask={handleUpdateSubtask} 
              onOpenSubtask={handleOpenSubtask} 
              isFlowTask={isFlowTask} 
            />
          </div>
        </main>
        <aside className="h-screen flex flex-col bg-white overflow-hidden shadow-none border-l" style={{ width: '420px', minWidth: '420px', maxWidth: '420px' }}>
          <TaskWorkSidebar 
            open={sidebarOpen} 
            onOpenChange={setSidebarOpen} 
            selectedTab={selectedTab} 
            setSelectedTab={setSelectedTab} 
            comments={taskState.comments} 
            addComment={handleAddComment} 
            commentValue={commentValue} 
            setCommentValue={setCommentValue} 
            taskId={taskState.id} 
            taskTitle={taskState.title} 
            taskDescription={taskState.description} 
            subtasks={taskState.subtasks} 
            currentSubtaskIndex={focusedSubtaskIdx !== null ? focusedSubtaskIdx : 0} 
            onSubtaskComplete={handleToggleSubtask} 
            onSubtaskSelect={handleFocusSubtask} 
            onGenerateSteps={handleGenerateSteps} 
            taskData={taskState.data} 
            isFlowTask={isFlowTask} 
          />
        </aside>
      </div>
      {subtaskDialogIdx !== null && dialogSubtask && (
        <SubtaskDialog 
          open={subtaskDialogIdx !== null} 
          onClose={handleCloseSubtask} 
          subtask={dialogSubtask} 
          onUpdate={(field, value) => {
            if (subtaskDialogIdx !== null) {
              handleUpdateSubtask(field as any, value);
            }
          }} 
          onToggleComplete={() => {
            if (subtaskDialogIdx !== null) {
              handleToggleSubtask(subtaskDialogIdx);
            }
          }} 
          jarvioWorkLog={undefined}
          jarvioCompletedAt={undefined}
          userWorkLog={[]}
          comments={[]}
          isFlowStep={isFlowTask} 
        />
      )}
    </MainLayout>
  );
}
