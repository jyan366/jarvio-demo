
export interface ToolConfigProps {
  toolId: string;
}

export type ToolConfig = {
  // Upload Sheet config
  fileUploaded?: boolean;
  fileName?: string;
  
  // Scrape Sheet config
  sheetUrl?: string;
  
  // Email Parsing config
  emailParsing?: boolean;
  parsingEmailAddress?: string; // Renamed from emailAddress to avoid conflict
  
  // AI Summary config
  promptTemplate?: string;
  
  // Send Email config
  emailAddress?: string;
  emailRecipients?: string;
  emailSubject?: string;
  emailTemplate?: string;
};
