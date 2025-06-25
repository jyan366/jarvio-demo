
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

const getSeverityIcon = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
    case 'low':
      return <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    case 'info':
      return <Info className="h-4 w-4 text-gray-500 flex-shrink-0" />;
  }
};

const getSeverityColor = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'info':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: Insight['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'acknowledged':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
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
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <Clock className="h-5 w-5 text-gray-600 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold truncate">Recent Insights</h2>
        <Badge variant="secondary" className="text-xs flex-shrink-0">
          {recentInsights.length} latest
        </Badge>
      </div>

      <div className="grid gap-3 w-full">
        {recentInsights.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              No recent insights available
            </div>
          </Card>
        ) : (
          recentInsights.map((insight) => (
            <Card key={`${insight.flowId}-${insight.id}`} className="border-l-4 border-l-blue-400 w-full">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSeverityIcon(insight.severity)}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{insight.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{insight.flowName}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(insight.status)}`}>
                      {insight.status}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 break-words">
                  {insight.summary}
                </p>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0">{insight.timestamp}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    {insight.status === 'new' && (
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                        Acknowledge
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2">
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
          <Button variant="outline" size="sm">
            View All Insights ({sortedInsights.length})
          </Button>
        </div>
      )}
    </div>
  );
}
