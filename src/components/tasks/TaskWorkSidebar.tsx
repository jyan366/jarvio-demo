import React from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { JarvioAssistant } from "./JarvioAssistant";
import { TaskWorkType } from "@/pages/TaskWorkContainer";

interface TaskWorkSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTab: "comments" | "ai";
  setSelectedTab: (tab: "comments" | "ai") => void;
  comments: { user: string; text: string; ago: string; subtaskId?: string }[];
  addComment: (text: string) => void;
  commentValue: string;
  setCommentValue: (value: string) => void;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  subtasks: { id: string; title: string; done: boolean; description: string; status: string; priority: string; category: string }[];
  currentSubtaskIndex: number;
  onSubtaskComplete: (index: number) => Promise<void>;
  onSubtaskSelect: (index: number) => void;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
    flowBlocks?: any[];
    flowSteps?: any[];
  };
  isFlowTask: boolean;
}

export function TaskWorkSidebar({
  open,
  onOpenChange,
  selectedTab,
  setSelectedTab,
  comments,
  addComment,
  commentValue,
  setCommentValue,
  taskId,
  taskTitle,
  taskDescription,
  subtasks,
  currentSubtaskIndex,
  onSubtaskComplete,
  onSubtaskSelect,
  taskData,
  isFlowTask
}: TaskWorkSidebarProps) {
  // Get block information for current subtask if it's a flow task
  const getCurrentSubtaskBlock = () => {
    if (!isFlowTask || !taskData?.flowBlocks || !taskData?.flowSteps) return null;
    
    const currentStep = taskData.flowSteps[currentSubtaskIndex];
    if (!currentStep?.blockId) return null;
    
    return taskData.flowBlocks.find((block: any) => block.id === currentStep.blockId);
  };

  const currentBlock = getCurrentSubtaskBlock();

  return (
    <div className={`flex flex-col h-full bg-white transition-all duration-300 ${open ? 'w-full' : 'w-0 overflow-hidden'}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Jarvio Assistant</h2>
        <button 
          onClick={() => onOpenChange(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setSelectedTab("ai")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            selectedTab === "ai" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          AI Assistant
        </button>
        <button
          onClick={() => setSelectedTab("comments")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            selectedTab === "comments" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedTab === "ai" && (
          <JarvioAssistant
            taskId={taskId}
            taskTitle={taskTitle}
            taskDescription={taskDescription}
            subtasks={subtasks}
            currentSubtaskIndex={currentSubtaskIndex}
            onSubtaskComplete={onSubtaskComplete}
            onSubtaskSelect={onSubtaskSelect}
            taskData={taskData}
            isFlowTask={isFlowTask}
            currentBlock={currentBlock}
          />
        )}
        
        {selectedTab === "comments" && (
          <div className="h-full flex flex-col">
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.ago}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet</p>
                </div>
              )}
            </div>

            {/* Add comment form */}
            <div className="p-4 border-t">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (commentValue.trim()) {
                  addComment(commentValue);
                }
              }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentValue.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
