
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, MessageSquare, CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskWork } from '@/hooks/useTaskWork';
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskInsight {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  date: string;
  status: 'new' | 'viewed' | 'actioned' | 'dismissed';
}

const severityColors = {
  'HIGH': 'bg-[#FEF2E3] text-[#FFA833] font-medium',
  'MEDIUM': 'bg-yellow-50 text-yellow-700',
  'LOW': 'bg-blue-50 text-blue-700'
};

const categoryColors = {
  'REVIEW': 'bg-[#FFF1D6] text-[#EEAF57]',
  'LISTING': 'bg-[#F0F9F5] text-[#27B36B]',
  'PRICING': 'bg-[#FDF6ED] text-[#EEAF57]',
  'COMPETITION': 'bg-[#F0F4FF] text-[#6271F3]',
};

interface TaskInsightsProps {
  insights: TaskInsight[];
  onDismissInsight: (id: string) => void;
  onConvertToSubtask: (insight: TaskInsight) => void;
  onAddComment: (insight: TaskInsight) => void;
}

export function TaskInsights({ 
  insights, 
  onDismissInsight, 
  onConvertToSubtask, 
  onAddComment 
}: TaskInsightsProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const newInsightsCount = insights.filter(i => i.status === 'new').length;

  return (
    <Card className="p-4 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Related Insights</h3>
            {newInsightsCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {newInsightsCount} new
              </Badge>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-3 mt-2">
            {insights.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No insights available for this task
              </p>
            ) : (
              insights.map((insight) => (
                <div 
                  key={insight.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    insight.status === 'new' ? 'bg-blue-50' : 'bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary"
                          className={severityColors[insight.severity]}
                        >
                          {insight.severity}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={categoryColors[insight.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {insight.category}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onConvertToSubtask(insight)}
                            >
                              <CirclePlus className="h-4 w-4 text-green-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Convert to subtask</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onAddComment(insight)}
                            >
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add comment</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDismissInsight(insight.id)}
                            >
                              <Check className="h-4 w-4 text-gray-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Dismiss insight</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
