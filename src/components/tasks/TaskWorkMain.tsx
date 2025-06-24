
import React from "react";
import { TaskWorkHeader } from "./TaskWorkHeader";
import { TaskWorkProductCard } from "./TaskWorkProductCard";
import { TaskWorkSubtasks } from "./TaskWorkSubtasks";
import { FlowStepsEditor } from "@/components/jarvi-flows/builder/FlowStepsEditor";
import { TaskInsights } from "./TaskInsights";
import { TaskWorkType, Subtask, TaskInsight } from "@/pages/TaskWorkContainer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FlowStep, FlowBlock } from "@/types/flowTypes";

interface TaskWorkMainProps {
  task: TaskWorkType;
  onUpdateTask: (field: keyof TaskWorkType, value: any) => void;
  onToggleSubtask: (i: number) => void;
  onAddSubtask: (val: string) => void;
  onRemoveSubtask: (i: number) => void;
  onOpenSidebarMobile: () => void;
  onGenerateSteps: () => Promise<void>;
  isGenerating: boolean;
  focusedSubtaskIdx: number | null;
  onFocusSubtask: (idx: number) => void;
  onUpdateSubtask: (field: keyof Subtask, value: any) => void;
  onOpenSubtask: (idx: number) => void;
  isFlowTask?: boolean;
  onUpdateFlowSteps?: (steps: FlowStep[]) => void;
  onUpdateFlowBlocks?: (blocks: FlowBlock[]) => void;
}

export const TaskWorkMain: React.FC<TaskWorkMainProps> = ({
  task,
  onUpdateTask,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  onOpenSidebarMobile,
  onGenerateSteps,
  isGenerating,
  focusedSubtaskIdx,
  onFocusSubtask,
  onUpdateSubtask,
  onOpenSubtask,
  isFlowTask = false,
  onUpdateFlowSteps,
  onUpdateFlowBlocks,
}) => {
  const { toast } = useToast();

  const handleDismissInsight = async (id: string) => {
    toast({
      title: "Insight dismissed",
      description: "The insight has been marked as resolved.",
    });
  };

  const handleConvertToSubtask = async (insight: TaskInsight) => {
    try {
      await onAddSubtask(insight.title);
      toast({
        title: "Step created",
        description: "The insight has been converted to a step.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create step from insight.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = (insight: TaskInsight) => {
    onOpenSidebarMobile();
  };

  // Get flow steps and blocks from task data
  const flowSteps: FlowStep[] = task.data?.flowSteps || [];
  const flowBlocks: FlowBlock[] = task.data?.flowBlocks || [];

  // Determine if this is a flow task (has flow steps or is explicitly marked as flow)
  const hasFlowSteps = flowSteps.length > 0;
  const isActualFlowTask = isFlowTask || hasFlowSteps || task.data?.isFlowTask || task.task_type === 'flow';

  // Handle flow steps update with proper persistence
  const handleFlowStepsChange = async (steps: FlowStep[]) => {
    if (onUpdateFlowSteps) {
      await onUpdateFlowSteps(steps);
      // Removed toast notification for step updates
    }
  };

  // Handle flow blocks update with proper persistence
  const handleFlowBlocksChange = async (blocks: FlowBlock[]) => {
    if (onUpdateFlowBlocks) {
      await onUpdateFlowBlocks(blocks);
      // Removed toast notification for block updates
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <TaskWorkHeader
        title={task.title}
        onTitleChange={(newTitle) => onUpdateTask("title", newTitle)}
        createdAt={task.date}
        description={task.description}
        onDescriptionChange={(desc) => onUpdateTask("description", desc)}
        status={task.status}
        setStatus={(s: string) => onUpdateTask("status", s)}
        priority={task.priority}
        setPriority={(p: string) => onUpdateTask("priority", p)}
        category={task.category}
        setCategory={(c: string) => onUpdateTask("category", c)}
        onOpenSidebarMobile={onOpenSidebarMobile}
        isFlowTask={isActualFlowTask}
      />
      
      <TaskInsights
        insights={task.insights || []}
        onDismissInsight={handleDismissInsight}
        onConvertToSubtask={handleConvertToSubtask}
        onAddComment={handleAddComment}
      />

      {/* Show generate steps button for all tasks */}
      <div className="flex gap-4 items-center mb-1">
        <Button
          variant="outline"
          onClick={onGenerateSteps}
          disabled={isGenerating}
          className="text-xs"
        >
          {isGenerating && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Generate steps with AI
        </Button>
        <span className="text-neutral-400 text-xs">
          {hasFlowSteps ? "Replace current steps" : "Break down this task"}
        </span>
      </div>

      {task.products && task.products[0] && (
        <div className="mb-1">
          <h3 className="font-semibold text-base mb-2">Products</h3>
          <TaskWorkProductCard product={task.products[0]} />
        </div>
      )}

      <div className="mt-2">
        {isActualFlowTask ? (
          <FlowStepsEditor
            steps={flowSteps}
            blocks={flowBlocks}
            onStepsChange={handleFlowStepsChange}
            onBlocksChange={handleFlowBlocksChange}
            availableBlockOptions={{
              collect: ['User Text', 'File Upload', 'Data Import', 'Form Input'],
              think: ['Basic AI Analysis', 'Advanced Reasoning', 'Data Processing', 'Pattern Recognition'],
              act: ['AI Summary', 'Send Email', 'Create Report', 'Update Database', 'API Call'],
              agent: ['Agent']
            }}
            task={{
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status as "Not Started" | "In Progress" | "Done",
              priority: task.priority as "HIGH" | "MEDIUM" | "LOW" | "CRITICAL",
              category: task.category,
              date: task.date,
              task_type: 'flow',
              user_id: "00000000-0000-0000-0000-000000000000",
              created_at: new Date().toISOString(),
              execution_order: 0,
              steps_completed: task.data?.steps_completed || [],
              data: task.data
            }}
          />
        ) : (
          <TaskWorkSubtasks
            subtasks={task.subtasks}
            onToggleSubtask={onToggleSubtask}
            onAddSubtask={onAddSubtask}
            onRemoveSubtask={onRemoveSubtask}
            focusedSubtaskIdx={focusedSubtaskIdx}
            onFocusSubtask={onFocusSubtask}
            onOpenSubtask={onOpenSubtask}
          />
        )}
      </div>
    </div>
  );
};
