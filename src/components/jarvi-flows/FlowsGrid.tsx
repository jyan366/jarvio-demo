import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Clock, Zap, Trash2, Loader2, Eye, History, PlayCircle, ChevronDown, ChevronRight, MoreVertical, Activity, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Flow, FlowBlock } from '@/types/flowTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

// Helper function to get total step count
const getTotalSteps = (blocks: FlowBlock[]) => {
  return blocks.length;
};

// Generate mock final output data
const generateMockOutput = (flowName: string) => {
  const outputs = [
    `Enhanced product listing for "${flowName.includes('Inventory') ? 'Amazon FBA Product Analyzer' : 'Bluetooth Wireless Earbuds'}" with optimized title, bullet points, and description`,
    `Price adjustment recommendation reducing cost by 15% while maintaining 40% profit margin`,
    `Competitor analysis report identifying 3 key advantages and 2 areas for improvement`,
    `Updated inventory tracking spreadsheet with automated restock alerts for low-stock items`,
    `SEO-optimized product description with high-converting keywords and improved search ranking`
  ];
  
  const randomIndex = Math.floor(Math.random() * outputs.length);
  return {
    result: outputs[randomIndex],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    documentsGenerated: Math.floor(Math.random() * 5) + 1
  };
};

// Document Preview Modal Component
const DocumentPreviewModal = ({ flowName, output }: { flowName: string; output: any }) => {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Document Preview - {flowName}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {/* Document preview content */}
        <div className="bg-muted/30 rounded-lg p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Generated Document</h3>
          </div>
          <div className="bg-white p-6 rounded-md border min-h-[300px]">
            <h4 className="text-lg font-semibold mb-4">{flowName} - Final Output</h4>
            <p className="text-muted-foreground mb-6">{output.result}</p>
            
            {/* Mock document content */}
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Executive Summary</h5>
                <p className="text-sm text-muted-foreground">This automated analysis has identified key optimization opportunities that can improve performance by 25-40%.</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Key Findings</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pricing strategy optimization potential identified</li>
                  <li>• Market positioning improvements recommended</li>
                  <li>• Inventory management enhancements suggested</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Recommended Actions</h5>
                <p className="text-sm text-muted-foreground">Implementation of suggested changes should be prioritized based on impact and resource requirements.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Generated on {output.timestamp.toLocaleString()} • {output.documentsGenerated} documents created
          </div>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View All Documents
          </Button>
        </div>
      </div>
    </DialogContent>
  );
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

  

  return (
    <div className="space-y-6">      
      {/* Flows List - Single Column */}
      <div className="space-y-4">
        {flows.map(flow => {
          const totalSteps = getTotalSteps(flow.blocks);
          const isCurrentFlowRunning = individualRunning.has(flow.id);
          const runHistory = getRunHistory(flow.id);
          const isExpanded = expandedFlows.has(flow.id);
          const mockOutput = generateMockOutput(flow.name);
          const isActive = Math.random() > 0.3; // Mock active status
          
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
                    </div>
                    <CardDescription className="break-words mb-3">{flow.description}</CardDescription>
                    
                    {/* Flow info row */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center space-x-1 rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
                        {getTriggerIcon(flow.trigger)}
                        <span className="text-xs capitalize">{flow.trigger}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span className="text-xs">{totalSteps} steps</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs">{isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    
                    {runHistory.totalRuns > 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Last run: {runHistory.lastRun.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Top right buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => onEditFlow(flow.id)} disabled={isCurrentFlowRunning}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {onDeleteFlow && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50 hover:text-red-700" 
                        onClick={() => onDeleteFlow(flow.id)} 
                        disabled={isCurrentFlowRunning}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Bottom section - Output focused */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-2">
                    {runHistory.totalRuns > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(flow.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isCurrentFlowRunning}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Output
                            {isExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </div>
                  
                  {flow.trigger === 'manual' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRunFlow(flow.id)} 
                      disabled={isCurrentFlowRunning}
                      className={isCurrentFlowRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-primary text-primary-foreground hover:bg-primary/90"}
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
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Recent Output</h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DocumentPreviewModal flowName={flow.name} output={mockOutput} />
                          </Dialog>
                        </div>
                        <div className="bg-background rounded-md p-4 border">
                          <p className="text-sm font-medium mb-2">{mockOutput.result}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Generated on {mockOutput.timestamp.toLocaleDateString()}</span>
                            <span>{mockOutput.documentsGenerated} documents created</span>
                          </div>
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
