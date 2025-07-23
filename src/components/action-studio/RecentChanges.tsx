import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface ChangeItem {
  id: string;
  checker: string;
  previousValue: string;
  currentValue: string;
  changeType: 'improvement' | 'decline' | 'warning' | 'neutral';
  timeAgo: string;
}

const recentChanges: ChangeItem[] = [
  {
    id: '1',
    checker: 'Account health status',
    previousValue: 'At Risk',
    currentValue: 'Healthy',
    changeType: 'improvement',
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    checker: 'Buy Box win rate',
    previousValue: '78%',
    currentValue: '86%',
    changeType: 'improvement',
    timeAgo: '8 days ago'
  },
  {
    id: '3',
    checker: 'Out of stock SKUs',
    previousValue: '2',
    currentValue: '6',
    changeType: 'decline',
    timeAgo: '3 days ago'
  },
  {
    id: '4',
    checker: 'Average profit margin',
    previousValue: '22%',
    currentValue: '24%',
    changeType: 'improvement',
    timeAgo: '5 days ago'
  },
  {
    id: '5',
    checker: 'Customer retention rate',
    previousValue: '74%',
    currentValue: '78%',
    changeType: 'improvement',
    timeAgo: '1 week ago'
  },
  {
    id: '6',
    checker: 'Suppressed listings',
    previousValue: '1',
    currentValue: '3',
    changeType: 'warning',
    timeAgo: '4 days ago'
  },
  {
    id: '7',
    checker: 'Total sales (30 days)',
    previousValue: '$38,200',
    currentValue: '$42,600',
    changeType: 'improvement',
    timeAgo: '6 days ago'
  }
];

const getChangeIcon = (changeType: string) => {
  switch (changeType) {
    case 'improvement':
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    case 'decline':
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    case 'warning':
      return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
    default:
      return <CheckCircle className="h-3 w-3 text-blue-600" />;
  }
};

const getChangeColor = (changeType: string) => {
  switch (changeType) {
    case 'improvement':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'decline':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

export function RecentChanges() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-foreground">Recent Changes</h3>
        <Badge variant="outline" className="text-xs">
          Last 7 days
        </Badge>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex gap-4 pb-2 min-w-max">
          {recentChanges.map((change) => (
            <Card key={change.id} className="flex-none w-80 p-4 hover:shadow-sm transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {change.checker}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {change.timeAgo}
                    </div>
                  </div>
                  {getChangeIcon(change.changeType)}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1.5 bg-muted/50 rounded border">
                    {change.previousValue}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm px-3 py-1.5 rounded border font-medium ${getChangeColor(change.changeType)}`}>
                    {change.currentValue}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}