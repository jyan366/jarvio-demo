
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, GitBranch, Workflow, CheckSquare } from 'lucide-react';
import { TaskTreeNode } from '@/types/unifiedTask';
import { useNavigate } from 'react-router-dom';

interface UnifiedTaskCardProps {
  task: TaskTreeNode;
  onDelete: (taskId: string) => void;
  onUpdate: () => void;
}

export function UnifiedTaskCard({ task, onDelete, onUpdate }: UnifiedTaskCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/task/${task.id}`);
  };

  const getTaskTypeIcon = () => {
    switch (task.task_type) {
      case 'flow':
        return <Workflow className="h-4 w-4" />;
      case 'step':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };

  const getTaskTypeColor = () => {
    switch (task.task_type) {
      case 'flow':
        return 'bg-purple-100 text-purple-800';
      case 'step':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTaskTypeColor()}>
                {getTaskTypeIcon()}
                <span className="ml-1 capitalize">{task.task_type}</span>
              </Badge>
            </div>
            <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description || 'No description'}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={getPriorityColor()}>
              {task.priority}
            </Badge>
            {task.category && (
              <Badge variant="secondary" className="text-xs">
                {task.category}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {task.children.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {task.children.length} subtask{task.children.length !== 1 ? 's' : ''}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {task.date}
            </div>
          </div>
        </div>

        {/* Show nested child tasks within the parent card */}
        {task.children.length > 0 && (
          <div className="border-t pt-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Subtasks:</div>
            {task.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/task/${child.id}`);
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    Step
                  </Badge>
                  <span className="font-medium truncate">{child.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {child.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
