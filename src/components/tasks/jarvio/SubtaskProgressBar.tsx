
import React from "react";

interface SubtaskProgressBarProps {
  completed: number;
  total: number;
}

export const SubtaskProgressBar: React.FC<SubtaskProgressBarProps> = ({ completed, total }) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="px-4 py-2 border-b">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="font-medium">Progress</span>
        <span>{completed} of {total} steps</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
