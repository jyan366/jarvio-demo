
import React from 'react';
import { Card } from '@/components/ui/card';
import { InsightCard, InsightData } from './InsightCard';
import { useToast } from '@/hooks/use-toast';

const defaultInsights: InsightData[] = [
  {
    id: '1',
    title: '1 Star Review Detected',
    description: 'A new 1-star review was detected for Kimchi 1kg Jar mentioning "product arrived damaged".',
    category: 'REVIEW',
    severity: 'HIGH',
    date: '20 Apr 2025',
  },
  {
    id: '2',
    title: 'Lost Buy Box on Kimchi 500g',
    description: 'You are no longer the Buy Box winner for Kimchi 500g. Current winner is offering 5% lower price.',
    category: 'PRICING',
    severity: 'HIGH',
    date: '19 Apr 2025',
  },
  {
    id: '3',
    title: 'New Listing Opportunity',
    description: 'Based on search trends, "Vegan Kimchi" has high search volume with low competition. Consider creating a listing.',
    category: 'LISTING',
    severity: 'MEDIUM',
    date: '18 Apr 2025',
  },
  {
    id: '4',
    title: 'Competitor Price Drop',
    description: 'A main competitor has reduced prices across their fermented food products by an average of 8%.',
    category: 'COMPETITION',
    severity: 'MEDIUM',
    date: '17 Apr 2025',
  },
];

interface InsightSectionProps {
  onCreateTask: (insight: InsightData) => void;
  hideHeader?: boolean;
  hideActions?: boolean;
  insights?: InsightData[];
}

export function InsightSection({ onCreateTask, hideHeader = false, hideActions = false, insights }: InsightSectionProps) {
  const { toast } = useToast();
  const data = insights || defaultInsights;

  const handleCreateTask = (insight: InsightData) => {
    onCreateTask(insight);
    toast({
      title: "Task Created",
      description: `A task for "${insight.title}" was added to your tasks.`,
    });
  };

  return (
    <Card className="p-0 md:p-0 border-0 shadow-none bg-transparent">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Recent Insights</h2>
            <p className="text-sm text-muted-foreground">
              Actionable insights from your account
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((insight) => (
          <InsightCard
            key={insight.id}
            {...insight}
            onCreateTask={handleCreateTask}
          />
        ))}
      </div>
      {!hideActions && (
        <div className="flex justify-end mt-4">
          {/* Placeholder for any actions if needed in the future */}
        </div>
      )}
    </Card>
  );
}
