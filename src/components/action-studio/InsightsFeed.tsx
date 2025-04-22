
import React from 'react';
import { ClusteredInsightsFeed } from './ClusteredInsightsFeed';
import type { InsightCategory } from '@/pages/ActionStudio';
import { generateMockInsights } from './utils/mockInsightsGenerator';

const mockInsights = generateMockInsights();

interface InsightsFeedProps {
  selectedCategory: InsightCategory;
}

export const InsightsFeed: React.FC<InsightsFeedProps> = ({ selectedCategory }) => {
  return (
    <div className="px-4 sm:px-0">
      <ClusteredInsightsFeed 
        selectedCategory={selectedCategory}
        insights={mockInsights}
      />
    </div>
  );
};
