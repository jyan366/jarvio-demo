
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
        className={`h-full flex flex-col overflow-hidden bg-white ${
          immersive
            ? "fixed top-0 right-0 bottom-0 left-auto w-full max-w-none min-w-0 border-0"
            : "h-[calc(100vh-4rem)] w-full"
        }`}
        style={{
          maxWidth: immersive ? "100%" : "420px",
          minWidth: immersive ? "0" : "320px",
          margin: 0,
          padding: 0,
          borderLeft: immersive ? "none" : "1.5px solid #F4F4F8",
          height: "100vh",
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

        {/* Tabs pinned/sticky to top */}
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

        {selectedTab === "comments" ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-5 py-2 text-xs font-bold text-muted-foreground tracking-[1px]">
              COMMENTS ({comments.length})
            </div>
            {/* ScrollArea panel filling available vertical space */}
            <ScrollArea className="flex-1 px-5 pb-24">
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
            {/* Dock message input to the bottom */}
            <div className="p-4 w-full border-t bg-white fixed bottom-0 right-0 left-auto md:left-auto z-10">
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
          <div className="flex flex-col flex-1 h-full overflow-hidden">
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
            {/* Dock message input to the bottom */}
            <div className="p-4 w-full border-t bg-white fixed bottom-0 right-0 left-auto md:left-auto z-10">
              <form
                className="flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Textarea
                  className="min-h-24 mb-2 text-sm resize-none"
                  placeholder="Ask Jarvio for help..."
                  value=""
                  readOnly
                />
                <Button type="submit" size="sm" disabled className="ml-auto">
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
