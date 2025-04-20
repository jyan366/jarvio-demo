
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskWorkHeader } from "@/components/tasks/TaskWorkHeader";
import { TaskWorkProductCard } from "@/components/tasks/TaskWorkProductCard";
import { TaskWorkSubtasks } from "@/components/tasks/TaskWorkSubtasks";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";

// Dummy Data (for demo, consider fetching later)
const PRODUCT_IMAGE = "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png";

const dummyTasks = [
  {
    id: "1",
    title: "Fix Main Images for Suppressed Listings",
    description:
      "Update main product images to comply with Amazon's policy requirements to get listings unsuppressed.",
    status: "Not Started",
    priority: "HIGH",
    category: "LISTINGS",
    date: "16 Apr 2025",
    products: [
      {
        image: PRODUCT_IMAGE,
        name:
          "Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by The Cultured Food Company",
        asin: "B08P5P3QGC",
        sku: "KM1000",
        price: "16.99",
        units: "111",
        last30Sales: "1155.32",
        last30Units: "68",
      },
    ],
    subtasks: [
      { title: "Update Amazon listing images" },
      { title: "Verify compliance" },
    ],
    comments: [
      { user: "you", text: "new comment", ago: "2 days ago" },
    ],
  },
  {
    id: "3",
    title: "Resolve Support Cases 2101",
    description:
      'My listing was removed due to an ingredient detected in the product "Guava". This is not in the product and is a listing error.',
    status: "Not Started",
    priority: "HIGH",
    category: "SUPPORT",
    date: "16 Apr 2025",
    products: [
      {
        image: PRODUCT_IMAGE,
        name:
          "Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by The Cultured Food Company",
        asin: "B08P5P3QGC",
        sku: "KM1000",
        price: "16.99",
        units: "111",
        last30Sales: "1155.32",
        last30Units: "68",
      },
    ],
    subtasks: [
      { title: "Check ingredient report" },
      { title: "Submit support case" },
    ],
    comments: [
      { user: "you", text: "new comment", ago: "2 days ago" },
    ],
  },
];

export default function TaskWork() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch task by id from dummy data
  const task = dummyTasks.find((t) => t.id === id) || dummyTasks[0];

  // Action state
  const [selectedTab, setSelectedTab] = useState<"comments" | "ai">("comments");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [comments, setComments] = useState(task.comments || []);
  const [commentValue, setCommentValue] = useState("");

  if (!task) return <div>Task not found</div>;

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-0 w-full h-full px-0 md:px-0 pt-4 pb-8">
        {/* Main Work Area */}
        <div className="flex-1 w-full max-w-[960px] mx-auto px-2 md:px-8">
          <TaskWorkHeader
            title={task.title}
            createdAt="Created 4 days ago"
            description={task.description}
            status={task.status}
            setStatus={() => {}}
            priority={task.priority}
            setPriority={() => {}}
            category={task.category}
            setCategory={() => {}}
          />

          {/* Product Selection */}
          <div className="text-[15px] font-semibold mb-1 mt-8 flex items-center gap-2">
            <span className="bg-[#F1F0FB] text-[#3527A0] font-bold px-2 py-1 rounded mr-1 text-base">1</span>
            <span className="font-semibold text-zinc-700">product selected</span>
          </div>
          <TaskWorkProductCard product={task.products?.[0]} />

          {/* Subtasks */}
          <div className="mt-8 w-full">
            <TaskWorkSubtasks subtasks={subtasks} setSubtasks={setSubtasks} />
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-[370px] xl:w-[420px] flex-shrink-0 mt-10 lg:mt-0 px-2 lg:px-4">
          <TaskWorkSidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            comments={comments}
            addComment={(text: string) => {
              if (text.trim()) {
                setComments([
                  ...comments,
                  { user: "you", text, ago: "now" },
                ]);
                setCommentValue("");
              }
            }}
            commentValue={commentValue}
            setCommentValue={setCommentValue}
          />
        </div>
      </div>
    </MainLayout>
  );
}
