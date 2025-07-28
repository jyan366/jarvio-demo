import React, { useState } from 'react';
import { TrendingUp, Bot, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentGrid } from './DocumentGrid';
import { DocumentMetadata } from '@/types/docs';
import { cn } from '@/lib/utils';

interface FlowOutputsSectionProps {
  documents: DocumentMetadata[];
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onViewFlow?: (flowId: string) => void;
}

export function FlowOutputsSection({
  documents,
  onSelectDocument,
  onDeleteDocument,
  onViewFlow
}: FlowOutputsSectionProps) {
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());

  // Group documents by flow
  const documentsByFlow = documents.reduce((acc, doc) => {
    if (doc.sourceFlow) {
      if (!acc[doc.sourceFlow.id]) {
        acc[doc.sourceFlow.id] = {
          flow: doc.sourceFlow,
          documents: []
        };
      }
      acc[doc.sourceFlow.id].documents.push(doc);
    } else {
      // Handle documents without flow (legacy outputs)
      if (!acc['manual']) {
        acc['manual'] = {
          flow: {
            id: 'manual',
            name: 'Manual Outputs',
            status: 'active' as const,
            frequency: 'Manual'
          },
          documents: []
        };
      }
      acc['manual'].documents.push(doc);
    }
    return acc;
  }, {} as Record<string, { flow: any; documents: DocumentMetadata[] }>);

  const toggleFlowExpansion = (flowId: string) => {
    const newExpanded = new Set(expandedFlows);
    if (newExpanded.has(flowId)) {
      newExpanded.delete(flowId);
    } else {
      newExpanded.add(flowId);
    }
    setExpandedFlows(newExpanded);
  };

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
      case 'active': return <RefreshCw className="h-3 w-3" />;
      case 'paused': return <RefreshCw className="h-3 w-3 text-muted-foreground" />;
      case 'error': return <RefreshCw className="h-3 w-3 text-destructive" />;
      default: return <RefreshCw className="h-3 w-3" />;
    }
  };

  if (Object.keys(documentsByFlow).length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-medium text-foreground">Workflow Outputs</h2>
        <span className="text-sm text-muted-foreground">({documents.length})</span>
        <Badge variant="blue" className="ml-2">
          <Bot className="h-3 w-3 mr-1" />
          {Object.values(documentsByFlow).filter(g => g.flow.status === 'active').length} flows active
        </Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(documentsByFlow).map(([flowId, group]) => {
          const isExpanded = expandedFlows.has(flowId);
          const isManual = flowId === 'manual';
          
          return (
            <div key={flowId} className="border rounded-lg">
              <Collapsible open={isExpanded} onOpenChange={() => toggleFlowExpansion(flowId)}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        {isManual ? (
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{group.flow.name}</h3>
                          {!isManual && (
                            <Badge variant={getStatusVariant(group.flow.status)} className="h-5 text-xs">
                              {getStatusIcon(group.flow.status)}
                              <span className="ml-1">{group.flow.status}</span>
                            </Badge>
                          )}
                        </div>
                        {!isManual && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {group.flow.frequency} • {group.documents.length} outputs
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {group.documents.length} document{group.documents.length !== 1 ? 's' : ''}
                      </span>
                      {!isManual && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewFlow?.(flowId);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Flow
                        </Button>
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <DocumentGrid
                      documents={group.documents}
                      onSelectDocument={onSelectDocument}
                      onDeleteDocument={onDeleteDocument}
                      onViewFlow={onViewFlow}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </section>
  );
}