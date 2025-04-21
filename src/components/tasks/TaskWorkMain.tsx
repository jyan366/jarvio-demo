
import React from "react";
import { TaskWorkHeader } from "./TaskWorkHeader";
import { TaskWorkProductCard } from "./TaskWorkProductCard";
import { TaskWorkSubtasks } from "./TaskWorkSubtasks";
import { TaskWorkType, Subtask, Product } from "@/pages/TaskWorkContainer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
}) => {
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
      />
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
      {task.products && task.products[0] && (
        <div className="mb-1">
          <h3 className="font-semibold text-base mb-2">Products</h3>
          <TaskWorkProductCard product={task.products[0]} />
        </div>
      )}
      <div className="mt-2">
        <TaskWorkSubtasks
          subtasks={task.subtasks}
          onToggleSubtask={onToggleSubtask}
          onAddSubtask={onAddSubtask}
          onRemoveSubtask={onRemoveSubtask}
          focusedSubtaskIdx={focusedSubtaskIdx}
          onFocusSubtask={onFocusSubtask}
          onOpenSubtask={onOpenSubtask}
        />
        {/* Hide Subtask Details. To view/edit, use dialog via the popout button */}
      </div>
    </div>
  );
};
