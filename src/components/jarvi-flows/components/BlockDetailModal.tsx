import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Block } from '../types/blockTypes';

interface BlockDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBlock: Block | null;
  connectedServices: Record<string, boolean>;
  onServiceConnection: (service: string) => void;
  onActivateBlock: (blockName: string) => void;
}

export function BlockDetailModal({
  isOpen,
  onOpenChange,
  selectedBlock,
  connectedServices,
  onServiceConnection,
  onActivateBlock
}: BlockDetailModalProps) {
  if (!selectedBlock) return null;

  // Default everything to connected and activated
  const isConnected = selectedBlock.needsConnection ? 
    (connectedServices[selectedBlock.connectionService!] ?? true) : true;
  const isActivated = true; // Default to activated

  // Get the current category for this block
  const getCurrentCategory = () => {
    // This is a simple way to determine category - in a real app you might pass this as a prop
    if (selectedBlock.name.includes('Amazon') || selectedBlock.name.includes('Scrape') || selectedBlock.name.includes('Google Sheet') || selectedBlock.name.includes('Upload') || selectedBlock.name.includes('ClickUp')) {
      return 'collect';
    }
    if (selectedBlock.name.includes('AI') || selectedBlock.name.includes('Estimate') || selectedBlock.name.includes('Audit') || selectedBlock.name.includes('Sentiment') || selectedBlock.name.includes('Summary')) {
      return 'think';
    }
    return 'act';
  };

  const currentCategory = getCurrentCategory();

  const renderCollectBlockContent = () => {
    switch (selectedBlock.name) {
      case 'Amazon Sales Summary':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Pull comprehensive Amazon sales data over a defined period for analysis and reporting.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total sales revenue by period</li>
                <li>• Unit sales and order counts</li>
                <li>• Conversion rates and session data</li>
                <li>• Performance by ASIN or account-wide</li>
                <li>• Revenue trends and growth metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Options:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filter by specific ASINs or pull all listings</li>
                <li>• Daily, weekly, or monthly reporting periods</li>
                <li>• Date range selection</li>
              </ul>
            </div>
          </div>
        );
      case 'Amazon Inventory Summary':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get real-time inventory levels and automated restock recommendations from Amazon Seller Central.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Current FBA and FBM stock levels</li>
                <li>• Inbound shipment quantities</li>
                <li>• Reserved and stranded inventory</li>
                <li>• Sales velocity calculations</li>
                <li>• Restock recommendations with lead times</li>
              </ul>
            </div>
          </div>
        );
      case 'Amazon Listing Summary':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Extract complete listing content from Amazon for optimization and competitive analysis.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product titles and descriptions</li>
                <li>• Bullet points and key features</li>
                <li>• A+ content and enhanced content</li>
                <li>• Backend keywords and search terms</li>
                <li>• Product images and media</li>
                <li>• Current pricing information</li>
              </ul>
            </div>
          </div>
        );
      case 'Amazon Customer Reviews Summary':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Collect and analyze customer reviews from Amazon product pages for sentiment analysis.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review text and ratings (1-5 stars)</li>
                <li>• Reviewer information and verification status</li>
                <li>• Review dates and helpful votes</li>
                <li>• Review images and videos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Filters Available:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Star rating (1-5 star reviews)</li>
                <li>• Date range selection</li>
                <li>• Verified purchase only</li>
              </ul>
            </div>
          </div>
        );
      case 'Scrape Shopify Product Pages':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Extract product information from any public Shopify store without requiring API access.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product titles and descriptions</li>
                <li>• Pricing and variant information</li>
                <li>• Product images and media</li>
                <li>• Inventory availability status</li>
                <li>• Product tags and categories</li>
              </ul>
            </div>
          </div>
        );
      case 'Scrape Competitor Amazon Listings':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Monitor competitor products by providing their ASINs or Amazon URLs for competitive intelligence.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Current pricing and price changes</li>
                <li>• Title optimization and structure</li>
                <li>• Bullet point content and formatting</li>
                <li>• Image count and A+ content presence</li>
                <li>• Review counts and average ratings</li>
                <li>• Best Seller Rank information</li>
              </ul>
            </div>
          </div>
        );
      case 'Link Google Sheet':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Google account to access live data from any Google Sheet in your workflows.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All sheet data in real-time</li>
                <li>• Specific ranges and cells</li>
                <li>• Multiple sheets from one workbook</li>
                <li>• Formatted data including formulas</li>
              </ul>
            </div>
          </div>
        );
      case 'Upload Sheet':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload spreadsheet files containing your data for use in workflows and analysis.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Supported Formats:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV files</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Google Sheets exports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Types:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product lists and inventory data</li>
                <li>• Keyword research and SEO data</li>
                <li>• Sales reports and analytics</li>
                <li>• Customer information</li>
              </ul>
            </div>
          </div>
        );
      case 'Scrape Website':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Extract specific content from any publicly accessible website using URLs and CSS selectors.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product information and pricing</li>
                <li>• Blog content and articles</li>
                <li>• Structured data from tables</li>
                <li>• Any visible webpage content</li>
              </ul>
            </div>
          </div>
        );
      case 'Pull ClickUp Tasks':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your ClickUp account to retrieve tasks, projects, and team data with customizable filters.
            </p>
            <div>
              <h4 className="font-medium text-sm mb-2">Data Retrieved:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Task titles, descriptions, and status</li>
                <li>• Assignees and due dates</li>
                <li>• Project and folder organization</li>
                <li>• Custom fields and tags</li>
                <li>• Time tracking and estimates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Filters Available:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Task status and priority</li>
                <li>• Assigned team members</li>
                <li>• Due date ranges</li>
                <li>• Tags and custom fields</li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedBlock.description}
            </p>
          </div>
        );
    }
  };

  const renderBlockContent = () => {
    if (currentCategory === 'collect') {
      return renderCollectBlockContent();
    } else {
      // For think and act blocks, keep the paragraph format but make it more readable
      const formatDescription = (description: string) => {
        const sentences = description.split('. ');
        const paragraphs = [];
        
        for (let i = 0; i < sentences.length; i += 2) {
          const paragraph = sentences.slice(i, i + 2).join('. ') + (i + 2 < sentences.length ? '.' : '');
          paragraphs.push(paragraph);
        }
        
        return paragraphs;
      };

      const descriptionParagraphs = formatDescription(selectedBlock.description);

      return (
        <div className="space-y-4">
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="text-sm text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {selectedBlock.logo ? (
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center p-3">
                  <img 
                    src={selectedBlock.logo} 
                    alt={`${selectedBlock.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  <selectedBlock.icon className="h-8 w-8 text-gray-700" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{selectedBlock.name}</span>
                <div className="flex items-center gap-2">
                  {selectedBlock.needsConnection && (
                    <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                      {isConnected ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        'Not Connected'
                      )}
                    </Badge>
                  )}
                  <Badge variant={isActivated ? "default" : "secondary"} className="text-xs">
                    {isActivated ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Activated
                      </>
                    ) : (
                      'Not Activated'
                    )}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedBlock.summary}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {renderBlockContent()}
        </div>

        <DialogFooter className="mt-6 gap-2">
          {selectedBlock.needsConnection && !isConnected ? (
            <>
              <Button 
                variant="outline"
                onClick={() => onServiceConnection(selectedBlock.connectionService!)}
                className="flex-1"
              >
                Connect Account
              </Button>
              <Button 
                onClick={() => onActivateBlock(selectedBlock.name)}
                className="flex-1"
                disabled={!isConnected}
              >
                Activate
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                className="flex-1"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Connected
              </Button>
              <Button 
                className="flex-1"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Activated
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
