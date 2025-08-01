import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UnifiedTaskCard } from './UnifiedTaskCard';
import { SimpleCreateTaskDialog } from './SimpleCreateTaskDialog';
import { fetchTaskTree, deleteUnifiedTask } from '@/lib/unifiedTasks';
import { TaskTreeNode } from '@/types/unifiedTask';
import { useToast } from '@/hooks/use-toast';
const statusColumns = [{
  id: 'Not Started',
  title: 'Not Started',
  color: 'bg-gray-100'
}, {
  id: 'In Progress',
  title: 'In Progress',
  color: 'bg-blue-100'
}, {
  id: 'Done',
  title: 'Done',
  color: 'bg-green-100'
}];
interface UnifiedTaskBoardProps {
  onCreateTask?: () => void;
  onTaskDeleted?: () => void;
}
export function UnifiedTaskBoard({
  onCreateTask,
  onTaskDeleted
}: UnifiedTaskBoardProps) {
  const [tasks, setTasks] = useState<TaskTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimpleCreateDialogOpen, setIsSimpleCreateDialogOpen] = useState(false);
  const {
    toast
  } = useToast();
  const loadTasks = async () => {
    try {
      setLoading(true);
      const taskTree = await fetchTaskTree();
      // Filter to show only parent tasks (tasks without parent_id)
      const parentTasks = taskTree.filter(task => !task.parent_id);
      setTasks(parentTasks);
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
        description: "Task and all its children have been deleted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };
  const handleAdvancedCreateTask = () => {
    if (onCreateTask) {
      onCreateTask();
    }
  };
  const handleSimpleTaskCreated = async () => {
    await loadTasks();
    setIsSimpleCreateDialogOpen(false);
  };
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusColumns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        return <Card key={column.id} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className={column.color}>
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm">
                    No tasks in {column.title.toLowerCase()}
                  </div> : columnTasks.map(task => <UnifiedTaskCard key={task.id} task={task} onDelete={handleDeleteTask} onUpdate={loadTasks} />)}
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Simple Create Task Dialog */}
      <SimpleCreateTaskDialog open={isSimpleCreateDialogOpen} onOpenChange={setIsSimpleCreateDialogOpen} onSuccess={handleSimpleTaskCreated} />
    </div>;
}