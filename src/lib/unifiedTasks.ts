
import { supabase } from "@/integrations/supabase/client";
import { UnifiedTask, TaskTreeNode, TaskType } from "@/types/unifiedTask";

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
      data: task.data || undefined,
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
        // For backward compatibility, also add to subtasks
        if (!parent.subtasks) parent.subtasks = [];
        parent.subtasks.push(node);
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

// Create a new task
export async function createUnifiedTask(
  task: Partial<UnifiedTask> & { title: string },
  childTasks?: { title: string; description?: string }[]
) {
  try {
    await ensureAuthForDemo();
    const user = { id: "00000000-0000-0000-0000-000000000000" };
    
    const { data, error } = await supabase
      .from("tasks")
      .insert({ 
        ...task, 
        user_id: user.id,
        task_type: task.task_type || 'task'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
    
    // If child tasks were provided, create them
    if (childTasks && childTasks.length > 0 && data) {
      try {
        const childTasksWithParent = childTasks.map(ct => ({
          title: ct.title,
          description: ct.description || "",
          parent_id: data.id,
          user_id: user.id,
          task_type: 'step' as TaskType,
          status: 'Not Started' as const,
          priority: 'MEDIUM' as const,
          category: data.category || ''
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
export async function addChildTask(parentId: string, title: string, description?: string) {
  try {
    const user = await ensureAuthForDemo();
    
    const { data, error } = await supabase
      .from("tasks")
      .insert({ 
        title,
        description: description || "",
        parent_id: parentId,
        user_id: user.id,
        task_type: 'step',
        status: 'Not Started',
        priority: 'MEDIUM',
        category: ''
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding child task:", error);
    throw error;
  }
}

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

// Convert flow to unified task structure
export async function convertFlowToUnifiedTask(flow: any) {
  try {
    const childTasks = flow.blocks?.map((block: any) => ({
      title: block.name || `${block.type}: ${block.option}`,
      description: `Flow step: ${block.option}`
    })) || [];
    
    const task = await createUnifiedTask({
      title: `Flow: ${flow.name}`,
      description: flow.description,
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'FLOW',
      task_type: 'flow',
      data: { flowId: flow.id, flowTrigger: flow.trigger }
    }, childTasks);
    
    return task;
  } catch (error) {
    console.error('Error converting flow to unified task:', error);
    throw error;
  }
}
