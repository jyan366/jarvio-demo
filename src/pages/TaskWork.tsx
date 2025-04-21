import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskWorkMain } from "@/components/tasks/TaskWorkMain";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";
import { SubtaskDialog } from "@/components/tasks/SubtaskDialog";
import {
  fetchTasks,
  fetchSubtasks,
  createTask,
  createSubtasks,
  addSubtask,
  deleteSubtask,
  toggleSubtask,
  SupabaseTask,
  SupabaseSubtask
} from "@/lib/supabaseTasks";
import { generateTaskSteps } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PRODUCT_IMAGE = "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png";
const dummyTasks = [
  {
    id: "1",
    title: "Fix Main Images for Suppressed Listings",
    description: "Update main product images to comply with Amazon's policy requirements to get listings unsuppressed.",
    status: "Not Started",
    priority: "HIGH",
    category: "LISTINGS",
    date: "16 Apr 2025",
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
      },
    ],
    subtasks: [
      { id: "st1", title: "Update Amazon listing images", done: false },
      { id: "st2", title: "Verify compliance", done: false },
    ],
    comments: [{ user: "you", text: "new comment", ago: "2 days ago" }],
  },
  {
    id: "3",
    title: "Resolve Support Cases 2101",
    description: 'My listing was removed due to an ingredient detected in the product "Guava". This is not in the product and is a listing error.',
    status: "Not Started",
    priority: "HIGH",
    category: "SUPPORT",
    date: "16 Apr 2025",
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
      },
    ],
    subtasks: [
      { id: "st3", title: "Check ingredient report", done: false },
      { id: "st4", title: "Submit support case", done: true },
    ],
    comments: [{ user: "you", text: "new comment", ago: "2 days ago" }],
  },
];

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}
export interface Product {
  image: string;
  name: string;
  asin: string;
  sku: string;
  price: string;
  units: string;
  last30Sales: string;
  last30Units: string;
}
export interface TaskWorkType {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  date: string;
  products: Product[];
  subtasks: Subtask[];
  comments: { user: string; text: string; ago: string }[];
}

export default function TaskWork() {
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
              image: "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png",
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
          comments: [{ user: "you", text: "new comment", ago: "2 days ago" }],
        };
        
        setTaskState(task);
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
  }, [id, navigate, toast]);

  if (loading) return (
    <MainLayout>
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading task...</p>
      </div>
    </MainLayout>
  );
  
  if (!taskState) return (
    <MainLayout>
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Task not found</p>
      </div>
    </MainLayout>
  );

  const handleToggleSubtask = async (idx: number) => {
    const sub = taskState.subtasks[idx];
    try {
      await toggleSubtask(sub.id, !sub.done);
      setTaskState((prev) => {
        if (!prev) return prev;
        const newSubs = [...prev.subtasks];
        newSubs[idx] = { ...newSubs[idx], done: !newSubs[idx].done };
        return { ...prev, subtasks: newSubs };
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update subtask",
        variant: "destructive"
      });
    }
  };

  const handleAddSubtask = async (val: string) => {
    if (val.trim()) {
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
    const st = taskState.subtasks[idx];
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
      
      console.log("Steps from API:", steps);
      
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
      
      console.log("Created steps:", createdSteps);
      
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

  const handleAddComment = (text: string) => {
    if (text.trim()) {
      setTaskState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...prev.comments, { user: "you", text, ago: "now" }],
        };
      });
      setCommentValue("");
    }
  };

  const handleUpdateTask = (field: keyof TaskWorkType, value: any) => {
    setTaskState((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleFocusSubtask = (idx: number) => {
    setFocusedSubtaskIdx(idx);
  };

  const handleUpdateSubtask = (field: keyof Subtask, value: any) => {
    if (focusedSubtaskIdx === null) return;
    setTaskState((prev) => {
      if (!prev) return prev;
      const updatedSubs = prev.subtasks.map((st, i) =>
        i === focusedSubtaskIdx ? { ...st, [field]: value } : st
      );
      return { ...prev, subtasks: updatedSubs };
    });
  };

  const handleOpenSubtask = (idx: number) => setSubtaskDialogIdx(idx);
  const handleCloseSubtask = () => setSubtaskDialogIdx(null);

  const handleAddSubtaskComment = (subtaskId: string, text: string) => {
    setSubtaskComments(prev => ({
      ...prev,
      [subtaskId]: [...(prev[subtaskId] || []), { user: "you", text, ago: "now" }],
    }));
  };

  return (
    <MainLayout>
      <div className="w-full h-[calc(100vh-4rem)] max-w-screen-2xl mx-auto flex overflow-hidden">
        <main className="flex-1 min-w-0 p-1 sm:p-2 md:p-6 lg:p-10 bg-white border-r-[1.5px] border-[#F4F4F8] flex flex-col overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
            <TaskWorkMain
              task={taskState}
              onUpdateTask={handleUpdateTask}
              onToggleSubtask={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
              onRemoveSubtask={handleRemoveSubtask}
              onOpenSidebarMobile={() => setSidebarOpen(true)}
              onGenerateSteps={handleGenerateSteps}
              isGenerating={isGenerating}
              focusedSubtaskIdx={focusedSubtaskIdx}
              onFocusSubtask={handleFocusSubtask}
              onUpdateSubtask={handleUpdateSubtask}
              onOpenSubtask={handleOpenSubtask}
            />
            <SubtaskDialog
              open={subtaskDialogIdx !== null && !!taskState.subtasks[subtaskDialogIdx]}
              onOpenChange={(open) => open ? undefined : handleCloseSubtask()}
              subtask={subtaskDialogIdx !== null ? taskState.subtasks[subtaskDialogIdx] : null}
              comments={
                subtaskDialogIdx !== null && taskState.subtasks[subtaskDialogIdx]
                  ? (subtaskComments[taskState.subtasks[subtaskDialogIdx].id] || [])
                  : []
              }
              addComment={text =>
                subtaskDialogIdx !== null && taskState.subtasks[subtaskDialogIdx]
                  ? handleAddSubtaskComment(taskState.subtasks[subtaskDialogIdx].id, text)
                  : undefined
              }
            />
          </div>
        </main>
        <TaskWorkSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          comments={taskState.comments}
          addComment={handleAddComment}
          commentValue={commentValue}
          setCommentValue={setCommentValue}
          taskId={taskState.id}
          taskTitle={taskState.title}
          taskDescription={taskState.description}
          subtasks={taskState.subtasks}
          currentSubtaskIndex={focusedSubtaskIdx !== null ? focusedSubtaskIdx : 0}
          onSubtaskComplete={handleToggleSubtask}
          onSubtaskSelect={handleFocusSubtask}
          immersive={true}
        />
      </div>
    </MainLayout>
  );
}
