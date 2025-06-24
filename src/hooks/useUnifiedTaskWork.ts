import { useState, useEffect } from 'react';
import { 
  fetchTaskById, 
  fetchChildTasks, 
  updateUnifiedTask, 
  addChildTask, 
  deleteUnifiedTask,
  markStepCompleted 
} from '@/lib/unifiedTasks';
import { UnifiedTask } from '@/types/unifiedTask';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { useToast } from '@/hooks/use-toast';

export function useUnifiedTaskWork(taskId: string) {
  const [task, setTask] = useState<UnifiedTask | null>(null);
  const [childTasks, setChildTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [taskData, childData] = await Promise.all([
        fetchTaskById(taskId),
        fetchChildTasks(taskId)
      ]);
      
      if (!taskData) {
        setError('Task not found');
        return;
      }
      
      setTask(taskData);
      setChildTasks(childData);
    } catch (err) {
      console.error('Error loading task:', err);
      setError('Failed to load task');
      toast({
        title: "Error",
        description: "Failed to load task data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (updates: Partial<UnifiedTask>) => {
    if (!task) return;
    
    try {
      await updateUnifiedTask(task.id, updates);
      setTask(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const updateTaskSteps = async (steps: string[]) => {
    if (!task) return;
    
    try {
      const updatedData = {
        ...task.data,
        flowSteps: steps.map((step, index) => ({
          id: crypto.randomUUID(),
          title: step,
          description: "",
          completed: false,
          order: index
        }))
      };
      
      await updateUnifiedTask(task.id, { data: updatedData });
      setTask(prev => prev ? { ...prev, data: updatedData } : null);
    } catch (error) {
      console.error('Failed to update task steps:', error);
    }
  };

  const updateFlowSteps = async (flowSteps: FlowStep[]) => {
    if (!task) return;
    
    try {
      const updatedData = {
        ...task.data,
        flowSteps
      };
      
      await updateUnifiedTask(task.id, { data: updatedData });
      setTask(prev => prev ? { ...prev, data: updatedData } : null);
    } catch (error) {
      console.error('Failed to update flow steps:', error);
    }
  };

  const updateFlowBlocks = async (flowBlocks: FlowBlock[]) => {
    if (!task) return;
    
    try {
      const updatedData = {
        ...task.data,
        flowBlocks
      };
      
      await updateUnifiedTask(task.id, { data: updatedData });
      setTask(prev => prev ? { ...prev, data: updatedData } : null);
    } catch (error) {
      console.error('Failed to update flow blocks:', error);
    }
  };

  const updateFlowData = async (flowSteps: FlowStep[], flowBlocks: FlowBlock[]) => {
    if (!task) return;
    
    try {
      const updatedData = {
        ...task.data,
        flowSteps,
        flowBlocks
      };
      
      await updateUnifiedTask(task.id, { data: updatedData });
      setTask(prev => prev ? { ...prev, data: updatedData } : null);
    } catch (error) {
      console.error('Failed to update flow data:', error);
    }
  };

  const addChild = async (title: string, description?: string) => {
    if (!task) return;
    
    try {
      const newChild = await addChildTask(task.id, title, description);
      setChildTasks(prev => [...prev, newChild]);
      return newChild;
    } catch (error) {
      throw error;
    }
  };

  const removeChild = async (childId: string) => {
    try {
      await deleteUnifiedTask(childId);
      setChildTasks(prev => prev.filter(child => child.id !== childId));
    } catch (error) {
      throw error;
    }
  };

  const markStepComplete = async (stepIndex: number, executionLog?: string) => {
    if (!task) return;
    
    try {
      await markStepCompleted(task.id, stepIndex, executionLog);
      await loadTask(); // Reload to get updated data
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  return {
    task,
    childTasks,
    loading,
    error,
    updateTask,
    updateTaskSteps,
    updateFlowSteps,
    updateFlowBlocks,
    updateFlowData,
    addChild,
    removeChild,
    markStepComplete,
    refresh: loadTask
  };
}
