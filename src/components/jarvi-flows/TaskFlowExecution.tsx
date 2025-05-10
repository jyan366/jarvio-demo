
import { useState, useEffect } from 'react';
import { Flow } from './FlowsGrid';
import { FlowExecutionView } from './FlowExecutionView';
import { Subtask } from '@/pages/TaskWorkContainer';
import { formatSystemMessage } from '../tasks/services/jarvioMessageService';

interface TaskFlowExecutionProps {
  taskId: string;
  taskData?: { 
    flowId?: string;
    flowTrigger?: string;
  };
  subtasks: Subtask[];
  isFlowTask: boolean;
  onAddMessage?: (message: any) => void;
}

export function TaskFlowExecution({ 
  taskId, 
  taskData, 
  subtasks,
  isFlowTask,
  onAddMessage 
}: TaskFlowExecutionProps) {
  const [flow, setFlow] = useState<Flow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFlowTask || !taskData?.flowId) {
      setLoading(false);
      return;
    }
    
    // Load the flow from localStorage
    const loadFlow = () => {
      const savedFlowsString = localStorage.getItem('jarviFlows');
      if (savedFlowsString) {
        try {
          const savedFlows = JSON.parse(savedFlowsString);
          const foundFlow = savedFlows.find((f: Flow) => f.id === taskData.flowId);
          
          if (foundFlow) {
            setFlow(foundFlow);
            // Add system message about flow
            if (onAddMessage) {
              onAddMessage(formatSystemMessage(
                `Found flow "${foundFlow.name}". This task was created from a flow with ${foundFlow.blocks.length} steps.`,
                0
              ));
            }
          } else {
            if (onAddMessage) {
              onAddMessage(formatSystemMessage(
                `Flow with ID ${taskData.flowId} was not found in saved flows. Some features may be limited.`,
                0
              ));
            }
          }
        } catch (error) {
          console.error("Error parsing saved flows:", error);
        }
      }
      setLoading(false);
    };
    
    loadFlow();
  }, [isFlowTask, taskData?.flowId]);

  // If this is not a flow task, don't render anything
  if (!isFlowTask || !taskData?.flowId) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 border rounded-md text-center">
        Loading flow information...
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">
          Could not find flow with ID: {taskData.flowId}. The flow may have been deleted.
        </p>
      </div>
    );
  }

  // Return the flow execution component
  return (
    <FlowExecutionView 
      flow={flow} 
      taskId={taskId}
      onComplete={() => {
        if (onAddMessage) {
          onAddMessage(formatSystemMessage(
            `Flow "${flow.name}" execution completed successfully! All ${flow.blocks.length} steps were processed.`,
            0
          ));
        }
      }} 
    />
  );
}
