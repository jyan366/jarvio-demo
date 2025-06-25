
import React from 'react';
import { ClusteredInsightsFeed } from './ClusteredInsightsFeed';
import type { InsightCategory } from '@/pages/ActionStudio';
import { generateSampleInsights } from './SampleInsightsData';

interface InsightsFeedProps {
  selectedCategory: InsightCategory;
}

export const InsightsFeed: React.FC<InsightsFeedProps> = ({ selectedCategory }) => {
  const insights = generateSampleInsights();
  
  return (
    <div className="px-4 sm:px-0">
      <ClusteredInsightsFeed 
        selectedCategory={selectedCategory}
        insights={insights}
      />
    </div>
  );
};
