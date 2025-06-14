import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JarvioAssistant } from "./JarvioAssistant";
import { Subtask } from "@/pages/TaskWorkContainer";

interface TaskWorkSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "ai" | "comments";
  setSelectedTab: (v: "ai" | "comments") => void;
  comments: { user: string; text: string; ago: string; subtaskId?: string }[];
  addComment: (t: string) => void;
  commentValue: string;
  setCommentValue: (v: string) => void;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  subtasks: Subtask[];
  currentSubtaskIndex: number;
  onSubtaskComplete: (idx: number) => Promise<void>;
  onSubtaskSelect: (idx: number) => void;
  onGenerateSteps?: () => Promise<void>;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
  };
  isFlowTask?: boolean;
}

export const TaskWorkSidebar: React.FC<TaskWorkSidebarProps> = ({
  open,
  onOpenChange,
  selectedTab,
  setSelectedTab,
  comments,
  addComment,
  commentValue,
  setCommentValue,
  taskId,
  taskTitle,
  taskDescription,
  subtasks,
  currentSubtaskIndex,
  onSubtaskComplete,
  onSubtaskSelect,
  onGenerateSteps,
  taskData,
  isFlowTask = false,
}) => {
  // Set AI tab as selected by default for demo purposes
  useEffect(() => {
    setSelectedTab("ai");
  }, []);
  
  const currentSubtask = subtasks[currentSubtaskIndex];
  
  // Filter comments to only show those relevant to the current subtask
  const subtaskComments = comments.filter(comment => {
    // If the comment doesn't have a subtaskId, it's a general comment
    // or if subtaskId matches current subtask's id
    return (!comment.subtaskId || comment.subtaskId === currentSubtask?.id);
  });
  
  const itemLabel = isFlowTask ? "step" : "subtask";
  
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={`flex flex-col h-full w-full md:w-auto
        ${open ? "translate-x-0" : "translate-x-full"} md:translate-x-0
        fixed md:static top-0 right-0 z-50 transition-all`}
        style={{
          height: '100%',
          minWidth: open ? 320 : 0,
        }}
      >
        {/* Close button for mobile */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 md:hidden"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* For the demo, we're removing the tabs and just showing Jarvio Assistant */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-full overflow-hidden">
            <JarvioAssistant
              taskId={taskId}
              taskTitle={taskTitle}
              taskDescription={taskDescription}
              subtasks={subtasks}
              currentSubtaskIndex={currentSubtaskIndex}
              onSubtaskComplete={onSubtaskComplete}
              onSubtaskSelect={onSubtaskSelect}
              onGenerateSteps={onGenerateSteps}
              taskData={taskData}
              isFlowTask={isFlowTask}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
