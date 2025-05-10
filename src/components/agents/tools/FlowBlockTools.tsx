
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';

// Upload Sheet Tool Configuration
export const UploadSheetConfig: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const handleFileUpload = () => {
    // In a real implementation, this would trigger a file upload dialog
    // For demo purposes, we'll simulate a file upload
    setFileUploaded(true);
    setFileName('sample_data.xlsx');
  };
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {!fileUploaded ? (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag & drop your file here, or click to browse
            </p>
            <Button onClick={handleFileUpload} className="mt-4">
              Select File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">{fileName}</span>
              <Button variant="outline" size="sm" onClick={() => setFileUploaded(false)}>
                Change
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">File is ready for processing when the flow runs.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Scrape Sheet Tool Configuration
export const ScrapeSheetConfig: React.FC = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sheet-url">Sheet URL</Label>
          <Input 
            id="sheet-url"
            placeholder="https://docs.google.com/spreadsheets/d/..." 
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL of the Google Sheet or Excel file you want to scrape. 
            Make sure the sheet is publicly accessible or has sharing enabled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Email Parsing Configuration
export const EmailParsingConfig: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState('');
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-address">Email Address to Parse</Label>
          <Input 
            id="email-address"
            placeholder="inbox@yourdomain.com" 
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the email address from which you want to parse messages. 
            Make sure you have connected this mailbox in your settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// AI Summary Configuration
export const AISummaryConfig: React.FC = () => {
  const [template, setTemplate] = useState('report');
  const [promptTemplate, setPromptTemplate] = useState('');
  
  const templates = {
    report: "Create a comprehensive report summarizing the key findings from the data, highlighting important trends, outliers, and actionable insights.",
    bullets: "Generate a bullet point list of the most important insights from the data, focusing on actionable items.",
    comparison: "Compare the current data with previous periods and highlight significant changes, improvements, and areas of concern."
  };
  
  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    setPromptTemplate(templates[value as keyof typeof templates]);
  };
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Summary Template</Label>
          <Tabs value={template} onValueChange={handleTemplateChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="bullets">Bullet Points</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 space-y-2">
            <Label htmlFor="prompt-template">Customize AI Prompt</Label>
            <Textarea 
              id="prompt-template"
              placeholder="Enter custom instructions for the AI..." 
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Customize how the AI will summarize your data. Be specific about what insights you're looking for.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Send Email Configuration
export const SendEmailConfig: React.FC = () => {
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('basic');
  
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-recipients">Recipients</Label>
          <Input 
            id="email-recipients"
            placeholder="email@example.com, another@example.com" 
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-subject">Subject</Label>
          <Input 
            id="email-subject"
            placeholder="Weekly Report: [Date]" 
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Email Template</Label>
          <Tabs value={emailTemplate} onValueChange={setEmailTemplate} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="alert">Alert</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground mt-2">
            Select a template for your email. The content will be generated based on the flow's results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Factory function to get the right configuration component
export const getFlowBlockConfigComponent = (blockType: string, blockOption: string): React.FC | null => {
  const configMap: Record<string, Record<string, React.FC>> = {
    collect: {
      'Upload Sheet': UploadSheetConfig,
      'Scrape Sheet': ScrapeSheetConfig,
      'Email Parsing': EmailParsingConfig
    },
    act: {
      'AI Summary': AISummaryConfig,
      'Send Email': SendEmailConfig
    }
  };
  
  return configMap[blockType]?.[blockOption] || null;
};
