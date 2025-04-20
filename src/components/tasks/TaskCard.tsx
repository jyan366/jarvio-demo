
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, MessageSquare, ExternalLink, Star, AlertTriangle, Flag, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Done';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    commentsCount?: number;
    date: string;
    fromInsight?: boolean;
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

const categoryIcons = {
  'LISTINGS': 'Pencil',
  'SUPPORT': 'MessageSquare',
  'REVIEWS': 'MessageSquare',
  'KEYWORDS': 'Pencil',
  'INVENTORY': 'Pencil',
  'PRICING': 'Pencil',
};

const categoryColors = {
  'LISTINGS': 'bg-[#FDF6ED] text-[#EEAF57]',
  'SUPPORT': 'bg-[#F0F4FF] text-[#6271F3]',  
  'REVIEWS': 'bg-[#F0F9F5] text-[#27B36B]',
  'KEYWORDS': 'bg-[#FDF6ED] text-[#EEAF57]',
  'INVENTORY': 'bg-[#F0F4FF] text-[#6271F3]',
  'PRICING': 'bg-[#FDF6ED] text-[#EEAF57]',
};

export function TaskCard({ task, onClick, cardBg }: TaskCardProps) {
  const navigate = useNavigate();
  
  const handleWorkOnClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    navigate(`/task/${task.id}`);
  };

  // Determine which icon to use based on the category
  const renderCategoryIcon = () => {
    switch (task.category) {
      case 'REVIEWS':
        return <Star className="w-3 h-3 mr-1 opacity-75" />;
      case 'SUPPORT':
        return <MessageSquare className="w-3 h-3 mr-1 opacity-75" />;
      case 'PRICING':
        return <TrendingDown className="w-3 h-3 mr-1 opacity-75" />;
      case 'LISTINGS':
        return <Flag className="w-3 h-3 mr-1 opacity-75" />;
      default:
        return <Pencil className="w-3 h-3 mr-1 opacity-75" />;
    }
  };
  
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-xl transition-shadow rounded-xl border-0",
        cardBg ? "" : "bg-white",
        task.fromInsight && "border-l-4 border-l-blue-500"
      )}
      style={cardBg ? { background: 'white' } : {}}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("rounded-md px-2 py-1 flex items-center text-xs font-medium", 
          categoryColors[task.category as keyof typeof categoryColors] || 'bg-[#FDF6ED] text-[#EEAF57]')}>
          {renderCategoryIcon()}
          {task.category}
        </span>
        
        {task.fromInsight && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            From Insight
          </Badge>
        )}
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
        {task.commentsCount !== undefined && task.commentsCount > 0 && (
          <span className="text-xs flex items-center gap-1 text-gray-400 font-medium">
            <MessageSquare className="w-3 h-3" />
            {task.commentsCount}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span className="inline-block">📅</span>
          <span>{task.date}</span>
        </div>
        <Button 
          onClick={handleWorkOnClick}
          size="sm"
          variant="outline"
          className="ml-auto text-xs px-2 py-1 h-7 rounded bg-primary/10 text-primary hover:bg-primary/20 font-medium transition border-0"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Work on
        </Button>
      </div>
    </Card>
  );
}
