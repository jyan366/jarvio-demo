
import React from 'react';
import { Card } from "@/components/ui/card";
import { Subtask } from "@/pages/TaskWorkContainer";
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface JarvioDataLogTabProps {
  subtasks: Subtask[];
  subtaskData: Record<string, { result?: string; completed?: boolean; completedAt?: string }>;
  activeSubtaskIdx: number;
  isFlowTask?: boolean;
}

export function JarvioDataLogTab({ 
  subtasks, 
  subtaskData,
  activeSubtaskIdx,
  isFlowTask = false
}: JarvioDataLogTabProps) {
  const currentSubtask = subtasks[activeSubtaskIdx];
  const currentSubtaskId = currentSubtask?.id;
  
  const currentData = currentSubtaskId ? subtaskData[currentSubtaskId] : null;
  
  return (
    <div className="p-4 space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">
          {isFlowTask ? 'Flow Step Data' : 'Subtask Data'}
        </h3>
        {currentSubtaskId ? (
          <Card className="p-4">
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Title:</span>
                <p className="text-sm font-medium">{currentSubtask?.title || 'Unknown'}</p>
              </div>
              
              <div>
                <span className="text-xs text-muted-foreground">Status:</span>
                <p className="text-sm">
                  {currentSubtask?.done ? 
                    <span className="text-green-600 font-medium">Complete</span> : 
                    <span className="text-amber-600 font-medium">In Progress</span>
                  }
                </p>
              </div>
              
              {currentData?.completedAt && (
                <div>
                  <span className="text-xs text-muted-foreground">Completed at:</span>
                  <p className="text-sm">{new Date(currentData.completedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-4 text-center text-muted-foreground">
            <p>No active {isFlowTask ? 'step' : 'subtask'} selected</p>
          </Card>
        )}
      </div>
      
      {currentData?.result && (
        <div>
          <h3 className="text-sm font-medium mb-2">Result Data</h3>
          <Card className="p-4 overflow-auto max-h-96">
            <MarkdownRenderer content={currentData.result} className="text-sm" />
          </Card>
        </div>
      )}
    </div>
  );
}
