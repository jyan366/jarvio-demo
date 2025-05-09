
import { supabase } from "@/integrations/supabase/client";

interface TaskData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  category?: string;
  source?: string;
  insight_id?: string;
  data?: Record<string, any>;
}

interface SubtaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  completed?: boolean;
  task_id?: string;
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
      await createSubtasks(taskData.data.subtasks.map((subtask: SubtaskData) => ({
        ...subtask,
        task_id: data.id
      })));
    }

    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Create subtasks for a task
export const createSubtasks = async (subtasks: SubtaskData[]) => {
  try {
    if (!subtasks || subtasks.length === 0) return [];
    
    // Insert all subtasks with the task ID
    const { data, error } = await supabase
      .from('subtasks')
      .insert(
        subtasks.map(subtask => ({
          ...subtask,
          completed: subtask.completed || false
        }))
      )
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating subtasks:', error);
    throw error;
  }
};

// Add a single subtask
export const addSubtask = async (taskId: string, subtaskData: Omit<SubtaskData, 'task_id'>) => {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        ...subtaskData,
        task_id: taskId,
        completed: subtaskData.completed || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding subtask:', error);
    throw error;
  }
};

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Fetch subtasks for specified task IDs
export const fetchSubtasks = async (taskIds: string[]) => {
  try {
    if (!taskIds || taskIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .in('task_id', taskIds);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching subtasks:', error);
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

// Delete a subtask
export const deleteSubtask = async (subtaskId: string) => {
  try {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting subtask:', error);
    throw error;
  }
};

// Toggle subtask completion status
export const toggleSubtask = async (subtaskId: string, completed: boolean) => {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .update({ completed })
      .eq('id', subtaskId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling subtask:', error);
    throw error;
  }
};

// Initialize sample tasks for demo purposes
export const initializeSampleTasks = async () => {
  try {
    const sampleTasks = [
      {
        title: "Review listing content for spring collection",
        description: "Check keyword density, image quality, and bullet points for our spring collection listings.",
        status: "Not Started",
        priority: "HIGH",
        category: "LISTING"
      },
      {
        title: "Analyze competitor price changes",
        description: "Review recent price changes from top 3 competitors and prepare adjustment recommendations.",
        status: "In Progress",
        priority: "MEDIUM",
        category: "STRATEGY"
      },
      {
        title: "Request PPC campaign report",
        description: "Contact marketing team for detailed PPC performance report for Q1.",
        status: "Done",
        priority: "LOW",
        category: "ADVERTISING"
      }
    ];
    
    // Set default user ID for demo purposes
    const userId = "00000000-0000-0000-0000-000000000000";
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(
        sampleTasks.map(task => ({
          ...task,
          user_id: userId
        }))
      )
      .select();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing sample tasks:', error);
    throw error;
  }
};

// Add sample subtasks to a task
export const addSampleSubtasksToTask = async (taskId: string, taskTitle: string) => {
  try {
    let subtasks: SubtaskData[] = [];
    
    // Add different subtasks based on the task title/type
    if (taskTitle.toLowerCase().includes("listing")) {
      subtasks = [
        { title: "Review keywords and search terms", task_id: taskId },
        { title: "Check image quality and compliance", task_id: taskId },
        { title: "Update bullet points for clarity", task_id: taskId },
        { title: "Verify pricing strategy", task_id: taskId }
      ];
    } else if (taskTitle.toLowerCase().includes("competitor")) {
      subtasks = [
        { title: "Gather data from top 3 competitors", task_id: taskId },
        { title: "Compare pricing strategies", task_id: taskId },
        { title: "Analyze listing content differences", task_id: taskId },
        { title: "Document findings in spreadsheet", task_id: taskId }
      ];
    } else if (taskTitle.toLowerCase().includes("ppc") || taskTitle.toLowerCase().includes("campaign")) {
      subtasks = [
        { title: "Request raw data from advertising platform", task_id: taskId },
        { title: "Analyze click-through rates", task_id: taskId },
        { title: "Review cost per acquisition", task_id: taskId },
        { title: "Prepare optimization suggestions", task_id: taskId }
      ];
    } else {
      // Generic subtasks for any other type of task
      subtasks = [
        { title: "Research and gather information", task_id: taskId },
        { title: "Analyze findings", task_id: taskId },
        { title: "Prepare action plan", task_id: taskId },
        { title: "Review and finalize", task_id: taskId }
      ];
    }
    
    // Create the subtasks in the database
    const { data, error } = await supabase
      .from('subtasks')
      .insert(subtasks.map(subtask => ({
        ...subtask,
        completed: false
      })))
      .select();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding sample subtasks:', error);
    throw error;
  }
};
