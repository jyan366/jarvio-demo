
import { supabase } from "@/integrations/supabase/client";

interface TaskData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  category?: string;
  source?: string;
  data?: Record<string, any>;
}

interface SubtaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  completed?: boolean;
}

// Create a new task
export const createTask = async (taskData: TaskData) => {
  try {
    // Set default user ID for demo purposes
    // In a real app, you'd get this from authentication
    const userId = "00000000-0000-0000-0000-000000000000";

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;

    // If there are subtasks in the data field, create them
    if (taskData.data?.subtasks) {
      await createSubtasks(data.id, taskData.data.subtasks);
    }

    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Create subtasks for a task
export const createSubtasks = async (taskId: string, subtasks: SubtaskData[]) => {
  try {
    // Insert all subtasks with the task ID
    const { data, error } = await supabase
      .from('subtasks')
      .insert(
        subtasks.map(subtask => ({
          ...subtask,
          task_id: taskId,
          completed: subtask.completed || false
        }))
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating subtasks:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId: string, updates: Partial<TaskData>) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    // First delete all subtasks
    await supabase
      .from('subtasks')
      .delete()
      .eq('task_id', taskId);

    // Then delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
