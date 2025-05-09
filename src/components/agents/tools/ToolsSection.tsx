
import React from "react";
import { ToolCard } from "./ToolCard";
import { flowBlockOptions } from "@/data/flowBlockOptions";
import { UploadSheetConfig } from "./UploadSheetConfig";
import { ScrapeSheetConfig } from "./ScrapeSheetConfig";
import { EmailParsingConfig } from "./EmailParsingConfig";
import { AiSummaryConfig } from "./AiSummaryConfig";
import { SendEmailConfig } from "./SendEmailConfig";

const blocksToRemove = ['User Text', 'Human in the Loop'];

export function ToolsSection() {
  const renderToolsByCategory = (category: string, title: string) => {
    const tools = flowBlockOptions[category as keyof typeof flowBlockOptions].filter(
      tool => !blocksToRemove.includes(tool)
    );

    return (
      <div className="mb-8">
        <h3 className="font-medium text-md mb-4 pb-2 border-b">{title}</h3>
        {tools.map(toolOption => {
          const toolId = `${category}-${toolOption.toLowerCase().replace(/\s+/g, '-')}`;
          
          let description = "";
          let configComponent = null;
          
          switch (toolOption) {
            case 'Upload Sheet':
              description = "Upload and analyze spreadsheets";
              configComponent = <UploadSheetConfig toolId={toolId} />;
              break;
            case 'Scrape Sheet':
              description = "Connect to external Google Sheets";
              configComponent = <ScrapeSheetConfig toolId={toolId} />;
              break;
            case 'Email Parsing':
              description = "Process information from emails";
              configComponent = <EmailParsingConfig toolId={toolId} />;
              break;
            case 'AI Summary':
              description = "Generate customized AI summaries";
              configComponent = <AiSummaryConfig toolId={toolId} />;
              break;
            case 'Send Email':
              description = "Send automated reports and updates";
              configComponent = <SendEmailConfig toolId={toolId} />;
              break;
            case 'All Listing Info':
              description = "Access complete product listing information";
              break;
            case 'Get Keywords':
              description = "Extract relevant keywords from content";
              break;
            case 'Estimate Sales':
              description = "Predict potential sales performance";
              break;
            case 'Review Information':
              description = "Analyze customer reviews and feedback";
              break;
            case 'Seller Account Feedback':
              description = "Access seller performance metrics";
              break;
            case 'Basic AI Analysis':
              description = "Perform standard AI analysis on data";
              break;
            case 'Listing Analysis':
              description = "Analyze product listings in depth";
              break;
            case 'Insights Generation':
              description = "Generate actionable business insights";
              break;
            case 'Review Analysis':
              description = "Analyze sentiment and trends in reviews";
              break;
            case 'Push to Amazon':
              description = "Publish content to Amazon platform";
              break;
            default:
              description = `${category} tool for agent workflows`;
          }
          
          return (
            <ToolCard
              key={toolId}
              toolId={toolId}
              title={toolOption}
              description={description}
              category={category}
              configComponent={configComponent}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Enable tools that this agent can access and configure their behavior.
      </p>
      
      {renderToolsByCategory('collect', 'Collect Tools')}
      {renderToolsByCategory('think', 'Think Tools')}
      {renderToolsByCategory('act', 'Act Tools')}
    </div>
  );
}
