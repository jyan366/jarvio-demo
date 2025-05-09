
import React, { useState } from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { save } from "lucide-react";

export function AiSummaryConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [promptTemplate, setPromptTemplate] = useState(
    config.promptTemplate || "Summarize the data and highlight key insights. Focus on {{aspects}} and include recommendations for next steps."
  );
  
  const handleSave = () => {
    updateToolConfig(toolId, { promptTemplate });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Customize how this agent formats its summary output.
      </p>
      
      <div className="space-y-2">
        <Textarea 
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          rows={4}
          placeholder="Enter your custom summary format instructions..."
          className="w-full"
        />
        
        <p className="text-xs text-muted-foreground">
          Use {"{{"}}variables{"}}"} as placeholders for dynamic content.
        </p>
        
        <Button onClick={handleSave} className="mt-2">
          <save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  );
}
