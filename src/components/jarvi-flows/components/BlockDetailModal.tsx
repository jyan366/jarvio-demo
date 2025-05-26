
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
      case 'Pull from Amazon':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Connect directly to Amazon's SP-API endpoints to pull custom data from your seller account with full flexibility.
            </p>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Configuration Required:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  SP-API endpoint URL (e.g., /orders/v0/orders)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Request parameters and filters
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Amazon marketplace selection
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Popular Endpoints:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /orders/v0/orders - Order data and fulfillment details
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /fba/inventory/v1/summaries - FBA inventory levels
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /catalog/v0/items - Product catalog information
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /finances/v0/financialEvents - Financial transaction data
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  /reports/2021-06-30/reports - Custom report generation
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Flexibility:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Access any data available through Amazon SP-API
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom date ranges and filtering options
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real-time data updates based on your schedule
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Amazon Sales Summary':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Amazon Inventory Summary':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Amazon Listing Summary':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Amazon Customer Reviews Summary':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Scrape Shopify Product Pages':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Scrape Competitor Amazon Listings':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Link Google Sheet':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Upload Sheet':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Scrape Website':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Pull ClickUp Tasks':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Connect your ClickUp account to retrieve tasks, projects, and team data with customizable filters.
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

  const renderThinkBlockContent = () => {
    switch (selectedBlock.name) {
      case 'AI Analysis':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Estimate ASIN Sales':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Listing Quality Audit':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Review Sentiment Analysis':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'Summary Message':
        return (
          <div className="space-y-6">
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
      // For act blocks, keep the paragraph format but make it more readable
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
            <p key={index} className="text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 pr-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {selectedBlock.logo ? (
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={selectedBlock.logo} 
                    alt={`${selectedBlock.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                  <selectedBlock.icon className="h-10 w-10 text-gray-700" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-24">
              <div className="flex items-start justify-between mb-2">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedBlock.name}
                </DialogTitle>
                <div className="flex items-center gap-2 absolute top-4 right-4">
                  {selectedBlock.name === 'Pull from Amazon' && (
                    <Badge variant="purple" className="flex-shrink-0">
                      Nerd Mode
                    </Badge>
                  )}
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
            <Button 
              variant="outline"
              className="flex-1 h-11"
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Connected
            </Button>
            <Button 
              className="flex-1 h-11 bg-gray-900 hover:bg-gray-800"
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Activated
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
