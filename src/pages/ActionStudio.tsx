
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SuggestedTasksSection } from '@/components/action-studio/SuggestedTasksSection';
import { InsightsFeed } from '@/components/action-studio/InsightsFeed';
import { MonitoringFlowsSection } from '@/components/action-studio/MonitoringFlowsSection';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { X, Circle, CheckCircle, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { ProcessBuilder } from '@/components/ads/ProcessBuilder';
import { BestSellersRestockProcess } from '@/components/inventory/BestSellersRestockProcess';
import { useToast } from '@/hooks/use-toast';

export type InsightCategory = 'All' | 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';

export default function ActionStudio() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('All');
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isRestockProcessOpen, setIsRestockProcessOpen] = useState(false);
  const [isProcessBuilderOpen, setIsProcessBuilderOpen] = useState(false);
  const { toast } = useToast();

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Insights Studio</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Cultured Food Company</span>
              <span className="text-muted-foreground">UK</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateTaskOpen(true)} className="bg-[#4457ff] hover:bg-[#4457ff]/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        {showHowItWorks}

        <div className="space-y-6">
          <MonitoringFlowsSection />
          
          <SuggestedTasksSection />
        </div>
      </div>

      <CreateTaskFlow open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} onSuccess={() => {
        navigate('/task-manager');
      }} />

      <ProcessBuilder open={isProcessBuilderOpen} onOpenChange={setIsProcessBuilderOpen} />

      <BestSellersRestockProcess open={isRestockProcessOpen} onOpenChange={setIsRestockProcessOpen} />
    </MainLayout>
  );
}
