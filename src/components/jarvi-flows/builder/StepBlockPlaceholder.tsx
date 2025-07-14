import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Database, Brain, Zap, User, X, Settings } from 'lucide-react';
import { FlowBlock, FlowStep } from '@/types/flowTypes';
import { BlockConfigDialog } from './BlockConfigDialog';
import { StepBlockSelectionDialog } from './StepBlockSelectionDialog';
import { v4 as uuidv4 } from 'uuid';

interface StepBlockPlaceholderProps {
  step: FlowStep;
  onBlockAttached: (stepId: string, block: FlowBlock) => void;
  onBlockDetached: (stepId: string) => void;
  onBlockConfigured: (block: FlowBlock) => void;
  onAgentSelected?: (stepId: string) => void;
  attachedBlock?: FlowBlock | null;
  availableBlockOptions?: Record<string, string[]>;
}

export function StepBlockPlaceholder({
  step,
  onBlockAttached,
  onBlockDetached,
  onBlockConfigured,
  onAgentSelected,
  attachedBlock,
  availableBlockOptions = {}
}: StepBlockPlaceholderProps) {
  const [showBlockConfig, setShowBlockConfig] = useState(false);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'think':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'act':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'agent':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleBlockSelected = (block: FlowBlock) => {
    onBlockAttached(step.id, block);
  };

  const handleAgentSelected = () => {
    // Call the parent's agent selection handler if provided
    if (onAgentSelected) {
      onAgentSelected(step.id);
    }
  };

  const handleDetachBlock = () => {
    onBlockDetached(step.id);
  };

  const handleConfigureBlock = () => {
    if (attachedBlock) {
      setShowBlockConfig(true);
    }
  };

  const getCategoryDisplayName = (type: string) => {
    switch (type) {
      case 'collect': return 'Collect Data';
      case 'think': return 'Process & Analyze';
      case 'act': return 'Take Action';
      case 'agent': return 'AI Agent';
      default: return type;
    }
  };

  // Show attached block
  if (attachedBlock) {
    return (
      <>
        <Card className={`mt-3 transition-colors ${getBlockColor(attachedBlock.type)}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getBlockIcon(attachedBlock.type)}
                <Badge variant="outline" className="capitalize text-xs">
                  {getCategoryDisplayName(attachedBlock.type)}
                </Badge>
                <span className="text-sm font-medium">{attachedBlock.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleConfigureBlock}
                  className="h-6 w-6 p-0"
                  title="Configure block parameters"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDetachBlock}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  title="Remove block"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Show configuration hint for agents */}
            {attachedBlock.type === 'agent' && (
              <div className="mt-2 pt-2 border-t border-purple-200">
                <p className="text-xs text-purple-700">
                  <Settings className="inline w-3 h-3 mr-1" />
                  Click configure to set system prompt, tools, and parameters
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {showBlockConfig && (
          <BlockConfigDialog
            isOpen={showBlockConfig}
            onClose={() => setShowBlockConfig(false)}
            block={attachedBlock}
          />
        )}
      </>
    );
  }

  // Show placeholder for adding block/agent
  return (
    <>
      <Card className="mt-3 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
        <CardContent className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSelectionDialog(true)}
            className="w-full h-8 text-gray-600 hover:text-gray-800 justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Block or Use Agent
          </Button>
        </CardContent>
      </Card>

      <StepBlockSelectionDialog
        open={showSelectionDialog}
        onOpenChange={setShowSelectionDialog}
        onBlockSelected={handleBlockSelected}
        onAgentSelected={handleAgentSelected}
      />
    </>
  );
}