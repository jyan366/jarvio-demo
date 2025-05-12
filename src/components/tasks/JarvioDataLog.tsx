import React from "react";
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface JarvioDataLogProps {
  result?: string;
  completedAt?: string;
}

export const JarvioDataLog: React.FC<JarvioDataLogProps> = ({ result, completedAt }) => {
  if (!result) {
    return (
      <div className="italic text-zinc-400 p-2 text-xs w-full">
        No work log entries for this step yet.
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-300 rounded-md px-3 py-2 my-2 w-full">
      <p className="text-xs font-semibold text-green-800 mb-1">WORK LOG:</p>
      <div className="bg-white p-3 rounded border border-green-100 overflow-auto max-h-[calc(100vh-300px)]">
        <MarkdownRenderer content={result} className="text-xs text-gray-800" />
      </div>
      {completedAt && (
        <p className="text-[10px] text-right text-green-500 mt-1">
          Completed: {new Date(completedAt).toLocaleString()}
        </p>
      )}
      <p className="text-[10px] text-green-700 mt-2">
        This log shows all results and actions Jarvio has performed or gathered for this step.
      </p>
    </div>
  );
};
