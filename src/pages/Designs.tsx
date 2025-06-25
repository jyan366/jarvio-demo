import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Info, Clock, Play, Check, ArrowRight, Settings, Target, TrendingUp, ShoppingCart, Package, Star, DollarSign, Sparkles, Calendar, Mouse, CheckCircle } from 'lucide-react';

export default function Designs() {
  const [currentMockup, setCurrentMockup] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showTriggerDialog, setShowTriggerDialog] = useState(false);
  const [selectedTriggerType, setSelectedTriggerType] = useState<string | null>(null);
  const [showInsightCheckers, setShowInsightCheckers] = useState(false);

  // Mock data for the different mockups
  const insights = [
    {
      id: '1',
      title: 'Buy Box Loss Detected',
      summary: 'Competitor won Buy Box on 3 top-selling products in last 2 hours',
      severity: 'high' as const,
      timestamp: '2 hours ago',
      category: 'Competitors',
      suggestedFlow: 'Price Optimization Flow'
    },
    {
      id: '2',
      title: 'Inventory Running Low',
      summary: 'Best-selling Kimchi products below 15% threshold',
      severity: 'medium' as const,
      timestamp: '4 hours ago',
      category: 'Inventory',
      suggestedFlow: 'Restock Automation Flow'
    },
    {
      id: '3',
      title: 'Listing Suppression Alert',
      summary: '2 listings suppressed due to compliance issues',
      severity: 'high' as const,
      timestamp: '1 hour ago',
      category: 'Listings',
      suggestedFlow: 'Compliance Fix Flow'
    }
  ];

  const tasks = [
    { id: '1', title: 'Update product prices to match competitors', status: 'pending' },
    { id: '2', title: 'Reorder inventory for best sellers', status: 'pending' },
    { id: '3', title: 'Fix listing compliance issues', status: 'pending' },
    { id: '4', title: 'Optimize PPC campaigns', status: 'pending' },
    { id: '5', title: 'Respond to customer reviews', status: 'pending' }
  ];

  const triggerOptions = [
    {
      id: 'manual',
      name: 'Manual',
      description: 'Trigger workflow manually when needed',
      icon: Mouse,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      id: 'scheduled',
      name: 'Scheduled',
      description: 'Run workflow on a time-based schedule',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'insight',
      name: 'From Insight',
      description: 'AI automatically triggers when insights are detected',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      isSpecial: true
    }
  ];

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
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handlePlayTasks = () => {
    setShowAnimation(true);
    tasks.forEach((task, index) => {
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, task.id]);
      }, (index + 1) * 800);
    });
  };

  const resetTasks = () => {
    setCompletedTasks([]);
    setShowAnimation(false);
  };

  const handleTriggerSelection = (triggerType: string) => {
    setSelectedTriggerType(triggerType);
    if (triggerType === 'insight') {
      setShowInsightCheckers(true);
    }
    console.log(`Selected trigger type: ${triggerType}`);
  };

  const handleInsightCheckerSelection = (checkerId: string) => {
    console.log(`Selected insight checker: ${checkerId}`);
    setShowInsightCheckers(false);
    setShowTriggerDialog(false);
    // Here you would typically proceed with workflow setup
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Design Mockups</h1>
          <div className="flex gap-2">
            <Button 
              variant={currentMockup === 1 ? "default" : "outline"} 
              onClick={() => setCurrentMockup(1)}
              size="sm"
            >
              Workflow Triggers
            </Button>
            <Button 
              variant={currentMockup === 2 ? "default" : "outline"} 
              onClick={() => setCurrentMockup(2)}
              size="sm"
            >
              Active Flows
            </Button>
            <Button 
              variant={currentMockup === 3 ? "default" : "outline"} 
              onClick={() => setCurrentMockup(3)}
              size="sm"
            >
              Auto Tasks
            </Button>
          </div>
        </div>

        {/* Mockup 1: Select Workflow Trigger */}
        {currentMockup === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Workflow Trigger Selection</h2>
              <p className="text-muted-foreground">Choose how your workflow should be activated</p>
            </div>

            {/* Main Workflow Setup Interface */}
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-gray-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Create New Workflow</CardTitle>
                  <p className="text-muted-foreground">Price Optimization Workflow</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Workflow Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workflow Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="text-sm">Auto Price Adjustment for Buy Box</div>
                    </div>
                  </div>

                  {/* Trigger Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Trigger Method</label>
                    <Button 
                      onClick={() => setShowTriggerDialog(true)}
                      className="w-full h-auto p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 hover:border-indigo-400 text-gray-700 hover:text-gray-900"
                      variant="outline"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Settings className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Select Workflow Trigger</div>
                          <div className="text-xs text-muted-foreground">Choose when this workflow should run</div>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </div>
                    </Button>
                  </div>

                  {/* Selected Trigger Preview */}
                  {selectedTriggerType && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">
                            Trigger Selected: {triggerOptions.find(opt => opt.id === selectedTriggerType)?.name}
                          </div>
                          <div className="text-sm text-green-600">
                            {triggerOptions.find(opt => opt.id === selectedTriggerType)?.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button 
                      className={`flex-1 ${selectedTriggerType ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={!selectedTriggerType}
                    >
                      Continue Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Insights Preview */}
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-blue-800">Available AI Insights</CardTitle>
                  </div>
                  <p className="text-sm text-blue-600">These insights can automatically trigger your workflows</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.slice(0, 2).map((insight) => (
                      <div key={insight.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(insight.severity)}
                          <div>
                            <div className="font-medium text-sm">{insight.title}</div>
                            <div className="text-xs text-muted-foreground">{insight.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">Ready to trigger</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Trigger Selection Dialog */}
        <Dialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Workflow Trigger</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {triggerOptions.map((option) => (
                <div 
                  key={option.id} 
                  className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    option.isSpecial 
                      ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  } ${option.isSpecial ? 'animate-pulse' : ''}`}
                  onClick={() => handleTriggerSelection(option.id)}
                >
                  {option.isSpecial && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      option.isSpecial 
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100' 
                        : 'bg-gray-100'
                    }`}>
                      <option.icon className={`h-5 w-5 ${
                        option.isSpecial ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium flex items-center gap-2 ${
                        option.isSpecial ? 'text-blue-800' : 'text-gray-900'
                      }`}>
                        {option.name}
                        {option.isSpecial && (
                          <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full">
                            ✨ AI Powered
                          </span>
                        )}
                      </div>
                      <div className={`text-sm mt-1 ${
                        option.isSpecial ? 'text-blue-600' : 'text-muted-foreground'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Insight Checkers Selection Dialog */}
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

        {/* Mockup 2: 37 Active Flows */}
        {currentMockup === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Active Background Flows</h2>
              <p className="text-muted-foreground">Showing continuous monitoring and automation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">37</div>
                  <div className="text-sm font-medium text-blue-700">Active Flows</div>
                  <div className="text-xs text-blue-600 mt-1">Running continuously</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">142</div>
                  <div className="text-sm font-medium text-green-700">Insights Generated</div>
                  <div className="text-xs text-green-600 mt-1">Today</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">23</div>
                  <div className="text-sm font-medium text-purple-700">Auto Actions</div>
                  <div className="text-xs text-purple-600 mt-1">Executed</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Flow Status Dashboard</CardTitle>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Flows
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Buy Box Monitor', status: 'active', lastRun: '2 min ago', icon: TrendingUp },
                    { name: 'Inventory Tracker', status: 'active', lastRun: '5 min ago', icon: Package },
                    { name: 'Price Optimization', status: 'active', lastRun: '1 min ago', icon: DollarSign },
                    { name: 'Review Monitor', status: 'active', lastRun: '10 min ago', icon: Star },
                    { name: 'Listing Health Check', status: 'active', lastRun: '3 min ago', icon: ShoppingCart },
                    { name: 'Competitor Analysis', status: 'active', lastRun: '7 min ago', icon: Target },
                  ].map((flow, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <flow.icon className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{flow.name}</div>
                        <div className="text-xs text-muted-foreground">{flow.lastRun}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    View All 37 Flows
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mockup 3: Auto Task Completion */}
        {currentMockup === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Automated Task Completion</h2>
              <p className="text-muted-foreground">Watch tasks automatically move to completion</p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <Button 
                onClick={handlePlayTasks}
                disabled={showAnimation}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Automation
              </Button>
              <Button 
                onClick={resetTasks}
                variant="outline"
              >
                Reset Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.filter(task => !completedTasks.includes(task.id)).map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="text-sm font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">Waiting for automation</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {showAnimation && (
                      <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="text-sm font-medium">Automation running...</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Processing tasks</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedTasks.map((taskId) => {
                      const task = tasks.find(t => t.id === taskId);
                      return task ? (
                        <div key={taskId} className="p-3 border rounded-lg bg-green-50 border-green-200 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <div className="text-sm font-medium">{task.title}</div>
                          </div>
                          <div className="text-xs text-green-600 mt-1">Completed automatically</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-lg font-semibold mb-2">
                  {completedTasks.length === tasks.length ? 
                    "🎉 All tasks completed automatically!" :
                    `${completedTasks.length}/${tasks.length} tasks completed`
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Automation saved you approximately {completedTasks.length * 15} minutes of manual work
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
