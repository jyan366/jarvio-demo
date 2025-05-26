
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const isConnected = selectedBlock.needsConnection ? connectedServices[selectedBlock.connectionService!] ?? true : true;
  const isActivated = true; // Default to activated

  // Get the current category for this block
  const getCurrentCategory = () => {
    // This is a simple way to determine category - in a real app you might pass this as a prop
    if (selectedBlock.name.includes('Amazon') || selectedBlock.name.includes('Scrape') || selectedBlock.name.includes('Google Sheet') || selectedBlock.name.includes('Upload') || selectedBlock.name.includes('ClickUp') || selectedBlock.name.includes('Pull from Amazon')) {
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
      case 'Pull ClickUp Tasks':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Connect your ClickUp account to retrieve tasks, projects, and team data from your workspace with customizable filters.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Task titles, descriptions, and status
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Assignees and due dates
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Project and folder organization
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom fields and tags
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Time tracking and estimates
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Task attachments and all related data
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Filters Available:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Task status and priority
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Assigned team members
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Due date ranges
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tags and custom fields
                </li>
              </ul>
            </div>
          </div>;
      // ... keep existing code (other Amazon and scraping blocks)
      case 'Pull from Amazon':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              We've already connected to your Amazon Seller Central account. Now you can access any SP-API endpoint directly - just enter the endpoint URL and test your queries in real-time.
            </p>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">1</span>
                  Enter any SP-API endpoint URL (e.g., /orders/v0/orders)
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">2</span>
                  Configure your request parameters and filters
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">3</span>
                  Test your query and see the data in real-time
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">4</span>
                  Use the data in your workflow or share new discoveries with us
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Endpoints to Try:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /orders/v0/orders - Order data and fulfillment details
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /fba/inventory/v1/summaries - FBA inventory levels
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /catalog/v0/items - Product catalog information
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Technical users who know exactly what data they need
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Exploring new data sources before we build dedicated blocks
                </li>
              </ul>
            </div>
          </div>;
      case 'Amazon Sales Summary':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Pull comprehensive Amazon sales data over a defined period for analysis and reporting.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Total sales revenue by period
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Unit sales and order counts
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Conversion rates and session data
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Performance by ASIN or account-wide
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Revenue trends and growth metrics
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Options:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Filter by specific ASINs or pull all listings
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Daily, weekly, or monthly reporting periods
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Date range selection
                </li>
              </ul>
            </div>
          </div>;
      case 'Amazon Inventory Summary':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Get real-time inventory levels and automated restock recommendations from Amazon Seller Central.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Current FBA and FBM stock levels
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Inbound shipment quantities
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Reserved and stranded inventory
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sales velocity calculations
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Restock recommendations with lead times
                </li>
              </ul>
            </div>
          </div>;
      case 'Amazon Listing Summary':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Extract complete listing content from Amazon for optimization and competitive analysis.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product titles and descriptions
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bullet points and key features
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A+ content and enhanced content
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Backend keywords and search terms
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product images and media
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Current pricing information
                </li>
              </ul>
            </div>
          </div>;
      case 'Amazon Customer Reviews Summary':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Collect and analyze customer reviews from Amazon product pages for sentiment analysis.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Review text and ratings (1-5 stars)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Reviewer information and verification status
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Review dates and helpful votes
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Review images and videos
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Filters Available:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Star rating (1-5 star reviews)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Date range selection
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Verified purchase only
                </li>
              </ul>
            </div>
          </div>;
      case 'Scrape Shopify Product Pages':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Extract product information from any public Shopify store without requiring API access.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product titles and descriptions
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pricing and variant information
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product images and media
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Inventory availability status
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product tags and categories
                </li>
              </ul>
            </div>
          </div>;
      case 'Scrape Competitor Amazon Listings':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Monitor competitor products by providing their ASINs or Amazon URLs for competitive intelligence.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Current pricing and price changes
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Title optimization and structure
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bullet point content and formatting
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Image count and A+ content presence
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Review counts and average ratings
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Best Seller Rank information
                </li>
              </ul>
            </div>
          </div>;
      case 'Link Google Sheet':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Connect your Google account to access live data from any Google Sheet in your workflows.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  All sheet data in real-time
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Specific ranges and cells
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Multiple sheets from one workbook
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Formatted data including formulas
                </li>
              </ul>
            </div>
          </div>;
      case 'Upload Sheet':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Upload spreadsheet files containing your data for use in workflows and analysis.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Supported Formats:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  CSV files
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Excel files (.xlsx, .xls)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Google Sheets exports
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Types:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product lists and inventory data
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Keyword research and SEO data
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sales reports and analytics
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Customer information
                </li>
              </ul>
            </div>
          </div>;
      case 'Scrape Website':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Extract specific content from any publicly accessible website using URLs and CSS selectors.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Retrieved:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product information and pricing
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Blog content and articles
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Structured data from tables
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Any visible webpage content
                </li>
              </ul>
            </div>
          </div>;
      default:
        return <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {selectedBlock.description}
            </p>
          </div>;
    }
  };

  // ... keep existing code (renderThinkBlockContent and renderActBlockContent functions)
  const renderThinkBlockContent = () => {
    switch (selectedBlock.name) {
      case 'AI Analysis':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Leverage advanced AI to analyze your data using natural language queries and generate detailed insights, trends, and actionable recommendations.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Input:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Any structured data (sales, inventory, reviews, etc.)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Natural language query describing what you want to discover
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compatible Collect Blocks:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon Sales Summary
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon Inventory Summary
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Upload Sheet
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Link Google Sheet
                </li>
              </ul>
            </div>
          </div>;
      case 'Estimate ASIN Sales':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Analyze any Amazon ASIN to estimate monthly unit sales, revenue, and market performance using proprietary algorithms and category benchmarks.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Input:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  List of ASINs to analyze
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon marketplace (US, UK, etc.)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compatible Collect Blocks:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Scrape Competitor Amazon Listings (provides ASINs)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Upload Sheet (with ASIN column)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Link Google Sheet (with ASIN data)
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                <em>Without these blocks, you'll need to manually input the ASINs to analyze.</em>
              </p>
            </div>
          </div>;
      case 'Listing Quality Audit':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Comprehensive audit that scores your Amazon listings across optimization factors with specific recommendations for improvement.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Input:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon listing content (titles, bullets, descriptions, images)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  ASINs to audit
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compatible Collect Blocks:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon Listing Summary (provides complete listing content)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Scrape Competitor Amazon Listings (for competitive benchmarking)
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                <em>Without these blocks, you'll need to manually provide listing content and ASINs.</em>
              </p>
            </div>
          </div>;
      case 'Review Sentiment Analysis':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Advanced sentiment analysis that processes customer reviews to identify recurring themes, product issues, and improvement opportunities.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Input:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Customer review text and ratings
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Product ASINs for context
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compatible Collect Blocks:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon Customer Reviews Summary (provides review data)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Upload Sheet (with review data export)
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                <em>Without these blocks, you'll need to manually input review text and product information.</em>
              </p>
            </div>
          </div>;
      case 'Summary Message':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Transform complex data sets and analysis results into clear, professional summaries tailored for different audiences.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Input:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data from previous workflow blocks
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Target audience specification (executives, team, etc.)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compatible Collect Blocks:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Any data collection block (sales, inventory, reviews, etc.)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Results from other Think blocks for deeper insights
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                <em>This block works best when placed after other analysis blocks in your workflow.</em>
              </p>
            </div>
          </div>;
      default:
        return <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {selectedBlock.description}
            </p>
          </div>;
    }
  };

  const renderActBlockContent = () => {
    switch (selectedBlock.name) {
      case 'ClickUp Action':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Create and manage items in your ClickUp workspace based on workflow triggers and data insights.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Available Actions:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Create Folder:</strong> Add a new folder to a space
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Create List:</strong> Add a new list to a folder
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Create Task:</strong> Create a new task
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Add Comment:</strong> Add a new comment to a task
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Delete Task:</strong> Delete a task from your workspace
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Update Task:</strong> Update a task in ClickUp
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Push to Amazon':
        return <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              We've already connected to your Amazon Seller Central account. Now you can access any SP-API endpoint directly - just enter the endpoint URL and update your listings in real-time.
            </p>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">1</span>
                  Enter any SP-API endpoint URL (e.g., /listings/2021-08-01/items)
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">2</span>
                  Configure your request parameters and filters
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">3</span>
                  Test your update and preview changes before publishing
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">4</span>
                  Execute the update and share new discoveries with us
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Endpoints to Try:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /listings/2021-08-01/items - Update listing content and attributes
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /fba/inventory/v1/summaries - Update FBA inventory levels
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /listings/2021-08-01/items/{"{sku}"}/images - Upload product images
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Technical users who know exactly what updates they need
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Exploring new update capabilities before we build dedicated blocks
                </li>
              </ul>
            </div>
          </div>;
      case 'Slack Message from Jarvio':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Automatically send formatted messages, alerts, and reports to designated Slack channels or direct messages.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Rich formatting and mentions
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data visualizations and attachments
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Automated notifications and alerts
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Slack Message (sent by user)':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Create and send custom Slack messages with your approval before sending.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Human oversight before sending
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom message composition
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Channel and recipient selection
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Send Email':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Send professional emails with insights, reports, and alerts to team members and stakeholders.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Rich HTML formatting
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data tables and charts
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  File attachments
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Create Jarvio Task':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Generate internal tasks within the Jarvio platform for tracking follow-up actions and optimization opportunities.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Detailed descriptions and priority levels
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Due dates and accountability tracking
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Links to related insights and data
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Create PDF':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Generate professional, branded PDF documents from your workflow data and analysis results.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional branding and templates
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data visualizations and tables
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom layouts and formatting
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Create Word':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Generate Microsoft Word-compatible documents with professional formatting, tables, and charts.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom templates and formatting
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Headers, footers, and consistent styling
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Editable in Microsoft Word
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Create Excel Sheet':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Export your workflow data into fully-formatted Excel spreadsheets with multiple sheets and advanced features.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Multiple sheets and formulas
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Charts and pivot tables
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Conditional formatting and data validation
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {selectedBlock.description}
            </p>
          </div>
        );
    }
  };

  const renderBlockContent = () => {
    if (currentCategory === 'collect') {
      return renderCollectBlockContent();
    } else if (currentCategory === 'think') {
      return renderThinkBlockContent();
    } else {
      return renderActBlockContent();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {selectedBlock.logo ? <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center p-4">
                  <img src={selectedBlock.logo} alt={`${selectedBlock.name} logo`} className="w-full h-full object-contain" />
                </div> : <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                  <selectedBlock.icon className="h-10 w-10 text-gray-700" />
                </div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedBlock.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {(selectedBlock.name === 'Pull from Amazon' || selectedBlock.name === 'Push to Amazon') && <Badge variant="purple" className="flex-shrink-0">
                      Nerd Mode
                    </Badge>}
                  <Badge variant="default" className="bg-gray-900 text-white flex-shrink-0">
                    <Check className="w-3 h-3 mr-1" />
                    Activated
                  </Badge>
                </div>
              </div>
              <DialogDescription className="text-gray-500">
                {selectedBlock.summary}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {renderBlockContent()}
        </div>

        <DialogFooter className="pt-6 border-t">
          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 h-11" disabled>
              <Check className="w-4 h-4 mr-2" />
              Connected
            </Button>
            <Button className="flex-1 h-11 bg-gray-900 hover:bg-gray-800" disabled>
              <Check className="w-4 h-4 mr-2" />
              Activated
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
