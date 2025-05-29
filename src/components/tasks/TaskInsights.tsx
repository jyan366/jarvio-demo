
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, MessageSquare, CirclePlus, ChevronDown, ChevronUp } from "lucide-react";
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
  'COMPETITION': 'bg-[#F0F4FF] text-[#6271F3]'
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

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Task Insights</h3>
              {newInsightsCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {newInsightsCount} new
                </Badge>
              )}
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 mt-3">
            {insights.map((insight) => (
              <Card key={insight.id} className="p-4 border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", categoryColors[insight.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700")}
                    >
                      {insight.category}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", severityColors[insight.severity])}
                    >
                      {insight.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{insight.date}</span>
                </div>
                
                <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onConvertToSubtask(insight)}
                          className="text-xs h-7"
                        >
                          <CirclePlus className="w-3 h-3 mr-1" />
                          Convert
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Convert to subtask</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => onAddComment(insight)}
                          className="text-xs h-7"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Comment
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add comment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDismissInsight(insight.id)}
                    className="text-xs h-7 ml-auto text-gray-500 hover:text-gray-700"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
