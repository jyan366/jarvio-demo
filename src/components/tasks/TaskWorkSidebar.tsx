
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JarvioAssistant } from "./JarvioAssistant";
import { Subtask } from "@/pages/TaskWork";

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
  immersive?: boolean;
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
  immersive = false,
}) => {
  const sidebarWidth = "420px";
  
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`flex flex-col bg-white ${
          immersive
            ? "fixed top-0 right-0 bottom-0 z-20"
            : "h-full"
        }`}
        style={{
          width: immersive ? sidebarWidth : "100%",
          maxWidth: immersive ? sidebarWidth : "100%",
          minWidth: immersive ? sidebarWidth : undefined,
          borderLeft: !immersive ? undefined : "1.5px solid #F4F4F8",
          height: immersive ? "100vh" : "100%",
        }}
      >
        {/* Close button for mobile */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 md:hidden ${immersive ? "!hidden" : ""}`}
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full min-h-0 flex-1">
          {/* Tabs pinned/sticky to top with NO gap */}
          <div className="flex w-full z-10 sticky top-0 bg-white border-b">
            <button
              className={`${
                selectedTab === "comments"
                  ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0] bg-white"
                  : "text-gray-400 border-b-2 border-transparent"
              } px-5 py-3 text-base transition rounded-none flex-1`}
              onClick={() => setSelectedTab("comments")}
            >
              Comments
            </button>
            <button
              className={`${
                selectedTab === "ai"
                  ? "font-semibold border-b-2 border-[#3527A0] text-[#3527A0] bg-white"
                  : "text-gray-400 border-b-2 border-transparent"
              } px-5 py-3 text-base transition rounded-none flex-1`}
              onClick={() => setSelectedTab("ai")}
            >
              AI Assistant
            </button>
          </div>

          {/* Main Sidebar Body, flexes to fill! */}
          <div className="flex flex-col flex-1 relative min-h-0">
            {selectedTab === "comments" ? (
              <div className="flex flex-col h-full max-h-full min-h-0">
                <div className="px-5 py-2 text-xs font-bold text-muted-foreground tracking-[1px]">
                  COMMENTS ({comments.length})
                </div>
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full px-5 pb-24">
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
                </div>
                {/* Add Comment form kept at bottom and contained */}
                <div className="p-4 border-t bg-white">
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
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0 h-full">
                <JarvioAssistant
                  taskId={taskId}
                  taskTitle={taskTitle}
                  taskDescription={taskDescription}
                  subtasks={subtasks}
                  currentSubtaskIndex={currentSubtaskIndex}
                  onSubtaskComplete={onSubtaskComplete}
                  onSubtaskSelect={onSubtaskSelect}
                  immersive={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
