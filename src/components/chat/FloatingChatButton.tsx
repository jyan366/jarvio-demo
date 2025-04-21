
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { JarvioAssistant } from '@/components/tasks/JarvioAssistant';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform z-50 bg-[#9b87f5]"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] p-0">
          <JarvioAssistant 
            taskId="customer-insights"
            taskTitle="Customer Insights Analysis"
            taskDescription="Analyze customer insights and feedback data"
            subtasks={[]}
            currentSubtaskIndex={0}
            onSubtaskComplete={async () => {}}
            onSubtaskSelect={() => {}}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
