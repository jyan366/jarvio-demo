import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Eye, Link, BarChart2, Trash2, MoreHorizontal } from 'lucide-react';
import { CreateInsightDialog } from '@/components/tasks/CreateInsightDialog';

interface Task {
  id: string;
  name: string;
  category: 'Sales' | 'Inventory' | 'Listings' | 'Other' | 'Advertising';
  status: 'Backlog' | 'Historical';
  priority: 'Medium' | 'High' | 'Low';
  frequency?: 'WEEKLY';
}

interface InsightTask {
  id: string;
  name: string;
  completed: boolean;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  tasks: InsightTask[];
  showTasks: boolean;
}

const initialInsights: Insight[] = [
  {
    id: '1',
    title: 'My listing has been suppressed',
    description: 'Detected ingredient "Guava"',
    category: 'Listings',
    showTasks: false,
    tasks: [
      { id: '1', name: 'Review Suppressed Listings', completed: false },
      { id: '2', name: 'Correct Listing Information', completed: false },
      { id: '3', name: 'Resubmit Listings for Review', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Products Sales Spike',
    description: 'Products with a significant increase in units ...',
    category: 'Sales',
    showTasks: false,
    tasks: [
      { id: '4', name: 'Analyze Sales Data', completed: false },
      { id: '5', name: 'Review Inventory Levels', completed: false },
      { id: '6', name: 'Update Sales Forecast', completed: false },
    ],
  },
];

const scheduledTasks: Task[] = [
  {
    id: 'TASK-342',
    name: 'Conduct Performance Deep Dive',
    category: 'Sales',
    status: 'Backlog',
    priority: 'Medium',
    frequency: 'WEEKLY',
  },
  {
    id: 'TASK-343',
    name: 'Audit Listing Quality Page for Updates',
    category: 'Listings',
    status: 'Backlog',
    priority: 'Medium',
    frequency: 'WEEKLY',
  },
  {
    id: 'TASK-344',
    name: 'Check Account Health',
    category: 'Other',
    status: 'Backlog',
    priority: 'Medium',
    frequency: 'WEEKLY',
  },
];

const backlogTasks: Task[] = [
  {
    id: 'TASK-305',
    name: 'Promotion Strategy',
    category: 'Sales',
    status: 'Backlog',
    priority: 'Medium',
  },
  {
    id: 'TASK-301',
    name: 'Identify Critical Products',
    category: 'Inventory',
    status: 'Backlog',
    priority: 'Medium',
  },
];

const categoryColors = {
  Sales: 'bg-red-500/10 text-red-500',
  Inventory: 'bg-blue-500/10 text-blue-500',
  Listings: 'bg-green-500/10 text-green-500',
  Other: 'bg-gray-500/10 text-gray-500',
  Advertising: 'bg-yellow-500/10 text-yellow-500',
  Customers: 'bg-purple-500/10 text-purple-500',
  Competitors: 'bg-orange-500/10 text-orange-500',
};

const statusColors = {
  Backlog: 'bg-yellow-500/10 text-yellow-500',
  Historical: 'bg-brown-500/10 text-brown-500',
};

export default function ActionStudio() {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [createInsightOpen, setCreateInsightOpen] = useState(false);

  const toggleTasks = (insightId: string) => {
    setInsights(insights.map(insight => {
      if (insight.id === insightId) {
        return { ...insight, showTasks: !insight.showTasks };
      }
      return insight;
    }));
  };

  const toggleTask = (insightId: string, taskId: string) => {
    setInsights(insights.map(insight => {
      if (insight.id === insightId) {
        return {
          ...insight,
          tasks: insight.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          })
        };
      }
      return insight;
    }));
  };

  const handleCreateInsight = (newInsight: { title: string; description: string; category: string }) => {
    const insight: Insight = {
      id: (insights.length + 1).toString(),
      ...newInsight,
      showTasks: false,
      tasks: [
        { id: Math.random().toString(), name: 'Review Impact', completed: false },
        { id: Math.random().toString(), name: 'Take Action', completed: false },
        { id: Math.random().toString(), name: 'Monitor Results', completed: false },
      ],
    };
    setInsights([insight, ...insights]);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Action Studio</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Cultured Food Company</span>
              <span className="text-muted-foreground">UK</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Insights</h2>
              <Button 
                className="w-full md:w-auto flex items-center gap-2"
                onClick={() => setCreateInsightOpen(true)}
              >
                <BarChart2 className="w-4 h-4" />
                New Insight
              </Button>
            </div>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex flex-col gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{insight.title}</h3>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[insight.category as keyof typeof categoryColors]}`}>
                        {insight.category}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => toggleTasks(insight.id)}
                      className="w-full"
                    >
                      {insight.showTasks ? "Hide Tasks" : "View Suggested Tasks"}
                    </Button>
                    
                    {insight.showTasks && (
                      <div className="mt-4 space-y-4">
                        <h4 className="font-medium">Suggested Tasks:</h4>
                        <div className="space-y-3">
                          {insight.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(insight.id, task.id)}
                              />
                              <span className="text-sm">{task.name}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800">
                          Add Selected Tasks to Workflow
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Scheduled Tasks</h2>
              <Button className="w-full md:w-auto">Schedule Task</Button>
            </div>
            <div className="space-y-4">
              {scheduledTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-2 w-full md:w-auto">
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                          {task.category}
                        </span>
                        <span className="text-sm text-muted-foreground">{task.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button variant="outline" size="sm" className="w-full md:w-auto">Edit</Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <CreateInsightDialog
        open={createInsightOpen}
        onOpenChange={setCreateInsightOpen}
        onInsightCreate={handleCreateInsight}
      />
    </MainLayout>
  );
}
