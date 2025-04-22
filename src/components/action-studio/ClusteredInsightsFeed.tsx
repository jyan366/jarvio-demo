
import React from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import type { Insight } from './types';
import type { InsightCategory } from '@/pages/ActionStudio';
import { clusterInsights } from './utils/clusteringUtils';
import { InsightCard } from './components/InsightCard';
import { ClusterHeader } from './components/ClusterHeader';

interface ClusteredInsightsFeedProps {
  selectedCategory: InsightCategory;
  insights: Insight[];
}

export const ClusteredInsightsFeed: React.FC<ClusteredInsightsFeedProps> = ({
  selectedCategory,
  insights
}) => {
  const filteredInsights = selectedCategory === 'All'
    ? insights
    : insights.filter(insight => insight.category === selectedCategory);

  const clusters = clusterInsights(filteredInsights);

  return (
    <div className="space-y-6">
      {clusters.map(cluster => (
        <Card key={cluster.id} className="p-4">
          <Collapsible>
            <ClusterHeader cluster={cluster} />
            
            <CollapsibleContent>
              <div className="mt-4 space-y-3 pl-9">
                {cluster.insights.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
