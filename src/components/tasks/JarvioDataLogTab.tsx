
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
  comments?: { user: string; text: string; ago: string; subtaskId?: string }[];
}

export const JarvioDataLogTab: React.FC<JarvioDataLogTabProps> = ({
  subtasks,
  subtaskData,
  activeSubtaskIdx,
  comments = [],
}) => {
  const subtask = subtasks[activeSubtaskIdx];
  if (!subtask) return <div className="text-gray-500 p-4 text-sm">No subtask selected.</div>;

  const data = subtaskData[subtask.id];
  
  // Split the AI's result into Jarvio work log and user work log sections
  let jarvioWorkLog = "";
  let userWorkLog = "";

  if (data?.result) {
    // Extract "COLLECTED DATA:" section if present
    const aiMatch = data.result.match(/COLLECTED DATA:\s*([\s\S]+?)(?=(USER WORK LOG:|$))/i);
    jarvioWorkLog = aiMatch?.[1]?.trim() || "";

    // If no explicit COLLECTED DATA section, use the whole result
    if (!jarvioWorkLog && data.result) {
      jarvioWorkLog = data.result.trim();
    }

    // Extract any "USER WORK LOG:" section
    const userMatch = data.result.match(/USER WORK LOG:\s*([\s\S]+)/i);
    userWorkLog = userMatch?.[1]?.trim() || "";
  }

  // Also allow user work log to show manually added user confirmations/comments
  const commentsForThisSubtask = Array.isArray(comments)
    ? comments.filter(
        (c) => (c.subtaskId === subtask.id || c.subtaskId === undefined) && c.user !== "jarvio"
      )
    : [];

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-2">{subtask.title}</h3>
      
      {/* Jarvio Work Log (AI Output) */}
      <div className="w-full mb-4">
        <p className="text-xs font-medium text-green-700 mb-1">Jarvio Work Log (AI Output)</p>
        {jarvioWorkLog ? (
          <pre className="text-xs bg-green-50 border border-green-200 rounded px-3 py-2 whitespace-pre-wrap max-h-[220px] overflow-auto">{jarvioWorkLog}</pre>
        ) : (
          <div className="italic text-zinc-400 p-2 text-xs w-full">No Jarvio work log for this step yet.</div>
        )}
      </div>
      
      {/* User Work Log (User confirmations / actions) */}
      <div className="w-full mb-2">
        <p className="text-xs font-medium text-blue-700 mb-1">User Work Log (Actions/Inputs)</p>
        {/* Show user work log from AI result or comments */}
        {userWorkLog ? (
          <pre className="text-xs bg-blue-50 border border-blue-200 rounded px-3 py-2 whitespace-pre-wrap max-h-[120px] overflow-auto">{userWorkLog}</pre>
        ) : commentsForThisSubtask.length > 0 ? (
          <ul className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
            {commentsForThisSubtask.map((c, i) => (
              <li key={i}>
                <span className="font-semibold text-xs text-blue-900">{c.user[0]?.toUpperCase()}: </span>
                <span className="text-xs text-blue-900">{c.text}</span>
                <div className="text-[10px] text-right text-blue-500">{c.ago}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="italic text-blue-400 p-2 text-xs w-full">
            No user work log entries for this step yet.
          </div>
        )}
      </div>
      
      {/* Completed at info */}
      {data?.completedAt && (
        <p className="text-[10px] text-green-500 mt-2 w-full text-right">
          Completed: {new Date(data.completedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};
