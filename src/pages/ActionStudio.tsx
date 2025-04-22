
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SuggestedTasksSection } from '@/components/action-studio/SuggestedTasksSection';
import { InsightsFeed } from '@/components/action-studio/InsightsFeed';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the insight categories
export type InsightCategory = 'All' | 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';

export default function ActionStudio() {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('All');

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
        </div>

        {/* Suggested Tasks Section */}
        <SuggestedTasksSection />

        {/* Category Tabs */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Insights Feed</h2>
            <Tabs defaultValue="All" className="w-fit" onValueChange={(value) => setSelectedCategory(value as InsightCategory)}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Sales">Sales</TabsTrigger>
                <TabsTrigger value="Inventory">Inventory</TabsTrigger>
                <TabsTrigger value="Listings">Listings</TabsTrigger>
                <TabsTrigger value="Customers">Customers</TabsTrigger>
                <TabsTrigger value="Competitors">Competitors</TabsTrigger>
                <TabsTrigger value="Advertising">Advertising</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Insights Feed */}
          <InsightsFeed selectedCategory={selectedCategory} />
        </div>
      </div>
    </MainLayout>
  );
}
