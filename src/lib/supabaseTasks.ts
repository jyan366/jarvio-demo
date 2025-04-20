
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
}

// Fetch all tasks for user
export async function fetchTasks(): Promise<SupabaseTask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Fetch all subtasks for a list of task ids
export async function fetchSubtasks(taskIds: string[]): Promise<SupabaseSubtask[]> {
  if (taskIds.length === 0) return [];
  const { data, error } = await supabase
    .from("subtasks")
    .select("*")
    .in("task_id", taskIds);

  if (error) throw error;
  return data || [];
}

// Create task, returns created task
export async function createTask(task: Partial<SupabaseTask>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Create multiple subtasks, returns array of created subtasks
export async function createSubtasks(subtasks: { task_id: string; title: string }[]) {
  if (subtasks.length === 0) return [];
  const payload = subtasks.map(st => ({ ...st, completed: false }));
  const { data, error } = await supabase
    .from("subtasks")
    .insert(payload)
    .select();
  if (error) throw error;
  return data || [];
}

// Add a single subtask
export async function addSubtask(task_id: string, title: string) {
  const { data, error } = await supabase
    .from("subtasks")
    .insert({ task_id, title, completed: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Remove a subtask
export async function deleteSubtask(id: string) {
  const { error } = await supabase
    .from("subtasks")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

// Toggle subtask completion
export async function toggleSubtask(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from("subtasks")
    .update({ completed })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
