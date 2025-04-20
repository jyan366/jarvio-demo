
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // Sidebar state (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Comments/AI tab state
  const [selectedTab, setSelectedTab] = useState<"comments" | "ai">("comments");
  const [commentValue, setCommentValue] = useState("");

  if (!task) return <div>Task not found</div>;

  // Subtask management
  const handleToggleSubtask = (idx: number) => {
    setTaskState((prev) => {
      const newSubs = [...prev.subtasks];
      newSubs[idx] = { ...newSubs[idx], done: !newSubs[idx].done };
      return { ...prev, subtasks: newSubs };
    });
  };
  const handleAddSubtask = (val: string) => {
    if (val.trim()) {
      setTaskState((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: val, done: false }],
      }));
    }
  };
  const handleRemoveSubtask = (idx: number) => {
    setTaskState((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== idx),
    }));
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
      <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-4 w-full h-full max-w-screen-2xl mx-auto p-0 md:px-6 lg:px-12">
        {/* Main Workspace */}
        <div className="col-span-2 rounded-lg bg-white shadow-sm p-2 md:p-6 min-h-screen">
          <TaskWorkMain
            task={taskState}
            onUpdateTask={handleUpdateTask}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
            onRemoveSubtask={handleRemoveSubtask}
            onOpenSidebarMobile={() => setSidebarOpen(true)}
          />
        </div>
        {/* Responsive Sidebar */}
        <div className="w-full md:col-span-1">
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
        </div>
      </div>
    </MainLayout>
  );
}
