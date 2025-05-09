
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { ToolConfigProps } from "./toolConfigs";
import { Upload } from "lucide-react";

export function UploadSheetConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [fileName, setFileName] = useState(config.fileName || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      updateToolConfig(toolId, {
        fileUploaded: true,
        fileName: file.name
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a spreadsheet file to analyze with this agent.
      </p>
      
      <div className="flex gap-2">
        <Input
          value={fileName}
          readOnly
          placeholder="No file selected"
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv,.xlsx,.xls"
      />
      
      <p className="text-xs text-muted-foreground">
        Accepted formats: .xlsx, .xls, .csv
      </p>
    </div>
  );
}
