
import React, { useState } from "react";
import { ToolConfigProps } from "./toolConfigs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Textarea } from "@/components/ui/textarea";
import { Send, Save } from "lucide-react";

export function SendEmailConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [emailRecipients, setEmailRecipients] = useState(config.emailRecipients || "");
  const [emailSubject, setEmailSubject] = useState(config.emailSubject || "");
  const [emailTemplate, setEmailTemplate] = useState(config.emailTemplate || "");
  
  const handleSave = () => {
    updateToolConfig(toolId, {
      emailRecipients,
      emailSubject,
      emailTemplate
    });
  };
  
  const handleSendTest = () => {
    // Test email functionality
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Send className="h-5 w-5 text-purple-600" />
        <h3 className="font-medium">Email Configuration</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipients</label>
          <Input 
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
            placeholder="email@example.com, otheremail@example.com"
          />
          <p className="text-xs text-muted-foreground mt-1">Separate multiple emails with commas</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Subject Line</label>
          <Input 
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email Template</label>
          <Textarea 
            value={emailTemplate}
            onChange={(e) => setEmailTemplate(e.target.value)}
            rows={6}
            className="mb-1"
            placeholder="Enter your email template. Use {{variables}} for dynamic content."
          />
          <p className="text-xs text-muted-foreground">Use &#123;&#123;variables&#125;&#125; as placeholders for dynamic content</p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button onClick={handleSendTest} variant="outline" className="gap-1">
            <Send className="h-4 w-4" />
            Test Email
          </Button>
          <Button onClick={handleSave} className="gap-1 bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
