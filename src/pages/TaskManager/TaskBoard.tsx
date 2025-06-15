import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid, List, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { suggestedTasks } from '@/components/action-studio/SuggestedTasksSection';
import { TaskPreviewDialog } from '@/components/tasks/TaskPreviewDialog';
import { InsightsDialog } from '@/components/insights/InsightsDialog';
import { InsightDetailDialog } from '@/components/insights/InsightDetailDialog';
import { fetchTasks, fetchSubtasks, createTask, createSubtasks, initializeSampleTasks, addSampleSubtasksToTask } from '@/lib/supabaseTasks';
import { initialTasks, insightsData } from './constants';
import { mapInsightToTask } from './helpers';
import type { Task } from './types';
import { supabase } from '@/integrations/supabase/client';

interface TaskBoardProps {
  onCreateTask?: () => void;
  onTaskDeleted?: () => void;
}

export default function TaskBoard({ onCreateTask, onTaskDeleted }: TaskBoardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
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
        },
        {
          id: 'todo',
          label: 'To Do',
        },
        {
          id: 'inProgress',
          label: 'In Progress',
        },
      ]
    : [
        {
          id: 'todo',
          label: 'To Do',
        },
        {
          id: 'inProgress',
          label: 'In Progress',
        },
        {
          id: 'done',
          label: 'Done',
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

          // Add sample subtasks to each task
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
            // Ensure we're properly handling the data object
            data: t.data || {},
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
  }, [toast]);

  const createTaskFromInsight = async (insight: any, suggestedTasks?: any[]) => {
    try {
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
        console.log("Auto-authenticated user before creating task from insight");
      }
      
      const newTask = await createTask(mapInsightToTask(insight, suggestedTasks));
      let subtasks: any[] = [];
      
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
          subtasks: subtasksData.filter(st => st.task_id === t.id).map(st => ({
            id: st.id,
            title: st.title,
            done: st.completed,
          })),
          comments: [],
          products: [],
          // Ensure we're properly handling the data object
          data: t.data || {},
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
                  priority: (newTask.priority || 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
                  date: new Date(newTask.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }),
                  subtasks: subtasks.map(st => ({ id: st.id, title: st.title, done: st.completed })),
                  comments: [],
                  products: [],
                  data: newTask.data || {} // Ensure data is properly handled
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

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return { bg: 'text-blue-600', count: tasksByStatus[columnId]?.length || 0 };
      case 'inProgress':
        return { bg: 'text-orange-600', count: tasksByStatus[columnId]?.length || 0 };
      case 'done':
        return { bg: 'text-green-600', count: tasksByStatus[columnId]?.length || 0 };
      case 'suggested':
        return { bg: 'text-purple-600', count: filteredSuggestedTasks.length };
      default:
        return { bg: 'text-gray-600', count: 0 };
    }
  };

  return (
    <div className="space-y-6 p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs px-3 py-1"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="text-xs px-3 py-1"
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSuggestedTasks(!showSuggestedTasks)}
            className="text-sm"
          >
            Suggested Tasks
          </Button>
        </div>
        <Button 
          onClick={onCreateTask}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground text-lg">Loading your tasks…</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => {
              const colorInfo = getColumnColor(col.id);
              
              return (
                <div key={col.id}>
                  <div className="mb-4">
                    <h2 className={`font-medium text-sm ${colorInfo.bg} flex items-center gap-2`}>
                      {col.label}
                      <span className="text-gray-500 font-normal">
                        {colorInfo.count}
                      </span>
                    </h2>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 min-h-[200px]"
                        onClick={(e) => e.stopPropagation()}
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
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <TaskCard
                                      task={task}
                                      onClick={() => {
                                        setSelectedTask(task);
                                        setIsPreviewOpen(true);
                                      }}
                                      isSuggested={true}
                                      onAccept={() => handleCreateTask(task)}
                                      onReject={() => handleDismissTask(task.id)}
                                      hideFlowTag={true}
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
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                  >
                                    <TaskCard
                                      task={task}
                                      onClick={() => {
                                        setSelectedTask(task);
                                        setIsPreviewOpen(true);
                                      }}
                                      hideFlowTag={true}
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
              );
            })}
          </div>
        </DragDropContext>
      )}
      
      <TaskPreviewDialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) setSelectedTask(null);
        }}
        task={selectedTask}
      />
      <InsightsDialog
        open={isInsightsDialogOpen}
        onOpenChange={(open) => {
          setIsInsightsDialogOpen(open);
          if (!open) setDetailInsight(null);
        }}
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
