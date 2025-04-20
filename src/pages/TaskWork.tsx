import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskWorkMain } from "@/components/tasks/TaskWorkMain";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";

// Dummy Data (for demo)
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
      { title: "Update Amazon listing images", done: false },
      { title: "Verify compliance", done: false },
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
      { title: "Check ingredient report", done: false },
      { title: "Submit support case", done: true },
    ],
    comments: [{ user: "you", text: "new comment", ago: "2 days ago" }],
  },
];

// Types
export interface Subtask {
  title: string;
  done: boolean;
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
  const task = dummyTasks.find((t) => t.id === id) || dummyTasks[0];
  const [taskState, setTaskState] = useState<TaskWorkType>(task);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tab state for sidebar
  const [selectedTab, setSelectedTab] = useState<"comments" | "ai">("comments");
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    // Fetch subtasks for this task from supabase
    async function fetch() {
      if (!taskState.id) return;
      try {
        const subtasks = await fetchSubtasks([taskState.id]);
        setTaskState((prev) => ({
          ...prev,
          subtasks: subtasks.map(st => ({
            id: st.id,
            title: st.title,
            done: st.completed,
          })),
        }));
      } catch (e) {
        // fallback: leave as is
      }
    }
    fetch();
  }, [taskState.id]);

  if (!task) return <div>Task not found</div>;

  // Subtask management
  const handleToggleSubtask = async (idx: number) => {
    const sub = taskState.subtasks[idx];
    try {
      await toggleSubtask(sub.id, !sub.done);
      setTaskState((prev) => {
        const newSubs = [...prev.subtasks];
        newSubs[idx] = { ...newSubs[idx], done: !newSubs[idx].done };
        return { ...prev, subtasks: newSubs };
      });
    } catch {}
  };
  const handleAddSubtask = async (val: string) => {
    if (val.trim()) {
      try {
        const st = await addSubtask(taskState.id, val);
        setTaskState((prev) => ({
          ...prev,
          subtasks: [...prev.subtasks, { id: st.id, title: st.title, done: st.completed }],
        }));
      } catch {}
    }
  };
  const handleRemoveSubtask = async (idx: number) => {
    const st = taskState.subtasks[idx];
    try {
      await deleteSubtask(st.id);
      setTaskState((prev) => ({
        ...prev,
        subtasks: prev.subtasks.filter((_, i) => i !== idx),
      }));
    } catch {}
  };

  // Comment management
  const handleAddComment = (text: string) => {
    if (text.trim()) {
      setTaskState((prev) => ({
        ...prev,
        comments: [...prev.comments, { user: "you", text, ago: "now" }],
      }));
      setCommentValue("");
    }
  };

  // Task header/properties inplace editing
  const handleUpdateTask = (field: keyof TaskWorkType, value: any) => {
    setTaskState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout>
      <div className="w-full h-[calc(100vh-4rem)] max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-0 items-stretch bg-background overflow-hidden">
        {/* Main panel - with fixed height and scrolling for content overflow */}
        <main className="flex-1 min-w-0 p-1 sm:p-2 md:p-6 lg:p-10 bg-white border-r-[1.5px] border-[#F4F4F8] flex flex-col overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
            <TaskWorkMain
              task={taskState}
              onUpdateTask={handleUpdateTask}
              onToggleSubtask={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
              onRemoveSubtask={handleRemoveSubtask}
              onOpenSidebarMobile={() => setSidebarOpen(true)}
            />
          </div>
        </main>
        {/* Sidebar (Comments / AI) - with fixed height */}
        <aside className="w-full max-w-full md:max-w-sm bg-white overflow-hidden">
          <TaskWorkSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            comments={taskState.comments}
            addComment={handleAddComment}
            commentValue={commentValue}
            setCommentValue={setCommentValue}
          />
        </aside>
      </div>
    </MainLayout>
  );
}
