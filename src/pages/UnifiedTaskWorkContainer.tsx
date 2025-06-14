import React, { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UnifiedTaskSteps } from "@/components/tasks/UnifiedTaskSteps";
import { TaskWorkHeader } from "@/components/tasks/TaskWorkHeader";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";
import { useUnifiedTaskWork } from "@/hooks/useUnifiedTaskWork";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowUp, MessageCircle } from "lucide-react";
import { parseTaskSteps } from "@/lib/unifiedTasks";
import { useJarvioAutoRun } from "@/components/tasks/hooks/useJarvioAutoRun";

export default function UnifiedTaskWorkContainer() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  // All hooks must be called at the top, before any conditional logic
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [comments, setComments] = useState<{ user: string; text: string; ago: string; stepId?: string }[]>([]);
  const [commentValue, setCommentValue] = useState("");
  const [selectedTab, setSelectedTab] = useState<"ai" | "comments">("ai");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Auto-run state
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [subtaskData, setSubtaskData] = useState<Record<string, any>>({});
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  
  // Auto-run refs
  const autoRunTimerRef = useRef<number | undefined>();
  const autoRunStepInProgressRef = useRef(false);
  
  // Add ref to track if we're in the middle of auto-run to prevent state clearing
  const autoRunActiveRef = useRef(false);

  // Call useUnifiedTaskWork hook (must be before conditional returns)
  const {
    task,
    childTasks,
    loading,
    error,
    updateTask,
    addChild,
    removeChild,
    refresh
  } = useUnifiedTaskWork(taskId || '');

  // Parse steps and create subtasks (move this logic up so it's available for hooks)
  const steps = task ? parseTaskSteps(task) : [];
  const subtasks = steps.map((step, index) => ({
    id: `step-${index}`,
    title: step,
    description: "",
    done: task?.steps_completed?.includes(index) || false,
    status: task?.steps_completed?.includes(index) ? 'Done' as const : 'Not Started' as const,
    priority: 'MEDIUM' as const,
    category: 'FLOW'
  }));

  // Helper functions
  const addComment = (text: string) => {
    const newComment = {
      user: "You",
      text,
      ago: "now",
      stepId: `step-${currentStepIndex}`
    };
    setComments([...comments, newComment]);
    setCommentValue("");
  };

  const handleStepComplete = async (stepIndex: number) => {
    try {
      setIsLoading(true);
      console.log("Completing step:", stepIndex);
      
      const currentCompleted = task?.steps_completed || [];
      const updatedCompleted = currentCompleted.includes(stepIndex) 
        ? currentCompleted.filter(idx => idx !== stepIndex)
        : [...currentCompleted, stepIndex];
      
      // Update task without triggering a full refresh during auto-run
      await updateTask({ steps_completed: updatedCompleted });
      
      // Store step result data
      setSubtaskData(prev => ({
        ...prev,
        [`step-${stepIndex}`]: {
          result: `Step ${stepIndex + 1} completed: ${steps[stepIndex]}`,
          completedAt: new Date().toISOString()
        }
      }));
      
      console.log("Step completed successfully:", stepIndex);
    } catch (error) {
      console.error("Error updating step completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    console.log("Selecting step:", stepIndex);
    setCurrentStepIndex(stepIndex);
    setHistorySubtaskIdx(null);
  };

  const handleSendMessage = async (e?: React.FormEvent, autoMessage?: string) => {
    if (e) e.preventDefault();
    
    const messageText = autoMessage || "Continue with next step";
    
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      isUser: !!autoMessage,
      text: messageText,
      timestamp: new Date()
    }]);
  };

  // Track auto-run state changes
  useEffect(() => {
    autoRunActiveRef.current = autoRunMode && !autoRunPaused;
  }, [autoRunMode, autoRunPaused]);

  // Auto-run hook - now called after all other hooks but before conditional returns
  useJarvioAutoRun({
    autoRunMode,
    autoRunPaused,
    historySubtaskIdx,
    currentSubtaskIndex: currentStepIndex,
    isLoading,
    isTransitioning,
    readyForNextSubtask,
    subtasks,
    subtaskData,
    messages,
    onSubtaskComplete: handleStepComplete,
    onSubtaskSelect: handleStepSelect,
    setAutoRunPaused,
    setReadyForNextSubtask,
    autoRunTimerRef,
    autoRunStepInProgressRef,
    setIsTransitioning,
    setMessages,
    handleSendMessage,
  });

  // Now we can have conditional returns after all hooks are called
  if (!taskId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">No task ID provided</p>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Loading task...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !task) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              {error || 'Task not found'}
            </p>
            <Button onClick={() => navigate('/tasks')} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Build breadcrumb navigation
  const breadcrumbs = [];
  if (task?.parent_id) {
    breadcrumbs.push(
      <Button
        key="parent"
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/task/${task.parent_id}`)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowUp className="h-4 w-4" />
        Parent Task
      </Button>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => navigate('/tasks')} 
                    variant="ghost" 
                    size="icon"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {breadcrumbs}
                </div>
                <div className="flex items-center gap-2">
                  {/* Auto-run controls */}
                  <Button
                    onClick={() => {
                      const newAutoRunMode = !autoRunMode;
                      setAutoRunMode(newAutoRunMode);
                      if (newAutoRunMode) {
                        setAutoRunPaused(false);
                        console.log("Auto-run started");
                        setMessages(prev => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            isUser: false,
                            text: "🚀 Auto-run mode activated! Starting step execution...",
                            timestamp: new Date()
                          }
                        ]);
                      } else {
                        setAutoRunPaused(true);
                        autoRunActiveRef.current = false;
                        console.log("Auto-run stopped");
                        setMessages(prev => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            isUser: false,
                            text: "⏹️ Auto-run mode deactivated.",
                            timestamp: new Date()
                          }
                        ]);
                      }
                    }}
                    variant={autoRunMode ? "default" : "outline"}
                    size="sm"
                  >
                    {autoRunMode ? "Stop Auto-Run" : "Start Auto-Run"}
                  </Button>
                  <Button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    AI Assistant
                  </Button>
                </div>
              </div>

              {/* Task Header */}
              <TaskWorkHeader
                title={task.title}
                onTitleChange={(newTitle) => updateTask({ title: newTitle })}
                createdAt={task.date || ''}
                description={task.description}
                onDescriptionChange={(desc) => updateTask({ description: desc })}
                status={task.status}
                setStatus={(status) => updateTask({ status: status as any })}
                priority={task.priority}
                setPriority={(priority) => updateTask({ priority: priority as any })}
                category={task.category}
                setCategory={(category) => updateTask({ category })}
                isFlowTask={task.task_type === 'flow'}
              />

              {/* Main Task Content */}
              <UnifiedTaskSteps
                task={task}
                childTasks={childTasks}
                onTaskUpdate={refresh}
                onAddChildTask={addChild}
                onRemoveChildTask={removeChild}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-[420px] border-l bg-background">
            <TaskWorkSidebar
              open={sidebarOpen}
              onOpenChange={setSidebarOpen}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              comments={comments}
              addComment={addComment}
              commentValue={commentValue}
              setCommentValue={setCommentValue}
              taskId={taskId}
              taskTitle={task.title}
              taskDescription={task.description}
              subtasks={subtasks}
              currentSubtaskIndex={currentStepIndex}
              onSubtaskComplete={handleStepComplete}
              onSubtaskSelect={handleStepSelect}
              taskData={task.data}
              isFlowTask={task.task_type === 'flow'}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
