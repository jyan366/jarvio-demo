
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash, ArrowRight } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}

interface TaskWorkSubtasksProps {
  subtasks: Subtask[];
  onToggleSubtask: (idx: number) => void;
  onAddSubtask: (val: string) => void;
  onRemoveSubtask: (idx: number) => void;
  focusedSubtaskIdx: number | null;
  onFocusSubtask: (idx: number) => void;
  onOpenSubtask: (idx: number) => void;
}

export const TaskWorkSubtasks: React.FC<TaskWorkSubtasksProps> = ({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  focusedSubtaskIdx,
  onFocusSubtask,
  onOpenSubtask,
}) => {
  const [newSubtask, setNewSubtask] = useState("");

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
            className={`flex items-center border rounded-lg px-3 py-3 bg-white group cursor-pointer transition 
              ${focusedSubtaskIdx === idx ? "ring-2 ring-purple-400 border-purple-400" : "border-gray-200"}
              hover:bg-gray-50 ${sub.done ? "opacity-60" : ""}`}
            tabIndex={0}
            onClick={() => onFocusSubtask(idx)}
            role="button"
            style={{ minHeight: 64 }}
          >
            <Button
              variant={sub.done ? "default" : "outline"}
              size="icon"
              className="mr-3"
              onClick={e => { e.stopPropagation(); onToggleSubtask(idx); }}
              aria-label={sub.done ? "Mark incomplete" : "Mark complete"}
            >
              {sub.done ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border rounded-full"></div>}
            </Button>
            <div className="flex-1 min-w-0">
              <span className={`text-base font-medium ${sub.done ? "line-through text-gray-400" : ""}`}>
                {sub.title}
              </span>
              {sub.description ? (
                <div className="text-sm text-gray-500 mt-1">
                  {sub.description}
                </div>
              ) : (
                <div className="text-sm italic text-gray-300 mt-1">
                  No description
                </div>
              )}
            </div>
            <div className="flex gap-1 ml-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="opacity-70 hover:text-purple-800"
                onClick={e => { e.stopPropagation(); onOpenSubtask(idx); }}
                aria-label="Open subtask full page"
                title="Open details"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="opacity-60 hover:text-red-600 transition"
                onClick={e => { e.stopPropagation(); onRemoveSubtask(idx); }}
                aria-label="Delete subtask"
                title="Delete"
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
