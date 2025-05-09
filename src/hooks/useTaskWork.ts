import { ref, computed } from 'vue';
import { TaskData, SubtaskData } from '@/lib/supabaseTasks';
import {
  getTask,
  updateTask as updateTaskInSupabase,
  getSubtasks as getSubtasksFromSupabase,
  createSubtasks as createSubtasksInSupabase,
  updateSubtask as updateSubtaskInSupabase,
  deleteSubtask as deleteSubtaskInSupabase,
  deleteTask as deleteTaskInSupabase,
} from '@/lib/supabaseTasks';
import { useToast } from "@/hooks/use-toast";

// Reactive references
const task = ref<TaskData | null>(null);
const subtasks = ref<SubtaskData[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const toastMessage = ref<string | null>(null);

// Computed properties
const completedSubtasksCount = computed(() => {
  return subtasks.value.filter(subtask => subtask.status === 'completed').length;
});

const totalSubtasksCount = computed(() => {
  return subtasks.value.length;
});

const progressPercentage = computed(() => {
  if (totalSubtasksCount.value === 0) return 0;
  return (completedSubtasksCount.value / totalSubtasksCount.value) * 100;
});

// Function to fetch task and subtasks
const fetchTask = async (taskId: string) => {
  try {
    loading.value = true;
    error.value = null;
    task.value = await getTask(taskId);
    if (task.value) {
      await fetchSubtasks(taskId);
    } else {
      error.value = "Task not found.";
    }
  } catch (e) {
    error.value = "Failed to load task.";
    console.error("Error fetching task:", e);
  } finally {
    loading.value = false;
  }
};

// Function to fetch subtasks
const fetchSubtasks = async (taskId: string) => {
  try {
    loading.value = true;
    error.value = null;
    subtasks.value = await getSubtasksFromSupabase(taskId) || [];
  } catch (e) {
    error.value = "Failed to load subtasks.";
    console.error("Error fetching subtasks:", e);
  } finally {
    loading.value = false;
  }
};

// Function to update task
const updateTask = async (taskId: string, updates: Partial<TaskData>) => {
  try {
    loading.value = true;
    error.value = null;
    const updatedTask = await updateTaskInSupabase(taskId, updates);
    if (updatedTask) {
      task.value = updatedTask;
      toastMessage.value = "Task updated successfully.";
    } else {
      error.value = "Failed to update task.";
    }
  } catch (e) {
    error.value = "Failed to update task.";
    console.error("Error updating task:", e);
  } finally {
    loading.value = false;
  }
};

// Function to create subtasks
// Fix for error TS2554: Expected 2 arguments, but got 1
const createSteps = async (taskId: string) => {
  try {
    loading.value = true;
    const createdSteps = await createSubtasksInSupabase(taskId, []); // Adding empty array as second argument
    
    // Fix for error TS18047: 'createdSteps' is possibly 'null'
    if (createdSteps) {
      subtasks.value = createdSteps; // Use createdSteps only if not null
    }
    
    // Fix for error TS2339: Property 'map' does not exist on type 'never'
    if (Array.isArray(subtasks.value)) {
      return subtasks.value;
    }
    return [];
  } catch (error) {
    console.error("Error creating steps:", error);
    error.value = "Failed to create subtasks.";
    return [];
  } finally {
    loading.value = false;
  }
};

// Function to update subtask
const updateSubtask = async (subtaskId: string, updates: Partial<SubtaskData>) => {
  try {
    loading.value = true;
    error.value = null;
    const updatedSubtask = await updateSubtaskInSupabase(subtaskId, updates);
    if (updatedSubtask) {
      // Optimistically update the subtask in the local array
      subtasks.value = subtasks.value.map(st => st.id === subtaskId ? { ...st, ...updates } : st);
      toastMessage.value = "Subtask updated successfully.";
    } else {
      error.value = "Failed to update subtask.";
    }
  } catch (e) {
    error.value = "Failed to update subtask.";
    console.error("Error updating subtask:", e);
  } finally {
    loading.value = false;
  }
};

// Function to delete subtask
const deleteSubtask = async (subtaskId: string) => {
  try {
    loading.value = true;
    error.value = null;
    const success = await deleteSubtaskInSupabase(subtaskId);
    if (success) {
      // Optimistically remove the subtask from the local array
      subtasks.value = subtasks.value.filter(st => st.id !== subtaskId);
      toastMessage.value = "Subtask deleted successfully.";
    } else {
      error.value = "Failed to delete subtask.";
    }
  } catch (e) {
    error.value = "Failed to delete subtask.";
    console.error("Error deleting subtask:", e);
  } finally {
    loading.value = false;
  }
};

// Function to delete task
const deleteTask = async (taskId: string) => {
  try {
    loading.value = true;
    error.value = null;
    const success = await deleteTaskInSupabase(taskId);
    if (success) {
      toastMessage.value = "Task deleted successfully.";
    } else {
      error.value = "Failed to delete task.";
    }
    return success; // Return success status
  } catch (e) {
    error.value = "Failed to delete task.";
    console.error("Error deleting task:", e);
    return false; // Return failure status
  } finally {
    loading.value = false;
  }
};

// Function to clear toast message
const clearToastMessage = () => {
  toastMessage.value = null;
};

// Expose the state and actions
export const useTaskWork = () => {
  const { toast } = useToast();

  // Watch toastMessage and show toast when it changes
  if (toastMessage.value) {
    toast({
      title: "Task Operation",
      description: toastMessage.value,
    });
    clearToastMessage();
  }

  return {
    task,
    subtasks,
    loading,
    error,
    fetchTask,
    fetchSubtasks,
    updateTask,
    createSteps,
    updateSubtask,
    deleteSubtask,
    deleteTask,
    completedSubtasksCount,
    totalSubtasksCount,
    progressPercentage,
    clearToastMessage,
  };
};
