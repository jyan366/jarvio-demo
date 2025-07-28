import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Clock, Zap, Trash2, Loader2, Eye, History, PlayCircle, ChevronDown, ChevronRight, MoreVertical, Activity, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Flow, FlowBlock } from '@/types/flowTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DocumentPreviewDialog } from '@/components/docs/DocumentPreviewDialog';
import { sampleDocumentContents } from '@/data/sampleDocuments';

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

// Generate stable mock run history with outputs (only runs once per flow)
const generateStableRunHistory = (flowId: string) => {
  const baseRuns = Math.floor(Math.random() * 20) + 5; // 5-25 runs
  const outputs = [];
  
  for (let i = 0; i < Math.min(baseRuns, 10); i++) { // Show max 10 recent outputs
    const daysAgo = Math.floor(Math.random() * 30); // Within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    outputs.push({
      id: `${flowId}-output-${i}`,
      date: date,
      status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
      runtime: `${Math.floor(Math.random() * 300) + 30}s` // 30-330 seconds
    });
  }
  
  return {
    totalRuns: baseRuns,
    lastRun: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    outputs: outputs.sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
  };
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());
  const [individualRunning, setIndividualRunning] = useState<Set<string>>(new Set());
  const [previewDocument, setPreviewDocument] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  // Generate stable run history data for all flows (memoized to prevent regeneration)
  const flowRunHistories = useMemo(() => {
    const histories: Record<string, any> = {};
    flows.forEach(flow => {
      histories[flow.id] = generateStableRunHistory(flow.id);
    });
    return histories;
  }, [flows.map(f => f.id).join(',')]); // Only regenerate if flow IDs change

  const toggleExpanded = (flowId: string) => {
    const newExpanded = new Set(expandedFlows);
    if (newExpanded.has(flowId)) {
      newExpanded.delete(flowId);
    } else {
      newExpanded.add(flowId);
    }
    setExpandedFlows(newExpanded);
  };

  // Map flow names to their corresponding document IDs
  const getFlowDocumentId = (flowName: string): string | null => {
    const normalizedName = flowName.toLowerCase();
    if (normalizedName.includes('inventory') && normalizedName.includes('restock')) {
      return 'flow-output-1';
    }
    if (normalizedName.includes('listing') && normalizedName.includes('optimis')) {
      return 'flow-output-2';
    }
    if (normalizedName.includes('perfect') && normalizedName.includes('amazon') && normalizedName.includes('listing')) {
      return 'flow-output-3';
    }
    return null;
  };

  const getDocumentTitle = (documentId: string): string => {
    switch (documentId) {
      case 'flow-output-1': return 'Inventory Restock Flow Output';
      case 'flow-output-2': return 'Listing Optimisation Flow Output';  
      case 'flow-output-3': return 'Perfect Amazon Listing Creation Output';
      default: return 'Flow Output Document';
    }
  };

  const handlePreviewDocument = (flowName: string, outputId?: string) => {
    const documentId = getFlowDocumentId(flowName);
    if (documentId && sampleDocumentContents[documentId]) {
      setPreviewDocument({
        id: documentId,
        title: `${getDocumentTitle(documentId)}${outputId ? ` - Run ${outputId.split('-').pop()}` : ''}`,
        content: sampleDocumentContents[documentId]
      });
    } else {
      toast({
        title: "No output available",
        description: "This flow hasn't generated any output documents yet.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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


  // Get stable run history for a flow
  const getRunHistory = (flowId: string) => {
    return flowRunHistories[flowId] || { totalRuns: 0, outputs: [], lastRun: new Date() };
  };

  return (
    <div className="space-y-6">      
      {/* Flows List - Single Column */}
      <div className="space-y-4">
        {flows.map((flow, index) => {
          const totalSteps = getTotalSteps(flow.blocks);
          const isCurrentFlowRunning = individualRunning.has(flow.id);
          const runHistory = getRunHistory(flow.id);
          const isExpanded = expandedFlows.has(flow.id);
          const mockOutput = generateMockOutput(flow.name);
          
          // Determine flow type based on index for consistent states
          const isScheduled = index % 3 === 0; // Every 3rd flow is scheduled
          const isActive = true; // All flows are active by default
          const scheduledTime = isScheduled ? 
            (index % 2 === 0 ? "Daily at 9:00 AM" : "Weekly on Mondays") : null;
          
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
                        {getTriggerIcon(isScheduled ? 'scheduled' : 'manual')}
                        <span className="text-xs capitalize">{isScheduled ? 'Scheduled' : 'Manual'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span className="text-xs">{totalSteps} steps</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs">Active</span>
                      </div>
                      
                      {isScheduled && scheduledTime && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{scheduledTime}</span>
                        </div>
                      )}
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
                    {/* Collapsible Runs Section */}
                    {runHistory.outputs.length > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(flow.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isCurrentFlowRunning}>
                            <History className="h-4 w-4 mr-1" />
                            View Runs ({runHistory.outputs.length})
                            {isExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </div>
                  
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
                        {isScheduled ? 'Run Now' : 'Run'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Collapsible Content - Show Output History */}
                {runHistory.outputs.length > 0 && (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(flow.id)}>
                    <CollapsibleContent className="mt-4 pt-4 border-t space-y-2">
                      <h4 className="text-sm font-medium text-foreground mb-3">Recent Runs</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground/20">
                        {runHistory.outputs.slice(0, 5).map((output, index) => (
                          <div 
                            key={output.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  Run #{runHistory.outputs.length - index}
                                </span>
                                {output.status === 'success' ? (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                ) : (
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(output.date)} • Runtime: {output.runtime}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreviewDocument(flow.name, output.id)}
                                className="text-xs"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                View Output
                              </Button>
                            </div>
                          </div>
                        ))}
                        {runHistory.outputs.length > 5 && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            + {runHistory.outputs.length - 5} more runs
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreviewDialog
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          documentId={previewDocument.id}
          title={previewDocument.title}
          content={previewDocument.content}
        />
      )}
    </div>
  );
}
