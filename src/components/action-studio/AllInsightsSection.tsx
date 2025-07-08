
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Clock } from 'lucide-react';
import { getFlowInsights } from './MonitoringFlowInsights';

interface Insight {
  id: string;
  title: string;
  summary: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  flowName: string;
  flowId: string;
}

const monitoringFlows = [
  { id: 'buybox-monitor', name: 'Buy Box Loss Monitor' },
  { id: 'listing-suppression', name: 'Listing Suppression Monitor' },
  { id: 'account-health', name: 'Account Health Monitor' },
  { id: 'sales-dip', name: 'Sales Dip Checker' },
  { id: 'policy-breach', name: 'Listing Policy Breach Checker' }
];

const getSeverityIndicator = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-blue-500';
    case 'info':
      return 'bg-gray-400';
  }
};

// Helper function to parse timestamp and sort by recency
const parseTimestamp = (timestamp: string): Date => {
  const now = new Date();
  if (timestamp.includes('hour')) {
    const hours = parseInt(timestamp.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (timestamp.includes('day')) {
    const days = parseInt(timestamp.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  } else if (timestamp.includes('minute')) {
    const minutes = parseInt(timestamp.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - minutes * 60 * 1000);
  }
  return now;
};

export function AllInsightsSection() {
  // Aggregate all insights from all flows
  const allInsights: Insight[] = monitoringFlows.flatMap(flow => {
    const flowInsights = getFlowInsights(flow.id);
    return flowInsights.map(insight => ({
      ...insight,
      flowName: flow.name,
      flowId: flow.id
    }));
  });

  // Sort by recency (most recent first)
  const sortedInsights = allInsights.sort((a, b) => {
    const dateA = parseTimestamp(a.timestamp);
    const dateB = parseTimestamp(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });

  // Show only the most recent 8 insights
  const recentInsights = sortedInsights.slice(0, 8);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Recent Insights</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {recentInsights.length} latest
        </span>
      </div>

      <div className="space-y-3 w-full">
        {recentInsights.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              No recent insights available
            </div>
          </Card>
        ) : (
          recentInsights.map((insight) => (
            <Card key={`${insight.flowId}-${insight.id}`} className="border-l-4 border-l-blue-500 w-full hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityIndicator(insight.severity)} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{insight.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{insight.flowName}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {insight.status === 'new' && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 break-words leading-relaxed">
                  {insight.summary}
                </p>
                
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0">{insight.timestamp}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    {insight.status === 'new' && (
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-muted">
                        Acknowledge
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-muted">
                      Create Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {sortedInsights.length > 8 && (
        <div className="text-center">
          <Button variant="outline" size="sm" className="hover:bg-muted">
            View All Insights ({sortedInsights.length})
          </Button>
        </div>
      )}
    </div>
  );
}
