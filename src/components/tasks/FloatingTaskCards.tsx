import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchTaskTree } from '@/lib/unifiedTasks';
import { TaskTreeNode } from '@/types/unifiedTask';
import { useNavigate } from 'react-router-dom';

const FloatingTaskCards: React.FC = () => {
  const [tasks, setTasks] = useState<TaskTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskTree = await fetchTaskTree();
        // Get only parent tasks (tasks without parent_id) for the scroller
        const parentTasks = taskTree.filter(task => !task.parent_id);
        setTasks(parentTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Not Started':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b">
      <div className="relative">
        <div 
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="flex-shrink-0 w-80 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleTaskClick(task.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
                      {task.title}
                    </h3>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      {task.children.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {task.children.length} subtask{task.children.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {task.category && (
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-right">
                    {task.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/95 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/95 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default FloatingTaskCards;