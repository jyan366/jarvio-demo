import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Upload, 
  Database, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Globe, 
  Users, 
  FileText,
  Brain,
  BarChart3,
  Eye,
  Zap,
  Send,
  User,
  Bot,
  Sheet,
  FileSpreadsheet,
  Star,
  ShoppingCart,
  CheckSquare,
  Download,
  ExternalLink
} from 'lucide-react';

// Block data with updated logo URLs
const allBlocksData = {
  collect: [
    {
      name: 'Amazon Sales Summary',
      summary: 'Pull daily or weekly sales data across your ASINs.',
      description: 'This block fetches your Amazon sales over a defined period and makes it available for use in later blocks.',
      icon: ShoppingCart,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Inventory Summary',
      summary: 'Retrieve current stock levels and restock alerts.',
      description: 'This block gathers inventory levels from Amazon, including fulfilment and restock suggestions.',
      icon: Database,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Listing Summary',
      summary: 'Extract titles, bullets, images, and descriptions for your listings.',
      description: 'Pull full listing content from Amazon, useful for analysis or audits.',
      icon: FileText,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Customer Reviews Summary',
      summary: 'Collect recent Amazon reviews by ASIN.',
      description: 'Scrapes and summarises the latest customer reviews across your ASINs, with optional rating filters.',
      icon: Star,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Shopify Product Pages',
      summary: 'Scrape product content from a Shopify storefront.',
      description: 'Provide a link to your Shopify store and scrape visible product content (no API access needed).',
      icon: Globe,
      logo: '/lovable-uploads/ea403407-f5cf-46bf-95f8-906adf37082f.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Competitor Amazon Listings',
      summary: 'Get competitor pricing and product info from Amazon.',
      description: 'Add competitor ASINs or URLs to fetch details such as price, title, image count, and bullet structure.',
      icon: Search,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Link Google Sheet',
      summary: 'Link a live Google Sheet for use in your workflows.',
      description: 'Connect your Google account to pull data from a specified sheet.',
      icon: Sheet,
      logo: '/lovable-uploads/7ac8edf9-3963-4a29-a547-0f62ea731c5e.png',
      needsConnection: true,
      connectionService: 'Google Sheets'
    },
    {
      name: 'Upload Sheet',
      summary: 'Upload a CSV or Excel file into Jarvio.',
      description: 'This block allows manual uploading of performance data or customer lists in spreadsheet format.',
      icon: Upload,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Website',
      summary: 'Extract data from any public webpage.',
      description: 'Add a URL and optional selector. Jarvio will scrape the page content for later use.',
      icon: Globe,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Pull ClickUp Tasks',
      summary: 'Pull tasks from your ClickUp workspace.',
      description: 'Connect your ClickUp account to retrieve tasks based on filters like tag or status.',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    }
  ],
  think: [
    {
      name: 'AI Analysis',
      summary: 'Use natural language to request specific insights from your data.',
      description: 'Provide instructions like "show ASINs with high sales but low reviews" and Jarvio will generate the answer.',
      icon: Brain,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Estimate ASIN Sales',
      summary: 'Estimate sales volume for any ASIN.',
      description: 'Enter any Amazon ASIN to estimate its monthly unit sales using our proprietary algorithm.',
      icon: TrendingUp,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Listing Quality Audit',
      summary: 'Score your listings based on SEO and content best practices.',
      description: 'Analyses title length, bullet coverage, image count, A+ content, and backend keywords for each ASIN.',
      icon: Eye,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Review Sentiment Analysis',
      summary: 'Summarise sentiment from recent 1–3 star reviews.',
      description: 'Jarvio identifies trends and recurring complaints across negative customer feedback.',
      icon: MessageSquare,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Summary Message',
      summary: 'Turn raw data into a digestible summary.',
      description: 'This block transforms input data (like a sales summary) into a clear written message for reporting or action.',
      icon: FileText,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    }
  ],
  act: [
    {
      name: 'Slack Message from Jarvio',
      summary: 'Send a message to Slack automatically.',
      description: 'Jarvio will send a message (e.g. summary, alert) to your specified Slack channel.',
      icon: MessageSquare,
      logo: '/lovable-uploads/77701ad2-d0ba-4b86-829f-87f39dcf8d9d.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Slack Message (sent by user)',
      summary: 'Compose and send a manual Slack message.',
      description: 'Enter message text and channel for Jarvio to send on your behalf.',
      icon: MessageSquare,
      logo: '/lovable-uploads/77701ad2-d0ba-4b86-829f-87f39dcf8d9d.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Send Email',
      summary: 'Email insights or alerts to your team.',
      description: 'Choose recipients and link data from earlier blocks to send it via email.',
      icon: Mail,
      logo: '/lovable-uploads/9875ceed-bfd6-465c-9a73-375563737cac.png',
      needsConnection: true,
      connectionService: 'Email'
    },
    {
      name: 'Create ClickUp Task',
      summary: 'Automatically generate a task in ClickUp.',
      description: 'Connect ClickUp to automatically create tasks based on block triggers (e.g. bad reviews).',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    },
    {
      name: 'Create Jarvio Task',
      summary: 'Create a task within Jarvio.',
      description: 'Add title, description, and optionally link to an insight to track tasks inside Jarvio.',
      icon: User,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create PDF',
      summary: 'Turn any report or message into a downloadable PDF.',
      description: 'Choose what to export (e.g. sales summary or listing audit) and generate a branded PDF file.',
      icon: Download,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Word',
      summary: 'Export formatted content to a .docx file.',
      description: 'Same as PDF, but outputs a Word-compatible format.',
      icon: FileText,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Excel Sheet',
      summary: 'Export structured data into an Excel file.',
      description: 'Select block output to be formatted as a spreadsheet (e.g. inventory table).',
      icon: FileSpreadsheet,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Push to Amazon',
      summary: 'Update product content or pricing on Amazon.',
      description: 'Choose what to update (e.g. title, price, image) and confirm before publishing to Amazon via API.',
      icon: Upload,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    }
  ]
};

export function MyBlocksSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('collect');
  const [activeBlocks, setActiveBlocks] = useState<Record<string, boolean>>({
    'Upload Sheet': true,
    'AI Analysis': true,
    'Send Email': true,
    'Create PDF': true
  });
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    'Google Sheets': false,
    'ClickUp': false,
    'Slack': false,
    'Gmail': false
  });

  // Get filtered blocks based on category and search
  const getFilteredBlocks = () => {
    const categoryBlocks = allBlocksData[selectedCategory as keyof typeof allBlocksData] || [];
    return categoryBlocks.filter(block =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleBlockClick = (block: any) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  const handleServiceConnection = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: true
    }));
  };

  const handleActivateBlock = (blockName: string) => {
    setActiveBlocks(prev => ({
      ...prev,
      [blockName]: true
    }));
    setIsModalOpen(false);
  };

  const categories = [
    { id: 'collect', name: 'Collect', description: 'Retrieves data from Amazon, scraped sites, or files' },
    { id: 'think', name: 'Think', description: 'Interprets data using AI or logic' },
    { id: 'act', name: 'Act', description: 'Performs an action like messaging, updating listings, or creating tasks' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collect': return 'bg-blue-500';
      case 'think': return 'bg-purple-500';
      case 'act': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredBlocks = getFilteredBlocks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Blocks</h2>
          <p className="text-muted-foreground mt-1">
            Most used tools and integrations for your flows
          </p>
        </div>
      </div>

      {/* Categories - horizontal above search */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.id)}`} />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="max-w-md">
          <Input 
            placeholder="Search blocks..." 
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blocks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => {
          const IconComponent = block.icon;
          
          return (
            <Card 
              key={block.name} 
              className="transition-all duration-200 hover:shadow-md border border-gray-200 bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {block.logo ? (
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                          <img 
                            src={block.logo} 
                            alt={`${block.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                          <IconComponent className="h-7 w-7 text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium text-gray-900">
                        {block.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    onClick={() => handleBlockClick(block)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-4 line-clamp-2">
                  {block.summary}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(selectedCategory)}`} />
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedCategory}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                    onClick={() => handleBlockClick(block)}
                  >
                    Learn more
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBlocks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blocks found matching your search.</p>
        </div>
      )}

      {/* Block Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedBlock && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  {selectedBlock.logo ? (
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                      <img 
                        src={selectedBlock.logo} 
                        alt={`${selectedBlock.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                      <selectedBlock.icon className="h-7 w-7 text-gray-700" />
                    </div>
                  )}
                  <span>{selectedBlock.name}</span>
                </DialogTitle>
                <DialogDescription className="mt-4">
                  {selectedBlock.description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6">
                {selectedBlock.needsConnection && !connectedServices[selectedBlock.connectionService] ? (
                  <Button 
                    onClick={() => handleServiceConnection(selectedBlock.connectionService)}
                    className="w-full"
                  >
                    Connect {selectedBlock.connectionService}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleActivateBlock(selectedBlock.name)}
                    className="w-full"
                  >
                    Activate Block
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
