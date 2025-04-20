
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
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
}

const statusColors = {
  'Not Started': 'bg-blue-500/10 text-blue-500',
  'In Progress': 'bg-yellow-500/10 text-yellow-500',
  'Done': 'bg-green-500/10 text-green-500'
};

const priorityColors = {
  'HIGH': 'bg-red-500/10 text-red-500',
  'MEDIUM': 'bg-yellow-500/10 text-yellow-500',
  'LOW': 'bg-blue-500/10 text-blue-500'
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card 
      className="p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="space-y-2">
        <h3 className="font-medium">{task.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className={cn(statusColors[task.status])}>
          {task.status}
        </Badge>
        <Badge variant="secondary" className={cn(priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {task.category}
        </Badge>
        {task.commentsCount && task.commentsCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            <span>{task.commentsCount} comments</span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {task.date}
      </div>
    </Card>
  );
}
