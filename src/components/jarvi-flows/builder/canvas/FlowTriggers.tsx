import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Calendar, Globe } from 'lucide-react';

interface FlowTriggersProps {
  selectedTrigger: string;
  onTriggerChange: (trigger: string) => void;
  onStartFlow: () => void;
  isRunning: boolean;
}

const triggerOptions = [
  {
    value: 'manual',
    label: 'Manual Trigger',
    description: 'Start the flow manually when needed',
    icon: Zap,
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Run automatically on a schedule',
    icon: Clock,
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Run once every day',
    icon: Calendar,
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    value: 'webhook',
    label: 'Webhook',
    description: 'Triggered by external events',
    icon: Globe,
    color: 'bg-orange-50 text-orange-700 border-orange-200'
  }
];

export function FlowTriggers({ selectedTrigger, onTriggerChange, onStartFlow, isRunning }: FlowTriggersProps) {
  const currentTrigger = triggerOptions.find(t => t.value === selectedTrigger) || triggerOptions[0];
  const TriggerIcon = currentTrigger.icon;

  return (
    <div className="absolute bottom-4 left-4 bg-white border rounded-lg shadow-lg p-4 z-20 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Flow Trigger</h3>
        {selectedTrigger === 'manual' && (
          <Button
            size="sm"
            onClick={onStartFlow}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isRunning ? 'Running...' : 'Start Flow'}
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <Select value={selectedTrigger} onValueChange={onTriggerChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {triggerOptions.map((trigger) => (
              <SelectItem key={trigger.value} value={trigger.value}>
                <div className="flex items-center gap-2">
                  <trigger.icon className="w-4 h-4" />
                  {trigger.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className={`p-3 rounded-lg border ${currentTrigger.color}`}>
          <div className="flex items-center gap-2 mb-1">
            <TriggerIcon className="w-4 h-4" />
            <span className="font-medium text-sm">{currentTrigger.label}</span>
          </div>
          <p className="text-xs opacity-80">{currentTrigger.description}</p>
        </div>

        {selectedTrigger === 'scheduled' && (
          <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
            Configure schedule in flow settings
          </div>
        )}

        {selectedTrigger === 'webhook' && (
          <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
            Webhook URL will be generated after saving
          </div>
        )}
      </div>
    </div>
  );
}