
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FlowBlock } from '@/types/flowTypes';
import { Database, Brain, Zap, User, Mail } from 'lucide-react';

interface BlockConfigDialogProps {
  block: FlowBlock | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlockConfigDialog({ block, isOpen, onClose }: BlockConfigDialogProps) {
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
    const blockDetails: Record<string, { description: string; parameters: string[] }> = {
      'All Listing Info': {
        description: 'Fetches comprehensive listing information including titles, descriptions, prices, and performance metrics from Amazon.',
        parameters: ['Marketplace', 'Date Range', 'ASIN Filter', 'Include Images']
      },
      'Send Email': {
        description: 'Sends automated emails with customizable templates and dynamic content insertion.',
        parameters: ['Recipients', 'Subject Template', 'Email Template', 'Attachments']
      },
      'Basic AI Analysis': {
        description: 'Performs intelligent analysis on data using AI to identify patterns, trends, and insights.',
        parameters: ['Analysis Type', 'Data Fields', 'Output Format', 'Confidence Threshold']
      },
      'AI Summary': {
        description: 'Generates comprehensive summaries of data using AI with customizable output formats.',
        parameters: ['Summary Length', 'Focus Areas', 'Output Format', 'Language']
      }
    };

    return blockDetails[option] || {
      description: `Execute the ${option} operation with configured parameters.`,
      parameters: ['Configuration Required']
    };
  };

  const blockDetails = getBlockDetails(block.option);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Block Configuration: {block.option}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg border ${getBlockColor(block.type)}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize text-xs">
                {block.type}
              </Badge>
              <span className="text-sm font-medium">{block.option}</span>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
