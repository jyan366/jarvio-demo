
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Jarvi Workflow Platform</h1>
          <p className="text-xl text-muted-foreground">
            Manage tasks, build automated flows, and streamline your processes
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/task-manager')}
              className="min-w-[180px]"
            >
              Task Manager
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/jarvi-flows')}
              variant="outline"
              className="min-w-[180px]"
            >
              Jarvi Flows
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/action-studio')}
              variant="outline"
              className="min-w-[180px]"
            >
              Action Studio
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
