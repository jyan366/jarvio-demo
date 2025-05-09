
import React, { useState } from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { send, save } from "lucide-react";

export function SendEmailConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [email, setEmail] = useState(config.emailAddress || "");
  
  const handleSave = () => {
    updateToolConfig(toolId, { emailAddress: email });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Set the default email address for this agent to send reports and updates to.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <send className="h-4 w-4" />
          <span>Default Recipient</span>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="flex-1"
          />
          <Button onClick={handleSave}>
            <save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          The agent will use this email address when sending automated reports.
        </p>
      </div>
    </div>
  );
}
