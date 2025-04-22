
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Insight } from '../types';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <Card className="p-3">
      <h4 className="font-medium text-sm">{insight.title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
      <div className="flex justify-end mt-2">
        <Button variant="outline" size="sm">
          <span className="mr-1">Take Action</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};
