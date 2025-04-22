
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SuggestedTasksSection } from '@/components/action-studio/SuggestedTasksSection';
import { InsightsFeed } from '@/components/action-studio/InsightsFeed';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

        {/* Category Selection and Insights Feed */}
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

          {/* Insights Feed */}
          <InsightsFeed selectedCategory={selectedCategory} />
        </div>
      </div>
    </MainLayout>
  );
}
