
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskBoard from './TaskManager/TaskBoard';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { useState } from 'react';

export default function TaskManager() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <TaskBoard onCreateTask={() => setIsCreateTaskOpen(true)} />
        <CreateTaskFlow 
          open={isCreateTaskOpen} 
          onOpenChange={setIsCreateTaskOpen} 
        />
      </div>
    </MainLayout>
  );
}
