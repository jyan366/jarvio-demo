
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Edit, List } from "lucide-react";

const PRODUCT_IMAGE = "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg";

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
      }
    ],
    subtasks: [
      { title: "Update Amazon listing images" },
      { title: "Verify compliance" },
    ],
    comments: [
      { user: "you", text: "new comment", ago: "2 days ago" }
    ]
  },
  {
    id: "3",
    title: "Resolve Support Cases 2101",
    description: "My listing was removed due to an ingredient detected in the product \"Guava\". This is not in the product and is a listing error.",
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
      }
    ],
    subtasks: [
      { title: "Check ingredient report" },
      { title: "Submit support case" },
    ],
    comments: [
      { user: "you", text: "new comment", ago: "2 days ago" }
    ]
  }
];

const statusOptions = ["Not Started", "In Progress", "Done"];
const priorityOptions = ["HIGH", "MEDIUM", "LOW"];
const categoryOptions = ["LISTINGS", "SUPPORT", "REVIEWS", "KEYWORDS", "INVENTORY", "PRICING"];

export default function TaskWork() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In real app, fetch task by id, here just using dummy
  const task = dummyTasks.find((t) => t.id === id) || dummyTasks[0];

  if (!task) return <div>Task not found</div>;

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-2 w-full h-full px-2 md:px-8 pt-6 pb-12">
        <div className="flex-1 max-w-3xl w-full">
          <div className="mb-4 flex items-center">
            <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">{task.title}</h1>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-sm mb-6">
            <List className="w-4 h-4" />
            <span>Created 4 days ago</span>
          </div>
          {/* Description */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="uppercase text-xs text-muted-foreground font-semibold tracking-wide mb-1">
                Description
              </div>
              <p className="text-sm text-gray-800">{task.description}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          {/* Properties */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <Select defaultValue={task.status}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue>{task.status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={task.priority}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue>{task.priority}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={task.category}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue>{task.category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Products Selected */}
          <div className="font-semibold mb-3 flex items-center text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded mr-2">
              1
            </span>
            <span>1 product selected</span>
          </div>
          {/* Product Card */}
          <div className="mb-6">
            <div className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 bg-[#f7f7fc]">
              <img
                src={PRODUCT_IMAGE}
                alt={task.products[0].name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="font-semibold truncate max-w-xs">{task.products[0].name}</p>
                  <p className="text-xs text-gray-500 flex gap-2">
                    ASIN: {task.products[0].asin} <span>•</span> SKU: {task.products[0].sku}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-8">
                  <div className="mr-4">
                    <span className="block uppercase text-gray-400 text-[10px] mb-1">Price</span>
                    <span className="font-bold text-[15px]">£{task.products[0].price}</span>
                  </div>
                  <div className="mr-4">
                    <span className="block uppercase text-gray-400 text-[10px] mb-1">Available Units</span>
                    <span className="font-bold text-[15px]">{task.products[0].units}</span>
                  </div>
                  <div>
                    <span className="block uppercase text-gray-400 text-[10px] mb-1">Last 30D Sales</span>
                    <span className="font-bold text-[15px]">{task.products[0].last30Sales}</span>
                    <span className="block text-xs text-gray-500">Last 30D Units Sold: {task.products[0].last30Units}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Subtasks */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base">Subtasks</h3>
              <Button variant="outline" className="h-8 text-xs px-3 py-1">+ Add Subtask</Button>
            </div>
            <div className="space-y-2">
              {task.subtasks?.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center border rounded-lg px-2 py-2 bg-white group hover:bg-gray-50"
                >
                  {/* Drag handle icon */}
                  <span className="text-gray-300 cursor-move pr-2">
                    <List className="w-4 h-4" />
                  </span>
                  <span className="flex-1 text-sm">{sub.title}</span>
                  {/* Edit button */}
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Comments/AI Assistant Panel */}
        <div className="w-full lg:max-w-xs border-l pl-4 pt-4 bg-white flex flex-col min-h-[400px]">
          <div className="flex mb-4">
            <button className="font-semibold border-b-2 border-black px-2 py-1 mr-4">Comments</button>
            <button className="text-gray-400 px-2 py-1">AI Assistant</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="mb-3 text-xs text-muted-foreground font-bold">
              COMMENTS ({task.comments?.length || 0})
            </div>
            <div className="space-y-2">
              {task.comments?.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center font-bold">{c.user[0] || "U"}</span>
                  <div>
                    <span className="text-sm">{c.text}</span>
                    <div className="text-gray-400 text-xs">{c.ago}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Add Comment */}
          <form className="mt-4 flex border rounded-lg overflow-hidden">
            <input
              type="text"
              className="flex-1 px-3 py-2 outline-none text-sm"
              placeholder="Add a comment..."
              disabled
            />
            <Button
              size="icon"
              variant="ghost"
              type="submit"
              disabled
              className="rounded-none"
              aria-label="Send"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
