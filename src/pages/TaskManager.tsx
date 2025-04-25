
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskBoard from './TaskManager/TaskBoard';
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
      // Remove any stray dialog overlays that might be causing issues
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });
    };

    // Clean up when component mounts and unmounts
    cleanup();
    return cleanup;
  }, [refreshTrigger]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <TaskBoard 
          onCreateTask={() => setIsCreateTaskOpen(true)}
          key={`task-board-${refreshTrigger}`}
          onTaskDeleted={handleTaskOperationComplete}
        />
        <CreateTaskFlow 
          open={isCreateTaskOpen} 
          onOpenChange={setIsCreateTaskOpen} 
        />
      </div>
    </MainLayout>
  );
}
