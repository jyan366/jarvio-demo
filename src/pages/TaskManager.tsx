
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid, List, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskPreviewDialog } from '@/components/tasks/TaskPreviewDialog';
import { InsightsDialog } from '@/components/insights/InsightsDialog';
import { InsightDetailDialog } from '@/components/insights/InsightDetailDialog';
import { useToast } from '@/hooks/use-toast';
import { InsightData, InsightCategory, InsightSeverity } from '@/components/tasks/InsightCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  fetchTasks,
  fetchSubtasks,
  createTask,
  createSubtasks,
  SupabaseTask,
  SupabaseSubtask,
  initializeSampleTasks,
  addSampleSubtasksToTask
} from '@/lib/supabaseTasks';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  products?: any[];
  subtasks?: any[];
  comments?: any[];
  date: string;
  commentsCount?: number;
}

const initialTasks: { [key: string]: Task[] } = {
  todo: [
    {
      id: '1',
      title: 'Fix Main Images for Suppressed Listings',
      description: 'Update main product images to comply with Amazon\'s policy requirements to get listings unsuppressed.',
      status: 'Not Started',
      priority: 'HIGH',
      category: 'LISTINGS',
      date: '16 Apr 2025',
      commentsCount: 3,
    },
    {
      id: '2',
      title: 'Monitor Listing Status',
      description: 'After updating the main images, continuously monitor the status of the affected listings to ensure they are no longer suppressed.',
      status: 'Not Started',
      priority: 'MEDIUM',
      category: 'LISTINGS',
      date: '16 Apr 2025',
    },
    {
      id: '3',
      title: 'Resolve Support Cases 2101',
      description: 'My listing was removed due to an ingredient detected in the product "Guava". This is not in the product and appears to be a listing error.',
      status: 'Not Started',
      priority: 'HIGH',
      category: 'SUPPORT',
      date: '16 Apr 2025',
      commentsCount: 1,
    },
    {
      id: '4',
      title: 'Identify Suppressed Listings',
      description: 'Review listings to identify those that are currently suppressed due to non-compliance with Amazon\'s policies.',
      status: 'Not Started',
      priority: 'LOW',
      category: 'LISTINGS',
      date: '17 Apr 2025',
    }
  ],
  inProgress: [
    {
      id: '5',
      title: 'Review and Address Customer Feedback',
      description: 'Analyze all 1-star reviews to understand issues raised by customers, focusing on listing inaccuracies and quality concerns.',
      status: 'In Progress',
      priority: 'HIGH',
      category: 'REVIEWS',
      date: '14 Apr 2025',
      commentsCount: 2,
    },
    {
      id: '6',
      title: 'Analyze Reviews for Keyword Opportunities',
      description: 'Examine 5-star reviews to identify any keywords frequently mentioned that are not currently included in product metadata.',
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'KEYWORDS',
      date: '14 Apr 2025',
      commentsCount: 5,
    },
    {
      id: '7',
      title: 'Update Product Descriptions',
      description: 'Revise product descriptions to include new keywords identified from customer reviews and improve SEO ranking.',
      status: 'In Progress',
      priority: 'LOW',
      category: 'LISTINGS',
      date: '15 Apr 2025',
    }
  ],
  done: [
    {
      id: '8',
      title: 'Resolve Listing Suppression',
      description: 'Identified and resolved issues with suppressed listings to reinstate them on the marketplace.',
      status: 'Done',
      priority: 'HIGH',
      category: 'LISTINGS',
      date: '10 Apr 2025',
      commentsCount: 4,
    },
    {
      id: '9',
      title: 'Assess Inventory Impact',
      description: 'Evaluated the potential impact on sales and inventory turnover due to the suppression of best-seller listings.',
      status: 'Done',
      priority: 'MEDIUM',
      category: 'INVENTORY',
      date: '12 Apr 2025',
    },
    {
      id: '10',
      title: 'Analyze Competitor Pricing',
      description: 'Examined competitor pricing for best sellers to identify if price adjustments are needed to win back the Buy Box.',
      status: 'Done',
      priority: 'LOW',
      category: 'PRICING',
      date: '09 Apr 2025',
      commentsCount: 1,
    }
  ]
};

const COLUMN_CONFIG = [
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

const insightsData: InsightData[] = [
  {
    id: '1',
    title: '1 Star Review Detected',
    description: 'A new 1-star review was detected for Kimchi 1kg Jar mentioning "product arrived damaged".',
    category: 'REVIEW',
    severity: 'HIGH',
    date: '20 Apr 2025',
  },
  {
    id: '2',
    title: 'Lost Buy Box on Kimchi 500g',
    description: 'You are no longer the Buy Box winner for Kimchi 500g. Current winner is offering 5% lower price.',
    category: 'PRICING',
    severity: 'HIGH',
    date: '19 Apr 2025',
  },
  {
    id: '3',
    title: 'New Listing Opportunity',
    description: 'Based on search trends, "Vegan Kimchi" has high search volume with low competition. Consider creating a listing.',
    category: 'LISTING',
    severity: 'MEDIUM',
    date: '18 Apr 2025',
  },
  {
    id: '4',
    title: 'Competitor Price Drop',
    description: 'A main competitor has reduced prices across their fermented food products by an average of 8%.',
    category: 'COMPETITION',
    severity: 'MEDIUM',
    date: '17 Apr 2025',
  },
];

export default function TaskManager() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isInsightsDialogOpen, setIsInsightsDialogOpen] = useState(false);
  const [detailInsight, setDetailInsight] = useState<InsightData | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try to fetch tasks from Supabase
        let supabaseTasks = await fetchTasks();
        
        // If no tasks exist, initialize with sample data
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
        toast({ title: "Error", description: String(e) });
      }
      setLoading(false);
    }
    load();
  }, []);

  function mapInsightToTask(insight: InsightData, suggestedTasks?: any[]) {
    return {
      title: insight.title,
      description: insight.description,
      status: "Not Started" as const,
      priority: insight.severity === 'HIGH' ? 'HIGH' : insight.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
      category: insight.category,
      insight_id: insight.id,
    };
  }

  const createTaskFromInsight = async (insight: InsightData, suggestedTasks?: any[]) => {
    try {
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
                } as Task);
                setIsPreviewOpen(true);
              }}
            >
              View Task
            </Button>
          </div>
        ),
      });
    } catch (e) {
      toast({ title: "Error", description: String(e) });
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

  return (
    <MainLayout>
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
              onClick={() => setIsInsightsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <span>Insights</span>
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
              {COLUMN_CONFIG.map((col) => (
                <div key={col.id} className="rounded-xl p-3 md:p-2">
                  <Card className={`p-0 bg-transparent shadow-none border-0`}>
                    <div className={`px-3 pt-2 pb-4 ${col.bg} rounded-xl`}>
                      <h2 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${col.headerColor}`}>
                        {col.label}
                        <span className="ml-2 text-base text-gray-400 font-medium">{tasksByStatus[col.id]?.length || 0}</span>
                      </h2>
                      <Droppable droppableId={col.id}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {tasksByStatus[col.id]?.map((task, index) => (
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
    </MainLayout>
  );
}
