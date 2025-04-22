
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Insight } from '../types';
import { categoryColors, getSeverityIcon } from '../utils/insightStyles';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getSeverityIcon(insight.severity)}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-sm">{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
          
          <div className="flex items-center justify-between mt-2">
            <Badge className={`${categoryColors[insight.category]} text-xs`}>
              {insight.category}
            </Badge>
            
            <Button variant="outline" size="sm">
              <span className="mr-1">Take Action</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
