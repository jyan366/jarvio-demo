import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Database, Brain, Zap, User, Settings, Trash2 } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface FlowNodeProps {
  step: FlowStep;
  block?: FlowBlock | null;
  isAgent: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPromptChange?: (prompt: string) => void;
  style: React.CSSProperties;
}

export function FlowNode({ 
  step, 
  block, 
  isAgent, 
  onEdit, 
  onDelete, 
  onPromptChange, 
  style 
}: FlowNodeProps) {
  const getBlockIcon = (type?: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
      default:
        return <User className="w-4 h-4 text-orange-600" />;
    }
  };

  const getBlockColor = (type?: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'think':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'act':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'agent':
      default:
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
    }
  };

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-100 text-blue-700';
      case 'think':
        return 'bg-purple-100 text-purple-700';
      case 'act':
        return 'bg-green-100 text-green-700';
      case 'agent':
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <Card 
      className={`w-64 cursor-move transition-all duration-200 ${getBlockColor(isAgent ? 'agent' : block?.type)}`}
      style={style}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getBlockIcon(isAgent ? 'agent' : block?.type)}
              <Badge 
                variant="secondary" 
                className={`text-xs ${getBadgeColor(isAgent ? 'agent' : block?.type)}`}
              >
                {isAgent ? 'Agent' : block?.type || 'collect'}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-6 w-6 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-medium text-sm line-clamp-2">{step.title}</h3>
            {!isAgent && block && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {block.name}
              </p>
            )}
          </div>

          {/* Agent-specific content */}
          {isAgent && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                24/24 blocks selected
              </div>
              {step.agentPrompt !== undefined && (
                <Textarea
                  placeholder="Enter agent prompt..."
                  value={step.agentPrompt || ''}
                  onChange={(e) => onPromptChange?.(e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                />
              )}
            </div>
          )}

          {/* Step completion indicator */}
          {step.completed && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Completed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}