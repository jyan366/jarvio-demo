
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const metrics = [
  { label: 'Total Sales', value: '£12,954.99', change: -20.65 },
  { label: 'Total Cost', value: '£9,471.61', change: -27.71 },
  { label: 'Total Profit', value: '£217.61', change: -93.32 },
  { label: 'Advertising Cost', value: '£0.00', change: 0 },
  { label: 'Inventory Value', value: '£12,570.47', change: 0 },
  { label: 'Profit Margin', value: '1.68%', change: -91.58 },
  { label: 'Units Sold', value: '950', change: -20.44 },
];

const tasks = {
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
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold">{metric.value}</p>
                  {metric.change !== 0 && (
                    <div className={`flex items-center ${metric.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {metric.change < 0 ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      <span className="text-sm">{Math.abs(metric.change)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button variant="outline">Select Category</Button>
              <Button variant="outline">Select Priority</Button>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasks).map(([status, items]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="capitalize font-semibold">
                    {status.replace(/([A-Z])/g, ' $1').trim()}
                    <span className="ml-2 text-sm text-muted-foreground">({items.length})</span>
                  </h3>
                  <Button variant="ghost" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {items.map((task, index) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
