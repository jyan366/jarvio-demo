
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle } from 'lucide-react';
import { TriggerType } from '@/components/jarvi-flows/FlowsGrid';

interface FlowDetailsSectionProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  trigger: TriggerType;
  setTrigger: (trigger: TriggerType) => void;
}

const insightCheckers = [
  {
    id: 'buybox-monitor',
    name: 'Buy Box Loss Monitor',
    description: 'Tracks Buy Box status changes across all products',
    status: 'active',
    insightsGenerated: 3,
    frequency: 'Every 30 minutes'
  },
  {
    id: 'listing-suppression',
    name: 'Listing Suppression Monitor',
    description: 'Monitors listing health and detects suppressions',
    status: 'active',
    insightsGenerated: 3,
    frequency: 'Every hour'
  },
  {
    id: 'account-health',
    name: 'Account Health Monitor',
    description: 'Tracks account performance metrics',
    status: 'active',
    insightsGenerated: 2,
    frequency: 'Daily'
  },
  {
    id: 'sales-dip',
    name: 'Sales Dip Checker',
    description: 'Analyzes sales patterns and identifies decreases',
    status: 'active',
    insightsGenerated: 3,
    frequency: 'Every 6 hours'
  },
  {
    id: 'policy-breach',
    name: 'Listing Policy Breach Checker',
    description: 'Scans listings for potential policy violations',
    status: 'active',
    insightsGenerated: 3,
    frequency: 'Daily'
  }
];

export function FlowDetailsSection({
  name, 
  setName,
  description,
  setDescription,
  trigger,
  setTrigger
}: FlowDetailsSectionProps) {
  const [showInsightCheckers, setShowInsightCheckers] = useState(false);
  const [selectedInsightChecker, setSelectedInsightChecker] = useState<string | null>(null);

  const handleTriggerChange = (value: string) => {
    if (value === 'insight') {
      setShowInsightCheckers(true);
    } else {
      setTrigger(value as TriggerType);
      setSelectedInsightChecker(null);
    }
  };

  const handleInsightCheckerSelection = (checkerId: string) => {
    const checker = insightCheckers.find(c => c.id === checkerId);
    setSelectedInsightChecker(checkerId);
    setTrigger('event'); // Map to existing TriggerType
    setShowInsightCheckers(false);
    
    if (checker && !name) {
      setName(`Auto-trigger from ${checker.name}`);
    }
  };

  const getTriggerDescription = () => {
    if (selectedInsightChecker) {
      const checker = insightCheckers.find(c => c.id === selectedInsightChecker);
      return `This flow will be automatically triggered when ${checker?.name} generates new insights.`;
    }
    
    switch (trigger) {
      case 'manual':
        return "This flow will need to be manually triggered by a user.";
      case 'scheduled':
        return "This flow will run automatically based on a schedule.";
      case 'webhook':
        return "This flow will be triggered by webhook calls.";
      case 'event':
        return "This flow will be triggered when specific events occur.";
      default:
        return "";
    }
  };

  const getDisplayTriggerValue = () => {
    if (selectedInsightChecker) {
      return 'insight';
    }
    return trigger;
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {name ? 'Edit Flow' : 'Create New Flow'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Flow Name</Label>
              <Input 
                id="name" 
                value={name} 
                placeholder="Enter flow name"
                onChange={(e) => setName(e.target.value)} 
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                placeholder="Describe what this flow does"
                onChange={(e) => setDescription(e.target.value)} 
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="trigger">Trigger Type</Label>
            <Select 
              value={getDisplayTriggerValue()} 
              onValueChange={handleTriggerChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Trigger</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="event">Event-Based</SelectItem>
                <SelectItem value="insight">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium">
                      From Insight
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {selectedInsightChecker && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {insightCheckers.find(c => c.id === selectedInsightChecker)?.name}
                  </span>
                </div>
                <p className="text-xs text-blue-600">
                  Triggered automatically when insights are detected
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              {getTriggerDescription()}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showInsightCheckers} onOpenChange={setShowInsightCheckers}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Select Insight Checker
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose which insight checker should trigger this workflow
            </p>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {insightCheckers.map((checker) => (
              <div 
                key={checker.id} 
                className="p-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all"
                onClick={() => handleInsightCheckerSelection(checker.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium text-blue-900">{checker.name}</div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-sm text-blue-700 mb-2">{checker.description}</div>
                    <div className="flex items-center gap-4 text-xs text-blue-600">
                      <span>{checker.frequency}</span>
                      <span>{checker.insightsGenerated} insights generated</span>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-600 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
