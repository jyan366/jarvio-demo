import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash, Save } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
}
interface TaskWorkSubtasksProps {
  subtasks: Subtask[];
  onToggleSubtask: (idx: number) => void;
  onAddSubtask: (val: string) => void;
  onRemoveSubtask: (idx: number) => void;
  focusedSubtaskIdx: number | null;
  onFocusSubtask: (idx: number) => void;
}

export const TaskWorkSubtasks: React.FC<TaskWorkSubtasksProps> = ({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  focusedSubtaskIdx,
  onFocusSubtask,
}) => {
  const [newSubtask, setNewSubtask] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftSubTitle, setDraftSubTitle] = useState("");

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setDraftSubTitle(subtasks[idx].title);
  };
  const handleSaveEdit = (idx: number) => {
    if (draftSubTitle.trim()) {
      // trigger external update since main task state is managed up
      subtasks[idx].title = draftSubTitle;
    }
    setEditingIdx(null);
  };

  return (
    <div className="mb-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">Subtasks</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newSubtask.trim()) {
              onAddSubtask(newSubtask);
              setNewSubtask("");
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Add subtask..."
            className="h-8 px-2 rounded border text-xs w-36"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
          />
          <Button type="submit" variant="outline" className="h-8 text-xs px-3 py-1 whitespace-nowrap">
            + Add
          </Button>
        </form>
      </div>
      <div className="space-y-2">
        {subtasks.map((sub, idx) => (
          <div
            key={sub.id || idx}
            className={`flex items-center border rounded-lg px-2 py-2 bg-white group hover:bg-gray-50 ${sub.done ? "opacity-50" : ""} ${focusedSubtaskIdx===idx ? 'ring-2 ring-purple-400' : ''}`}
            tabIndex={0}
            onClick={() => onFocusSubtask(idx)}
            role="button"
          >
            <Button
              variant={sub.done ? "default" : "outline"}
              size="icon"
              className="mr-2"
              onClick={e => {e.stopPropagation(); onToggleSubtask(idx);}}
              aria-label={sub.done ? "Mark incomplete" : "Mark complete"}
            >
              {sub.done ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border rounded-full"></div>}
            </Button>
            <span className={`flex-1 text-sm truncate ${sub.done ? "line-through text-gray-400" : ""}`}>
              {sub.title}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="opacity-60 hover:text-red-600 transition"
                onClick={e => {e.stopPropagation(); onRemoveSubtask(idx);}}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
