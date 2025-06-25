
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Info, CheckCircle } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  summary: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

interface ViewInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flowId: string;
  flowName: string;
  insights: Insight[];
}

const getSeverityIcon = (severity: Insight['severity']) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-gray-500" />;
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

export function ViewInsightsDialog({ 
  open, 
  onOpenChange, 
  flowId, 
  flowName, 
  insights 
}: ViewInsightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Recent Insights from {flowName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No insights generated yet for this checker.
            </div>
          ) : (
            insights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-blue-400">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {getSeverityIcon(insight.severity)}
                      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(insight.status)}`}>
                        {insight.status}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(insight.severity)}`}>
                        {insight.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{insight.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                    <div className="flex gap-2">
                      {insight.status === 'new' && (
                        <Button variant="outline" size="sm" className="text-xs">
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-xs">
                        Create Task
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
