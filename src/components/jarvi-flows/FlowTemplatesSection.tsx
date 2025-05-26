
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Sample flow templates
const flowTemplates = [
  {
    id: 'performance-summary-email',
    name: 'Get Performance Summary via Email',
    description: 'This flow is to get the account performance summary and send it via email',
    steps: 3,
    trigger: 'Manual'
  },
  {
    id: 'inventory-restock-alert',
    name: 'Inventory Restock Alert System',
    description: 'Automatically monitors inventory levels and sends restock alerts when products are running low',
    steps: 4,
    trigger: 'Manual'
  },
  {
    id: 'competitor-price-monitoring',
    name: 'Competitor Price Monitoring',
    description: 'Track competitor pricing changes and get notifications when prices drop below your threshold',
    steps: 5,
    trigger: 'Manual'
  }
];

export function FlowTemplatesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Flow Templates</h2>
      </div>

      {/* Search bar */}
      <div className="max-w-md">
        <Input placeholder="Search flows..." className="w-full" />
      </div>

      {/* Flow templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {flowTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold break-words">{template.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 break-words">{template.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-1 rounded-md bg-secondary p-1 text-secondary-foreground">
                  <Play className="h-4 w-4" />
                  <span className="text-xs">{template.trigger}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                {template.steps} steps in this flow
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4 mr-1" />
                Run Flow
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
