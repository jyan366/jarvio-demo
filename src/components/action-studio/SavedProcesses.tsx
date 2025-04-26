
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface ProcessStep {
  id: string;
  content: string;
  completed: boolean;
}

interface ProcessData {
  name: string;
  steps: ProcessStep[];
  schedule: string;
  autoRun: boolean;
}

export function SavedProcesses({ onCreateNew }: { onCreateNew: () => void }) {
  const navigate = useNavigate();

  const { data: processes, isLoading } = useQuery({
    queryKey: ['processes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', 'PROCESS');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleRunProcess = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading processes...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {processes?.map((process) => {
        // Type checking and safe conversion to ProcessData
        const processData = process.data as unknown as ProcessData;
        // Make sure processData has the expected structure before using it
        if (!processData || !processData.steps) {
          console.error('Invalid process data structure:', process);
          return null; // Skip rendering this process
        }
        
        return (
          <Card key={process.id} className="p-4 space-y-2">
            <h3 className="font-semibold">{process.title}</h3>
            <p className="text-sm text-muted-foreground">
              {processData.steps.length} steps • Runs {processData.schedule}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRunProcess(process.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Run Process
              </Button>
            </div>
          </Card>
        );
      })}
      
      <Card className="p-4 space-y-2 cursor-pointer hover:shadow-md transition-shadow border-dashed flex items-center justify-center hover:border-primary/50">
        <Button variant="ghost" onClick={onCreateNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Process
        </Button>
      </Card>
    </div>
  );
}
