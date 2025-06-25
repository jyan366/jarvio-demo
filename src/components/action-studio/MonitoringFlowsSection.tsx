
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, TrendingDown, FileX, Activity, Clock, CheckCircle, Settings } from 'lucide-react';

interface MonitoringFlow {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  insightsGenerated: number;
  frequency: string;
}

const monitoringFlows: MonitoringFlow[] = [{
  id: 'buybox-monitor',
  name: 'Buy Box Loss Monitor',
  description: 'Tracks Buy Box status changes across all products and alerts when competitors win',
  icon: <TrendingDown className="h-5 w-5" />,
  status: 'active',
  lastRun: '2 hours ago',
  insightsGenerated: 3,
  frequency: 'Every 30 minutes'
}, {
  id: 'listing-suppression',
  name: 'Listing Suppression Monitor',
  description: 'Monitors listing health and detects suppressions or compliance issues',
  icon: <FileX className="h-5 w-5" />,
  status: 'active',
  lastRun: '1 hour ago',
  insightsGenerated: 3,
  frequency: 'Every hour'
}, {
  id: 'account-health',
  name: 'Account Health Monitor',
  description: 'Tracks account performance metrics and identifies health score changes',
  icon: <Activity className="h-5 w-5" />,
  status: 'active',
  lastRun: '8 hours ago',
  insightsGenerated: 2,
  frequency: 'Daily'
}, {
  id: 'sales-dip',
  name: 'Sales Dip Checker',
  description: 'Analyzes sales patterns and identifies unusual decreases or trend changes',
  icon: <AlertTriangle className="h-5 w-5" />,
  status: 'active',
  lastRun: '5 hours ago',
  insightsGenerated: 3,
  frequency: 'Every 6 hours'
}, {
  id: 'policy-breach',
  name: 'Listing Policy Breach Checker',
  description: 'Scans listings for potential policy violations and compliance issues',
  icon: <Shield className="h-5 w-5" />,
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4" />;
    case 'paused':
      return <Clock className="h-4 w-4" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function MonitoringFlowsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">My Insight Checkers</h2>
          <p className="text-sm text-muted-foreground">
            AI workflows continuously monitoring your business for insights
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage Flows
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md">
                {flow.icon}
              </div>
              <span className="font-medium text-sm">{flow.name}</span>
            </div>
            <Badge className={`${getStatusColor(flow.status)} flex items-center gap-1`}>
              {getStatusIcon(flow.status)}
              {flow.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
