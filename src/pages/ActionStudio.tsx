import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SuggestedTasksSection } from '@/components/action-studio/SuggestedTasksSection';
import { MonitoringFlowsSection } from '@/components/action-studio/MonitoringFlowsSection';
import { AllInsightsSection } from '@/components/action-studio/AllInsightsSection';
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
          <h1 className="text-2xl font-semibold text-foreground">Insights Studio</h1>
          <p className="text-muted-foreground">Monitor your business and get actionable insights</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
          <div className="xl:col-span-2 space-y-8 min-w-0">
            <MonitoringFlowsSection />
            <SuggestedTasksSection />
          </div>
          
          <div className="space-y-8 min-w-0 overflow-hidden">
            <AllInsightsSection />
          </div>
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