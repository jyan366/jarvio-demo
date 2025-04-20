
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TaskWorkSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "comments" | "ai";
  setSelectedTab: (v: "comments" | "ai") => void;
  comments: { user: string; text: string; ago: string }[];
  addComment: (t: string) => void;
  commentValue: string;
  setCommentValue: (v: string) => void;
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
}) => {
  // Make the sidebar fixed height and the input pinned to the bottom
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
        md:shadow-sm max-w-full md:max-w-[380px] xl:max-w-[420px] h-full md:h-screen`}
        style={{
          minWidth: open ? 320 : 0,
          maxWidth: open ? 420 : undefined,
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

        <div className="flex mb-3">
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
        {selectedTab === "comments" ? (
          <div className="flex flex-col h-full min-h-0 max-h-full">
            <div className="mb-2 text-xs font-bold text-muted-foreground tracking-[1px]">
              COMMENTS ({comments.length})
            </div>
            <div className="flex-1 overflow-y-auto pr-1 mb-3 min-h-0">
              {comments.map((c, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="bg-zinc-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm text-zinc-700">
                    {c.user[0]?.toUpperCase() ?? "U"}
                  </span>
                  <div>
                    <span className="text-sm text-zinc-800">{c.text}</span>
                    <div className="text-gray-400 text-xs">{c.ago}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Comment - always pinned at bottom */}
            <form
              className="mt-auto flex border rounded-lg overflow-hidden bg-white sticky bottom-0"
              style={{ zIndex: 1 }}
              onSubmit={(e) => {
                e.preventDefault();
                addComment(commentValue);
              }}
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 outline-none text-sm"
                placeholder="Add a comment..."
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                disabled={false}
              />
              <Button
                size="icon"
                variant="ghost"
                type="submit"
                className="rounded-none"
                aria-label="Send"
                disabled={!commentValue.trim()}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M22 2 11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m22 2-7 20-4-9-9-4 20-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-sm text-muted-foreground min-h-[180px]">
            {/* AI Assistant placeholder */}
            <span className="pb-6 pt-6">AI assistant coming soon!</span>
          </div>
        )}
      </aside>
    </>
  );
};
