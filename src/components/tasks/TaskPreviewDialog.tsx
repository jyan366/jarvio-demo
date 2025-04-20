
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, ChevronRight, ChevronLeft, List } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Using one of the product images from Supabase
const PRODUCT_IMAGE = "/lovable-uploads/77701ad2-d0ba-4b86-829f-87f39dcf8d9d.png";

interface Product {
  image: string;
  name: string;
  asin: string;
  sku: string;
  price: string;
  units: string;
  last30Sales: string;
  last30Units: string;
}

interface Subtask {
  title: string;
}

interface TaskDetail {
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  createdAgo?: string;
  products?: Product[];
  subtasks?: Subtask[];
}

interface TaskPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // The parent passes a task. We'll shape it to TaskDetail for nicer UI
  task: any;
}

const statusOptions = ['Not Started', 'In Progress', 'Done'];
const priorityOptions = ['HIGH', 'MEDIUM', 'LOW'];
const categoryOptions = ['LISTINGS', 'SUPPORT', 'REVIEWS', 'KEYWORDS', 'INVENTORY', 'PRICING'];

export function TaskPreviewDialog({ open, onOpenChange, task }: TaskPreviewDialogProps) {
  if (!task) return null;

  // Prep demo product if not present
  const products: Product[] = task.products ?? [
    {
      image: PRODUCT_IMAGE,
      name: "Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by T...",
      asin: "B08P5P3QGC",
      sku: "KM1000",
      price: "16.99",
      units: "111",
      last30Sales: "1155.32",
      last30Units: "68"
    }
  ];

  // Prep demo subtasks if not present
  const subtasks: Subtask[] = task.subtasks ?? [
    { title: "Task" },
    { title: "Task" },
    { title: "task" },
    { title: "Task" },
    { title: "Task" }
  ];

  // Setup "Created X days ago" (using createdAgo if present)
  const createdAgo = task.createdAgo || "Created 4 days ago";

  // Make them appear in the same style as the screenshot
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden max-h-[90vh]">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-start justify-between px-6 pt-6 pb-2 border-b">
            <DialogHeader className="flex-grow">
              <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
              <div className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>{createdAgo}</span>
              </div>
            </DialogHeader>
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div>
              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="uppercase text-xs text-muted-foreground font-semibold tracking-wide">Description</h3>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-800">{task.description}</p>
              </div>
              {/* Properties (Status, Priority, Category) */}
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <div className="mb-2 sm:mb-0">
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
                </div>
                <div className="mb-2 sm:mb-0">
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
                </div>
                <div className="mb-2 sm:mb-0">
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
              </div>
              {/* Products */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base mb-2">Products</h3>
                  <div className="flex gap-2 items-center text-xs text-gray-500">
                    <span>1 of {products.length}</span>
                    <ChevronLeft className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white text-gray-400 p-1 cursor-pointer" />
                    <ChevronRight className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white text-gray-400 p-1 cursor-pointer" />
                  </div>
                </div>
                <div className="border rounded-xl p-3 flex flex-col md:flex-row gap-4 bg-[#f7f7fc]">
                  <img
                    src={products[0].image}
                    alt={products[0].name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <p className="font-semibold truncate max-w-xs">{products[0].name}</p>
                      <p className="text-xs text-gray-500 flex gap-2">
                        ASIN: {products[0].asin} <span>•</span> SKU: {products[0].sku}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-8">
                      <div className="mr-4">
                        <span className="block uppercase text-gray-400 text-[10px] mb-1">Price</span>
                        <span className="font-bold text-[15px]">£{products[0].price}</span>
                      </div>
                      <div className="mr-4">
                        <span className="block uppercase text-gray-400 text-[10px] mb-1">Available Units</span>
                        <span className="font-bold text-[15px]">{products[0].units}</span>
                      </div>
                      <div>
                        <span className="block uppercase text-gray-400 text-[10px] mb-1">Last 30D Sales</span>
                        <span className="font-bold text-[15px]">{products[0].last30Sales}</span>
                        <span className="block text-xs text-gray-500">Last 30D Units Sold: {products[0].last30Units}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Subtasks */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base">Subtasks</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-8 text-xs px-3 py-1">Add Subtask</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {subtasks.map((sub, idx) => (
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
