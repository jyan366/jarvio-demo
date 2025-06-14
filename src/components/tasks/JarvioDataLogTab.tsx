
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  description: string;
  done: boolean;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
}

interface SubtaskData {
  result: string;
  completed: boolean;
  completedAt?: string;
}

interface JarvioDataLogTabProps {
  subtasks: Subtask[];
  subtaskData: { [subtaskId: string]: SubtaskData };
  currentSubtaskIndex: number;
}

export function JarvioDataLogTab({ 
  subtasks, 
  subtaskData, 
  currentSubtaskIndex 
}: JarvioDataLogTabProps) {
  const getStatusIcon = (subtask: Subtask, index: number) => {
    if (subtask.done || subtaskData[subtask.id]?.completed) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (index === currentSubtaskIndex) {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (subtask: Subtask, index: number) => {
    if (subtask.done || subtaskData[subtask.id]?.completed) {
      return "text-green-600";
    }
    if (index === currentSubtaskIndex) {
      return "text-blue-600";
    }
    return "text-gray-500";
  };

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Task Progress Data</h3>
        
        {subtasks.map((subtask, index) => (
          <div 
            key={subtask.id} 
            className={`p-4 border rounded-lg ${
              index === currentSubtaskIndex ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(subtask, index)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${getStatusColor(subtask, index)}`}>
                    Step {index + 1}: {subtask.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {subtask.status}
                  </Badge>
                </div>
                
                {subtask.description && (
                  <p className="text-sm text-gray-600 mb-2">{subtask.description}</p>
                )}
                
                {subtaskData[subtask.id]?.result && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Result:</strong> {subtaskData[subtask.id].result}
                  </div>
                )}
                
                {subtaskData[subtask.id]?.completedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Completed: {new Date(subtaskData[subtask.id].completedAt!).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {subtasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No task steps available</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
