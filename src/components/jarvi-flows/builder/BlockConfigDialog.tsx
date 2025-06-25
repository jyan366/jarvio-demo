
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FlowBlock } from '@/types/flowTypes';
import { Database, Brain, Zap, User } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Block Configuration
          </DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg border ${getBlockColor(block.type)}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize text-xs">
                {block.type}
              </Badge>
              <span className="text-sm font-medium">{block.option}</span>
            </div>
            
            <div>
              <Label className="text-xs">Block Name</Label>
              <Input 
                value={block.name} 
                readOnly 
                className="text-sm bg-white/50" 
              />
            </div>
            
            {block.agentId && block.agentName && (
              <div>
                <Label className="text-xs">Selected Agent</Label>
                <Input 
                  value={block.agentName} 
                  readOnly 
                  className="text-sm bg-white/50" 
                />
              </div>
            )}
            
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea 
                value={`This ${block.type} block will ${block.name.toLowerCase()}`}
                readOnly 
                className="text-xs bg-white/50 min-h-[60px]" 
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
