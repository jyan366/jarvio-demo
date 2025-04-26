
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SuggestedTasksSection } from '@/components/action-studio/SuggestedTasksSection';
import { InsightsFeed } from '@/components/action-studio/InsightsFeed';
import { PlusCircle, Play, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { X, Circle, CheckCircle, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreateTaskFlow } from '@/components/tasks/CreateTaskFlow';
import { ProcessBuilder } from '@/components/ads/ProcessBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedProcesses } from '@/components/action-studio/SavedProcesses';
import { BestSellersRestockProcess } from '@/components/inventory/BestSellersRestockProcess';

export type InsightCategory = 'All' | 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';

export default function ActionStudio() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('All');
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isProcessBuilderOpen, setIsProcessBuilderOpen] = useState(false);
  const [isRestockProcessOpen, setIsRestockProcessOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Action Studio</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Cultured Food Company</span>
              <span className="text-muted-foreground">UK</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsProcessBuilderOpen(true)}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Process
            </Button>
            <Button 
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-[#4457ff] hover:bg-[#4457ff]/90"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        {showHowItWorks && (
          <Card className="p-4 bg-muted/30 border-border shadow-sm relative">
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start space-x-4 pr-8">
              <BookText className="h-8 w-8 text-primary/70 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">How Action Studio Works</h3>
                <div className="space-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <Circle className="h-4 w-4 text-primary/50" />
                    <span>Discover actionable insights across your business</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary/50" />
                    <span>Create tasks directly from insights in one click</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookText className="h-4 w-4 text-primary/50" />
                    <span>Monitor task status from creation to completion</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks & Insights</TabsTrigger>
            <TabsTrigger value="processes">Saved Processes</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <SuggestedTasksSection />

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Insights Feed</h2>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as InsightCategory)}>
                  <SelectTrigger className="w-[140px] sm:w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Listings">Listings</SelectItem>
                      <SelectItem value="Customers">Customers</SelectItem>
                      <SelectItem value="Competitors">Competitors</SelectItem>
                      <SelectItem value="Advertising">Advertising</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <InsightsFeed selectedCategory={selectedCategory} />
            </div>
          </TabsContent>

          <TabsContent value="processes">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Saved Processes</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsRestockProcessOpen(true)}
                >
                  <Package className="w-4 h-4 mr-2 text-amber-500" />
                  Best Sellers Restock
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsProcessBuilderOpen(true)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Process
                </Button>
              </div>
            </div>
            <SavedProcesses onCreateNew={() => setIsProcessBuilderOpen(true)} />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskFlow 
        open={isCreateTaskOpen} 
        onOpenChange={setIsCreateTaskOpen} 
        onSuccess={() => {
          navigate('/task-manager');
        }}
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
