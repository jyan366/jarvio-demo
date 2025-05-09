
import React, { useState } from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react"; // Fixed capitalization

export function UploadSheetConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [sheetFormat, setSheetFormat] = useState(config.sheetFormat || '');
  const [columnNames, setColumnNames] = useState(config.columnNames || '');
  
  const handleSave = () => {
    updateToolConfig(toolId, {
      sheetFormat,
      columnNames,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Upload className="h-5 w-5 text-blue-600" /> {/* Fixed capitalization */}
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Sheet Upload Requirements</h3>
            <p className="text-sm text-blue-700 mt-1">
              Supported formats: Excel (.xlsx), CSV (.csv), Google Sheets URL
            </p>
            <div className="mt-3 text-xs text-blue-600 space-y-1">
              <p>• Maximum file size: 10MB</p>
              <p>• Requires header row with column names</p>
              <p>• Sheet must contain product data organized in rows</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="sheetFormat">Expected Sheet Format</Label>
          <Textarea
            id="sheetFormat"
            value={sheetFormat}
            onChange={(e) => setSheetFormat(e.target.value)}
            placeholder="Describe the expected format of the sheet (optional)"
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="columnNames">Required Column Names</Label>
          <Textarea
            id="columnNames"
            value={columnNames}
            onChange={(e) => setColumnNames(e.target.value)}
            placeholder="List required column names, separated by commas (optional)"
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1">If specified, the agent will validate that these columns exist</p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
