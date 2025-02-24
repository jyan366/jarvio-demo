
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Headphones } from 'lucide-react';

export default function TaskView() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium">Task Name</label>
              <Input value="Resolve Support Case 2101" readOnly />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Category</label>
              <Select>
                <option>Listings</option>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value="My listing was removed due to an ingredient detected &quot;Guava&quot; that is prohibited. This is not in my product."
                readOnly
                className="h-32"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Why Important</label>
              <Textarea 
                value="Resolving this support case is crucial to restore the listing, maintain sales, and uphold brand reputation."
                readOnly
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue="todo">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </Select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium">Priority Level</label>
                <Select defaultValue="low">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Input placeholder="Leave a comment on this task" className="flex-1" />
              <Button size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Headphones className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Product Name</span>
                  <span className="text-sm font-medium">Kimchi 1 kg Jar - Raw & Unpasteurised - Traditionally Fermented - by The Cultured Food Company</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">16.99</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Last 30D Sales</span>
                  <span className="text-sm font-medium">390.77</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Last 30D Units Sold</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Days of Stock Remaining</span>
                  <span className="text-sm font-medium">45</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <img src="/lovable-uploads/1a224868-586a-4b33-aea4-b6b32d85ea18.png" alt="Jarvio" className="h-8" />
                  <h3 className="text-xl font-bold">TASK ASSISTANT</h3>
                </div>
                <p className="text-center">
                  Need assistance on this task? Ask below and Jarvio will walk you through the steps and help you complete this task with ease!
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">Give me the steps</Button>
                  <Button variant="outline" className="flex-1">View more insights</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
