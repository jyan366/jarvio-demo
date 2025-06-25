
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Eye, Settings } from 'lucide-react';
import { ViewInsightsDialog } from './ViewInsightsDialog';
import { getFlowInsights } from './MonitoringFlowInsights';
import { useNavigate } from 'react-router-dom';

interface MonitoringFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  insightsGenerated: number;
  frequency: string;
}

const monitoringFlows: MonitoringFlow[] = [{
  id: 'buybox-monitor',
  name: 'Buy Box Loss Monitor',
  description: 'Tracks Buy Box status changes across all products and alerts when competitors win',
  status: 'active',
  lastRun: '2 hours ago',
  insightsGenerated: 3,
  frequency: 'Every 30 minutes'
}, {
  id: 'listing-suppression',
  name: 'Listing Suppression Monitor',
  description: 'Monitors listing health and detects suppressions or compliance issues',
  status: 'active',
  lastRun: '1 hour ago',
  insightsGenerated: 3,
  frequency: 'Every hour'
}, {
  id: 'account-health',
  name: 'Account Health Monitor',
  description: 'Tracks account performance metrics and identifies health score changes',
  status: 'active',
  lastRun: '8 hours ago',
  insightsGenerated: 2,
  frequency: 'Daily'
}, {
  id: 'sales-dip',
  name: 'Sales Dip Checker',
  description: 'Analyzes sales patterns and identifies unusual decreases or trend changes',
  status: 'active',
  lastRun: '5 hours ago',
  insightsGenerated: 3,
  frequency: 'Every 6 hours'
}, {
  id: 'policy-breach',
  name: 'Listing Policy Breach Checker',
  description: 'Scans listings for potential policy violations and compliance issues',
  status: 'active',
  lastRun: '3 hours ago',
  insightsGenerated: 3,
  frequency: 'Daily'
}];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function MonitoringFlowsSection() {
  const navigate = useNavigate();
  const [viewInsightsOpen, setViewInsightsOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<MonitoringFlow | null>(null);

  const handleToggleFlow = (flowId: string, isEnabled: boolean) => {
    console.log(`Toggling flow ${flowId} to ${isEnabled ? 'active' : 'paused'}`);
    // TODO: Implement actual toggle functionality
  };

  const handleEditFlow = (flowId: string) => {
    console.log(`Editing flow ${flowId}`);
    // Navigate to the flow builder with the specific flow ID
    navigate(`/jarvi-flows/builder/${flowId}`);
  };

  const handleViewInsights = (flow: MonitoringFlow) => {
    console.log(`Viewing insights for flow ${flow.id}`);
    setSelectedFlow(flow);
    setViewInsightsOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">My Insight Checkers</h2>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            My Insight Engine
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          {monitoringFlows.map((flow, index) => (
            <div
              key={flow.id}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== monitoringFlows.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={flow.status === 'active'}
                  onCheckedChange={(checked) => handleToggleFlow(flow.id, checked)}
                />
                <div>
                  <span className="font-medium text-sm">{flow.name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewInsights(flow)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditFlow(flow.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ViewInsightsDialog
        open={viewInsightsOpen}
        onOpenChange={setViewInsightsOpen}
        flowId={selectedFlow?.id || ''}
        flowName={selectedFlow?.name || ''}
        insights={selectedFlow ? getFlowInsights(selectedFlow.id) : []}
      />
    </>
  );
}
