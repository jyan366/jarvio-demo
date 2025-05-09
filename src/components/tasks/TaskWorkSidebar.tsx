
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JarvioAssistant } from "./JarvioAssistant";
import { Subtask } from "@/pages/TaskWorkContainer";

interface TaskWorkSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "ai"| "comments" ;
  setSelectedTab: (v: "ai | ""comments") => void;
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
}) => {
  const currentSubtask = subtasks[currentSubtaskIndex];
  
  // Filter comments to only show those relevant to the current subtask
  const subtaskComments = comments.filter(comment => {
    // If the comment doesn't have a subtaskId, it's a general comment
    // or if subtaskId matches current subtask's id
    return (!comment.subtaskId || comment.subtaskId === currentSubtask?.id);
  });
  
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

        <div className="flex p-4 border-b">
          <button
            className={`${
              selectedTab === "comments"
                ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0]"
                : "text-gray-400 border-b-2 border-transparent"
            } px-2 py-1 text-base transition`}
            onClick={() => setSelectedTab("comments")}
          >
            Comments
          </button>
          <button
            className={`${
              selectedTab === "ai"
                ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0]"
                : "text-gray-400 border-b-2 border-transparent"
            } px-2 py-1 mr-3 text-base transition`}
            onClick={() => setSelectedTab("ai")}
          >
            AI Assistant
          </button>

        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {selectedTab === "comments" ? (
            <div className="flex flex-col h-full">
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground tracking-[1px] flex justify-between items-center">
                <span>COMMENTS ({subtaskComments.length})</span>
                {currentSubtask && (
                  <span className="text-purple-600 font-semibold">
                    {currentSubtask.title}
                  </span>
                )}
              </div>
              
              {/* Comments area with ScrollArea to handle overflow */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pr-2">
                  {subtaskComments.length > 0 ? (
                    subtaskComments.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="bg-zinc-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm text-zinc-700 mt-0.5 flex-shrink-0">
                          {c.user[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-zinc-800 break-words">{c.text}</div>
                          <div className="text-gray-400 text-xs">{c.ago}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-6">
                      No comments for this subtask
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Add Comment - always at the bottom of the sidebar */}
              <div className="p-4 pt-2 border-t mt-auto bg-white">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (commentValue.trim()) {
                      addComment(commentValue);
                    }
                  }}
                >
                  <Textarea
                    className="min-h-24 mb-2 text-sm resize-none"
                    placeholder={`Add a comment about "${currentSubtask?.title || 'this task'}"...`}
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentValue.trim()}
                    className="ml-auto"
                  >
                    Add Comment
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-hidden">
              <JarvioAssistant
                taskId={taskId}
                taskTitle={taskTitle}
                taskDescription={taskDescription}
                subtasks={subtasks}
                currentSubtaskIndex={currentSubtaskIndex}
                onSubtaskComplete={onSubtaskComplete}
                onSubtaskSelect={onSubtaskSelect}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
