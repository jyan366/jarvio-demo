
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

      {/* Product Selection - more compact */}
      {task.products && task.products[0] && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-[15px] font-semibold mb-1">
            <span className="bg-[#F1F0FB] text-[#3527A0] font-bold px-2 py-1 rounded mr-1 text-base min-w-[2.2rem] text-center">
              1
            </span>
            <span className="font-semibold text-zinc-700">
              product selected
            </span>
          </div>
          <TaskWorkProductCard product={task.products[0]} />
        </div>
      )}

      {/* Actionable subtasks - more compact spacing */}
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
