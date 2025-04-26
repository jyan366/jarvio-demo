import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Play, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { ProcessViewDialog } from './ProcessViewDialog';

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
  const [selectedProcess, setSelectedProcess] = useState<any>(null);

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
  
  const getScheduleText = (schedule: string) => {
    switch(schedule) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return schedule;
    }
  };

  const getScheduleIcon = (schedule: string) => {
    return schedule === 'monthly' ? <Calendar className="w-4 h-4 mr-2 text-amber-500" /> : <Clock className="w-4 h-4 mr-2 text-blue-500" />;
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading processes...</div>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {processes?.map((process) => {
          const processData = process.data as unknown as ProcessData;
          if (!processData || !processData.steps) {
            return null;
          }
          
          return (
            <Card 
              key={process.id} 
              className="p-4 space-y-2 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedProcess(process)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{process.title}</h3>
                <div className="flex items-center text-xs px-2 py-1 bg-muted rounded-full">
                  {getScheduleIcon(processData.schedule)}
                  <span>{getScheduleText(processData.schedule)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {processData.steps.length} steps • {processData.autoRun ? 'Auto runs' : 'Manual run'}
              </p>
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

      {selectedProcess && (
        <ProcessViewDialog
          open={!!selectedProcess}
          onOpenChange={(open) => !open && setSelectedProcess(null)}
          process={selectedProcess}
        />
      )}
    </>
  );
}
