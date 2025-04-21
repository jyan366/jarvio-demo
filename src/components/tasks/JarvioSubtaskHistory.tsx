
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioSubtaskHistoryProps {
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  currentSubtaskIndex: number;
  onSubtaskHistoryClick: (idx: number) => void;
}

export const JarvioSubtaskHistory: React.FC<JarvioSubtaskHistoryProps> = ({
  subtasks,
  activeSubtaskIdx,
  currentSubtaskIndex,
  onSubtaskHistoryClick
}) => {
  const getStepNumber = (idx: number) => (subtasks ? idx + 1 : 1);

  return (
    <div className="border-b overflow-x-auto">
      <ScrollArea className="w-full">
        <div className="flex py-2 px-3 gap-1 min-w-full">
          {subtasks && subtasks.map((subtask, idx) => (
            <button
              key={subtask.id}
              onClick={() => onSubtaskHistoryClick(idx)}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded-full flex items-center gap-1 transition-colors
                ${idx === activeSubtaskIdx ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'hover:bg-gray-100'}
                ${subtask.done ? 'text-green-700 font-medium' : ''}
                ${idx < currentSubtaskIndex || idx === currentSubtaskIndex || subtask.done ? '' : 'opacity-50 cursor-not-allowed'}
              `}
              disabled={!subtask.done && idx > currentSubtaskIndex}
              title={subtask.title}
            >
              {subtask.done && <Check size={12} className="text-green-600" />}
              {getStepNumber(idx)}. {subtask.title.substring(0, 15)}{subtask.title.length > 15 ? '...' : ''}
              {idx === currentSubtaskIndex && !subtask.done && (
                <span className="w-2 h-2 rounded-full bg-blue-500 ml-1 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
