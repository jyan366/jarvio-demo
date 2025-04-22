import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid, List, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { suggestedTasks } from '@/components/action-studio/SuggestedTasksSection';
import { TaskPreviewDialog, InsightsDialog, InsightDetailDialog } from '@/components/tasks';
import { fetchTasks, fetchSubtasks, createTask, createSubtasks, initializeSampleTasks, addSampleSubtasksToTask } from '@/lib/supabaseTasks';
import { initialTasks, insightsData } from './constants';
import { mapInsightToTask } from './helpers';
import type { Task } from './types';
import { supabase } from '@/integrations/supabase/client';

export default function TaskBoard() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isInsightsDialogOpen, setIsInsightsDialogOpen] = useState(false);
  const [detailInsight, setDetailInsight] = useState<any>(null);
  const [showSuggestedTasks, setShowSuggestedTasks] = useState(false);
  const [handledTasks, setHandledTasks] = useState<string[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  const columns = showSuggestedTasks
    ? [
        {
          id: 'suggested',
          label: 'Suggested Tasks',
          bg: 'bg-[#F1F0FB]',
          headerColor: 'text-[#3527A0]',
        },
        {
          id: 'todo',
          label: 'To Do',
          bg: 'bg-[#F1F0FB]',
          headerColor: 'text-[#3527A0]',
        },
        {
          id: 'inProgress',
          label: 'In Progress',
          bg: 'bg-[#FFF8E8]',
          headerColor: 'text-[#AB860B]',
        },
      ]
    : [
        {
          id: 'todo',
          label: 'To Do',
          bg: 'bg-[#F1F0FB]',
          headerColor: 'text-[#3527A0]',
        },
        {
          id: 'inProgress',
          label: 'In Progress',
          bg: 'bg-[#FFF8E8]',
          headerColor: 'text-[#AB860B]',
        },
        {
          id: 'done',
          label: 'Done',
          bg: 'bg-[#F1FBF5]',
          headerColor: 'text-[#199255]',
        },
      ];

  const suggestedTasksFormatted = suggestedTasks.map(st => ({
    id: st.id,
    title: st.title,
    description: st.linkedInsights[0]?.summary || '',
    status: 'Not Started' as const,
    priority: st.priority as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    category: st.category.toUpperCase(),
    date: new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    subtasks: [],
    comments: [],
    products: [],
  }));

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasksByStatus(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(status => {
          newState[status] = newState[status].filter(task => task.id !== taskId);
        });
        return newState;
      });

      toast({
        title: "Task Deleted",
        description: "The task has been successfully removed.",
      });
    } catch (e) {
      console.error("Error deleting task:", e);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!localStorage.getItem('isAuthenticated')) {
          localStorage.setItem('isAuthenticated', 'true');
          console.log("Auto-authenticated user for demo purposes in TaskBoard");
        }
        
        let supabaseTasks = await fetchTasks();

        supabaseTasks = supabaseTasks.filter((task, index, self) =>
          index === self.findIndex(t => t.id === task.id)
        );

        if (supabaseTasks.length === 0) {
          console.log("No tasks found, initializing sample data...");
          supabaseTasks = await initializeSampleTasks();

          for (const task of supabaseTasks) {
            await addSampleSubtasksToTask(task.id, task.title);
          }

          toast({
            title: "Sample Tasks Created",
            description: "Sample tasks have been added to your task manager."
          });
        }

        const taskIds = supabaseTasks.map(t => t.id);
        const subtasks = await fetchSubtasks(taskIds);

        const byStatus: { [key: string]: Task[] } = { todo: [], inProgress: [], done: [] };
        
        const processedIds = new Set();
        
        for (const t of supabaseTasks) {
          if (processedIds.has(t.id)) continue;
          processedIds.add(t.id);
          
          const group =
            t.status === 'Done'
              ? 'done'
              : t.status === 'In Progress'
                ? 'inProgress'
                : 'todo';

          const statusMapped = t.status as 'Not Started' | 'In Progress' | 'Done';
          const priorityMapped = (t.priority || 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

          byStatus[group].push({
            ...t,
            status: statusMapped,
            priority: priorityMapped,
            date: new Date(t.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            subtasks: subtasks.filter(st => st.task_id === t.id).map(st => ({
              id: st.id,
              title: st.title,
              done: st.completed,
            })),
            comments: [],
            products: [],
          });
        }

        setTasksByStatus(byStatus);
      } catch (e) {
        console.error("Error loading tasks:", e);
        toast({ 
          title: "Error", 
          description: String(e),
          variant: "destructive" 
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const createTaskFromInsight = async (insight: any, suggestedTasks?: any[]) => {
    try {
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
        console.log("Auto-authenticated user before creating task from insight");
      }
      
      const newTask = await createTask(mapInsightToTask(insight, suggestedTasks));
      let subtasks: SupabaseSubtask[] = [];
      
      if (suggestedTasks && suggestedTasks.length > 0) {
        subtasks = await createSubtasks(
          suggestedTasks.map((task: any) => ({ task_id: newTask.id, title: task.name }))
        );
      }

      const supabaseTasks = await fetchTasks();
      const taskIds = supabaseTasks.map(t => t.id);
      const subtasksData = await fetchSubtasks(taskIds);

      const byStatus: { [key: string]: Task[] } = { todo: [], inProgress: [], done: [] };
      for (const t of supabaseTasks) {
        const group =
          t.status === 'Done'
            ? 'done'
            : t.status === 'In Progress'
              ? 'inProgress'
              : 'todo';

        const statusMapped = t.status as 'Not Started' | 'In Progress' | 'Done';
        const priorityMapped = (t.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW';

        byStatus[group].push({
          ...t,
          status: statusMapped,
          priority: priorityMapped,
          date: new Date(t.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          subtasks: subtasksData.filter(st => st.task_id === t.id).map(st => ({
            id: st.id,
            title: st.title,
            done: st.completed,
          })),
          comments: [],
          products: [],
        });
      }
      setTasksByStatus(byStatus);
      setDetailInsight(null);
      setIsInsightsDialogOpen(false);

      const subtasksMessage = subtasks.length > 0 ? `with ${subtasks.length} subtasks` : '';
      toast({
        title: "Task Created",
        description: (
          <div className="flex flex-col gap-2">
            <p>"{insight.title}" has been added to your tasks in To Do {subtasksMessage}.</p>
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => {
                setSelectedTask({
                  ...newTask,
                  status: newTask.status as 'Not Started' | 'In Progress' | 'Done',
                  priority: (newTask.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
                  date: new Date(newTask.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }),
                  subtasks: subtasks.map(st => ({ id: st.id, title: st.title, done: st.completed })),
                  comments: [],
                  products: []
                });
                setIsPreviewOpen(true);
              }}
            >
              View Task
            </Button>
          </div>
        ),
      });
    } catch (e) {
      console.error("Error creating task from insight:", e);
      toast({ 
        title: "Error Creating Task", 
        description: String(e),
        variant: "destructive" 
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceColumn = Array.from(tasksByStatus[result.source.droppableId]);
    const destColumn = Array.from(tasksByStatus[result.destination.droppableId]);
    const [removed] = sourceColumn.splice(result.source.index, 1);
    destColumn.splice(result.destination.index, 0, removed);

    setTasksByStatus({
      ...tasksByStatus,
      [result.source.droppableId]: sourceColumn,
      [result.destination.droppableId]: destColumn
    });
  };

  const handleCreateTask = (task: Task) => {
    if (!localStorage.getItem('isAuthenticated')) {
      localStorage.setItem('isAuthenticated', 'true');
      console.log("Auto-authenticated user before creating task from insight");
    }
    
    createTaskFromInsight(task);
    setHandledTasks(prev => [...prev, task.id]);
  };

  const handleDismissTask = (taskId: string) => {
    setHandledTasks(prev => [...prev, taskId]);
    toast({
      description: "Task dismissed",
    });
  };

  const filteredSuggestedTasks = suggestedTasksFormatted.filter(
    task => !handledTasks.includes(task.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSuggestedTasks(!showSuggestedTasks)}
            className="flex items-center gap-2"
          >
            <span>{showSuggestedTasks ? 'Hide' : 'View'} Suggested Tasks</span>
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="py-12 text-center text-muted-foreground text-lg">Loading your tasks…</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {columns.map((col) => (
              <div key={col.id} className="rounded-xl p-3 md:p-2">
                <Card className={`p-0 bg-transparent shadow-none border-0`}>
                  <div className={`px-3 pt-2 pb-4 ${col.bg} rounded-xl`}>
                    <h2 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${col.headerColor}`}>
                      {col.label}
                      <span className="ml-2 text-base text-gray-400 font-medium">
                        {col.id === 'suggested' 
                          ? filteredSuggestedTasks.length 
                          : tasksByStatus[col.id]?.length || 0}
                      </span>
                    </h2>
                    <Droppable droppableId={col.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {col.id === 'suggested' 
                            ? filteredSuggestedTasks.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <TaskCard
                                        task={task}
                                        onClick={() => {
                                          setSelectedTask(task);
                                          setIsPreviewOpen(true);
                                        }}
                                        cardBg={col.bg}
                                        isSuggested={true}
                                        onAccept={() => handleCreateTask(task)}
                                        onReject={() => handleDismissTask(task.id)}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            : tasksByStatus[col.id]?.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <TaskCard
                                        task={task}
                                        onClick={() => {
                                          setSelectedTask(task);
                                          setIsPreviewOpen(true);
                                        }}
                                        cardBg={col.bg}
                                        onDelete={() => handleDeleteTask(task.id)}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
      <TaskPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        task={selectedTask}
      />
      <InsightsDialog
        open={isInsightsDialogOpen}
        onOpenChange={setIsInsightsDialogOpen}
        onCreateTask={createTaskFromInsight}
        insights={insightsData}
        onInsightClick={setDetailInsight}
      />
      <InsightDetailDialog
        insight={detailInsight}
        open={!!detailInsight}
        onClose={() => setDetailInsight(null)}
        onCreateTask={(suggestedTasks) => {
          if (detailInsight) {
            createTaskFromInsight(detailInsight, suggestedTasks);
          }
        }}
      />
    </div>
  );
}
