
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TriggerType } from '@/components/jarvi-flows/FlowsGrid';

interface FlowDetailsSectionProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  trigger: TriggerType;
  setTrigger: (trigger: TriggerType) => void;
}

export function FlowDetailsSection({
  name, 
  setName,
  description,
  setDescription,
  trigger,
  setTrigger
}: FlowDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        {name ? 'Edit Flow' : 'Create New Flow'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Flow Name</Label>
            <Input 
              id="name" 
              value={name} 
              placeholder="Enter flow name"
              onChange={(e) => setName(e.target.value)} 
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              placeholder="Describe what this flow does"
              onChange={(e) => setDescription(e.target.value)} 
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="trigger">Trigger Type</Label>
          <Select 
            value={trigger} 
            onValueChange={(value) => setTrigger(value as TriggerType)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Trigger</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="event">Event-Based</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            {trigger === 'manual' && "This flow will need to be manually triggered by a user."}
            {trigger === 'scheduled' && "This flow will run automatically based on a schedule."}
            {trigger === 'webhook' && "This flow will be triggered by webhook calls."}
            {trigger === 'event' && "This flow will be triggered when specific events occur."}
          </p>
        </div>
      </div>
    </div>
  );
}
