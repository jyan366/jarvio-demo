
import React, { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { useToast } from '@/components/ui/use-toast';

const metrics = [
  { label: 'Total Sales', value: '£89,954.99', change: 35.65, inverseColor: false },
  { label: 'Total Cost', value: '£52,471.61', change: -8.71, inverseColor: true },
  { label: 'Total Profit', value: '£37,483.38', change: 68.32, inverseColor: false },
  { label: 'Advertising Cost', value: '£2,890.00', change: -12.5, inverseColor: true },
  { label: 'Inventory Value', value: '£142,570.47', change: 45.3, inverseColor: false },
  { label: 'Profit Margin', value: '41.67%', change: 28.58, inverseColor: false },
  { label: 'Units Sold', value: '4,950', change: 55.44, inverseColor: false },
];

const initialTasks = {
  todo: [
    {
      title: 'Resolve Support Case 21',
      priority: 'low',
      description: 'My listing was removed due to an ingredient detected "Guava" that is prohibited. This is not in my product.',
      tag: 'Listings',
      products: ['Kimchi 1kg Jar - Ra'],
    },
    {
      title: 'Enhance Product Listings',
      priority: 'high',
      description: 'Revise your bean product listings by incorporating high-value keywords, compelling images, and detailed descriptions to attract more customers.',
      tag: 'Marketing',
    },
  ],
  inProgress: [
    {
      title: 'Automate Pricing',
      priority: 'medium',
      description: 'Set up Automated Pricing within Seller Central',
      tag: 'Sales',
    },
    {
      title: 'Create Restock Order',
      priority: 'high',
      description: 'Task description, but this is a random description',
      tag: 'Sales',
      products: ['Carrot & Fennel Sauce', 'Kimchi 1kg Jar - Ra'],
    },
  ],
  done: [
    {
      title: 'Optimise Images',
      priority: 'high',
      description: 'Task description',
      tag: 'Listings',
      products: ['Kimchi 1kg Jar - Ra', 'Juniper Berry with L'],
    },
    {
      title: 'Create Bundle Listing',
      priority: 'high',
      description: 'Task description',
      tag: 'Advertising',
    },
  ],
};

const priorityColors = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-danger/10 text-danger',
};

const tagColors = {
  Sales: 'bg-blue-500/10 text-blue-500',
  Listings: 'bg-green-500/10 text-green-500',
  Marketing: 'bg-purple-500/10 text-purple-500',
  Advertising: 'bg-orange-500/10 text-orange-500',
};

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const metricsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId as keyof typeof tasks]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: items,
      });
    } else {
      const sourceItems = Array.from(tasks[source.droppableId as keyof typeof tasks]);
      const destItems = Array.from(tasks[destination.droppableId as keyof typeof tasks]);
      const [removedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }
  };

  const handleCreateTask = (newTask: any) => {
    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, {
        ...newTask,
        tag: newTask.category,
      }]
    }));
    
    toast({
      title: "Task created",
      description: "Your new task has been added to the board.",
    });
  };

  const scrollMetrics = () => {
    if (metricsRef.current) {
      metricsRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Products
            </Button>
            <div className="w-full md:w-auto border rounded-lg px-4 py-2 text-sm">
              Jan 24, 2025 - Feb 23, 2025
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="relative">
          <div
            ref={metricsRef}
            className="flex lg:grid lg:grid-cols-7 overflow-x-auto lg:overflow-x-visible gap-4 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className="p-4 border rounded-2xl snap-start min-w-[180px] lg:min-w-0 flex-shrink-0 lg:flex-shrink"
              >
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                  <p className="text-lg md:text-xl font-bold">{metric.value}</p>
                  {metric.change !== 0 && (
                    <div className={`flex items-center ${
                      metric.inverseColor 
                        ? (metric.change < 0 ? 'text-green-500' : 'text-red-500')
                        : (metric.change < 0 ? 'text-red-500' : 'text-green-500')
                    } text-sm font-medium`}>
                      {metric.change < 0 ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <button
            onClick={scrollMetrics}
            className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden bg-background/80 backdrop-blur-sm border rounded-full p-2 shadow-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto">Select Category</Button>
              <Button variant="outline" className="w-full md:w-auto">Select Priority</Button>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {Object.entries(tasks).map(([status, items]) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="capitalize font-semibold">
                      {status.replace(/([A-Z])/g, ' $1').trim()}
                      <span className="ml-2 text-sm text-muted-foreground">({items.length})</span>
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {items.map((task, index) => (
                          <Draggable
                            key={task.title}
                            draggableId={task.title}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                                {task.products && (
                                  <div className="flex flex-wrap gap-2">
                                    {task.products.map((product, i) => (
                                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                        {product}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {task.tag && (
                                  <span className={`text-xs px-2 py-1 rounded ${tagColors[task.tag as keyof typeof tagColors]}`}>
                                    {task.tag}
                                  </span>
                                )}
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </MainLayout>
  );
}
