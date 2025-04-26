
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ProcessStep {
  id: string;
  content: string;
  completed: boolean;
}

interface ProcessViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: {
    id: string;
    title: string;
    data: {
      name: string;
      steps: ProcessStep[];
      schedule: string;
      autoRun: boolean;
    };
  };
}

export function ProcessViewDialog({ open, onOpenChange, process }: ProcessViewDialogProps) {
  const navigate = useNavigate();
  
  const getScheduleIcon = (schedule: string) => {
    return schedule === 'monthly' ? <Calendar className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  const getScheduleText = (schedule: string) => {
    switch(schedule) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return schedule;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{process.data.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getScheduleIcon(process.data.schedule)}
              {getScheduleText(process.data.schedule)}
            </Badge>
            <Badge variant="outline">
              {process.data.autoRun ? 'Auto runs' : 'Manual run'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Process Steps:</h3>
            {process.data.steps.map((step, index) => (
              <div 
                key={step.id}
                className="flex items-center gap-2 p-3 bg-white border rounded-md"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {index + 1}
                </div>
                <span>{step.content}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => {
                onOpenChange(false);
                navigate(`/task/${process.id}`);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Work on Process
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
