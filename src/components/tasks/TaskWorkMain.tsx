
import React from "react";
import { TaskWorkHeader } from "./TaskWorkHeader";
import { TaskWorkProductCard } from "./TaskWorkProductCard";
import { TaskWorkSubtasks } from "./TaskWorkSubtasks";
import { TaskWorkType, Subtask, Product } from "@/pages/TaskWork";

interface TaskWorkMainProps {
  task: TaskWorkType;
  onUpdateTask: (field: keyof TaskWorkType, value: any) => void;
  onToggleSubtask: (i: number) => void;
  onAddSubtask: (val: string) => void;
  onRemoveSubtask: (i: number) => void;
  onOpenSidebarMobile: () => void;
}

export const TaskWorkMain: React.FC<TaskWorkMainProps> = ({
  task,
  onUpdateTask,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  onOpenSidebarMobile,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Header with editable props */}
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

      {/* Product Preview - compact */}
      {task.products && task.products[0] && (
        <div className="mb-1">
          <h3 className="font-semibold text-base mb-2">Products</h3>
          <TaskWorkProductCard product={task.products[0]} />
        </div>
      )}

      {/* Actionable subtasks */}
      <div className="mt-2">
        <TaskWorkSubtasks
          subtasks={task.subtasks}
          onToggleSubtask={onToggleSubtask}
          onAddSubtask={onAddSubtask}
          onRemoveSubtask={onRemoveSubtask}
        />
      </div>
    </div>
  );
};
