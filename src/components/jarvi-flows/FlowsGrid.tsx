import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Clock, Zap, Trash2, Loader2, Eye, History, PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Flow, FlowBlock } from '@/types/flowTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

// Generate mock output data
const generateMockOutput = (flowName: string) => {
  const outputs = [
    {
      timestamp: new Date().toISOString(),
      step: "Data Collection",
      result: `Successfully collected 247 product listings for ${flowName}`,
      duration: "2.3s"
    },
    {
      timestamp: new Date(Date.now() - 1000).toISOString(),
      step: "Analysis",
      result: "Identified 23 optimization opportunities and 5 potential issues",
      duration: "4.1s"
    },
    {
      timestamp: new Date(Date.now() - 2000).toISOString(),
      step: "Action",
      result: "Generated 15 optimized listings and scheduled 8 price updates",
      duration: "1.7s"
    }
  ];
  return outputs;
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
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());
  const [individualRunning, setIndividualRunning] = useState<Set<string>>(new Set());

  const toggleExpanded = (flowId: string) => {
    const newExpanded = new Set(expandedFlows);
    if (newExpanded.has(flowId)) {
      newExpanded.delete(flowId);
    } else {
      newExpanded.add(flowId);
    }
    setExpandedFlows(newExpanded);
  };

  const handleRunFlow = (flowId: string) => {
    const newRunning = new Set(individualRunning);
    newRunning.add(flowId);
    setIndividualRunning(newRunning);
    
    // Random duration between 5-30 seconds
    const duration = Math.floor(Math.random() * 25000) + 5000;
    
    setTimeout(() => {
      const updatedRunning = new Set(individualRunning);
      updatedRunning.delete(flowId);
      setIndividualRunning(updatedRunning);
    }, duration);

    onRunFlow(flowId);
  };

  // Mock run history data
  const getRunHistory = (flowId: string) => {
    const mockRuns = Math.floor(Math.random() * 15) + 1;
    const lastRun = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    return { totalRuns: mockRuns, lastRun };
  };

  const manualFlows = flows.filter(flow => flow.trigger === 'manual');

  return (
    <div className="space-y-6">
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
      
      {/* Flows List - Single Column */}
      <div className="space-y-4">
        {flows.map(flow => {
          const blockCounts = getBlockCounts(flow.blocks);
          const isCurrentFlowRunning = individualRunning.has(flow.id);
          const runHistory = getRunHistory(flow.id);
          const isExpanded = expandedFlows.has(flow.id);
          const mockOutput = generateMockOutput(flow.name);
          
          return (
            <Card key={flow.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-semibold">{flow.name}</CardTitle>
                      {runHistory.totalRuns > 0 && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <History className="h-3 w-3" />
                          {runHistory.totalRuns} runs
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1 rounded-md bg-secondary p-1 text-secondary-foreground">
                        {getTriggerIcon(flow.trigger)}
                        <span className="text-xs capitalize">{flow.trigger}</span>
                      </div>
                    </div>
                    <CardDescription className="break-words mb-2">{flow.description}</CardDescription>
                    {runHistory.totalRuns > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Last run: {runHistory.lastRun.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Block counts */}
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
              </CardHeader>

              <CardContent className="pt-0">
                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditFlow(flow.id)} disabled={isCurrentFlowRunning}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {runHistory.totalRuns > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(flow.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isCurrentFlowRunning}>
                            <Eye className="h-4 w-4 mr-1" />
                            Output
                            {isExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                    
                    {onDeleteFlow && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" 
                        onClick={() => onDeleteFlow(flow.id)} 
                        disabled={isCurrentFlowRunning}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                  
                  {flow.trigger === 'manual' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRunFlow(flow.id)} 
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
                </div>

                {/* Expandable output section */}
                {runHistory.totalRuns > 0 && (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(flow.id)}>
                    <CollapsibleContent className="mt-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Recent Output</h4>
                        <div className="space-y-3">
                          {mockOutput.map((output, index) => (
                            <div key={index} className="bg-background rounded-md p-3 border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{output.step}</span>
                                <span className="text-xs text-muted-foreground">{output.duration}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{output.result}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(output.timestamp).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
