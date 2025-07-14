import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Settings, Trash2, Check, Link, ChevronDown } from 'lucide-react';
import { FlowStep } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';
import { flowBlockOptions } from '@/data/flowBlockOptions';

interface AgentStepNodeData {
  step: FlowStep;
  isAgent: boolean;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
}

const AgentStepNode = memo(({ data }: NodeProps) => {
  const { step, onStepUpdate, onDelete, onAttachBlock } = data as unknown as AgentStepNodeData;
  const [selectedBlocks, setSelectedBlocks] = React.useState<string[]>([]);

  // Get all available blocks from blocksData
  const allBlocks = React.useMemo(() => {
    const blocks: string[] = [];
    Object.values(blocksData).forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((block: any) => {
          blocks.push(block.name);
        });
      }
    });
    return blocks;
  }, []);

  // Initialize with all blocks selected by default
  React.useEffect(() => {
    if (selectedBlocks.length === 0) {
      setSelectedBlocks(allBlocks);
    }
  }, [allBlocks, selectedBlocks.length]);

  const totalBlockCount = allBlocks.length;
  const selectedCount = selectedBlocks.length;

  const handleBlockToggle = (blockName: string) => {
    setSelectedBlocks(prev => 
      prev.includes(blockName) 
        ? prev.filter(b => b !== blockName)
        : [...prev, blockName]
    );
  };

  const handlePromptChange = (prompt: string) => {
    onStepUpdate({ agentPrompt: prompt });
  };

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '70px' }} 
      />
      
      {/* Floating step name and description above the block */}
      <div className="absolute -top-12 left-0 w-72 space-y-1 mb-2">
        <Input
          placeholder="Step name..."
          value={step.title || ''}
          onChange={(e) => onStepUpdate({ title: e.target.value })}
          className="text-xs h-7 bg-transparent border-none shadow-none p-1 font-medium placeholder:text-gray-400"
        />
        <Input
          placeholder="Step description..."
          value={step.description || ''}
          onChange={(e) => onStepUpdate({ description: e.target.value })}
          className="text-xs h-6 bg-transparent border-none shadow-none p-1 placeholder:text-gray-400"
        />
      </div>
      
      <Card className="w-72 min-h-[120px] transition-all duration-200 bg-purple-50 border-purple-200 hover:bg-purple-100 border-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                  Agent
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Tools dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Tools:</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-8 text-xs border-purple-200 focus:border-purple-300 justify-between"
                  >
                    <span>{selectedCount}/{totalBlockCount} selected</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-64 overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                  <DropdownMenuLabel className="text-xs">Select Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allBlocks.map((blockName) => (
                    <DropdownMenuCheckboxItem
                      key={blockName}
                      checked={selectedBlocks.includes(blockName)}
                      onCheckedChange={() => handleBlockToggle(blockName)}
                      onSelect={(e) => e.preventDefault()}
                      className="text-xs"
                    >
                      {blockName}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* System prompt */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">System prompt:</label>
              <Textarea
                placeholder="Explain what the agent should do..."
                value={step.agentPrompt || ''}
                onChange={(e) => handlePromptChange(e.target.value)}
                className="text-xs min-h-[40px] resize-none border-purple-200 focus:border-purple-300"
              />
            </div>

            {/* Attach Block Option */}
            <div className="pt-2 border-t border-purple-200">
              <Button
                size="sm"
                variant="outline"
                onClick={onAttachBlock}
                className="w-full h-8 text-xs border-purple-200 hover:border-purple-300"
              >
                <Link className="h-3 w-3 mr-1" />
                Attach Block Instead
              </Button>
            </div>

            {/* Step completion indicator */}
            {step.completed && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Check className="w-3 h-3" />
                Completed
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3" 
        style={{ top: '70px' }} 
      />
    </div>
  );
});

AgentStepNode.displayName = 'AgentStepNode';

export { AgentStepNode };