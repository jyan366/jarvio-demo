
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate a descriptive block name based on the block type and option
export function getDescriptiveBlockName(type: string, option: string): string {
  const contextualNaming: Record<string, Record<string, string>> = {
    collect: {
      'User Text': 'Collect Product Details from User',
      'Upload Sheet': 'Import Product Data Spreadsheet',
      'All Listing Info': 'Fetch Complete Amazon Listing Data',
      'Get Keywords': 'Research High-Converting Keywords',
      'Estimate Sales': 'Generate Product Sales Forecast',
      'Review Information': 'Gather Customer Product Reviews',
      'Scrape Sheet': 'Extract Data from Inventory Sheet',
      'Seller Account Feedback': 'Collect Seller Performance Metrics',
      'Email Parsing': 'Extract Data from Supplier Emails'
    },
    think: {
      'Basic AI Analysis': 'Analyze Market Positioning Data',
      'Listing Analysis': 'Identify Listing Optimization Opportunities',
      'Insights Generation': 'Generate Strategic Marketing Insights',
      'Review Analysis': 'Process Customer Feedback Trends'
    },
    act: {
      'AI Summary': 'Create Comprehensive Action Report',
      'Push to Amazon': 'Update Amazon Product Listings',
      'Send Email': 'Distribute Weekly Performance Report',
      'Human in the Loop': 'Request Manager Approval for Changes',
      'Agent': 'Assign Specialized Agent for Task'
    },
    agent: {
      'Agent': 'Use AI Agent for Specialized Task'
    }
  };

  return contextualNaming[type]?.[option] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${option}`;
}
