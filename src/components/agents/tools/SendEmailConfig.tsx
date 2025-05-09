
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { ToolConfigProps } from "./toolConfigs";

export function SendEmailConfig({ toolId }: ToolConfigProps) {
  const { getToolConfig, updateToolConfig } = useAgentSettings();
  const config = getToolConfig(toolId);
  
  const [emailAddress, setEmailAddress] = useState(config.emailAddress || "");
  const [emailRecipients, setEmailRecipients] = useState(config.emailRecipients || "");
  const [emailSubject, setEmailSubject] = useState(config.emailSubject || "");
  const [emailTemplate, setEmailTemplate] = useState(config.emailTemplate || "");

  const handleSave = () => {
    updateToolConfig(toolId, {
      emailAddress,
      emailRecipients,
      emailSubject,
      emailTemplate
    });
  };
  
  const insertVariable = (variable: string) => {
    const textArea = document.getElementById("email-template") as HTMLTextAreaElement;
    if (!textArea) return;
    
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    setEmailTemplate(before + `{${variable}}` + after);
    textArea.focus();
    
    // Set cursor position after the inserted variable
    setTimeout(() => {
      textArea.selectionStart = textArea.selectionEnd = start + variable.length + 2;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="from-email">From Email Address</Label>
        <Input
          id="from-email"
          placeholder="your-email@example.com"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to-email">Recipient(s)</Label>
        <Input
          id="to-email"
          placeholder="recipient1@example.com, recipient2@example.com"
          value={emailRecipients}
          onChange={(e) => setEmailRecipients(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Separate multiple recipients with commas</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject Line</Label>
        <Input
          id="email-subject" 
          placeholder="Weekly Sales Report"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="email-template">Email Template</Label>
          <div className="flex flex-wrap gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => insertVariable("product_name")} 
              type="button"
            >
              &#123;product_name&#125;
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => insertVariable("sales_data")} 
              type="button"
            >
              &#123;sales_data&#125;
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => insertVariable("date")} 
              type="button"
            >
              &#123;date&#125;
            </Button>
          </div>
        </div>
        <Textarea
          id="email-template"
          placeholder="Hello Team,

Here is the weekly sales report for {product_name}. 

{sales_data}

Report generated on {date}.

Best regards,
Your name"
          rows={8}
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Use variables like {"{product_name}"}, {"{sales_data}"}, and {"{date}"} that will be replaced with actual data
        </p>
      </div>
      
      <Button type="button" onClick={handleSave} className="w-full">
        Save Email Configuration
      </Button>
    </div>
  );
}
