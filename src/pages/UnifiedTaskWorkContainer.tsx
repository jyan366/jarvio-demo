
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UnifiedTaskSteps } from "@/components/tasks/UnifiedTaskSteps";
import { TaskWorkHeader } from "@/components/tasks/TaskWorkHeader";
import { UnifiedJarvioChat } from "@/components/tasks/UnifiedJarvioChat";
import { useUnifiedTaskWork } from "@/hooks/useUnifiedTaskWork";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ArrowUp, MessageCircle, List } from "lucide-react";

export default function UnifiedTaskWorkContainer() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("steps");
  
  if (!taskId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">No task ID provided</p>
        </div>
      </MainLayout>
    );
  }

  const {
    task,
    childTasks,
    loading,
    error,
    updateTask,
    addChild,
    removeChild,
    refresh
  } = useUnifiedTaskWork(taskId);

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
      <div className="max-w-6xl mx-auto p-6 space-y-6">
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

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Steps & Tasks
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-6">
            <UnifiedTaskSteps
              task={task}
              childTasks={childTasks}
              onTaskUpdate={refresh}
              onAddChildTask={addChild}
              onRemoveChildTask={removeChild}
            />
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <UnifiedJarvioChat
              task={task}
              childTasks={childTasks}
              onTaskUpdate={refresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
