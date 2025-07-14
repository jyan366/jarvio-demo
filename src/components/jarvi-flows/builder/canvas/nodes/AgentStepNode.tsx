import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Settings, Trash2, Check, Link, ChevronDown, Unlink, Eye, EyeOff } from 'lucide-react';
import { FlowStep } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';
import { flowBlockOptions } from '@/data/flowBlockOptions';

interface AgentStepNodeData {
  step: FlowStep;
  isAgent: boolean;
  executionState?: 'idle' | 'running' | 'success' | 'failed';
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
}

const AgentStepNode = memo(({ data }: NodeProps) => {
  const { step, executionState = 'idle', onStepUpdate, onDelete, onAttachBlock } = data as unknown as AgentStepNodeData;
  const [selectedBlocks, setSelectedBlocks] = React.useState<string[]>([]);
  const [showToolsView, setShowToolsView] = React.useState(false);
  const isInitialMount = React.useRef(true);
  
  // Get execution state styling
  const getExecutionStateStyle = () => {
    switch (executionState) {
      case 'running':
        return 'bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border-cyan-400 animate-pulse shadow-lg shadow-cyan-500/25';
      case 'success':
        return 'bg-gradient-to-br from-green-950/80 to-emerald-950/80 border-green-400 shadow-lg shadow-green-500/25';
      case 'failed':
        return 'bg-gradient-to-br from-red-950/80 to-rose-950/80 border-red-400 shadow-lg shadow-red-500/25';
      default:
        return 'bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border-purple-500/50 shadow-lg shadow-purple-900/20';
    }
  };
  
  const getExecutionStateIndicator = () => {
    switch (executionState) {
      case 'running':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />;
      case 'success':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
          <Check className="w-2 h-2 text-white" />
        </div>;
      case 'failed':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
          <span className="text-white text-xs font-bold">×</span>
        </div>;
      default:
        return null;
    }
  };

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
    if (isInitialMount.current && allBlocks.length > 0) {
      setSelectedBlocks(allBlocks);
      isInitialMount.current = false;
    }
  }, [allBlocks]);

  const totalBlockCount = allBlocks.length;
  const selectedCount = selectedBlocks.length;

  const handleBlockToggle = (blockName: string) => {
    setSelectedBlocks(prev => 
      prev.includes(blockName) 
        ? prev.filter(b => b !== blockName)
        : [...prev, blockName]
    );
  };

  const handleSelectAll = () => {
    setSelectedBlocks(allBlocks);
  };

  const handleDeselectAll = () => {
    setSelectedBlocks([]);
  };

  const handlePromptChange = (prompt: string) => {
    onStepUpdate({ agentPrompt: prompt });
  };

  // Get block data for selected tools
  const getSelectedToolsData = () => {
    const toolsData = [];
    Object.values(blocksData).forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((block: any) => {
          if (selectedBlocks.includes(block.name)) {
            toolsData.push(block);
          }
        });
      }
    });
    return toolsData;
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
      <div className="absolute -top-16 left-0 w-72 space-y-1 mb-4">
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
      
      <Card className={`w-72 min-h-[120px] transition-all duration-200 hover:bg-purple-100 border-2 relative ${getExecutionStateStyle()}`}>
        {getExecutionStateIndicator()}
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Tools:</label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowToolsView(!showToolsView)}
                  className="h-5 w-5 p-0 text-purple-600 hover:text-purple-700"
                  title={showToolsView ? "Hide tools view" : "Show tools view"}
                >
                  {showToolsView ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
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
                  <div className="px-2 py-1 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSelectAll}
                      className="flex-1 h-6 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDeselectAll}
                      className="flex-1 h-6 text-xs"
                    >
                      Deselect All
                    </Button>
                  </div>
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

            {/* Action buttons */}
            <div className="pt-2 border-t border-purple-200 space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onAttachBlock}
                className="w-full h-8 text-xs border-purple-200 hover:border-purple-300"
              >
                <Link className="h-3 w-3 mr-1" />
                Attach Block Instead
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onStepUpdate({ 
                    isAgentStep: false, 
                    stepType: 'unselected',
                    agentPrompt: ''
                  });
                }}
                className="w-full h-8 text-xs border-purple-200 hover:border-purple-300 text-red-600 hover:text-red-700"
              >
                <Unlink className="h-3 w-3 mr-1" />
                Disconnect Agent
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

      {/* Connected Tools View */}
      {showToolsView && selectedBlocks.length > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-10" style={{ marginTop: '240px' }}>
          {/* Connection lines container */}
          <div className="relative" style={{ width: `${Math.max(getSelectedToolsData().length * 120, 600)}px`, height: '300px' }}>
            {/* Single SVG for all connection lines */}
            <svg 
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              width="100%" 
              height="540"
              style={{
                overflow: 'visible',
                pointerEvents: 'none',
                top: '-240px'
              }}
            >
              {getSelectedToolsData().map((tool, index) => {
                const totalTools = getSelectedToolsData().length;
                const centerIndex = (totalTools - 1) / 2;
                const offsetFromCenter = (index - centerIndex) * 120;
                const containerWidth = Math.max(totalTools * 120, 600);
                const startX = containerWidth / 2;
                const endX = containerWidth / 2 + offsetFromCenter;
                
                return (
                  <path
                    key={tool.name}
                    d={`M ${startX} 0 Q ${startX} 150 ${endX} 300`}
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                    fill="none"
                    opacity="0.7"
                  />
                );
              })}
            </svg>
            
            {/* Tools positioned at the bottom */}
            <div 
              className="absolute flex justify-center gap-6"
              style={{ 
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%'
              }}
            >
              {getSelectedToolsData().map((tool, index) => (
                <div
                  key={tool.name}
                  className="flex flex-col items-center"
                >
                  {/* Tool item */}
                  <div className="bg-white border border-purple-200 rounded-full p-3 shadow-sm hover:shadow-md transition-shadow w-16 h-16 flex items-center justify-center">
                    {tool.logo ? (
                      <img 
                        src={tool.logo} 
                        alt={tool.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-purple-400 rounded"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Tool name */}
                  <div className="mt-2 text-center max-w-20">
                    <span className="text-xs text-gray-700 font-medium leading-tight block">
                      {tool.name.length > 15 ? `${tool.name.substring(0, 15)}...` : tool.name}
                    </span>
                    {tool.description && (
                      <span className="text-xs text-gray-500 leading-tight block mt-1">
                        {tool.description.length > 20 ? `${tool.description.substring(0, 20)}...` : tool.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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