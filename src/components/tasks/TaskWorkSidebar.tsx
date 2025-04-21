
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
  selectedTab: "comments" | "ai";
  setSelectedTab: (v: "comments" | "ai") => void;
  comments: { user: string; text: string; ago: string }[];
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
        className={`bg-white border rounded-xl flex flex-col shadow-sm relative transition-all
        w-full md:w-auto md:relative fixed md:static top-0 right-0 z-50
        ${open ? "translate-x-0" : "translate-x-full"} md:translate-x-0
        md:shadow-sm max-w-full md:max-w-[380px] xl:max-w-[420px] h-[100vh]`}
        style={{
          minWidth: open ? 320 : 0,
          maxWidth: open ? 420 : undefined,
          height: "100vh",
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

        {/* Tabs header at the top (always visible) */}
        <div className="flex p-4 border-b bg-white sticky top-0 z-20">
          <button
            className={`${
              selectedTab === "comments"
                ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0]"
                : "text-gray-400 border-b-2 border-transparent"
            } px-2 py-1 mr-3 text-base transition`}
            onClick={() => setSelectedTab("comments")}
          >
            Comments
          </button>
          <button
            className={`${
              selectedTab === "ai"
                ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0]"
                : "text-gray-400 border-b-2 border-transparent"
            } px-2 py-1 text-base transition`}
            onClick={() => setSelectedTab("ai")}
          >
            AI Assistant
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Inner scrollable area */}
          <div className="flex-1 overflow-y-auto h-0 min-h-0">
            {selectedTab === "comments" ? (
              <>
                <div className="px-4 py-2 text-xs font-bold text-muted-foreground tracking-[1px]">
                  COMMENTS ({comments.length})
                </div>
                {/* Comments area with ScrollArea to handle overflow */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pr-2">
                    {comments.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="bg-zinc-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm text-zinc-700 mt-0.5 flex-shrink-0">
                          {c.user[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-zinc-800 break-words">{c.text}</div>
                          <div className="text-gray-400 text-xs">{c.ago}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {/* Add Comment - always at the bottom of the sidebar */}
                <div className="p-4 pt-2 border-t mt-auto bg-white sticky bottom-0 z-20">
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
                      placeholder="Add a comment..."
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
              </>
            ) : (
              <JarvioAssistant
                taskId={taskId}
                taskTitle={taskTitle}
                taskDescription={taskDescription}
                subtasks={subtasks}
                currentSubtaskIndex={currentSubtaskIndex}
                onSubtaskComplete={onSubtaskComplete}
                onSubtaskSelect={onSubtaskSelect}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
