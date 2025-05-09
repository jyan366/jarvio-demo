
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Edit, Clock, Zap, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the flow types and their properties
export type TriggerType = 'manual' | 'scheduled' | 'event';

export type FlowBlock = {
  id: string;
  type: 'collect' | 'think' | 'act';
  option: string;
  name?: string; // Add name field for blocks
  config?: Record<string, any>;
};

export type Flow = {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  blocks: FlowBlock[];
};

interface FlowsGridProps {
  flows: Flow[];
  onEditFlow: (flowId: string) => void;
  onRunFlow: (flowId: string) => void;
  onDeleteFlow?: (flowId: string) => void; // Add delete flow handler
  isRunningFlow?: boolean;
}

// Helper function to get a trigger icon
const getTriggerIcon = (trigger: TriggerType) => {
  switch (trigger) {
    case 'manual':
      return <Play className="h-4 w-4" />;
    case 'scheduled':
      return <Clock className="h-4 w-4" />;
    case 'event':
      return <Zap className="h-4 w-4" />;
    default:
      return <Play className="h-4 w-4" />;
  }
};

// Helper function to generate block type count
const getBlockCounts = (blocks: FlowBlock[]) => {
  const counts = {
    collect: 0,
    think: 0,
    act: 0
  };
  
  blocks.forEach(block => {
    counts[block.type]++;
  });
  
  return counts;
};

// Get the most significant blocks to display (one of each type if possible)
const getSignificantBlocks = (blocks: FlowBlock[]) => {
  const result: Record<string, string> = {};
  
  // Try to get one of each type
  for (const type of ['collect', 'think', 'act']) {
    const blockOfType = blocks.find(b => b.type === type);
    if (blockOfType) {
      result[type] = blockOfType.name || blockOfType.option || `${type} step`;
    }
  }
  
  return result;
};

export function FlowsGrid({ flows, onEditFlow, onRunFlow, onDeleteFlow, isRunningFlow = false }: FlowsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {flows.map((flow) => {
        const blockCounts = getBlockCounts(flow.blocks);
        const significantBlocks = getSignificantBlocks(flow.blocks);
        
        return (
          <Card key={flow.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold break-words">{flow.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 break-words">{flow.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-1 rounded-md bg-secondary p-1 text-secondary-foreground">
                  {getTriggerIcon(flow.trigger)}
                  <span className="text-xs capitalize">{flow.trigger}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="rounded-full w-2.5 h-2.5 bg-blue-500 mr-1.5" />
                    <span>{blockCounts.collect} Collect</span>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full w-2.5 h-2.5 bg-purple-500 mr-1.5" />
                    <span>{blockCounts.think} Think</span>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full w-2.5 h-2.5 bg-green-500 mr-1.5" />
                    <span>{blockCounts.act} Act</span>
                  </div>
                </div>
                
                {/* Show key steps with names (if available) */}
                {Object.keys(significantBlocks).length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-xs text-gray-500 mb-1">Key steps:</p>
                    <ul className="space-y-0.5 list-disc pl-4">
                      {Object.entries(significantBlocks).map(([type, name]) => (
                        <li key={type} className="break-words whitespace-normal overflow-wrap-break-word">{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditFlow(flow.id)}
                  disabled={isRunningFlow}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {onDeleteFlow && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onDeleteFlow(flow.id)}
                    disabled={isRunningFlow}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
              
              {flow.trigger === 'manual' && (
                <Button 
                  size="sm"
                  onClick={() => onRunFlow(flow.id)}
                  disabled={isRunningFlow}
                >
                  {isRunningFlow ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
