
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FlowBlock } from '@/types/flowTypes';
import { Database, Brain, Zap, User, Play, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockConfigDialogProps {
  block: FlowBlock | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlockConfigDialog({ block, isOpen, onClose }: BlockConfigDialogProps) {
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  if (!block) return null;

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
        return <User className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200';
      case 'think':
        return 'bg-purple-50 border-purple-200';
      case 'act':
        return 'bg-green-50 border-green-200';
      case 'agent':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBlockDetails = (option: string) => {
    const blockDetails: Record<string, { description: string; parameters: string[]; testData?: any }> = {
      'All Listing Info': {
        description: 'Fetches comprehensive listing information including titles, descriptions, prices, and performance metrics from Amazon.',
        parameters: ['Marketplace', 'Date Range', 'ASIN Filter', 'Include Images'],
        testData: { marketplace: 'US', dateRange: '30 days', asinFilter: 'All', includeImages: true }
      },
      'Send Email': {
        description: 'Sends automated emails with customizable templates and dynamic content insertion.',
        parameters: ['Recipients', 'Subject Template', 'Email Template', 'Attachments'],
        testData: { recipients: 'test@example.com', subject: 'Test Subject', template: 'Test Template' }
      },
      'Basic AI Analysis': {
        description: 'Performs intelligent analysis on data using AI to identify patterns, trends, and insights.',
        parameters: ['Analysis Type', 'Data Fields', 'Output Format', 'Confidence Threshold'],
        testData: { analysisType: 'Pattern Recognition', dataFields: 'Sales Data', outputFormat: 'Summary' }
      },
      'AI Summary': {
        description: 'Generates comprehensive summaries of data using AI with customizable output formats.',
        parameters: ['Summary Length', 'Focus Areas', 'Output Format', 'Language'],
        testData: { summaryLength: 'Medium', focusAreas: 'Key Insights', outputFormat: 'Text', language: 'English' }
      },
      'Get Keywords': {
        description: 'Research and gather relevant keywords for your products and market analysis.',
        parameters: ['Product Category', 'Search Volume', 'Competition Level', 'Keyword Count'],
        testData: { category: 'Electronics', searchVolume: 'High', competition: 'Medium', count: 50 }
      },
      'User Text': {
        description: 'Gather custom input and instructions from you to proceed with the task.',
        parameters: ['Input Type', 'Required Fields', 'Validation Rules', 'Default Values'],
        testData: { inputType: 'Text', requiredFields: 'Product Name', validation: 'Not Empty' }
      },
      'Upload Sheet': {
        description: 'Process uploaded spreadsheets and extract data for analysis.',
        parameters: ['File Format', 'Sheet Name', 'Column Mapping', 'Data Validation'],
        testData: { format: 'Excel', sheetName: 'Products', columns: 'Auto-detect', validation: 'Standard' }
      }
    };

    return blockDetails[option] || {
      description: `Execute the ${option} operation with configured parameters.`,
      parameters: ['Configuration Required'],
      testData: {}
    };
  };

  const handleTestBlock = async () => {
    setIsTesting(true);
    
    try {
      // Simulate API call to test the block
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Block Test Successful",
        description: `${block.option} block executed successfully with test data.`,
      });
      
      console.log(`Testing ${block.option} block with configuration:`, getBlockDetails(block.option).testData);
      
    } catch (error) {
      console.error('Block test failed:', error);
      toast({
        title: "Block Test Failed",
        description: "The block test encountered an error. Please check the configuration.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const blockDetails = getBlockDetails(block.option);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Block Configuration: {block.option}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg border ${getBlockColor(block.type)}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize text-xs">
                  {block.type}
                </Badge>
                <span className="text-sm font-medium">{block.option}</span>
              </div>
              
              <Button
                onClick={handleTestBlock}
                disabled={isTesting}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Block
                  </>
                )}
              </Button>
            </div>
            
            <div>
              <Label className="text-xs font-medium">Block Name</Label>
              <Input 
                value={block.name} 
                readOnly 
                className="text-sm bg-white/50 mt-1" 
              />
            </div>

            <div>
              <Label className="text-xs font-medium">Description</Label>
              <Textarea 
                value={blockDetails.description}
                readOnly 
                className="text-xs bg-white/50 min-h-[60px] mt-1" 
              />
            </div>
            
            {block.agentId && block.agentName && (
              <div>
                <Label className="text-xs font-medium">Selected Agent</Label>
                <Input 
                  value={block.agentName} 
                  readOnly 
                  className="text-sm bg-white/50 mt-1" 
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-medium">Required Parameters</Label>
              <div className="mt-2 space-y-2">
                {blockDetails.parameters.map((param, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {blockDetails.testData && Object.keys(blockDetails.testData).length > 0 && (
              <div>
                <Label className="text-xs font-medium">Test Configuration</Label>
                <div className="mt-2 bg-gray-50 p-3 rounded border text-xs">
                  <pre className="text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(blockDetails.testData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
