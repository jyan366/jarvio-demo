import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Trash2, Check, Plus, Bot, Unlink } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';

interface WorkflowStepNodeData {
  step: FlowStep;
  block: FlowBlock | null;
  executionState?: 'idle' | 'running' | 'success' | 'failed';
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
  onDetachBlock?: () => void;
  onConfigureBlock?: () => void;
  onConvertToAgent?: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const WorkflowStepNode = memo(({ data }: NodeProps) => {
  const { step, block, executionState = 'idle', onStepUpdate, onDelete, onAttachBlock, onDetachBlock, onConfigureBlock, onConvertToAgent } = data as unknown as WorkflowStepNodeData;

  const isUnselected = step.stepType === 'unselected' || (!step.isAgentStep && !block && !step.blockId);
  const isAgentStep = step.isAgentStep;
  
  // Get execution state styling - Theme-aware styling
  const getExecutionStateStyle = () => {
    switch (executionState) {
      case 'running':
        return 'border-blue-500 bg-card shadow-lg shadow-blue-500/20';
      case 'success':
        return 'border-green-500 bg-card shadow-lg shadow-green-500/20';
      case 'failed':
        return 'border-red-500 bg-card shadow-lg shadow-red-500/20';
      default:
        return 'border-border bg-card shadow-lg';
    }
  };
  
  const getExecutionStateIndicator = () => {
    switch (executionState) {
      case 'running':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />;
      case 'success':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-2 h-2 text-white" />
        </div>;
      case 'failed':
        return <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">×</span>
        </div>;
      default:
        return null;
    }
  };

  // Find block logo from blocksData
  const getBlockLogo = (blockName?: string) => {
    if (!blockName) return '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png';
    
    // Search through all categories in blocksData
    for (const category of Object.values(blocksData)) {
      if (Array.isArray(category)) {
        const foundBlock = category.find(b => b.name === blockName || b.name === block?.option);
        if (foundBlock?.logo) {
          return foundBlock.logo;
        }
      }
    }
    return '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png'; // Use Jarvio logo as fallback
  };

  const blockLogo = getBlockLogo(block?.name || block?.option);

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
          className="text-xs h-7 bg-transparent border-none shadow-none p-1 font-medium placeholder:text-muted-foreground text-foreground"
        />
        <Input
          placeholder="Step description..."
          value={step.description || ''}
          onChange={(e) => onStepUpdate({ description: e.target.value })}
          className="text-xs h-6 bg-transparent border-none shadow-none p-1 placeholder:text-muted-foreground text-muted-foreground"
        />
      </div>
      
      <Card className={`w-72 h-72 border-2 hover:border-primary transition-all duration-300 shadow-sm relative rounded-xl ${getExecutionStateStyle()}`}>
        {getExecutionStateIndicator()}
        {/* Delete button positioned at top right */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="absolute top-2 right-2 h-6 w-6 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/20 z-10 transition-colors duration-200"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <div className="space-y-3">
            {/* Step Header */}
            <div className="flex items-start justify-start">
              <div className="flex-1">
                {isAgentStep && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    <Bot className="w-3 h-3 mr-1" />
                    Agent
                  </Badge>
                )}
              </div>
            </div>

            {/* Block Section */}
            <div className="pt-2">
              {isUnselected ? (
                <div className="text-center space-y-4">
                  <div className="text-sm text-foreground font-medium">
                    Choose step type
                  </div>
                  <div className="flex flex-col gap-3 px-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        onStepUpdate({ 
                          isAgentStep: true, 
                          stepType: 'agent'
                        });
                      }}
                      className="w-full h-12 flex items-center justify-center gap-2 text-sm bg-accent hover:bg-accent/80 font-medium"
                    >
                      <Bot className="h-4 w-4" />
                      Agent
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onAttachBlock}
                      className="w-full h-12 flex items-center justify-center gap-2 text-sm bg-accent hover:bg-accent/80 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Block
                    </Button>
                  </div>
                </div>
              ) : block ? (
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-secondary flex items-center justify-center border border-border">
                      <img 
                        src={blockLogo} 
                        alt={block.option || block.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground block">
                      {block.option || block.name}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Action
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onConfigureBlock}
                      className="flex-1 h-7 text-xs bg-accent hover:bg-accent/80 font-medium"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                    {onDetachBlock && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Detach button clicked');
                          onDetachBlock();
                        }}
                        className="h-7 px-2 text-xs bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30"
                        title="Detach block"
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : isAgentStep ? (
                <div className="text-center space-y-3">
                  <div className="text-xs text-muted-foreground font-medium">
                    AI Agent will handle this step
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs flex-1 bg-accent">
                      No configuration needed
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onStepUpdate({ 
                          isAgentStep: false, 
                          stepType: 'unselected'
                        });
                      }}
                      className="h-7 px-2 text-xs bg-accent hover:bg-accent/80"
                      title="Disconnect agent"
                    >
                      <Unlink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium">
                    No action attached
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAttachBlock}
                    className="h-7 px-3 text-xs bg-accent hover:bg-accent/80 font-medium"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Attach Action
                  </Button>
                </div>
              )}
            </div>
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

WorkflowStepNode.displayName = 'WorkflowStepNode';

export { WorkflowStepNode };