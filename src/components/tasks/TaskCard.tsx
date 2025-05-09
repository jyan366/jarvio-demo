
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ExternalLink, Star, MessageSquare, TrendingDown, Flag, Trash2, PencilLine, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Done';
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    commentsCount?: number;
    date: string;
    fromInsight?: boolean;
    data?: {
      flowId?: string;
      flowTrigger?: string;
    };
  };
  onClick?: () => void;
  cardBg?: string;
  onAccept?: () => void;
  onReject?: () => void;
  isSuggested?: boolean;
}

const statusColors = {
  'Not Started': 'bg-[#EFEFFD] text-[#6271F3] font-medium',
  'In Progress': 'bg-[#FFF1D6] text-[#EEAF57] font-medium',
  'Done': 'bg-[#D9F2E5] text-[#27B36B] font-medium'
};

const priorityColors = {
  'CRITICAL': 'bg-purple-100 text-purple-800 border-purple-200',
  'HIGH': 'bg-[#FEF2E3] text-[#FFA833] font-medium',
  'MEDIUM': 'bg-yellow-50 text-yellow-700',
  'LOW': 'bg-blue-50 text-blue-700'
};

const categoryIcons = {
  'LISTINGS': <Flag className="w-4 h-4 mr-1.5" />,
  'SUPPORT': <MessageSquare className="w-4 h-4 mr-1.5" />,
  'REVIEWS': <Star className="w-4 h-4 mr-1.5" />,
  'KEYWORDS': <PencilLine className="w-4 h-4 mr-1.5" />,
  'INVENTORY': <PencilLine className="w-4 h-4 mr-1.5" />,
  'PRICING': <TrendingDown className="w-4 h-4 mr-1.5" />,
  'FLOW': <Workflow className="w-4 h-4 mr-1.5" />,
  'PROCESS': <Workflow className="w-4 h-4 mr-1.5" />,
};

const categoryColors = {
  'LISTINGS': 'text-amber-500',
  'SUPPORT': 'text-blue-500',  
  'REVIEWS': 'text-green-500',
  'KEYWORDS': 'text-amber-500',
  'INVENTORY': 'text-blue-500',
  'PRICING': 'text-amber-500',
  'FLOW': 'text-purple-500',
  'PROCESS': 'text-amber-500',
};

export function TaskCard({ task, onClick, cardBg, onAccept, onReject, isSuggested = false }: TaskCardProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  
  // Check if this task is a flow
  const isFlow = task.category === 'FLOW' || (task.data && task.data.flowId);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleWorkOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Make sure we have a valid task ID
    if (task && task.id) {
      navigate(`/task/${task.id}`);
    } else {
      toast({
        title: "Error",
        description: "Could not open task: missing task ID",
        variant: "destructive"
      });
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReject) {
      onReject();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
      });

      // Close the dialog
      setShowDeleteDialog(false);
      
      // Refresh the task list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCategoryIcon = () => {
    return categoryIcons[task.category as keyof typeof categoryIcons] || <PencilLine className="w-4 h-4 mr-1.5" />;
  };

  const getCategoryColor = () => {
    return categoryColors[task.category as keyof typeof categoryColors] || 'text-amber-500';
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Card 
        className={cn(
          "p-5 cursor-pointer hover:shadow-md transition-all duration-300 rounded-xl border overflow-hidden",
          isFlow ? "border-purple-300" : "border-gray-200",
          cardBg || "bg-white"
        )}
        onClick={handleCardClick}
      >
        {/* Purple accent bar for flow tasks */}
        {isFlow && (
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>
        )}
        
        {/* Task insight bar */}
        {task.fromInsight && !isFlow && (
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
        )}
        
        <div className="pl-2">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className={cn("flex items-center font-medium text-sm", getCategoryColor())}>
              {renderCategoryIcon()}
              {task.category}
            </div>
            
            {/* Flow badge */}
            {isFlow && (
              <Badge variant="purple" className="text-xs">
                Flow
              </Badge>
            )}
            
            {/* Insight badge */}
            {task.fromInsight && (
              <Badge variant="blue" className="text-xs">
                From Insight
              </Badge>
            )}
          </div>
          
          {/* Task title */}
          <h3 className={cn(
            "font-semibold text-lg mb-2 leading-tight",
            isFlow ? "text-purple-900" : "text-gray-800"
          )}>
            {task.title}
          </h3>
          
          {/* Task description */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Status badge */}
            <Badge variant="secondary" className={cn(statusColors[task.status], "text-xs py-1")}>
              {task.status}
            </Badge>
            
            {/* Priority badge */}
            <Badge variant="secondary" className={cn(priorityColors[task.priority], "text-xs py-1")}>
              {task.priority}
            </Badge>
          </div>
          
          {/* Footer with date and actions */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-400">
              <span className="mr-1">📅</span>
              <span>{task.date}</span>
            </div>
            
            {isSuggested ? (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-green-100 text-green-600 hover:text-green-700"
                  onClick={handleAccept}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-100 text-red-600 hover:text-red-700"
                  onClick={handleReject}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleWorkOnClick}
                  size="sm"
                  variant={isFlow ? "default" : "outline"}
                  className={cn(
                    "rounded-full text-xs px-3 py-1 h-8 font-medium",
                    isFlow 
                      ? "bg-purple-600 text-white hover:bg-purple-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  )}
                >
                  <span className="mr-1">{isFlow ? "Run Flow" : "Work on"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
