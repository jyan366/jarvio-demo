
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { fetchTaskTree, deleteUnifiedTask } from '@/lib/unifiedTasks';
import { TaskTreeNode } from '@/types/unifiedTask';
import { UnifiedTaskCard } from './UnifiedTaskCard';
import { useToast } from '@/hooks/use-toast';

interface UnifiedTaskBoardProps {
  onCreateTask: () => void;
  onTaskDeleted?: () => void;
}

export function UnifiedTaskBoard({ onCreateTask, onTaskDeleted }: UnifiedTaskBoardProps) {
  const [taskTree, setTaskTree] = useState<TaskTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tree = await fetchTaskTree();
      setTaskTree(tree);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteUnifiedTask(taskId);
      await loadTasks();
      onTaskDeleted?.();
      toast({
        title: "Task deleted",
        description: "Task and all its subtasks have been removed"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  // Get all tasks in flat view (including children)
  const getAllTasks = (nodes: TaskTreeNode[]): TaskTreeNode[] => {
    const allTasks: TaskTreeNode[] = [];
    
    function traverse(node: TaskTreeNode) {
      allTasks.push(node);
      node.children.forEach(child => traverse(child));
    }
    
    nodes.forEach(node => traverse(node));
    return allTasks;
  };

  const allTasks = getAllTasks(taskTree);

  // Group tasks by status for display
  const groupedTasks = {
    'Not Started': allTasks.filter(task => task.status === 'Not Started'),
    'In Progress': allTasks.filter(task => task.status === 'In Progress'),
    'Done': allTasks.filter(task => task.status === 'Done')
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{status}</h2>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <UnifiedTaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onUpdate={loadTasks}
                />
              ))}
            </div>
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                No {status.toLowerCase()} tasks
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
