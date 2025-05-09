
import { supabase } from "@/integrations/supabase/client";

interface TaskData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  category?: string;
  source?: string;
  data?: Record<string, any>;
  insight_id?: string; // Add this field to fix the error
}

interface SubtaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  completed?: boolean;
  task_id: string; // Making task_id required to fix the TypeScript error
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
export const createSubtasks = async (taskId: string, subtasks: Omit<SubtaskData, 'task_id'>[]) => {
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

// Fetch tasks
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

// Add a subtask to a task
export const addSubtask = async (taskId: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title,
        completed: false
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

// Toggle subtask completion
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
        title: "Optimize Amazon Listing for Kitchen Knife",
        description: "Improve the title, bullet points, and description for our chef's knife listing to increase conversions.",
        status: "Not Started",
        priority: "HIGH",
        category: "LISTING_OPTIMIZATION"
      },
      {
        title: "Research Competitors for New Product Launch",
        description: "Analyze top 5 competitors for our new product to identify market gaps and pricing strategy.",
        status: "In Progress",
        priority: "MEDIUM",
        category: "MARKET_RESEARCH"
      },
      {
        title: "Review PPC Campaign Performance",
        description: "Analyze the last 30 days of PPC campaign data and adjust bids for underperforming keywords.",
        status: "Not Started",
        priority: "CRITICAL",
        category: "ADVERTISING"
      }
    ];

    const userId = "00000000-0000-0000-0000-000000000000"; // Demo user ID
    
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
    
    if (taskTitle.includes("Optimize Amazon Listing")) {
      subtasks = [
        { task_id: taskId, title: "Research top keywords for kitchen knives", completed: false },
        { task_id: taskId, title: "Analyze competitor listings for insights", completed: false },
        { task_id: taskId, title: "Rewrite product title with primary keywords", completed: false },
        { task_id: taskId, title: "Update bullet points to highlight benefits", completed: false },
        { task_id: taskId, title: "Enhance product description with detailed features", completed: false }
      ];
    } else if (taskTitle.includes("Research Competitors")) {
      subtasks = [
        { task_id: taskId, title: "Identify top 5 competitors in niche", completed: true },
        { task_id: taskId, title: "Compare pricing strategies across competitors", completed: true },
        { task_id: taskId, title: "Analyze product features and differentiators", completed: false },
        { task_id: taskId, title: "Review customer feedback on competitor products", completed: false },
        { task_id: taskId, title: "Compile findings into competitive analysis report", completed: false }
      ];
    } else if (taskTitle.includes("Review PPC Campaign")) {
      subtasks = [
        { task_id: taskId, title: "Export campaign data from last 30 days", completed: false },
        { task_id: taskId, title: "Identify keywords with ACoS > 30%", completed: false },
        { task_id: taskId, title: "Find converting keywords with low impressions", completed: false },
        { task_id: taskId, title: "Adjust bids for underperforming keywords", completed: false },
        { task_id: taskId, title: "Create negative keyword list for irrelevant searches", completed: false }
      ];
    } else {
      // Default subtasks for any other task
      subtasks = [
        { task_id: taskId, title: "Research and planning", completed: false },
        { task_id: taskId, title: "Initial implementation", completed: false },
        { task_id: taskId, title: "Review and quality check", completed: false },
        { task_id: taskId, title: "Final adjustments", completed: false },
        { task_id: taskId, title: "Completion and reporting", completed: false }
      ];
    }
    
    const { data, error } = await supabase
      .from('subtasks')
      .insert(subtasks);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding sample subtasks:', error);
    throw error;
  }
};
