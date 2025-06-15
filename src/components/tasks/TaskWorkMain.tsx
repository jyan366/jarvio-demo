
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
        title: isFlowTask ? "Step created" : "Subtask created",
        description: isFlowTask 
          ? "The insight has been converted to a flow step." 
          : "The insight has been converted to a subtask.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: isFlowTask 
          ? "Failed to create step from insight."
          : "Failed to create subtask from insight.",
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
        isFlowTask={isFlowTask}
      />
      
      <TaskInsights
        insights={task.insights || []}
        onDismissInsight={handleDismissInsight}
        onConvertToSubtask={handleConvertToSubtask}
        onAddComment={handleAddComment}
      />

      {!isFlowTask && (
        <div className="flex gap-4 items-center mb-1">
          <Button
            variant="outline"
            onClick={onGenerateSteps}
            disabled={isGenerating}
            className="text-xs"
          >
            {isGenerating && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Generate steps
          </Button>
          <span className="text-neutral-400 text-xs">Break down this task</span>
        </div>
      )}

      {task.products && task.products[0] && (
        <div className="mb-1">
          <h3 className="font-semibold text-base mb-2">Products</h3>
          <TaskWorkProductCard product={task.products[0]} />
        </div>
      )}

      <div className="mt-2">
        {isFlowTask ? (
          <FlowStepsEditor
            steps={flowSteps}
            blocks={flowBlocks}
            onStepsChange={onUpdateFlowSteps || (() => {})}
            onBlocksChange={onUpdateFlowBlocks || (() => {})}
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
              status: task.status,
              priority: task.priority,
              category: task.category,
              date: task.date,
              task_type: 'flow',
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
