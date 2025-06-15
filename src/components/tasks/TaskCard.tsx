import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { Task } from '@/pages/TaskManager/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  cardBg?: string;
  isSuggested?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  hideFlowTag?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  cardBg,
  isSuggested = false,
  onAccept,
  onReject,
  onDelete,
  hideFlowTag = false,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'listings':
        return 'bg-yellow-100 text-yellow-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`text-xs ${getCategoryColor(task.category)} capitalize`}>
          {task.category.toLowerCase()}
        </Badge>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Task Title */}
      <h3 className="font-medium text-sm text-gray-900 leading-tight">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Status and Priority Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)} uppercase`}>
          {task.status === 'Not Started' ? 'TODO' : 
           task.status === 'In Progress' ? 'INPROGRESS' : 'DONE'}
        </Badge>
        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)} uppercase`}>
          {task.priority}
        </Badge>
      </div>

      {/* Date and Action */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-1">📅</span>
          {formatDate(task.date)}
        </div>
        
        {isSuggested ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.();
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            {task.status === 'Done' ? 'Work on' : 'Work on'}
          </Button>
        )}
      </div>

      {/* Run Flow Button for flow tasks */}
      {task.data?.flowId && !hideFlowTag && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            // Handle run flow action
          }}
        >
          🔄 Run Flow
        </Button>
      )}
    </div>
  );
};
