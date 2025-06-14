
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { UnifiedTaskBoard } from '@/components/tasks/UnifiedTaskBoard';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { useToast } from '@/hooks/use-toast';

export default function TaskManager() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Force refresh of the component when needed
  const handleTaskOperationComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Clear any stray dialogs that might be causing issues
  useEffect(() => {
    const cleanup = () => {
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });
    };

    cleanup();
    return cleanup;
  }, [refreshTrigger]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <UnifiedTaskBoard 
          onCreateTask={() => setIsCreateTaskOpen(true)}
          key={`unified-task-board-${refreshTrigger}`}
          onTaskDeleted={handleTaskOperationComplete}
        />
        <CreateTaskFlow 
          open={isCreateTaskOpen} 
          onOpenChange={setIsCreateTaskOpen} 
          onSuccess={handleTaskOperationComplete}
        />
      </div>
    </MainLayout>
  );
}
