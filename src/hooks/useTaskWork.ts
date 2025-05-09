
import { useState, useEffect } from 'react';
import { TaskData, SubtaskData } from '@/lib/supabaseTasks';
import {
  getTask,
  updateTask,
  getSubtasks,
  createSubtasks,
  updateSubtask,
  deleteSubtask,
  deleteTask,
} from '@/lib/supabaseTasks';
import { useToast } from "@/hooks/use-toast";

export const useTaskWork = () => {
  // State variables
  const [task, setTask] = useState<TaskData | null>(null);
  const [subtasks, setSubtasks] = useState<SubtaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [focusedSubtaskIdx, setFocusedSubtaskIdx] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<"comments" | "ai">("comments");
  const [commentValue, setCommentValue] = useState<string>("");
  const [taskState, setTaskState] = useState<any>(null);
  const [subtaskDialogIdx, setSubtaskDialogIdx] = useState<number | null>(null);
  const [subtaskData, setSubtaskData] = useState<any>({});

  const { toast } = useToast();

  // Computed properties
  const completedSubtasksCount = subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasksCount = subtasks.length;
  const progressPercentage = totalSubtasksCount === 0 ? 0 : (completedSubtasksCount / totalSubtasksCount) * 100;

  // Function to fetch task and subtasks
  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await getTask(taskId);
      if (taskData) {
        setTask(taskData);
        setTaskState(taskData);
        await fetchSubtasks(taskId);
      } else {
        setError("Task not found.");
      }
    } catch (e) {
      setError("Failed to load task.");
      console.error("Error fetching task:", e);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch subtasks
  const fetchSubtasks = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      const subtasksData = await getSubtasks(taskId);
      setSubtasks(subtasksData || []);
    } catch (e) {
      setError("Failed to load subtasks.");
      console.error("Error fetching subtasks:", e);
    } finally {
      setLoading(false);
    }
  };

  // Function to update task
  const handleUpdateTask = async (field: keyof TaskData, value: any) => {
    if (!task) return;
    
    try {
      const updates: Partial<TaskData> = { [field]: value };
      const updatedTask = await updateTask(task.id!, updates);
      
      if (updatedTask) {
        setTask(updatedTask);
        setTaskState(updatedTask);
        setToastMessage("Task updated successfully.");
      } else {
        setError("Failed to update task.");
      }
    } catch (e) {
      setError("Failed to update task.");
      console.error("Error updating task:", e);
    }
  };

  // Function to create subtasks
  const handleGenerateSteps = async () => {
    if (!task) return;
    
    try {
      setIsGenerating(true);
      const createdSteps = await createSubtasks(task.id!, []);
      
      if (createdSteps) {
        setSubtasks(createdSteps);
      }
      
      return Array.isArray(createdSteps) ? createdSteps : [];
    } catch (error) {
      console.error("Error creating steps:", error);
      setError("Failed to create subtasks.");
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to toggle subtask completion
  const handleToggleSubtask = async (index: number) => {
    if (!task) return;
    
    const subtask = subtasks[index];
    if (!subtask) return;
    
    const newCompleted = !subtask.completed;
    
    try {
      const updatedSubtask = await updateSubtask(subtask.id, { completed: newCompleted });
      if (updatedSubtask) {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = { ...newSubtasks[index], completed: newCompleted };
        setSubtasks(newSubtasks);
      }
    } catch (e) {
      console.error("Error toggling subtask:", e);
    }
  };

  // Function to add a subtask
  const handleAddSubtask = async (title: string) => {
    if (!task) return;
    
    try {
      const newSubtask = {
        title,
        task_id: task.id!,
        completed: false,
        order: subtasks.length + 1
      };
      
      const result = await createSubtasks(task.id!, [newSubtask]);
      
      if (result && Array.isArray(result) && result.length > 0) {
        setSubtasks([...subtasks, ...result]);
      }
    } catch (e) {
      console.error("Error adding subtask:", e);
    }
  };

  // Function to remove a subtask
  const handleRemoveSubtask = async (index: number) => {
    const subtask = subtasks[index];
    if (!subtask) return;
    
    try {
      const success = await deleteSubtask(subtask.id);
      if (success) {
        const newSubtasks = subtasks.filter((_, i) => i !== index);
        setSubtasks(newSubtasks);
      }
    } catch (e) {
      console.error("Error removing subtask:", e);
    }
  };

  // Function to focus on a subtask
  const handleFocusSubtask = (index: number) => {
    setFocusedSubtaskIdx(index);
  };

  // Function to update a subtask
  const handleUpdateSubtask = async (field: keyof SubtaskData, value: any) => {
    if (focusedSubtaskIdx === null || !subtasks[focusedSubtaskIdx]) return;
    
    const subtask = subtasks[focusedSubtaskIdx];
    
    try {
      const updates: Partial<SubtaskData> = { [field]: value };
      const updatedSubtask = await updateSubtask(subtask.id, updates);
      
      if (updatedSubtask) {
        const newSubtasks = [...subtasks];
        newSubtasks[focusedSubtaskIdx] = { ...newSubtasks[focusedSubtaskIdx], [field]: value };
        setSubtasks(newSubtasks);
      }
    } catch (e) {
      console.error("Error updating subtask:", e);
    }
  };

  // Function to open subtask dialog
  const handleOpenSubtask = (index: number) => {
    setSubtaskDialogIdx(index);
  };

  // Function to close subtask dialog
  const handleCloseSubtask = () => {
    setSubtaskDialogIdx(null);
  };

  // Function to add a comment
  const handleAddComment = (text: string) => {
    if (!task) return;
    
    const newComment = {
      user: "User",
      text,
      ago: "Just now",
      subtaskId: focusedSubtaskIdx !== null && subtasks[focusedSubtaskIdx] ? subtasks[focusedSubtaskIdx].id : undefined
    };
    
    setTaskState({
      ...taskState,
      comments: [...(taskState.comments || []), newComment]
    });
    
    setCommentValue("");
  };

  // Show toast message when it changes
  useEffect(() => {
    if (toastMessage) {
      toast({
        title: "Task Operation",
        description: toastMessage,
      });
      clearToastMessage();
    }
  }, [toastMessage, toast]);

  // Function to clear toast message
  const clearToastMessage = () => {
    setToastMessage(null);
  };

  return {
    task,
    subtasks,
    loading,
    error,
    fetchTask,
    fetchSubtasks,
    updateTask,
    createSteps: handleGenerateSteps,
    updateSubtask,
    deleteSubtask,
    deleteTask,
    completedSubtasksCount,
    totalSubtasksCount,
    progressPercentage,
    clearToastMessage,
    // Additional properties for TaskWorkContainer
    taskState,
    sidebarOpen,
    setSidebarOpen,
    isGenerating,
    focusedSubtaskIdx,
    selectedTab,
    setSelectedTab,
    commentValue,
    setCommentValue,
    handleUpdateTask,
    handleToggleSubtask,
    handleAddSubtask,
    handleRemoveSubtask,
    handleGenerateSteps,
    handleFocusSubtask,
    handleUpdateSubtask,
    handleOpenSubtask,
    handleAddComment,
    subtaskDialogIdx,
    handleCloseSubtask,
    subtaskData
  };
};
