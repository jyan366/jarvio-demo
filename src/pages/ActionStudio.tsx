
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, Link, BarChart2, Trash2, MoreHorizontal } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  category: 'Sales' | 'Inventory' | 'Listings' | 'Other' | 'Advertising';
  status: 'Backlog' | 'Historical';
  priority: 'Medium' | 'High' | 'Low';
  frequency?: 'WEEKLY';
}

const insights = [
  {
    title: 'Products Sales Spike',
    description: 'Products with a significant increase in units ...',
    category: 'Sales',
  },
  {
    title: 'Products Sales Dip',
    description: 'Products with a significant decrease in units ...',
    category: 'Sales',
  },
  {
    title: 'My listing has been suppressed',
    description: 'Detected ingredient "Guava"',
    category: 'Listings',
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
  // ... add more backlog tasks as needed
];

const categoryColors = {
  Sales: 'bg-red-500/10 text-red-500',
  Inventory: 'bg-blue-500/10 text-blue-500',
  Listings: 'bg-green-500/10 text-green-500',
  Other: 'bg-gray-500/10 text-gray-500',
  Advertising: 'bg-yellow-500/10 text-yellow-500',
};

const statusColors = {
  Backlog: 'bg-yellow-500/10 text-yellow-500',
  Historical: 'bg-brown-500/10 text-brown-500',
};

export default function ActionStudio() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Action Studio</h1>
          <div className="flex items-center gap-2">
            <span className="font-medium">Cultured Food Company</span>
            <span className="text-muted-foreground">UK</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Insights Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Insights</h2>
              <Button className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                New Insight
              </Button>
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{insight.title}</h3>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
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
              ))}
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page 1 of 9</span>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Scheduled Tasks Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Scheduled Tasks</h2>
              <Button>Schedule Task</Button>
            </div>
            <div className="space-y-4">
              {scheduledTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                          {task.category}
                        </span>
                        <span className="text-sm text-muted-foreground">{task.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page 1 of 5</span>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Backlog Section */}
          <Card className="col-span-2 p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold">Backlog</h2>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">7</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium">Task ID</th>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Priority</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backlogTasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-4">{task.id}</td>
                      <td className="py-4">{task.name}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                          {task.category}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-orange-500">●</span> {task.priority}
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
