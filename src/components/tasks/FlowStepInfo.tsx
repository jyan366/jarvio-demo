
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, Brain, Zap, User } from 'lucide-react';

interface FlowStepInfoProps {
  block?: {
    id: string;
    type: 'collect' | 'think' | 'act' | 'agent';
    option: string;
    name: string;
    agentId?: string;
    agentName?: string;
  };
  compact?: boolean;
}

export function FlowStepInfo({ block, compact = false }: FlowStepInfoProps) {
  if (!block) return null;

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-3 h-3 text-blue-600" />;
      case 'think':
        return <Brain className="w-3 h-3 text-purple-600" />;
      case 'act':
        return <Zap className="w-3 h-3 text-green-600" />;
      case 'agent':
        return <User className="w-3 h-3 text-orange-600" />;
      default:
        return null;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'think':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'act':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'agent':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {getBlockIcon(block.type)}
        <Badge variant="outline" className={`text-xs capitalize ${getBlockColor(block.type)}`}>
          {block.type}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`p-2 rounded-md border ${getBlockColor(block.type).replace('text-', 'bg-').replace('-700', '-50').replace('bg-bg-', 'bg-')} border-opacity-50`}>
      <div className="flex items-center gap-2 text-xs">
        {getBlockIcon(block.type)}
        <span className="capitalize font-medium">{block.type}</span>
        <span className="text-gray-600">•</span>
        <span>{block.option}</span>
        {block.agentName && (
          <>
            <span className="text-gray-600">•</span>
            <span className="font-medium">{block.agentName}</span>
          </>
        )}
      </div>
    </div>
  );
}
