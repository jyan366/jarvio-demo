
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid, List, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskPreviewDialog } from '@/components/tasks/TaskPreviewDialog';

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
      title: 'Resolve Support Cases 2101',
      description: 'My listing was removed due to an ingredient detected "Guava". This is not in the product and is a listing error.',
      status: 'Not Started',
      priority: 'HIGH',
      category: 'LISTINGS',
      date: '16 Apr 2025',
      commentsCount: 1,
      products: [
        {
          name: 'Kimchi 1kg Jar - Raw & Unpasteurised',
          asin: 'B08P5P3QCG',
          sku: 'KM1000',
          price: 16.99,
          units: 111
        }
      ],
      subtasks: [
        { title: 'Review listing details' },
        { title: 'Contact support' },
        { title: 'Update product information' }
      ],
      comments: [
        {
          author: 'John Doe',
          date: '2 days ago',
          content: 'Following up on this case.'
        }
      ]
    }
  ],
  inProgress: [],
  done: []
};

export default function TaskManager() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceColumn = tasks[result.source.droppableId];
    const destColumn = tasks[result.destination.droppableId];
    const [removed] = sourceColumn.splice(result.source.index, 1);
    destColumn.splice(result.destination.index, 0, removed);

    setTasks({
      ...tasks,
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasks).map(([columnId, columnTasks]) => (
              <Card key={columnId} className="p-4">
                <h2 className="font-semibold mb-4 capitalize">
                  {columnId.replace(/([A-Z])/g, ' $1').trim()}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({columnTasks.length})
                  </span>
                </h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {columnTasks.map((task, index) => (
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
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            ))}
          </div>
        </DragDropContext>

        <TaskPreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          task={selectedTask}
        />
      </div>
    </MainLayout>
  );
}
