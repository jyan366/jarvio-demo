
import { supabase } from "@/integrations/supabase/client";
import { UnifiedTask, TaskTreeNode, TaskType, TriggerType } from "@/types/unifiedTask";

// Helper function to ensure we have a demo user for the app
const ensureAuthForDemo = async () => {
  if (!localStorage.getItem('isAuthenticated')) {
    localStorage.setItem('isAuthenticated', 'true');
    console.log("Auto-authenticated user for demo in unifiedTasks.ts");
  }
  
  const demoUserId = "00000000-0000-0000-0000-000000000000";
  return { id: demoUserId };
};

// Fetch all tasks and build tree structure
export async function fetchTaskTree(): Promise<TaskTreeNode[]> {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Properly type and transform the database data
    const tasks: UnifiedTask[] = (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: (task.status as UnifiedTask['status']) || 'Not Started',
      priority: (task.priority as UnifiedTask['priority']) || 'MEDIUM',
      category: task.category || "",
      task_type: (task.task_type as TaskType) || 'task',
      parent_id: task.parent_id || undefined,
      user_id: task.user_id,
      created_at: task.created_at || new Date().toISOString(),
      execution_order: task.execution_order || 0,
      data: task.data || undefined,
      trigger: (task.trigger as TriggerType) || 'manual',
      saved_to_flows: task.saved_to_flows || false,
      steps_completed: Array.isArray(task.steps_completed) ? task.steps_completed as number[] : [],
      step_execution_log: Array.isArray(task.step_execution_log) ? task.step_execution_log as Array<{
        stepIndex: number;
        completedAt: string;
        log: string;
      }> : [],
      date: new Date(task.created_at || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));
    
    // Build tree structure
    return buildTaskTree(tasks);
  } catch (error) {
    console.error("Error fetching task tree:", error);
    return [];
  }
}

// Fetch a single task by ID
export async function fetchTaskById(taskId: string): Promise<UnifiedTask | null> {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      status: (data.status as UnifiedTask['status']) || 'Not Started',
      priority: (data.priority as UnifiedTask['priority']) || 'MEDIUM',
      category: data.category || "",
      task_type: (data.task_type as TaskType) || 'task',
      parent_id: data.parent_id || undefined,
      user_id: data.user_id,
      created_at: data.created_at || new Date().toISOString(),
      execution_order: data.execution_order || 0,
      data: data.data || undefined,
      trigger: (data.trigger as TriggerType) || 'manual',
      saved_to_flows: data.saved_to_flows || false,
      steps_completed: Array.isArray(data.steps_completed) ? data.steps_completed as number[] : [],
      step_execution_log: Array.isArray(data.step_execution_log) ? data.step_execution_log as Array<{
        stepIndex: number;
        completedAt: string;
        log: string;
      }> : [],
      date: new Date(data.created_at || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return null;
  }
}

// Fetch child tasks for a specific parent
export async function fetchChildTasks(parentId: string): Promise<UnifiedTask[]> {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("parent_id", parentId)
      .order("execution_order", { ascending: true });

    if (error) throw error;
    
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: (task.status as UnifiedTask['status']) || 'Not Started',
      priority: (task.priority as UnifiedTask['priority']) || 'MEDIUM',
      category: task.category || "",
      task_type: (task.task_type as TaskType) || 'task',
      parent_id: task.parent_id || undefined,
      user_id: task.user_id,
      created_at: task.created_at || new Date().toISOString(),
      execution_order: task.execution_order || 0,
      data: task.data || undefined,
      trigger: (task.trigger as TriggerType) || 'manual',
      saved_to_flows: task.saved_to_flows || false,
      steps_completed: Array.isArray(task.steps_completed) ? task.steps_completed as number[] : [],
      step_execution_log: Array.isArray(task.step_execution_log) ? task.step_execution_log as Array<{
        stepIndex: number;
        completedAt: string;
        log: string;
      }> : [],
      date: new Date(task.created_at || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));
  } catch (error) {
    console.error("Error fetching child tasks:", error);
    return [];
  }
}

// Build hierarchical tree from flat task list
function buildTaskTree(tasks: UnifiedTask[]): TaskTreeNode[] {
  const taskMap = new Map<string, TaskTreeNode>();
  const rootTasks: TaskTreeNode[] = [];
  
  // Create nodes for all tasks
  tasks.forEach(task => {
    taskMap.set(task.id, { ...task, children: [] });
  });
  
  // Build parent-child relationships
  tasks.forEach(task => {
    const node = taskMap.get(task.id)!;
    
    if (task.parent_id) {
      const parent = taskMap.get(task.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        // Parent not found, treat as root
        rootTasks.push(node);
      }
    } else {
      rootTasks.push(node);
    }
  });
  
  return rootTasks;
}

// Get flat list of all descendant tasks
export function getAllDescendants(task: TaskTreeNode): UnifiedTask[] {
  const descendants: UnifiedTask[] = [];
  
  function traverse(node: TaskTreeNode) {
    descendants.push(node);
    node.children.forEach(child => traverse(child));
  }
  
  task.children.forEach(child => traverse(child));
  return descendants;
}

// Simplified: Just return child task titles as steps
export function parseTaskSteps(task: UnifiedTask, childTasks: UnifiedTask[]): string[] {
  console.log("Parsing task steps - using child tasks only");
  
  // Simply return the titles of child tasks in execution order
  return childTasks
    .sort((a, b) => (a.execution_order || 0) - (b.execution_order || 0))
    .map(child => child.title);
}

// Mark a step as completed - now works with child task completion
export async function markStepCompleted(taskId: string, stepIndex: number, executionLog?: string) {
  try {
    // Get child tasks to find the one at stepIndex
    const childTasks = await fetchChildTasks(taskId);
    const childTask = childTasks[stepIndex];
    
    if (!childTask) throw new Error("Child task not found at index");
    
    // Update the child task status
    await updateUnifiedTask(childTask.id, {
      status: 'Done'
    });
    
    return true;
  } catch (error) {
    console.error("Error marking step completed:", error);
    throw error;
  }
}

// Create a new task
export async function createUnifiedTask(
  task: Partial<UnifiedTask> & { title: string },
  childTasks?: { title: string; description?: string; execution_order?: number }[]
) {
  try {
    console.log("=== CREATE UNIFIED TASK DEBUG START ===");
    console.log("Task input:", task);
    console.log("Child tasks:", childTasks);
    
    await ensureAuthForDemo();
    const user = { id: "00000000-0000-0000-0000-000000000000" };
    
    const { data, error } = await supabase
      .from("tasks")
      .insert({ 
        ...task, 
        user_id: user.id,
        task_type: task.task_type || 'task',
        execution_order: task.execution_order || 0,
        trigger: task.trigger || 'manual',
        saved_to_flows: task.saved_to_flows || false,
        steps_completed: [],
        step_execution_log: []
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
    
    console.log("Task created successfully:", data);
    
    // Create child tasks if provided
    if (childTasks && childTasks.length > 0 && data) {
      console.log("Creating child tasks...");
      try {
        const childTasksWithParent = childTasks.map((ct, index) => ({
          title: ct.title,
          description: ct.description || "",
          parent_id: data.id,
          user_id: user.id,
          task_type: 'task' as TaskType,
          status: 'Not Started' as const,
          priority: 'MEDIUM' as const,
          category: data.category || '',
          execution_order: ct.execution_order || index,
          trigger: 'manual' as TriggerType,
          saved_to_flows: false,
          steps_completed: [],
          step_execution_log: []
        }));
        
        await supabase
          .from("tasks")
          .insert(childTasksWithParent);
          
        console.log("Child tasks created successfully");
      } catch (subtaskError) {
        console.error("Error creating child tasks for new task:", subtaskError);
      }
    }
    
    console.log("=== CREATE UNIFIED TASK DEBUG END - SUCCESS ===");
    return data;
  } catch (error) {
    console.error("Error in createUnifiedTask:", error);
    console.log("=== CREATE UNIFIED TASK DEBUG END - ERROR ===");
    throw error;
  }
}

// Add a child task to an existing task
export async function addChildTask(parentId: string, title: string, description?: string, execution_order?: number) {
  try {
    console.log("=== ADD CHILD TASK DEBUG START ===");
    console.log("Parent ID:", parentId);
    console.log("Child title:", title);
    
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .insert({ 
        title,
        description: description || "",
        parent_id: parentId,
        user_id: user.id,
        task_type: 'task',
        status: 'Not Started',
        priority: 'MEDIUM',
        category: '',
        execution_order: execution_order || 0,
        trigger: 'manual' as TriggerType,
        saved_to_flows: false,
        steps_completed: [],
        step_execution_log: []
      })
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Child task created successfully");
    console.log("=== ADD CHILD TASK DEBUG END ===");
    
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      status: (data.status as UnifiedTask['status']) || 'Not Started',
      priority: (data.priority as UnifiedTask['priority']) || 'MEDIUM',
      category: data.category || "",
      task_type: (data.task_type as TaskType) || 'task',
      parent_id: data.parent_id || undefined,
      user_id: data.user_id,
      created_at: data.created_at || new Date().toISOString(),
      execution_order: data.execution_order || 0,
      data: data.data || undefined,
      trigger: (data.trigger as TriggerType) || 'manual',
      saved_to_flows: data.saved_to_flows || false,
      steps_completed: Array.isArray(data.steps_completed) ? data.steps_completed as number[] : [],
      step_execution_log: Array.isArray(data.step_execution_log) ? data.step_execution_log as Array<{
        stepIndex: number;
        completedAt: string;
        log: string;
      }> : [],
      date: new Date(data.created_at || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  } catch (error) {
    console.error("Error adding child task:", error);
    throw error;
  }
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Update task
export async function updateUnifiedTask(taskId: string, updates: Partial<UnifiedTask>) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Delete task and all its children
export async function deleteUnifiedTask(taskId: string) {
  try {
    // The CASCADE constraint will handle deleting children
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// Fetch tasks saved to flows (for "Your Flows" page)
export async function fetchSavedFlows(): Promise<UnifiedTask[]> {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("saved_to_flows", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: (task.status as UnifiedTask['status']) || 'Not Started',
      priority: (task.priority as UnifiedTask['priority']) || 'MEDIUM',
      category: task.category || "",
      task_type: (task.task_type as TaskType) || 'task',
      parent_id: task.parent_id || undefined,
      user_id: task.user_id,
      created_at: task.created_at || new Date().toISOString(),
      execution_order: task.execution_order || 0,
      data: task.data || undefined,
      trigger: (task.trigger as TriggerType) || 'manual',
      saved_to_flows: task.saved_to_flows || false,
      steps_completed: Array.isArray(task.steps_completed) ? task.steps_completed as number[] : [],
      step_execution_log: Array.isArray(task.step_execution_log) ? task.step_execution_log as Array<{
        stepIndex: number;
        completedAt: string;
        log: string;
      }> : [],
      date: new Date(task.created_at || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));
  } catch (error) {
    console.error("Error fetching saved flows:", error);
    return [];
  }
}

// Convert flow to unified task structure - Now creates a task with saved_to_flows = true
export async function convertFlowToUnifiedTask(flow: any) {
  try {
    console.log("Converting flow to unified task:", flow);
    
    // Create a single task with flow steps stored as child tasks
    const task = await createUnifiedTask({
      title: flow.name,
      description: flow.description,
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'FLOW',
      task_type: 'task',
      trigger: flow.trigger || 'manual',
      saved_to_flows: true,
      execution_order: 0,
      data: { 
        flowId: flow.id, 
        flowTrigger: flow.trigger,
        createdAt: new Date().toISOString()
      }
    }, 
    // Create child tasks from flow steps
    flow.steps?.map((step: any, index: number) => ({
      title: step.title || `Step ${index + 1}`,
      description: step.description || "",
      execution_order: index
    })) || []);
    
    console.log("Created unified task with child tasks");
    
    return task;
  } catch (error) {
    console.error('Error converting flow to unified task:', error);
    throw error;
  }
}
