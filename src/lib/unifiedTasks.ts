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

// Parse description into steps for agent execution - FIXED to handle flow steps properly
export function parseTaskSteps(task: UnifiedTask): string[] {
  console.log("Parsing task steps for task:", task.id, "type:", task.task_type, "data:", task.data);
  
  // For flow tasks, extract steps from the stored flow steps
  if (task.data) {
    // Use the actual flow steps that were stored
    if (task.data.flowSteps && Array.isArray(task.data.flowSteps)) {
      console.log("Found flow steps:", task.data.flowSteps);
      return task.data.flowSteps.map((step: any, index: number) => {
        const stepTitle = step.title || `Step ${index + 1}`;
        console.log(`Step ${index + 1}: ${stepTitle}`);
        return stepTitle;
      });
    }
  }
  
  // For regular tasks, parse from description
  const description = task.description || '';
  if (!description.trim()) return [];
  
  // Split by common step indicators
  const steps = description
    .split(/(?:\n|^)(?:\d+\.|[-*•]|\w+\))\s+/)
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());
  
  // If no clear steps found, treat entire description as one step
  if (steps.length <= 1) {
    return [description.trim()];
  }
  
  return steps;
}

// Mark a step as completed
export async function markStepCompleted(taskId: string, stepIndex: number, executionLog?: string) {
  try {
    // First, fetch current task to get existing completed steps
    const task = await fetchTaskById(taskId);
    if (!task) throw new Error("Task not found");
    
    const currentCompleted = task.steps_completed || [];
    const currentLog = task.step_execution_log || [];
    
    // Add step index if not already completed
    const updatedCompleted = currentCompleted.includes(stepIndex) 
      ? currentCompleted 
      : [...currentCompleted, stepIndex];
    
    // Add execution log entry
    const updatedLog = [
      ...currentLog,
      {
        stepIndex,
        completedAt: new Date().toISOString(),
        log: executionLog || `Step ${stepIndex + 1} completed`
      }
    ];
    
    const { data, error } = await supabase
      .from("tasks")
      .update({
        steps_completed: updatedCompleted,
        step_execution_log: updatedLog
      })
      .eq("id", taskId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
    
    // Create child tasks if provided and not a flow task
    if (childTasks && childTasks.length > 0 && data && !task.saved_to_flows) {
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
      } catch (subtaskError) {
        console.error("Error creating child tasks for new task:", subtaskError);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in createUnifiedTask:", error);
    throw error;
  }
}

// Add a child task to an existing task
export async function addChildTask(parentId: string, title: string, description?: string, execution_order?: number) {
  try {
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
    
    // Generate steps with AI for the child task
    if (data?.id) {
      const prompt = `${title}. ${description || ''}`;
      try {
        await generateStepsWithAI(data.id, prompt);
      } catch (stepError) {
        console.error("Error generating steps for child task:", stepError);
        // Don't throw here, the task was created successfully
      }
    }
    
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

// Add the generateStepsWithAI function that was in CreateTaskFlow
const generateStepsWithAI = async (taskId: string, prompt: string) => {
  try {
    console.log("Generating steps for task:", taskId, "with prompt:", prompt);
    
    const response = await supabase.functions.invoke('generate-flow', {
      body: {
        prompt: prompt,
        blockOptions: {
          collect: ['User Text', 'File Upload', 'Data Import', 'Form Input'],
          think: ['Basic AI Analysis', 'Advanced Reasoning', 'Data Processing', 'Pattern Recognition'],
          act: ['AI Summary', 'Send Email', 'Create Report', 'Update Database', 'API Call'],
          agent: ['Agent']
        }
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data || response.data.success === false) {
      const errorMsg = response.data?.error || "Unknown error occurred";
      throw new Error(errorMsg);
    }

    const generatedFlow = response.data.generatedFlow;

    if (generatedFlow?.blocks && Array.isArray(generatedFlow.blocks)) {
      // Convert blocks to flow steps and blocks
      const flowSteps = generatedFlow.blocks.map((block: any, index: number) => ({
        id: generateUUID(),
        title: block.name || `Step ${index + 1}`,
        description: "",
        completed: false,
        order: index,
        blockId: generateUUID()
      }));

      const flowBlocks = generatedFlow.blocks.map((block: any, index: number) => ({
        id: flowSteps[index].blockId,
        type: block.type || 'collect',
        option: block.option || 'User Text',
        name: block.name || `Step ${index + 1}`
      }));

      // Update the task with the generated steps
      await updateUnifiedTask(taskId, {
        data: {
          flowSteps,
          flowBlocks
        },
        task_type: 'flow'
      });

      console.log("Successfully generated and saved", flowSteps.length, "steps for task");
    }
  } catch (error) {
    console.error("Error generating steps:", error);
    throw error;
  }
};

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
    console.log("Flow steps being stored:", flow.steps);
    
    // Create a single task with flow steps stored in data field and marked as saved to flows
    const task = await createUnifiedTask({
      title: flow.name,
      description: flow.description,
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'FLOW',
      task_type: 'task', // Now everything is a task
      trigger: flow.trigger || 'manual',
      saved_to_flows: true, // This makes it appear in "Your Flows"
      execution_order: 0,
      data: { 
        flowId: flow.id, 
        flowTrigger: flow.trigger,
        // Store the actual steps from the flow
        flowSteps: flow.steps || [],
        flowBlocks: flow.blocks || [],
        totalSteps: (flow.steps || []).length,
        createdAt: new Date().toISOString()
      }
    });
    
    console.log("Created unified task with data:", task.data);
    
    return task;
  } catch (error) {
    console.error('Error converting flow to unified task:', error);
    throw error;
  }
}
