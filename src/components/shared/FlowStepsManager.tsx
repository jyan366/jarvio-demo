
import React, { useState } from 'react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { FlowStepsEditor } from '@/components/jarvi-flows/builder/FlowStepsEditor';
import { AIStepGenerator } from '@/components/shared/AIStepGenerator';
import { UnifiedTask } from '@/types/unifiedTask';

interface FlowStepsManagerProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  taskTitle?: string;
  taskDescription?: string;
  showAIGenerator?: boolean;
  availableBlockOptions?: Record<string, string[]>;
  task?: UnifiedTask; // Add task prop
}

export function FlowStepsManager({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  taskTitle,
  taskDescription,
  showAIGenerator = true,
  availableBlockOptions = {
    collect: ['User Text', 'File Upload', 'Data Import', 'Form Input'],
    think: ['Basic AI Analysis', 'Advanced Reasoning', 'Data Processing', 'Pattern Recognition'],
    act: ['AI Summary', 'Send Email', 'Create Report', 'Update Database', 'API Call'],
    agent: ['Agent']
  },
  task
}: FlowStepsManagerProps) {
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  const handleStepsGenerated = (generatedSteps: FlowStep[], generatedBlocks: FlowBlock[]) => {
    onStepsChange(generatedSteps);
    onBlocksChange(generatedBlocks);
    setShowAIPrompt(false);
  };

  const toggleAIGenerator = () => {
    setShowAIPrompt(!showAIPrompt);
  };

  return (
    <div className="space-y-6">
      {showAIGenerator && showAIPrompt && (
        <AIStepGenerator
          onStepsGenerated={handleStepsGenerated}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          placeholder="E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team."
        />
      )}

      <FlowStepsEditor
        steps={steps}
        blocks={blocks}
        onStepsChange={onStepsChange}
        onBlocksChange={onBlocksChange}
        availableBlockOptions={availableBlockOptions}
        task={task}
      />

      {showAIGenerator && !showAIPrompt && (
        <div className="flex justify-center">
          <button
            onClick={toggleAIGenerator}
            className="text-sm text-purple-600 hover:text-purple-700 underline"
          >
            Generate steps with AI
          </button>
        </div>
      )}
    </div>
  );
}
