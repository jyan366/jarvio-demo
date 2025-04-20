
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}

interface Comment {
  user: string;
  text: string;
  ago: string;
}

interface SubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtask: Subtask | null;
  comments: Comment[];
  addComment: (text: string) => void;
}

export const SubtaskDialog: React.FC<SubtaskDialogProps> = ({
  open,
  onOpenChange,
  subtask,
  comments,
  addComment,
}) => {
  const [commentValue, setCommentValue] = useState("");

  if (!subtask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">{subtask.title}</span>
            <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5 font-normal">{subtask.status || "No status"}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Description</p>
            <div className="min-h-[32px] text-sm text-gray-700 bg-gray-50 px-2 py-2 rounded">
              {subtask.description ? (
                subtask.description
              ) : (
                <span className="italic text-gray-400">No description</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="bg-gray-100 rounded px-2 py-0.5 text-xs">{subtask.priority || "No priority"}</div>
            <div className="bg-gray-100 rounded px-2 py-0.5 text-xs">{subtask.category || "No category"}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold mb-2 text-base">
              <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
            </div>
            <div className="space-y-3 max-h-32 overflow-auto pb-2 pr-1 mb-3">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="bg-zinc-100 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs text-zinc-700 mt-0.5 flex-shrink-0">
                    {c.user[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{c.text}</div>
                    <div className="text-xs text-gray-400">{c.ago}</div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-xs italic text-gray-400">No comments yet.</div>
              )}
            </div>
            <form
              className="flex flex-col gap-2"
              onSubmit={e => {
                e.preventDefault();
                if (commentValue.trim()) {
                  addComment(commentValue);
                  setCommentValue("");
                }
              }}
            >
              <textarea
                className="border rounded px-2 py-1 text-sm resize-none min-h-[36px]"
                placeholder="Add a comment..."
                value={commentValue}
                onChange={e => setCommentValue(e.target.value)}
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
        <DialogClose asChild>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
