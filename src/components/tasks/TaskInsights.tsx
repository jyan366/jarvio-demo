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
  return;
}