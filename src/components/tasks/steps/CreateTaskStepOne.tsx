
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { CreateTaskStepProps } from '../types/createTask';

export function CreateTaskStepOne({ 
  taskData, 
  setTaskData, 
  errors, 
  isSuggesting 
}: CreateTaskStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Task Name"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <div className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errors.title}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Textarea
            placeholder="Description"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            className={errors.description ? "border-destructive" : ""}
          />
          {isSuggesting && (
            <div className="absolute right-2 top-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {errors.description && (
          <div className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errors.description}
          </div>
        )}
      </div>
    </div>
  );
}
