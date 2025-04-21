
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";

interface SubtaskDialogProps {
  open: boolean;
  onClose: () => void;
  subtask: Subtask | null;
  onUpdate: (field: keyof Subtask, value: any) => void;
  onToggleComplete: () => void;
}

export const SubtaskDialog: React.FC<SubtaskDialogProps> = ({
  open,
  onClose,
  subtask,
  onUpdate,
  onToggleComplete,
}) => {
  const [commentValue, setCommentValue] = useState("");

  if (!subtask) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              <MessageSquare className="w-4 h-4" /> Comments
            </div>
            <div className="space-y-3 max-h-32 overflow-auto pb-2 pr-1 mb-3">
              {/* We're removing the comments mapping here since it's not in the interface */}
              <div className="text-xs italic text-gray-400">No comments yet.</div>
            </div>
            <form
              className="flex flex-col gap-2"
              onSubmit={e => {
                e.preventDefault();
                if (commentValue.trim()) {
                  // Handle comment submission
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
