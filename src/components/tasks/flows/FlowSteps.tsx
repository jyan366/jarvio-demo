
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash, ArrowRight, Plus, Workflow } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { flowBlockOptions, BlockCategory } from "@/data/flowBlockOptions";

interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}

interface FlowStepsProps {
  subtasks: Subtask[];
  onToggleSubtask: (idx: number) => void;
  onAddSubtask: (val: string) => void;
  onRemoveSubtask: (idx: number) => void;
  focusedSubtaskIdx: number | null;
  onFocusSubtask: (idx: number) => void;
  onOpenSubtask: (idx: number) => void;
}

export const FlowSteps: React.FC<FlowStepsProps> = ({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  focusedSubtaskIdx,
  onFocusSubtask,
  onOpenSubtask,
}) => {
  const [newStep, setNewStep] = useState("");
  const [selectedBlockType, setSelectedBlockType] = useState<string>("think");

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStep.trim()) {
      onAddSubtask(newStep);
      setNewStep("");
    }
  };

  // Get the list of block types for the dropdown
  const blockCategories = Object.keys(flowBlockOptions) as BlockCategory[];

  return (
    <div className="mb-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">Flow Steps</h3>
        <form
          onSubmit={handleAddStep}
          className="flex gap-2"
        >
          <Select value={selectedBlockType} onValueChange={setSelectedBlockType}>
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blockCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <input
            type="text"
            placeholder="Add flow step..."
            className="h-8 px-2 rounded border text-xs w-36"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
          />
          <Button type="submit" variant="outline" className="h-8 text-xs px-3 py-1 whitespace-nowrap bg-slate-800 text-white border-slate-800 hover:bg-slate-700 hover:border-slate-700">
            <Plus className="h-3 w-3 mr-1" /> Add Step
          </Button>
        </form>
      </div>
      <div className="space-y-2">
        {subtasks.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <Workflow className="w-8 h-8 mx-auto mb-2 text-primary/40" />
            <p className="text-muted-foreground">No flow steps yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add steps to execute this flow</p>
          </div>
        )}
        
        {subtasks.map((sub, idx) => (
          <div
            key={sub.id || idx}
            className={`flex items-center border rounded-lg px-3 py-3 bg-white group cursor-pointer transition 
              ${focusedSubtaskIdx === idx ? "ring-2 ring-blue-200 border-blue-200" : "border-gray-100"}
              hover:bg-gray-50 ${sub.done ? "opacity-75 bg-green-50" : ""}`}
            tabIndex={0}
            onClick={() => onFocusSubtask(idx)}
            role="button"
            style={{ minHeight: 64 }}
          >
            <Button
              variant={sub.done ? "default" : "outline"}
              size="icon"
              className={`mr-3 h-6 w-6 ${sub.done ? "bg-green-500 hover:bg-green-600 border-green-500" : "border-gray-200 hover:border-gray-300"}`}
              onClick={e => { e.stopPropagation(); onToggleSubtask(idx); }}
              aria-label={sub.done ? "Mark incomplete" : "Mark complete"}
            >
              {sub.done ? <Check className="w-3 h-3" /> : <div className="w-3 h-3"></div>}
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium border mr-2 ${
                  sub.done 
                    ? "bg-green-500 text-white border-green-500" 
                    : "bg-slate-800 text-white border-slate-800"
                }`}>
                  {sub.done ? <Check className="w-3 h-3" /> : (idx + 1)}
                </span>
                <span className={`text-base font-medium ${sub.done ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {sub.title}
                </span>
                <div className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  sub.done 
                    ? "bg-green-100 text-green-700" 
                    : "bg-blue-50 text-blue-600"
                }`}>
                  {sub.category || "think"} 
                </div>
              </div>
              {sub.description ? (
                <div className="text-sm text-gray-500 mt-1">
                  {sub.description}
                </div>
              ) : (
                <div className="text-sm italic text-gray-300 mt-1">
                  No description
                </div>
              )}
            </div>
            <div className="flex gap-1 ml-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-70 hover:opacity-100 hover:text-blue-600"
                onClick={e => { e.stopPropagation(); onOpenSubtask(idx); }}
                aria-label="Open step details"
                title="Open details"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-60 hover:opacity-100 hover:text-red-500 transition"
                onClick={e => { e.stopPropagation(); onRemoveSubtask(idx); }}
                aria-label="Delete step"
                title="Delete"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
