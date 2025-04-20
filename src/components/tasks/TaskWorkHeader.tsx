
import React from "react";
import { ChevronLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Prop types
interface TaskWorkHeaderProps {
  title: string;
  createdAt: string;
  description: string;
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (p: string) => void;
  category: string;
  setCategory: (c: string) => void;
}

const statusOptions = ["Not Started", "In Progress", "Done"];
const priorityOptions = ["HIGH", "MEDIUM", "LOW"];
const categoryOptions = [
  "LISTINGS",
  "SUPPORT",
  "REVIEWS",
  "KEYWORDS",
  "INVENTORY",
  "PRICING",
];

export const TaskWorkHeader: React.FC<TaskWorkHeaderProps> = ({
  title,
  createdAt,
  description,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-2">
      <div className="mb-5 flex items-center -ml-1">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="icon"
          className="mr-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2 text-neutral-400 text-sm mb-3">
        <span>{createdAt}</span>
      </div>
      {/* Description */}
      <div className="mb-4 flex items-start justify-between w-full">
        <div>
          <span className="uppercase text-xs text-neutral-400 font-semibold tracking-wide mb-2 block">Description</span>
          <p className="text-base text-zinc-700 font-normal leading-[1.6]">{description}</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-2">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      {/* Properties */}
      <div className="flex flex-wrap gap-2 items-center mb-1">
        <Select defaultValue={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue>{status}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-28 h-9">
            <SelectValue>{priority}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={category} onValueChange={setCategory}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue>{category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
