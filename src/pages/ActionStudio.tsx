
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
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

        {/* Action Path Card */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-blue-800">Action Pathway</h3>
              <p className="text-sm text-blue-700">Insights → Tasks → Resolution</p>
              <p className="text-xs text-blue-600 mt-1">Click "Take Action" on any insight to create a task in your Task Manager</p>
            </div>
            <Link to="/taskmanager" className="text-blue-700 hover:text-blue-800 flex items-center text-sm font-medium">
              View Tasks <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Card>

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
