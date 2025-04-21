
import React from "react";
import { Check } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";

interface SubtaskStepperProps {
  subtasks: Subtask[];
  currentSubtaskIdx: number;
  activeSubtaskIdx: number;
  onSubtaskClick: (idx: number) => void;
}

export const SubtaskStepper: React.FC<SubtaskStepperProps> = ({
  subtasks,
  currentSubtaskIdx,
  activeSubtaskIdx,
  onSubtaskClick,
}) => (
  <div className="border-b overflow-x-auto sticky top-[53px] bg-white z-10">
    <div className="flex py-1 px-2">
      {subtasks.map((subtask, idx) => (
        <button
          key={subtask.id}
          onClick={() => onSubtaskClick(idx)}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-full mr-1 flex items-center gap-1 transition-colors
            ${idx === activeSubtaskIdx ? 'bg-purple-100 text-purple-800' : ''}
            ${subtask.done || idx < currentSubtaskIdx || idx === currentSubtaskIdx ? 'hover:bg-purple-50' : 'opacity-60 cursor-not-allowed'}
          `}
          disabled={!subtask.done && idx > currentSubtaskIdx}
        >
          {subtask.done && <Check size={12} />}
          {idx + 1}. {subtask.title.substring(0, 20)}{subtask.title.length > 20 ? '...' : ''}
        </button>
      ))}
    </div>
  </div>
);
