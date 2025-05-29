import React, { useState } from "react";
import { ChevronLeft, Edit, Save, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
interface TaskWorkHeaderProps {
  title: string;
  onTitleChange: (v: string) => void;
  createdAt: string;
  description: string;
  onDescriptionChange: (v: string) => void;
  status: string;
  setStatus: (s: string) => void;
  priority: string;
  setPriority: (p: string) => void;
  category: string;
  setCategory: (c: string) => void;
  onOpenSidebarMobile?: () => void;
  isFlowTask?: boolean;
}
const statusOptions = ["Not Started", "In Progress", "Done"];
const priorityOptions = ["HIGH", "MEDIUM", "LOW"];
const categoryOptions = ["LISTINGS", "SUPPORT", "REVIEWS", "KEYWORDS", "INVENTORY", "PRICING", "FLOW"];
export const TaskWorkHeader: React.FC<TaskWorkHeaderProps> = ({
  title,
  onTitleChange,
  createdAt,
  description,
  onDescriptionChange,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  onOpenSidebarMobile,
  isFlowTask = false
}) => {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [draftDesc, setDraftDesc] = useState(description);
  const handleSaveTitle = () => {
    onTitleChange(draftTitle);
    setIsEditingTitle(false);
  };
  const handleSaveDesc = () => {
    onDescriptionChange(draftDesc);
    setIsEditingDesc(false);
  };
  return <div className="mb-2 w-full">
      {/* Header row */}
      <div className="mb-5 flex flex-wrap items-center -ml-1 gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {isEditingTitle ? <div className="flex items-center gap-2">
              <input className="text-2xl md:text-3xl font-bold border px-2 py-0.5 rounded min-w-[170px]" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} autoFocus />
              <Button variant="outline" size="icon" onClick={handleSaveTitle} aria-label="Save title">
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(false)} aria-label="Cancel">
                <Edit className="w-4 h-4" />
              </Button>
            </div> : <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {isFlowTask}
              {title}
              <Button variant="ghost" size="icon" onClick={() => {
            setDraftTitle(title);
            setIsEditingTitle(true);
          }} aria-label="Edit title">
                <Edit className="w-4 h-4" />
              </Button>
            </h1>}
        </div>
        
        {/* Mobile sidebar open button */}
        {onOpenSidebarMobile && <Button variant="outline" className="md:hidden" onClick={onOpenSidebarMobile}>
            Comments / AI
          </Button>}
        
        {/* Flow indicator for desktop */}
        {isFlowTask && <div className="hidden md:flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
            <Workflow className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Flow</span>
          </div>}
      </div>

      {/* Date row */}
      <div className="flex items-center gap-2 text-neutral-400 text-sm mb-3">
        <span>{createdAt ? `Created ${createdAt}` : null}</span>
      </div>

      {/* Description row */}
      <div className="mb-4 flex items-start justify-between w-full">
        <div className="flex-1">
          <span className="uppercase text-xs text-neutral-400 font-semibold tracking-wide mb-2 block">
            Description
          </span>
          {isEditingDesc ? <div className="flex gap-2 items-center w-full">
              <textarea className="text-base text-zinc-700 font-normal border rounded px-2 py-1 leading-[1.6] w-full" value={draftDesc} onChange={e => setDraftDesc(e.target.value)} rows={3} autoFocus />
              <Button variant="outline" size="icon" onClick={handleSaveDesc} aria-label="Save description">
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingDesc(false)} aria-label="Cancel">
                <Edit className="w-4 h-4" />
              </Button>
            </div> : <p className="text-base text-zinc-700 font-normal leading-[1.6] flex gap-2 items-center">
              {description}
              <Button variant="ghost" size="icon" onClick={() => {
            setDraftDesc(description);
            setIsEditingDesc(true);
          }} aria-label="Edit description">
                <Edit className="w-4 h-4" />
              </Button>
            </p>}
        </div>
      </div>

      {/* Properties */}
      <div className="flex flex-wrap gap-2 items-center mb-1">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue>{status}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(s => <SelectItem key={s} value={s}>
                {s}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-28 h-9">
            <SelectValue>{priority}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(p => <SelectItem key={p} value={p}>
                {p}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue>{category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(c => <SelectItem key={c} value={c}>
                {c}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>;
};