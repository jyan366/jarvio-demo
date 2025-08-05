import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, PlayCircle, Search, TrendingUp, Clock, Activity, CheckCircle } from 'lucide-react';
import { FlowsGrid, Flow } from './FlowsGrid';

interface FlowsSectionProps {
  flows: Flow[];
  onEditFlow: (flowId: string) => void;
  onRunFlow: (flowId: string) => void;
  onDeleteFlow: (flowId: string) => void;
  onCreateNewFlow: () => void;
  isCreating: boolean;
  isRunningFlow?: boolean;
  runningFlowId?: string;
}

export function FlowsSection({ 
  flows, 
  onEditFlow, 
  onRunFlow, 
  onDeleteFlow,
  onCreateNewFlow,
  isCreating,
  isRunningFlow = false,
  runningFlowId
}: FlowsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Calculate flow statistics
  const stats = useMemo(() => {
    const manualFlows = flows.filter(flow => flow.trigger === 'manual');
    const scheduledFlows = flows.filter(flow => flow.trigger === 'scheduled');
    const activeFlows = flows.length; // All flows are considered active for now
    const totalRuns = flows.length * 15; // Mock total runs
    
    return {
      total: flows.length,
      manual: manualFlows.length,
      scheduled: scheduledFlows.length,
      active: activeFlows,
      totalRuns,
      successRate: 94 // Mock success rate
    };
  }, [flows]);

  // Filter and search flows
  const filteredFlows = useMemo(() => {
    let filtered = flows;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(flow => 
        flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flow.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'manual') {
        filtered = filtered.filter(flow => flow.trigger === 'manual');
      } else if (selectedFilter === 'scheduled') {
        filtered = filtered.filter(flow => flow.trigger === 'scheduled');
      } else if (selectedFilter === 'active') {
        filtered = filtered.filter(flow => true); // All flows are active
      }
    }
    
    return filtered;
  }, [flows, searchTerm, selectedFilter]);

  const handleRunAllFlows = async () => {
    const manualFlows = filteredFlows.filter(flow => flow.trigger === 'manual');
    for (const flow of manualFlows) {
      onRunFlow(flow.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Automation Dashboard</h2>
            <p className="text-muted-foreground">Manage and monitor your automated workflows</p>
          </div>
          <div className="flex gap-3">
            {stats.manual > 0 && (
              <Button 
                onClick={handleRunAllFlows}
                disabled={isCreating}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Run All Manual ({stats.manual})
              </Button>
            )}
            <Button 
              onClick={onCreateNewFlow} 
              variant="default"
              className="gap-2"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4" />
              New Flow
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Flows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.manual}</p>
                  <p className="text-xs text-muted-foreground">Manual</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalRuns}</p>
                  <p className="text-xs text-muted-foreground">Total Runs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="manual">Manual ({stats.manual})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({stats.scheduled})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredFlows.length} {filteredFlows.length === 1 ? 'flow' : 'flows'} found
            </Badge>
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="h-6 px-2"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Flows Grid */}
      <FlowsGrid 
        flows={filteredFlows} 
        onEditFlow={onEditFlow} 
        onRunFlow={onRunFlow} 
        onDeleteFlow={onDeleteFlow}
        onCreateFlow={onCreateNewFlow}
        isRunningFlow={isRunningFlow}
        runningFlowId={runningFlowId}
        searchTerm={searchTerm}
      />
    </div>
  );
}