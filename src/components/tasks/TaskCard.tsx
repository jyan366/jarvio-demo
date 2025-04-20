
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: {
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Done';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    commentsCount?: number;
    date: string;
  };
  onClick?: () => void;
  cardBg?: string;
}

const statusColors = {
  'Not Started': 'bg-[#EFEFFD] text-[#6271F3] font-medium',
  'In Progress': 'bg-[#FFF1D6] text-[#EEAF57] font-medium',
  'Done': 'bg-[#D9F2E5] text-[#27B36B] font-medium'
};

const priorityColors = {
  'HIGH': 'bg-[#FEF2E3] text-[#FFA833] font-medium',
  'MEDIUM': 'bg-yellow-50 text-yellow-700',
  'LOW': 'bg-blue-50 text-blue-700'
};

export function TaskCard({ task, onClick, cardBg }: TaskCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-xl transition-shadow rounded-xl border-0",
        cardBg ? "" : "bg-white"
      )}
      style={cardBg ? { background: 'white' } : {}}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        {/* Simple icon representation for category */}
        <span className="rounded-md bg-[#FDF6ED] text-[#EEAF57] px-2 py-1 flex items-center text-xs font-medium">
          <Pencil className="w-3 h-3 mr-1 opacity-75" />
          {task.category}
        </span>
      </div>
      <h3 className="font-semibold text-base mb-1 leading-snug flex gap-1">
        {task.title}
      </h3>
      <p className="text-sm text-gray-500 leading-snug line-clamp-2 mb-3">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="secondary" className={cn(statusColors[task.status])}>
          {task.status}
        </Badge>
        <Badge variant="secondary" className={cn(priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        {/* moved category badge into icon label above */}
        {task.commentsCount !== undefined && task.commentsCount > 0 && (
          <span className="text-xs text-gray-400 font-medium">
            {task.commentsCount} comments
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <span className="inline-block">📅</span>
        <span>{task.date}</span>
      </div>
    </Card>
  );
}
