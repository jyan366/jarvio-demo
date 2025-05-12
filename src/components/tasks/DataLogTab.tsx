import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

// Extended subtask type with data field
interface ExtendedSubtask {
  id: string;
  title: string;
  done: boolean;
  data?: string | null;
}

interface DataLogTabProps {
  subtasks: ExtendedSubtask[];
  activeSubtaskIndex: number;
}

export function DataLogTab({ subtasks, activeSubtaskIndex }: DataLogTabProps) {
  const [selectedSubtask, setSelectedSubtask] = useState<number>(activeSubtaskIndex);

  // Update selected subtask when active subtask changes
  useEffect(() => {
    setSelectedSubtask(activeSubtaskIndex);
  }, [activeSubtaskIndex]);

  // Get the selected subtask's data
  const currentSubtask = subtasks[selectedSubtask];
  const subtaskData = currentSubtask?.data || null;
  
  // Handle step selection change
  const handleStepChange = (value: string) => {
    setSelectedSubtask(parseInt(value));
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden pb-4 bg-[#fcfbf8]">
      {/* Step selector */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Select Step:</h3>
          <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
            {currentSubtask?.done ? (
              <span className="text-green-600">Completed</span>
            ) : selectedSubtask === activeSubtaskIndex ? (
              <span className="text-amber-600">In Progress</span>
            ) : (
              <span className="text-gray-500">Pending</span>
            )}
          </div>
        </div>
        
        <Select 
          value={selectedSubtask.toString()} 
          onValueChange={handleStepChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a step" />
          </SelectTrigger>
          <SelectContent>
            {subtasks.map((subtask, index) => (
              <SelectItem key={subtask.id} value={index.toString()}>
                <div className="flex items-center">
                  <span className="mr-2">{index + 1}.</span>
                  <span>{subtask.title}</span>
                  {subtask.done && <Check className="h-3 w-3 ml-2 text-green-500" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Step details */}
      <div className="px-4 pt-3">
        <h3 className="text-base font-semibold text-gray-800">
          {currentSubtask?.title || "Step Details"}
        </h3>
      </div>
      
      {/* Subtask data display */}
      <ScrollArea className="flex-1 px-4 pt-2">
        {subtaskData ? (
          <div className="bg-white rounded-md shadow-sm border p-4 text-sm">
            <MarkdownRenderer content={subtaskData} className="text-sm" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {currentSubtask?.done ? 
              "No data available for this step" : 
              "This step has not been completed yet"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
} 