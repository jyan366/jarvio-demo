
import React from "react";
import { JarvioDataLog } from "./JarvioDataLog";
import { Subtask } from "@/pages/TaskWorkContainer";

interface SubtaskData {
  result: string;
  completed: boolean;
  completedAt?: string;
}
type SubtaskDataMap = {
  [subtaskId: string]: SubtaskData;
};

interface JarvioDataLogTabProps {
  subtasks: Subtask[];
  subtaskData: SubtaskDataMap;
  activeSubtaskIdx: number;
}

export const JarvioDataLogTab: React.FC<JarvioDataLogTabProps> = ({
  subtasks,
  subtaskData,
  activeSubtaskIdx,
}) => {
  const subtask = subtasks[activeSubtaskIdx];
  if (!subtask) return <div className="text-gray-500 p-4 text-sm">No subtask selected.</div>;
  
  const data = subtaskData[subtask.id];
  
  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-2">{subtask.title}</h3>
      <JarvioDataLog result={data?.result} completedAt={data?.completedAt} />
    </div>
  );
};
