
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskBoard from './TaskManager/TaskBoard';

export default function TaskManager() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <TaskBoard />
      </div>
    </MainLayout>
  );
}
