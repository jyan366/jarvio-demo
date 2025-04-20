import { supabase } from "@/integrations/supabase/client";

export interface SupabaseTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  category: string | null;
  created_at: string;
  insight_id?: string | null;
  data?: any;
}

export interface SupabaseSubtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  category?: string | null;
}

// Helper function to ensure we have a demo user for the app
const ensureAuthForDemo = async () => {
  // For demo purposes - ensure we're "authenticated"
  if (!localStorage.getItem('isAuthenticated')) {
    localStorage.setItem('isAuthenticated', 'true');
    console.log("Auto-authenticated user for demo in supabaseTasks.ts");
  }
  
  // Since this is a demo, we'll use a fixed user ID
  const demoUserId = "00000000-0000-0000-0000-000000000000";
  
  // Return the demo user
  return { id: demoUserId };
};

// Fetch all tasks for user
export async function fetchTasks(): Promise<SupabaseTask[]> {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

// Fetch all subtasks for a list of task ids
export async function fetchSubtasks(taskIds: string[]): Promise<SupabaseSubtask[]> {
  try {
    if (taskIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from("subtasks")
      .select("*")
      .in("task_id", taskIds);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
}

// Create task, returns created task
export async function createTask(task: Partial<SupabaseTask> & { title: string }) {
  try {
    await ensureAuthForDemo();
    
    // For demo purposes, we'll use a fixed user ID
    const user = { id: "00000000-0000-0000-0000-000000000000" };
    
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
}

// Create multiple subtasks, returns array of created subtasks
export async function createSubtasks(subtasks: { task_id: string; title: string }[]) {
  try {
    if (subtasks.length === 0) return [];
    
    const payload = subtasks.map(st => ({ 
      ...st, 
      completed: false,
      description: "",
      status: "",
      priority: "",
      category: ""
    }));
    
    const { data, error } = await supabase
      .from("subtasks")
      .insert(payload)
      .select();
      
    if (error) {
      console.error("Error creating subtasks:", error);
      throw new Error(`Failed to create subtasks: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    console.error("Error in createSubtasks:", error);
    throw error;
  }
}

// Add a single subtask
export async function addSubtask(task_id: string, title: string) {
  try {
    const { data, error } = await supabase
      .from("subtasks")
      .insert({ 
        task_id, 
        title, 
        completed: false,
        description: "",
        status: "",
        priority: "",
        category: ""
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding subtask:", error);
    throw error;
  }
}

// Remove a subtask
export async function deleteSubtask(id: string) {
  try {
    const { error } = await supabase
      .from("subtasks")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
}

// Toggle subtask completion
export async function toggleSubtask(id: string, completed: boolean) {
  try {
    const { data, error } = await supabase
      .from("subtasks")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error toggling subtask:", error);
    throw error; 
  }
}

// Initialize sample data - for development only
export async function initializeSampleTasks(): Promise<SupabaseTask[]> {
  try {
    // First check if we already have tasks
    const { data: existingTasks } = await supabase
      .from("tasks")
      .select("*");
      
    if (existingTasks && existingTasks.length > 0) {
      // We already have tasks, so just return them
      return existingTasks;
    }
    
    await ensureAuthForDemo();
    // For demo purposes, we'll use a fixed user ID
    const user = { id: "00000000-0000-0000-0000-000000000000" };
    
    const sampleTasks = [
      {
        title: 'Fix Main Images for Suppressed Listings',
        description: 'Update main product images to comply with Amazon\'s policy requirements to get listings unsuppressed.',
        status: 'Not Started',
        priority: 'HIGH',
        category: 'LISTINGS',
      },
      {
        title: 'Monitor Listing Status',
        description: 'After updating the main images, continuously monitor the status of the affected listings to ensure they are no longer suppressed.',
        status: 'Not Started',
        priority: 'MEDIUM',
        category: 'LISTINGS',
      },
      {
        title: 'Resolve Support Cases 2101',
        description: 'My listing was removed due to an ingredient detected in the product "Guava". This is not in the product and appears to be a listing error.',
        status: 'Not Started',
        priority: 'HIGH',
        category: 'SUPPORT',
      },
      {
        title: 'Identify Suppressed Listings',
        description: 'Review listings to identify those that are currently suppressed due to non-compliance with Amazon\'s policies.',
        status: 'Not Started',
        priority: 'LOW',
        category: 'LISTINGS',
      },
      {
        title: 'Review and Address Customer Feedback',
        description: 'Analyze all 1-star reviews to understand issues raised by customers, focusing on listing inaccuracies and quality concerns.',
        status: 'In Progress',
        priority: 'HIGH',
        category: 'REVIEWS',
      },
      {
        title: 'Analyze Reviews for Keyword Opportunities',
        description: 'Examine 5-star reviews to identify any keywords frequently mentioned that are not currently included in product metadata.',
        status: 'In Progress',
        priority: 'MEDIUM',
        category: 'KEYWORDS',
      },
      {
        title: 'Update Product Descriptions',
        description: 'Revise product descriptions to include new keywords identified from customer reviews and improve SEO ranking.',
        status: 'In Progress',
        priority: 'LOW',
        category: 'LISTINGS',
      },
      {
        title: 'Resolve Listing Suppression',
        description: 'Identified and resolved issues with suppressed listings to reinstate them on the marketplace.',
        status: 'Done',
        priority: 'HIGH',
        category: 'LISTINGS',
      },
      {
        title: 'Assess Inventory Impact',
        description: 'Evaluated the potential impact on sales and inventory turnover due to the suppression of best-seller listings.',
        status: 'Done',
        priority: 'MEDIUM',
        category: 'INVENTORY',
      },
      {
        title: 'Analyze Competitor Pricing',
        description: 'Examined competitor pricing for best sellers to identify if price adjustments are needed to win back the Buy Box.',
        status: 'Done',
        priority: 'LOW',
        category: 'PRICING',
      }
    ];
    
    // Add user_id to all tasks
    const tasksWithUserId = sampleTasks.map(task => ({
      ...task,
      user_id: user.id
    }));
    
    // Insert all tasks
    const { data, error } = await supabase
      .from("tasks")
      .insert(tasksWithUserId)
      .select();
      
    if (error) {
      console.error("Error initializing sample tasks:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error in initializeSampleTasks:", error);
    throw error;
  }
}

// Add sample subtasks to a specific task
export async function addSampleSubtasksToTask(taskId: string, taskTitle: string): Promise<SupabaseSubtask[]> {
  try {
    let subtasks: { task_id: string; title: string }[] = [];
    
    // Based on the task title, add relevant subtasks
    if (taskTitle.includes('Fix Main Images')) {
      subtasks = [
        { task_id: taskId, title: 'Update Amazon listing images' },
        { task_id: taskId, title: 'Verify compliance' }
      ];
    } else if (taskTitle.includes('Support Cases')) {
      subtasks = [
        { task_id: taskId, title: 'Check ingredient report' },
        { task_id: taskId, title: 'Submit support case' }
      ];
    } else if (taskTitle.includes('Review') && taskTitle.includes('Customer')) {
      subtasks = [
        { task_id: taskId, title: 'Collect all 1-star reviews' },
        { task_id: taskId, title: 'Categorize issues by frequency' },
        { task_id: taskId, title: 'Draft responses to reviews' }
      ];
    } else {
      // Generic subtasks for other tasks
      subtasks = [
        { task_id: taskId, title: 'Research requirements' },
        { task_id: taskId, title: 'Implement solution' }
      ];
    }
    
    // Create the subtasks
    return await createSubtasks(subtasks);
  } catch (error) {
    console.error("Error adding sample subtasks:", error);
    throw error;
  }
}
