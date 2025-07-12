import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Zap, Calendar, Globe, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TriggerNodeProps {
  data: {
    triggerType: string;
    onTriggerChange: (trigger: string) => void;
    onStartFlow: () => void;
    isRunning: boolean;
  };
}

const triggerOptions = [
  {
    value: 'manual',
    label: 'Manual',
    icon: Zap,
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    icon: Clock,
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    value: 'daily',
    label: 'Daily',
    icon: Calendar,
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    value: 'webhook',
    label: 'Webhook',
    icon: Globe,
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  }
];

export function TriggerNode({ data }: TriggerNodeProps) {
  const { triggerType, onTriggerChange, onStartFlow, isRunning } = data;
  const currentTrigger = triggerOptions.find(t => t.value === triggerType) || triggerOptions[0];
  const TriggerIcon = currentTrigger.icon;

  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 min-w-[200px] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <TriggerIcon className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Flow Trigger</h3>
          <p className="text-xs text-gray-500">How this flow starts</p>
        </div>
      </div>

      <div className="space-y-3">
        <Select value={triggerType} onValueChange={onTriggerChange}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {triggerOptions.map((trigger) => (
              <SelectItem key={trigger.value} value={trigger.value}>
                <div className="flex items-center gap-2">
                  <trigger.icon className="w-3 h-3" />
                  <span className="text-xs">{trigger.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className={`p-2 rounded border ${currentTrigger.color}`}>
          <div className="flex items-center gap-2">
            <TriggerIcon className="w-3 h-3" />
            <span className="text-xs font-medium">{currentTrigger.label}</span>
          </div>
        </div>

        {triggerType === 'manual' && (
          <Button
            size="sm"
            onClick={onStartFlow}
            disabled={isRunning}
            className="w-full h-7 text-xs bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Start Flow
              </>
            )}
          </Button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !border-gray-600 !w-3 !h-3"
      />
    </div>
  );
}