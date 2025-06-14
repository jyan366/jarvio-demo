
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchTasks, fetchSubtasks } from '@/lib/supabaseTasks';
import { SupabaseTask, SupabaseSubtask } from '@/lib/supabaseTasks';

export interface TaskWorkType {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  date: string;
  subtasks: {
    id: string;
    title: string;
    done: boolean;
    description: string;
    status: string;
    priority: string;
    category: string;
  }[];
  insights?: any[];
  products?: any[];
}

export const useTaskWork = (taskId: string) => {
  const [task, setTask] = useState<TaskWorkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch the main task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) {
        throw new Error(`Failed to fetch task: ${taskError.message}`);
      }

      if (!taskData) {
        throw new Error('Task not found');
      }

      // Fetch child tasks as subtasks
      const childTasks = await fetchSubtasks([taskId]);

      // Transform the data to match TaskWorkType
      const transformedTask: TaskWorkType = {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Not Started',
        priority: taskData.priority || 'MEDIUM',
        category: taskData.category || '',
        date: new Date(taskData.created_at).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        subtasks: childTasks.map(subtask => ({
          id: subtask.id,
          title: subtask.title,
          done: subtask.completed || false,
          description: subtask.description || '',
          status: subtask.status || '',
          priority: subtask.priority || '',
          category: subtask.category || ''
        })),
        insights: [],
        products: []
      };

      setTask(transformedTask);
    } catch (err) {
      console.error('Error loading task:', err);
      setError(err instanceof Error ? err.message : 'Failed to load task');
      toast({
        title: "Error loading task",
        description: err instanceof Error ? err.message : 'Failed to load task',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [taskId, toast]);

  const updateTask = useCallback(async (field: keyof TaskWorkType, value: any) => {
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ [field]: value })
        .eq('id', taskId);

      if (error) throw error;

      setTask(prev => prev ? { ...prev, [field]: value } : null);
      
      toast({
        title: "Task updated",
        description: `${field} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        title: "Error updating task",
        description: err instanceof Error ? err.message : 'Failed to update task',
        variant: "destructive",
      });
    }
  }, [task, taskId, toast]);

  const toggleSubtask = useCallback(async (index: number) => {
    if (!task || !task.subtasks[index]) return;

    const subtask = task.subtasks[index];
    const newDoneStatus = !subtask.done;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newDoneStatus ? 'Done' : 'Not Started' })
        .eq('id', subtask.id);

      if (error) throw error;

      setTask(prev => {
        if (!prev) return null;
        const newSubtasks = [...prev.subtasks];
        newSubtasks[index] = { ...newSubtasks[index], done: newDoneStatus };
        return { ...prev, subtasks: newSubtasks };
      });

      toast({
        title: newDoneStatus ? "Subtask completed" : "Subtask reopened",
        description: `"${subtask.title}" has been ${newDoneStatus ? 'completed' : 'reopened'}.`,
      });
    } catch (err) {
      console.error('Error toggling subtask:', err);
      toast({
        title: "Error updating subtask",
        description: err instanceof Error ? err.message : 'Failed to update subtask',
        variant: "destructive",
      });
    }
  }, [task, toast]);

  const addSubtask = useCallback(async (title: string) => {
    if (!task || !title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          parent_id: taskId,
          user_id: "00000000-0000-0000-0000-000000000000",
          task_type: 'task',
          status: 'Not Started',
          priority: 'MEDIUM',
          category: '',
          execution_order: task.subtasks.length,
          description: ""
        })
        .select()
        .single();

      if (error) throw error;

      const newSubtask = {
        id: data.id,
        title: data.title,
        done: false,
        description: data.description || '',
        status: data.status || '',
        priority: data.priority || '',
        category: data.category || ''
      };

      setTask(prev => prev ? { ...prev, subtasks: [...prev.subtasks, newSubtask] } : null);

      toast({
        title: "Subtask added",
        description: `"${title}" has been added to the task.`,
      });
    } catch (err) {
      console.error('Error adding subtask:', err);
      toast({
        title: "Error adding subtask",
        description: err instanceof Error ? err.message : 'Failed to add subtask',
        variant: "destructive",
      });
    }
  }, [task, taskId, toast]);

  const removeSubtask = useCallback(async (index: number) => {
    if (!task || !task.subtasks[index]) return;

    const subtask = task.subtasks[index];

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', subtask.id);

      if (error) throw error;

      setTask(prev => {
        if (!prev) return null;
        const newSubtasks = prev.subtasks.filter((_, i) => i !== index);
        return { ...prev, subtasks: newSubtasks };
      });

      toast({
        title: "Subtask removed",
        description: `"${subtask.title}" has been removed from the task.`,
      });
    } catch (err) {
      console.error('Error removing subtask:', err);
      toast({
        title: "Error removing subtask",
        description: err instanceof Error ? err.message : 'Failed to remove subtask',
        variant: "destructive",
      });
    }
  }, [task, toast]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  return {
    task,
    loading,
    error,
    updateTask,
    toggleSubtask,
    addSubtask,
    removeSubtask,
    refreshTask: loadTask
  };
};
