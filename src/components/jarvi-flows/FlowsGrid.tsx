import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Clock, Zap, Trash2, Loader2, Eye, History, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Flow, FlowBlock } from '@/types/flowTypes';

// Define the flow types and their properties
export type TriggerType = 'manual' | 'scheduled' | 'webhook' | 'event' | 'insight';

// Re-export types for backward compatibility
export type { Flow, FlowBlock };
interface FlowsGridProps {
  flows: Flow[];
  onEditFlow: (flowId: string) => void;
  onRunFlow: (flowId: string) => void;
  onDeleteFlow?: (flowId: string) => void;
  onRunAllFlows?: () => void;
  onViewOutput?: (flowId: string) => void;
  isRunningFlow?: boolean;
  runningFlowId?: string;
}

// Helper function to get a trigger icon
const getTriggerIcon = (trigger: TriggerType) => {
  switch (trigger) {
    case 'manual':
      return <Play className="h-4 w-4" />;
    case 'scheduled':
      return <Clock className="h-4 w-4" />;
    case 'webhook':
      return <Zap className="h-4 w-4" />;
    case 'event':
      return <Zap className="h-4 w-4" />;
    case 'insight':
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
    if (block.type === 'collect' || block.type === 'think' || block.type === 'act') {
      counts[block.type]++;
    }
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
export function FlowsGrid({
  flows,
  onEditFlow,
  onRunFlow,
  onDeleteFlow,
  onRunAllFlows,
  onViewOutput,
  isRunningFlow = false,
  runningFlowId
}: FlowsGridProps) {
  const { toast } = useToast();
  
  // Mock run history data - in real app this would come from props or API
  const getRunHistory = (flowId: string) => {
    const mockRuns = Math.floor(Math.random() * 15) + 1;
    const lastRun = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    return { totalRuns: mockRuns, lastRun };
  };

  const manualFlows = flows.filter(flow => flow.trigger === 'manual');

  return <div className="space-y-6">
      {/* Run All Manual Flows Button */}
      {manualFlows.length > 0 && onRunAllFlows && (
        <div className="flex justify-end">
          <Button 
            onClick={onRunAllFlows}
            disabled={isRunningFlow}
            className="gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Run All Manual Flows ({manualFlows.length})
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {flows.map(flow => {
          const blockCounts = getBlockCounts(flow.blocks);
          const significantBlocks = getSignificantBlocks(flow.blocks);
          const isCurrentFlowRunning = isRunningFlow && runningFlowId === flow.id;
          const runHistory = getRunHistory(flow.id);
          
          return <Card key={flow.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg font-semibold break-words">{flow.name}</CardTitle>
                    {runHistory.totalRuns > 0 && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <History className="h-3 w-3" />
                        {runHistory.totalRuns} runs
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 break-words">{flow.description}</CardDescription>
                  {runHistory.totalRuns > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Last run: {runHistory.lastRun.toLocaleDateString()}
                    </div>
                  )}
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
                {Object.keys(significantBlocks).length > 0}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEditFlow(flow.id)} disabled={isRunningFlow}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {runHistory.totalRuns > 0 && onViewOutput && (
                  <Button variant="outline" size="sm" onClick={() => onViewOutput(flow.id)} disabled={isRunningFlow}>
                    <Eye className="h-4 w-4 mr-1" />
                    Output
                  </Button>
                )}
                
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
                  disabled={isCurrentFlowRunning}
                  className={isCurrentFlowRunning ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {isCurrentFlowRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>;
        })}
      </div>
    </div>;
}
