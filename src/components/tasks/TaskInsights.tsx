
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  X, 
  CheckCircle,
  MessageCircle 
} from 'lucide-react';
import { Insight } from '@/hooks/useInsights';

interface TaskInsightsProps {
  insights: Insight[];
  onDismissInsight: (id: string) => void;
  onConvertToSubtask: (insight: Insight) => void;
  onAddComment: (insight: Insight) => void;
}

const getSeverityIcon = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getSeverityColor = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getCategoryColor = (category: Insight['category']) => {
  switch (category) {
    case 'Sales':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Inventory':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Listings':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Customers':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Competitors':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Advertising':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
};

export function TaskInsights({ 
  insights, 
  onDismissInsight, 
  onConvertToSubtask, 
  onAddComment 
}: TaskInsightsProps) {
  const activeInsights = insights.filter(insight => insight.status === 'active');
  
  if (activeInsights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">AI Insights</h3>
      {activeInsights.map((insight) => (
        <Card key={insight.id} className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                {getSeverityIcon(insight.severity)}
                <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismissInsight(insight.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getCategoryColor(insight.category)}`}
              >
                {insight.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${getSeverityColor(insight.severity)}`}
              >
                {insight.severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">{insight.summary}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConvertToSubtask(insight)}
                className="flex items-center gap-1 text-xs"
              >
                <CheckCircle className="h-3 w-3" />
                Create Step
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddComment(insight)}
                className="flex items-center gap-1 text-xs"
              >
                <MessageCircle className="h-3 w-3" />
                Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
