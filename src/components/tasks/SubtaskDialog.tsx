
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";
import { JarvioDataLog } from "./JarvioDataLog";

interface SubtaskDialogProps {
  open: boolean;
  onClose: () => void;
  subtask: Subtask | null;
  onUpdate: (field: keyof Subtask, value: any) => void;
  onToggleComplete: () => void;
  workLog?: string;
  completedAt?: string;
  comments?: { user: string; text: string; ago: string }[];
  onAddComment?: (text: string) => void;
  commentValue?: string;
  setCommentValue?: (v: string) => void;
}

export const SubtaskDialog: React.FC<SubtaskDialogProps> = ({
  open,
  onClose,
  subtask,
  onUpdate,
  onToggleComplete,
  workLog,
  completedAt,
  comments = [],
  onAddComment,
  commentValue = "",
  setCommentValue,
}) => {
  const [localCommentValue, setLocalCommentValue] = React.useState("");
  const handleCommentChange = setCommentValue || setLocalCommentValue;
  const handleCommentValue = setCommentValue ? commentValue : localCommentValue;

  if (!subtask) return null;

  // Accessibility: description id for dialog content
  const descId = "subtask-dialog-desc";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg w-full"
        aria-describedby={descId}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">{subtask.title}</span>
            <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5 font-normal">
              {subtask.status || "No status"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-3" id={descId}>
          {/* WORK LOG section (fully matching work log card style) */}
          <div>
            <p className="text-sm font-medium mb-1">Work Log</p>
            <JarvioDataLog result={workLog} completedAt={completedAt} />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            <div className="min-h-[32px] text-sm text-gray-700 bg-gray-50 px-2 py-2 rounded">
              {subtask.description ? (
                subtask.description
              ) : (
                <span className="italic text-gray-400">No description</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-1">
            <div className="bg-gray-100 rounded px-2 py-0.5 text-xs">
              {subtask.priority || "No priority"}
            </div>
            <div className="bg-gray-100 rounded px-2 py-0.5 text-xs">
              {subtask.category || "No category"}
            </div>
          </div>

          {/* Comments area */}
          <div className="mt-2">
            <div className="flex items-center gap-2 font-semibold mb-2 text-base">
              <MessageSquare className="w-4 h-4" /> Comments
            </div>
            <div className="space-y-3 max-h-32 overflow-auto pb-2 pr-1 mb-3">
              {comments.length > 0 ? (
                comments.map((c, i) => (
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
                <div className="text-xs italic text-gray-400">
                  No comments yet.
                </div>
              )}
            </div>
            {onAddComment && handleCommentChange && (
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (handleCommentValue?.trim()) {
                    onAddComment(handleCommentValue);
                  }
                }}
              >
                <textarea
                  className="border rounded px-2 py-1 text-sm resize-none min-h-[36px]"
                  placeholder="Add a comment..."
                  value={handleCommentValue}
                  onChange={(e) => handleCommentChange(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!handleCommentValue?.trim()}
                  className="ml-auto"
                >
                  Add Comment
                </Button>
              </form>
            )}
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
