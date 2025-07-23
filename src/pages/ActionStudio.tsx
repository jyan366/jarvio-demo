import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MonitoringFlowsSection } from '@/components/action-studio/MonitoringFlowsSection';
import { ResponseFlowsSection } from '@/components/action-studio/ResponseFlowsSection';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { ProcessBuilder } from '@/components/ads/ProcessBuilder';
import { BestSellersRestockProcess } from '@/components/inventory/BestSellersRestockProcess';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Action Studio</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Monitor for insights
            </span>
            <ArrowRight className="h-4 w-4" />
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Trigger automated responses
            </span>
          </div>
          <p className="text-muted-foreground">Build workflows that detect changes and take action automatically</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Monitoring Flows */}
          <div className="lg:col-span-3">
            <MonitoringFlowsSection />
          </div>
          
          {/* Right Column - Response Flows */}
          <div className="lg:col-span-2">
            <ResponseFlowsSection />
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