
import React from "react";
import { Button } from "@/components/ui/button";
import { List, Edit } from "lucide-react";

interface TaskWorkSubtasksProps {
  subtasks: { title: string }[];
  setSubtasks: (subs: { title: string }[]) => void;
}

export const TaskWorkSubtasks: React.FC<TaskWorkSubtasksProps> = ({
  subtasks,
  setSubtasks,
}) => (
  <div className="mb-0">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-base">Subtasks</h3>
      <Button variant="outline" className="h-8 text-xs px-3 py-1 whitespace-nowrap">+ Add Subtask</Button>
    </div>
    <div className="space-y-2">
      {subtasks.map((sub, idx) => (
        <div
          key={idx}
          className="flex items-center border rounded-lg px-2 py-2 bg-white group hover:bg-gray-50"
        >
          <span className="text-gray-300 cursor-move pr-2">
            <List className="w-4 h-4" />
          </span>
          <span className="flex-1 text-sm">{sub.title}</span>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);
