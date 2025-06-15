
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash } from 'lucide-react';
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
        
        <div className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  );
}
