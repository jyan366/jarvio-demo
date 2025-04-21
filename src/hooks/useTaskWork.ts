import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSubtasks, addSubtask, deleteSubtask, toggleSubtask, createSubtasks } from "@/lib/supabaseTasks";
import { generateTaskSteps, updateTaskState } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TaskWorkType, Subtask, Product } from "@/pages/TaskWorkContainer";

const PRODUCT_IMAGE = "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png";

interface SubtaskData {
  result: string;
  completed: boolean;
  completedAt?: string;
}

type SubtaskDataMap = {
  [subtaskId: string]: SubtaskData;
};

export function useTaskWork() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [taskState, setTaskState] = useState<TaskWorkType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [focusedSubtaskIdx, setFocusedSubtaskIdx] = useState<number | null>(null);
  const [subtaskDialogIdx, setSubtaskDialogIdx] = useState<number | null>(null);
  const [subtaskComments, setSubtaskComments] = useState<{ [subtaskId: string]: { user: string, text: string, ago: string }[] }>({});
  const [selectedTab, setSelectedTab] = useState<"comments" | "ai">("comments");
  const [commentValue, setCommentValue] = useState("");
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});

  const handleUpdateTask = (field: keyof TaskWorkType, value: any) => {
    setTaskState((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleToggleSubtask = async (idx: number) => {
    const sub = taskState?.subtasks[idx];
    if (!sub || !taskState) return;
    
    try {
      await updateTaskState({
        action: 'toggleSubtask',
        taskId: taskState.id,
        subtaskId: sub.id,
        data: { completed: !sub.done }
      });
      
      setTaskState((prev) => {
        if (!prev) return prev;
        const newSubs = [...prev.subtasks];
        newSubs[idx] = { ...newSubs[idx], done: !newSubs[idx].done };
        return { ...prev, subtasks: newSubs };
      });
      
      if (!sub.done && idx === focusedSubtaskIdx) {
        const nextIncompleteIdx = taskState.subtasks.findIndex((s, i) => i > idx && !s.done);
        if (nextIncompleteIdx !== -1) {
          setFocusedSubtaskIdx(nextIncompleteIdx);
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update subtask",
        variant: "destructive"
      });
    }
  };

  const handleAddSubtask = async (val: string) => {
    if (val.trim() && taskState) {
      try {
        const st = await addSubtask(taskState.id, val);
        setTaskState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            subtasks: [
              ...prev.subtasks,
              {
                id: st.id,
                title: st.title,
                done: st.completed ?? false,
                description: st.description ?? "",
                status: st.status ?? "",
                priority: st.priority ?? "",
                category: st.category ?? "",
              },
            ],
          };
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to add subtask",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveSubtask = async (idx: number) => {
    const st = taskState?.subtasks[idx];
    if (!st) return;

    try {
      await deleteSubtask(st.id);
      setTaskState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks.filter((_, i) => i !== idx),
        };
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete subtask",
        variant: "destructive"
      });
    }
  };

  const handleGenerateSteps = async () => {
    if (!taskState) return;
    setIsGenerating(true);
    try {
      const steps = await generateTaskSteps({ title: taskState.title, description: taskState.description });

      if (steps.length === 0) {
        toast({
          title: "No steps generated",
          description: "Could not generate subtasks. Try rewording your task.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      const createdSteps = await createSubtasks(
        steps.map((s) => ({
          task_id: taskState.id,
          title: s.title,
          description: s.description ?? "",
        }))
      );

      setTaskState((prev) => {
        if (!prev) return prev;
        const withNew = [
          ...prev.subtasks,
          ...createdSteps.map((s, i) => {
            return {
              id: s.id,
              title: s.title,
              done: s.completed ?? false,
              description: s.description ?? steps[i]?.description ?? "",
              status: s.status ?? "",
              priority: s.priority ?? "",
              category: s.category ?? "",
            };
          }),
        ];
        return { ...prev, subtasks: withNew };
      });

      toast({
        title: "Steps generated!",
        description: "The main task has been broken down into subtasks.",
        variant: "default"
      });
    } catch (err: any) {
      toast({
        title: "Error generating steps",
        description: typeof err === "object" && err?.message ? err.message : "Could not generate subtasks.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFocusSubtask = (idx: number) => {
    setFocusedSubtaskIdx(idx);
  };

  const handleUpdateSubtask = async (field: keyof Subtask, value: any) => {
    if (focusedSubtaskIdx === null || !taskState) return;
    
    try {
      const subtask = taskState.subtasks[focusedSubtaskIdx];
      
      await updateTaskState({
        action: 'updateSubtask',
        taskId: taskState.id,
        subtaskId: subtask.id,
        data: { field, value }
      });
      
      setTaskState((prev) => {
        if (!prev) return prev;
        const updatedSubs = prev.subtasks.map((st, i) =>
          i === focusedSubtaskIdx ? { ...st, [field]: value } : st
        );
        return { ...prev, subtasks: updatedSubs };
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update subtask",
        variant: "destructive"
      });
    }
  };

  const handleOpenSubtask = (idx: number) => setSubtaskDialogIdx(idx);
  const handleCloseSubtask = () => setSubtaskDialogIdx(null);

  const handleAddComment = async (text: string) => {
    if (text.trim() && focusedSubtaskIdx !== null && taskState) {
      const subtaskId = taskState.subtasks[focusedSubtaskIdx]?.id;
      
      if (subtaskId) {
        try {
          const result = await updateTaskState({
            action: 'addComment',
            taskId: taskState.id,
            subtaskId,
            data: {
              text,
              subtaskId,
              userId: 'you'
            }
          });
          
          const newComment = { 
            user: "you", 
            text, 
            ago: "just now",
            subtaskId
          };
          
          setTaskState(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              comments: [...prev.comments, newComment],
            };
          });
          
          setSubtaskComments(prev => ({
            ...prev,
            [subtaskId]: [...(prev[subtaskId] || []), { user: "you", text, ago: "just now" }]
          }));
          
          setCommentValue("");
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to save comment",
            variant: "destructive"
          });
        }
      }
    }
  };

  const handleSaveSubtaskResult = async (subtaskId: string, result: string) => {
    if (!taskState) return;
    
    try {
      await updateTaskState({
        action: 'saveSubtaskResult',
        taskId: taskState.id,
        subtaskId,
        data: {
          result
        }
      });
      
      setSubtaskData(prev => ({
        ...prev,
        [subtaskId]: {
          ...prev[subtaskId] || {},
          result,
          completed: true,
          completedAt: new Date().toISOString()
        }
      }));
      
      return true;
    } catch (err) {
      console.error("Failed to save subtask result:", err);
      return false;
    }
  };

  useEffect(() => {
    async function loadTask() {
      if (!id) {
        toast({
          title: "Error",
          description: "No task ID provided",
          variant: "destructive"
        });
        navigate("/task-manager");
        return;
      }

      setLoading(true);
      try {
        const { data: taskData, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !taskData) {
          toast({
            title: "Task Not Found",
            description: "The requested task could not be found",
            variant: "destructive"
          });
          navigate("/task-manager");
          return;
        }

        const subtasks = await fetchSubtasks([taskData.id]);
        const normalizedSubs = subtasks.map(st => ({
          id: st.id,
          title: st.title ?? "",
          done: st.completed ?? false,
          description: st.description ?? "",
          status: st.status ?? "",
          priority: st.priority ?? "",
          category: st.category ?? "",
        }));

        const task: TaskWorkType = {
          id: taskData.id,
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status as string,
          priority: taskData.priority || "MEDIUM",
          category: taskData.category || "",
          date: new Date(taskData.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          products: [
            {
              image: PRODUCT_IMAGE,
              name: "Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by The Cultured Food Company",
              asin: "B08P5P3QGC",
              sku: "KM1000",
              price: "16.99",
              units: "111",
              last30Sales: "1155.32",
              last30Units: "68",
            }
          ],
          subtasks: normalizedSubs,
          comments: [{ user: "you", text: "new comment", ago: "2 days ago", subtaskId: normalizedSubs[0]?.id }],
        };

        setTaskState(task);
        
        try {
          const { data: subtaskResults } = await supabase
            .from("subtask_results")
            .select("subtask_id, result, completed_at")
            .eq("task_id", id);
            
          if (subtaskResults && subtaskResults.length > 0) {
            const resultMap: SubtaskDataMap = {};
            subtaskResults.forEach(sr => {
              resultMap[sr.subtask_id] = {
                result: sr.result || "",
                completed: true,
                completedAt: sr.completed_at
              };
            });
            setSubtaskData(resultMap);
          }
        } catch (err) {
          console.log("Could not load subtask work logs:", err);
        }
      } catch (e) {
        console.error("Error loading task:", e);
        toast({
          title: "Error",
          description: "Failed to load task data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    loading,
    taskState,
    setTaskState,
    sidebarOpen,
    setSidebarOpen,
    isGenerating,
    focusedSubtaskIdx,
    setFocusedSubtaskIdx,
    subtaskDialogIdx,
    setSubtaskDialogIdx,
    subtaskComments,
    setSubtaskComments,
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
    handleCloseSubtask,
    handleAddComment,
    handleSaveSubtaskResult,
    subtaskData,
  };
}
