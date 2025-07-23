import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, ArrowRight, Play, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResponseFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  lastTriggered?: string;
  executionCount: number;
}

const responseFlows: ResponseFlow[] = [
  {
    id: 'buybox-alert',
    name: 'Buy Box Loss Alert',
    description: 'Send Slack notification when Buy Box is lost',
    trigger: 'Buy Box Loss Monitor',
    status: 'active',
    lastTriggered: '2 hours ago',
    executionCount: 12
  },
  {
    id: 'listing-fix',
    name: 'Auto Listing Fix',
    description: 'Create task to fix listing suppressions',
    trigger: 'Listing Suppression Monitor',
    status: 'active',
    lastTriggered: '1 hour ago',
    executionCount: 5
  },
  {
    id: 'sales-analysis',
    name: 'Sales Analysis Report',
    description: 'Generate detailed analysis when sales dip',
    trigger: 'Sales Dip Checker',
    status: 'draft',
    executionCount: 0
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function ResponseFlowsSection() {
  const navigate = useNavigate();
  const [selectedFlow, setSelectedFlow] = useState<ResponseFlow | null>(null);

  const handleCreateFlow = () => {
    navigate('/jarvi-flows/builder');
  };

  const handleEditFlow = (flowId: string) => {
    navigate(`/jarvi-flows/builder/${flowId}`);
  };

  const handleTestFlow = (flowId: string) => {
    console.log(`Testing response flow ${flowId}`);
    // TODO: Implement test functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Response Flows</h2>
          <p className="text-sm text-muted-foreground">Automated actions triggered by insights</p>
        </div>
        <Button onClick={handleCreateFlow} className="gap-2">
          <Plus className="h-4 w-4" />
          New Response
        </Button>
      </div>

      {/* If This Then That Visual */}
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">IF insight detected</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium">THEN execute response</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {responseFlows.map((flow) => (
          <Card key={flow.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{flow.name}</h3>
                    <Badge variant="outline" className={getStatusColor(flow.status)}>
                      {flow.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{flow.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Triggered by:</span>
                    <Badge variant="secondary" className="text-xs">
                      {flow.trigger}
                    </Badge>
                  </div>
                  {flow.lastTriggered && (
                    <p className="text-xs text-muted-foreground">
                      Last triggered: {flow.lastTriggered} • {flow.executionCount} executions
                    </p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestFlow(flow.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFlow(flow.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {responseFlows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No response flows configured yet</p>
          <Button onClick={handleCreateFlow} variant="outline">
            Create your first response flow
          </Button>
        </div>
      )}
    </div>
  );
}