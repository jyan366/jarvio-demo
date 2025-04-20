
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Star, Flag, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightProps {
  id: string;
  title: string;
  description: string;
  category: 'REVIEW' | 'LISTING' | 'PRICING' | 'COMPETITION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  onCreateTask: (insight: Omit<InsightProps, 'onCreateTask'>) => void;
}

const categoryIcons = {
  'REVIEW': Star,
  'LISTING': Flag,
  'PRICING': TrendingDown,
  'COMPETITION': TrendingDown,
};

const categoryColors = {
  'REVIEW': 'bg-[#FFF1D6] text-[#EEAF57]',
  'LISTING': 'bg-[#F0F9F5] text-[#27B36B]',
  'PRICING': 'bg-[#FDF6ED] text-[#EEAF57]',
  'COMPETITION': 'bg-[#F0F4FF] text-[#6271F3]',
};

const severityColors = {
  'HIGH': 'bg-[#FEF2E3] text-[#FFA833] font-medium',
  'MEDIUM': 'bg-yellow-50 text-yellow-700',
  'LOW': 'bg-blue-50 text-blue-700'
};

export function InsightCard({ 
  id, 
  title, 
  description, 
  category, 
  severity, 
  date,
  onCreateTask 
}: InsightProps) {
  const IconComponent = categoryIcons[category] || AlertTriangle;
  // Remove onCreateTask from the object passed so only insight data is in the task
  const passInsight = { id, title, description, category, severity, date };

  return (
    <Card className="p-4 bg-white hover:shadow-md transition-shadow rounded-xl border-0">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("rounded-md px-2 py-1 flex items-center text-xs font-medium", 
          categoryColors[category])}>
          <IconComponent className="w-3 h-3 mr-1 opacity-75" />
          {category}
        </span>
      </div>
      <h3 className="font-semibold text-base mb-1 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-snug line-clamp-2 mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="secondary" className={cn(severityColors[severity])}>
          {severity}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span className="inline-block">📅</span>
          <span>{date}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto text-xs px-2 py-1 h-7 rounded bg-primary/10 text-primary hover:bg-primary/20 font-medium transition border-0"
          onClick={() => onCreateTask(passInsight)}
        >
          Create Task
        </Button>
      </div>
    </Card>
  );
}
