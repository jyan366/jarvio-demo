
import React from "react";

interface JarvioDataLogProps {
  result?: string;
  completedAt?: string;
}

export const JarvioDataLog: React.FC<JarvioDataLogProps> = ({ result, completedAt }) => {
  if (!result) {
    return (
      <div className="italic text-zinc-400 p-2 text-xs">
        No collected data for this step yet.
      </div>
    );
  }
  return (
    <div className="bg-green-50 border border-green-300 rounded-md px-3 py-2 my-2">
      <p className="text-xs font-semibold text-green-800 mb-1">COLLECTED DATA:</p>
      <pre className="text-xs text-green-800 whitespace-pre-wrap overflow-auto max-h-36 bg-white p-2 rounded border border-green-100">{result}</pre>
      {completedAt && (
        <p className="text-[10px] text-right text-green-500 mt-1">
          Completed: {new Date(completedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};
