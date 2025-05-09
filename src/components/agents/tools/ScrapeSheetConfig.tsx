
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { ToolConfigProps } from "./toolConfigs";
import { link } from "lucide-react";

export function ScrapeSheetConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [url, setUrl] = useState(config.sheetUrl || "");
  
  const handleSave = () => {
    updateToolConfig(toolId, { sheetUrl: url });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a Google Sheet URL to connect and scrape data.
      </p>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="flex-1"
          />
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <link className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Must be a publicly accessible Google Sheet
          </span>
        </div>
      </div>
    </div>
  );
}
