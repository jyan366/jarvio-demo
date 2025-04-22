
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Insight } from './types';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InsightActionDialogProps {
  insight: Insight | null;
  isOpen: boolean;
  onClose: () => void;
}

type ActionStep = 'options' | 'creating' | 'complete';

export const InsightActionDialog: React.FC<InsightActionDialogProps> = ({
  insight,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<ActionStep>('options');
  const { toast } = useToast();

  const handleCreateTask = () => {
    setStep('creating');
    
    // Simulate task creation process
    setTimeout(() => {
      setStep('complete');
      
      // After showing completion state, notify user
      toast({
        title: "Task Created",
        description: `A new task for "${insight?.title}" has been added to your Task Manager.`,
      });
      
      // Reset and close dialog after a delay
      setTimeout(() => {
        setStep('options');
        onClose();
      }, 1500);
    }, 1000);
  };

  const categoryColors: Record<string, string> = {
    Sales: 'bg-red-100 text-red-800',
    Inventory: 'bg-blue-100 text-blue-800',
    Listings: 'bg-green-100 text-green-800',
    Customers: 'bg-purple-100 text-purple-800',
    Competitors: 'bg-orange-100 text-orange-800',
    Advertising: 'bg-yellow-100 text-yellow-800',
  };

  if (!insight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Take Action</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Badge className={categoryColors[insight.category] || 'bg-gray-100'}>
              {insight.category}
            </Badge>
            <h3 className="text-lg font-medium mt-2">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
          </div>
          
          {step === 'options' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-700 mb-2">Recommended Actions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-blue-200 text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs">1</div>
                    <span>Create a task to address this insight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-blue-200 text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs">2</div>
                    <span>Assign to team member with relevant expertise</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-blue-200 text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs">3</div>
                    <span>Set deadline based on insight severity</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button onClick={handleCreateTask} className="w-full">
                  Create Task
                </Button>
                <Button variant="outline" className="w-full">
                  View Related Insights
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {step === 'creating' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Creating task...</p>
            </div>
          )}
          
          {step === 'complete' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-100 p-2 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="font-medium">Task created successfully!</p>
              <p className="text-sm text-muted-foreground mt-1">You can view it in the Task Manager</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
