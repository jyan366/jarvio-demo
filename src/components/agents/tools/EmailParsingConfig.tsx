
import React, { useState } from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Mail } from "lucide-react";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmailParsingConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [parsingEmailAddress, setParsingEmailAddress] = useState(config.parsingEmailAddress || "parse@jarvio.io");
  
  const handleSave = () => {
    updateToolConfig(toolId, {
      emailParsing: true,
      parsingEmailAddress
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md border border-blue-100">
        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Email Parsing Enabled
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Forward your emails to <strong>{parsingEmailAddress}</strong> and this agent will process them automatically.
          </p>
          <p className="text-xs text-blue-600 mt-3">
            Always include the agent name in the subject line for accurate routing.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parsing-email">Email Address for Parsing</Label>
        <div className="flex gap-2">
          <Input
            id="parsing-email"
            value={parsingEmailAddress}
            onChange={(e) => setParsingEmailAddress(e.target.value)}
            placeholder="parse@jarvio.io"
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
