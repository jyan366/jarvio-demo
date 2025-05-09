
import React from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Mail } from "lucide-react";

export function EmailParsingConfig({ toolId }: ToolConfigProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md border border-blue-100">
        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Email Parsing Enabled
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Forward your emails to <strong>parse@jarvio.io</strong> and this agent will process them automatically.
          </p>
          <p className="text-xs text-blue-600 mt-3">
            Always include the agent name in the subject line for accurate routing.
          </p>
        </div>
      </div>
    </div>
  );
}
