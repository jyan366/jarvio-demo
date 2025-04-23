
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskBoard from './TaskManager/TaskBoard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TaskManager() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate('/task-manager')}
            className="bg-[#4457ff] hover:bg-[#4457ff]/90"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
        <TaskBoard />
      </div>
    </MainLayout>
  );
}
