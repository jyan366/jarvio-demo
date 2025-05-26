import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Bot
} from 'lucide-react';
import { flowBlockOptions } from '@/data/flowBlockOptions';

// Define block data with icons and descriptions
const blockData = {
  // Collect blocks
  'User Text': {
    icon: FileText,
    description: 'Collect text input from users for processing',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Upload Sheet': {
    icon: Upload,
    description: 'Upload and process Excel or CSV files',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'All Listing Info': {
    icon: Database,
    description: 'Retrieve comprehensive listing information',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Get Keywords': {
    icon: Search,
    description: 'Extract and analyze relevant keywords',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Estimate Sales': {
    icon: TrendingUp,
    description: 'Calculate sales estimates and projections',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Review Information': {
    icon: MessageSquare,
    description: 'Gather customer reviews and feedback',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Scrape Sheet': {
    icon: Globe,
    description: 'Extract data from web-based spreadsheets',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Seller Account Feedback': {
    icon: Users,
    description: 'Collect seller account performance data',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },
  'Email Parsing': {
    icon: Mail,
    description: 'Parse and extract data from emails',
    category: 'collect',
    color: 'bg-blue-50 border-blue-200'
  },

  // Think blocks
  'Basic AI Analysis': {
    icon: Brain,
    description: 'Perform basic AI-powered data analysis',
    category: 'think',
    color: 'bg-purple-50 border-purple-200'
  },
  'Listing Analysis': {
    icon: Eye,
    description: 'Analyze product listings for optimization',
    category: 'think',
    color: 'bg-purple-50 border-purple-200'
  },
  'Insights Generation': {
    icon: BarChart3,
    description: 'Generate actionable business insights',
    category: 'think',
    color: 'bg-purple-50 border-purple-200'
  },
  'Review Analysis': {
    icon: MessageSquare,
    description: 'Analyze customer reviews for patterns',
    category: 'think',
    color: 'bg-purple-50 border-purple-200'
  },

  // Act blocks
  'AI Summary': {
    icon: FileText,
    description: 'Generate AI-powered summaries and reports',
    category: 'act',
    color: 'bg-green-50 border-green-200'
  },
  'Push to Amazon': {
    icon: Upload,
    description: 'Update Amazon listings and data',
    category: 'act',
    color: 'bg-green-50 border-green-200'
  },
  'Send Email': {
    icon: Send,
    description: 'Send automated email notifications',
    category: 'act',
    color: 'bg-green-50 border-green-200'
  },
  'Human in the Loop': {
    icon: User,
    description: 'Require human review and approval',
    category: 'act',
    color: 'bg-green-50 border-green-200'
  },
  'Agent': {
    icon: Bot,
    description: 'Execute tasks through AI agents',
    category: 'act',
    color: 'bg-green-50 border-green-200'
  }
};

export function MyBlocksSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBlocks, setActiveBlocks] = useState<Record<string, boolean>>({
    // Initialize with some blocks active by default
    'Upload Sheet': true,
    'Basic AI Analysis': true,
    'Send Email': true,
    'AI Summary': true
  });

  // Get all blocks from flowBlockOptions
  const allBlocks = Object.entries(flowBlockOptions).flatMap(([category, blocks]) =>
    blocks.map(block => ({ name: block, category }))
  );

  // Filter blocks based on search term
  const filteredBlocks = allBlocks.filter(block =>
    block.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockToggle = (blockName: string) => {
    setActiveBlocks(prev => ({
      ...prev,
      [blockName]: !prev[blockName]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collect': return 'bg-blue-500';
      case 'think': return 'bg-purple-500';
      case 'act': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

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

      {/* Search bar */}
      <div className="max-w-md">
        <Input 
          placeholder="Search blocks..." 
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Blocks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => {
          const blockInfo = blockData[block.name as keyof typeof blockData];
          const IconComponent = blockInfo?.icon || FileText;
          const isActive = activeBlocks[block.name] || false;
          
          return (
            <Card 
              key={block.name} 
              className={`transition-all duration-200 hover:shadow-md ${
                blockInfo?.color || 'bg-gray-50 border-gray-200'
              } ${isActive ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium text-gray-900 truncate">
                        {block.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {blockInfo?.description || `${block.category} operation for data processing`}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(block.category)}`} />
                    <Badge variant="secondary" className="text-xs capitalize">
                      {block.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => handleBlockToggle(block.name)}
                    />
                  </div>
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
    </div>
  );
}
