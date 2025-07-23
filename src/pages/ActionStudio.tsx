import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HealthCheckers } from '@/components/action-studio/HealthCheckers';
import { MonitoringFlowsSection } from '@/components/action-studio/MonitoringFlowsSection';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { ProcessBuilder } from '@/components/ads/ProcessBuilder';
import { BestSellersRestockProcess } from '@/components/inventory/BestSellersRestockProcess';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export type InsightCategory = 'All' | 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';

export default function ActionStudio() {
  const navigate = useNavigate();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isRestockProcessOpen, setIsRestockProcessOpen] = useState(false);
  const [isProcessBuilderOpen, setIsProcessBuilderOpen] = useState(false);
  const { toast } = useToast();

  return (
    <MainLayout>
      <div className="space-y-8 max-w-full overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Action Studio</h1>
          <p className="text-muted-foreground">Build automated workflows that monitor your business and take action when changes occur</p>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <HealthCheckers />
        </div>
      </div>

      <CreateTaskFlow 
        open={isCreateTaskOpen} 
        onOpenChange={setIsCreateTaskOpen} 
        onSuccess={() => navigate('/task-manager')} 
      />

      <ProcessBuilder 
        open={isProcessBuilderOpen} 
        onOpenChange={setIsProcessBuilderOpen} 
      />

      <BestSellersRestockProcess 
        open={isRestockProcessOpen} 
        onOpenChange={setIsRestockProcessOpen} 
      />
    </MainLayout>
  );
}