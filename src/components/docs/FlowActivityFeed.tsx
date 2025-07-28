import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Activity, Bot, Clock, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FlowActivity {
  id: string;
  flowId: string;
  flowName: string;
  status: 'active' | 'paused' | 'error';
  frequency: string;
  lastRun: Date;
  documentsGenerated: number;
  nextRun?: Date;
}

interface FlowActivityFeedProps {
  onViewFlow?: (flowId: string) => void;
  onViewDocument?: (documentId: string) => void;
}

// Mock data for flow activities
const mockFlowActivities: FlowActivity[] = [
  {
    id: 'activity-1',
    flowId: 'flow-1',
    flowName: 'Inventory Restock Monitor',
    status: 'active',
    frequency: 'Daily at 6 AM',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    documentsGenerated: 12,
    nextRun: new Date(Date.now() + 16 * 60 * 60 * 1000) // 16 hours from now
  },
  {
    id: 'activity-2',
    flowId: 'flow-5',
    flowName: 'Competitor Price Monitor',
    status: 'active',
    frequency: 'Every 4 hours',
    lastRun: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    documentsGenerated: 6,
    nextRun: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
  },
  {
    id: 'activity-3',
    flowId: 'flow-4',
    flowName: 'Performance Analyzer',
    status: 'active',
    frequency: 'Daily at 9 AM',
    lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    documentsGenerated: 8,
    nextRun: new Date(Date.now() + 19 * 60 * 60 * 1000) // 19 hours from now
  },
  {
    id: 'activity-4',
    flowId: 'flow-6',
    flowName: 'Inventory Optimizer',
    status: 'paused',
    frequency: 'Twice weekly',
    lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    documentsGenerated: 4
  }
];

export function FlowActivityFeed({ onViewFlow, onViewDocument }: FlowActivityFeedProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'paused': return <Clock className="h-3 w-3" />;
      case 'error': return <Activity className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Flow Activity</CardTitle>
                <Badge variant="secondary" className="h-5 text-xs">
                  {mockFlowActivities.filter(f => f.status === 'active').length} active
                </Badge>
              </div>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {mockFlowActivities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <div>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 font-medium text-foreground hover:text-primary"
                          onClick={() => onViewFlow?.(activity.flowId)}
                        >
                          {activity.flowName}
                        </Button>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusVariant(activity.status)} className="h-5 text-xs">
                            {getStatusIcon(activity.status)}
                            <span className="ml-1">{activity.status}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.frequency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Last run: {formatDistanceToNow(activity.lastRun, { addSuffix: true })}</div>
                      {activity.nextRun && (
                        <div>Next run: {formatDistanceToNow(activity.nextRun, { addSuffix: true })}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {activity.documentsGenerated} documents generated
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                      onClick={() => {
                        // Map flow IDs to their corresponding output documents
                        const flowDocumentMap: Record<string, string> = {
                          'flow-1': 'inventory-restock-output', // Inventory Restock Monitor
                          'flow-5': 'competitor-price-output', // Competitor Price Monitor  
                          'flow-4': 'performance-analyzer-output', // Performance Analyzer
                          'flow-6': 'inventory-optimizer-output'  // Inventory Optimizer
                        };
                        const documentId = flowDocumentMap[activity.flowId];
                        if (documentId && onViewDocument) {
                          onViewDocument(documentId);
                        }
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Outputs
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onViewFlow?.('all')}
              >
                View All Flows
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}