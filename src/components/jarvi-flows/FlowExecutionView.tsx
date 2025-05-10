
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Flow } from '@/components/jarvi-flows/FlowsGrid';
import { useFlowExecution } from './engine/FlowExecutionEngine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Brain, Zap, User, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FlowExecutionViewProps {
  flow: Flow;
  taskId: string;
  onComplete?: () => void;
}

export function FlowExecutionView({ flow, taskId, onComplete }: FlowExecutionViewProps) {
  const { toast } = useToast();
  const { 
    startExecution, 
    isExecuting, 
    isCompleted, 
    currentBlockIndex, 
    blockResults 
  } = useFlowExecution({
    flow,
    taskId,
    onComplete,
    onBlockComplete: (index, result) => {
      toast({
        title: "Block completed",
        description: `Finished ${flow.blocks[index].name || `Block ${index + 1}`}`
      });
    },
    onError: (error, blockIndex) => {
      toast({
        title: "Error in flow",
        description: `Error in block ${blockIndex + 1}: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Auto-start execution when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startExecution();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 mr-1" />;
      case 'think':
        return <Brain className="w-4 h-4 mr-1" />;
      case 'act':
        return <Zap className="w-4 h-4 mr-1" />;
      case 'agent':
        return <User className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const getBlockStatusBadge = (index: number) => {
    if (index < currentBlockIndex) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center"><Check className="w-3 h-3 mr-1" /> Complete</Badge>;
    }
    if (index === currentBlockIndex && isExecuting) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Pending</Badge>;
  };

  const progressPercentage = flow.blocks.length > 0 
    ? Math.round((Math.min(currentBlockIndex, flow.blocks.length) / flow.blocks.length) * 100)
    : 0;

  const getBlockTypeClass = (type: string) => {
    switch (type) {
      case 'collect':
        return 'border-l-4 border-blue-400';
      case 'think':
        return 'border-l-4 border-purple-400';
      case 'act':
        return 'border-l-4 border-green-400';
      case 'agent':
        return 'border-l-4 border-orange-400';
      default:
        return '';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{flow.name}</CardTitle>
            <CardDescription className="mt-1">{flow.description}</CardDescription>
          </div>
          {!isExecuting && !isCompleted && (
            <Button onClick={startExecution}>
              Start Flow
            </Button>
          )}
        </div>
        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{Math.min(currentBlockIndex, flow.blocks.length)} of {flow.blocks.length} blocks completed</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-3">
          {flow.blocks.map((block, index) => (
            <div 
              key={block.id}
              className={`p-3 rounded-md bg-gray-50 ${getBlockTypeClass(block.type)} ${
                index < currentBlockIndex ? 'opacity-75' : 
                index === currentBlockIndex ? 'ring-1 ring-blue-200' : 'opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-medium border border-gray-200 mr-2">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center text-sm font-medium">
                      {getBlockIcon(block.type)}
                      {block.name || `${block.type}: ${block.option}`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {block.option}
                    </div>
                  </div>
                </div>
                {getBlockStatusBadge(index)}
              </div>

              {/* Show results for completed blocks */}
              {blockResults[block.id] && (
                <div className="mt-3 text-xs border-t border-gray-200 pt-2">
                  <div className="font-medium text-muted-foreground mb-1">Results:</div>
                  <div className="max-h-20 overflow-y-auto bg-white p-2 rounded border border-gray-200 text-[10px] font-mono">
                    {JSON.stringify(blockResults[block.id], null, 2)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isCompleted && (
            <div className="flex items-center justify-center p-4 border border-green-200 bg-green-50 rounded-md mt-4">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span className="font-medium text-green-700">Flow completed successfully!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
