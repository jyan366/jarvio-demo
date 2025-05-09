import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskWorkMain } from "@/components/tasks/TaskWorkMain";
import { TaskWorkSidebar } from "@/components/tasks/TaskWorkSidebar";
import { SubtaskDialog } from "@/components/tasks/SubtaskDialog";
import { CollapseNavButton } from "@/components/tasks/CollapseNavButton";
import { useTaskWork } from "@/hooks/useTaskWork";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  description: string;
  status: string;
  priority: string;
  category: string;
}

export interface TaskInsight {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  date: string;
  status: 'new' | 'viewed' | 'actioned' | 'dismissed';
}

export interface Product {
  image: string;
  name: string;
  asin: string;
  sku: string;
  price: string;
  units: string;
  last30Sales: string;
  last30Units: string;
}

export interface TaskWorkType {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  date: string;
  products: Product[];
  subtasks: Subtask[];
  comments: { user: string; text: string; ago: string; subtaskId?: string }[];
  insights?: TaskInsight[];
}

interface TaskWorkContainerProps {
  taskId: string;
}

export default function TaskWorkContainer({ taskId }: TaskWorkContainerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    loading,
    taskState,
    sidebarOpen,
    setSidebarOpen,
    isGenerating,
    focusedSubtaskIdx,
    selectedTab,
    setSelectedTab,
    commentValue,
    setCommentValue,
    handleUpdateTask,
    handleToggleSubtask,
    handleAddSubtask,
    handleRemoveSubtask,
    handleGenerateSteps,
    handleFocusSubtask,
    handleUpdateSubtask,
    handleOpenSubtask,
    handleAddComment,
    subtaskDialogIdx,
    handleCloseSubtask,
    subtaskData,
  } = useTaskWork(taskId);

  const handleConvertToProcess = async () => {
    if (!taskState) return;

    try {
      const processData = {
        name: taskState.title,
        steps: taskState.subtasks.map(st => ({
          id: st.id,
          content: st.title,
          completed: false
        })),
        schedule: 'monthly',
        autoRun: false
      };

      const { error } = await supabase
        .from('tasks')
        .update({ 
          category: 'PROCESS',
          data: processData
        })
        .eq('id', taskState.id);

      if (error) throw error;

      toast({
        title: "Task converted to process",
        description: "You can now find this in the Saved Processes section",
      });

      navigate('/action-studio');
    } catch (err) {
      console.error('Error converting to process:', err);
      toast({
        title: "Error",
        description: "Failed to convert task to process",
        variant: "destructive"
      });
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading task...</p>
        </div>
      </MainLayout>
    );

  if (!taskState)
    return (
      <MainLayout>
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Task not found</p>
        </div>
      </MainLayout>
    );

  let dialogSubtask = subtaskDialogIdx !== null ? taskState?.subtasks[subtaskDialogIdx] : null;
  
  let jarvioWorkLog: string | undefined = undefined;
  let jarvioCompletedAt: string | undefined = undefined;
  if (dialogSubtask && subtaskData && subtaskData[dialogSubtask.id]) {
    jarvioWorkLog = subtaskData[dialogSubtask.id].result;
    jarvioCompletedAt = subtaskData[dialogSubtask.id].completedAt;
  }

  let userWorkLog = dialogSubtask && Array.isArray(taskState.comments)
    ? taskState.comments.filter(
        (c) =>
          (c.subtaskId === dialogSubtask.id || (!c.subtaskId && subtaskDialogIdx === 0)) &&
          c.user !== "jarvio"
      )
    : [];

  let dialogComments =
    dialogSubtask && Array.isArray(taskState.comments)
      ? taskState.comments.filter(
          (c) => c.subtaskId === dialogSubtask.id || (!c.subtaskId && subtaskDialogIdx === 0)
        )
      : [];

  return (
    <MainLayout>
      <div className="w-full h-full max-w-none flex flex-row gap-0 bg-background">
        <main className="flex-1 min-w-0 bg-white border-r-[1.5px] border-[#F4F4F8] flex flex-col h-screen overflow-hidden">
          <div className="w-full max-w-3xl mx-auto flex flex-col h-full p-6 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <CollapseNavButton
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToProcess}
                className="ml-auto"
              >
                <Circle className="w-4 h-4 mr-2" />
                Convert to Process
              </Button>
            </div>
            <TaskWorkMain
              task={taskState}
              onUpdateTask={handleUpdateTask}
              onToggleSubtask={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
              onRemoveSubtask={handleRemoveSubtask}
              onOpenSidebarMobile={() => setSidebarOpen(true)}
              onGenerateSteps={handleGenerateSteps}
              isGenerating={isGenerating}
              focusedSubtaskIdx={focusedSubtaskIdx}
              onFocusSubtask={handleFocusSubtask}
              onUpdateSubtask={handleUpdateSubtask}
              onOpenSubtask={handleOpenSubtask}
            />
          </div>
        </main>
        <aside className="h-screen flex flex-col max-w-full md:max-w-[380px] xl:max-w-[420px] w-full bg-white overflow-hidden shadow-none border-l">
          <TaskWorkSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            comments={taskState.comments}
            addComment={handleAddComment}
            commentValue={commentValue}
            setCommentValue={setCommentValue}
            taskId={taskState.id}
            taskTitle={taskState.title}
            taskDescription={taskState.description}
            subtasks={taskState.subtasks}
            currentSubtaskIndex={focusedSubtaskIdx !== null ? focusedSubtaskIdx : 0}
            onSubtaskComplete={handleToggleSubtask}
            onSubtaskSelect={handleFocusSubtask}
          />
        </aside>
      </div>
      {subtaskDialogIdx !== null && (
        <SubtaskDialog
          open={subtaskDialogIdx !== null}
          onClose={handleCloseSubtask}
          subtask={dialogSubtask}
          onUpdate={(field, value) => {
            if (subtaskDialogIdx !== null) {
              handleUpdateSubtask(field as any, value);
            }
          }}
          onToggleComplete={() => {
            if (subtaskDialogIdx !== null) {
              handleToggleSubtask(subtaskDialogIdx);
            }
          }}
          jarvioWorkLog={jarvioWorkLog}
          jarvioCompletedAt={jarvioCompletedAt}
          userWorkLog={userWorkLog}
          comments={dialogComments}
        />
      )}
    </MainLayout>
  );
}
