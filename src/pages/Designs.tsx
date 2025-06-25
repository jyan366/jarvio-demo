
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, Clock, Play, Check, ArrowRight, Settings, Target, TrendingUp, ShoppingCart, Package, Star, DollarSign } from 'lucide-react';

export default function Designs() {
  const [currentMockup, setCurrentMockup] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleTriggerFlow = (insightId: string) => {
    console.log(`Triggering flow for insight ${insightId}`);
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
              Trigger Flows
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

        {/* Mockup 1: Trigger Flows with Insights (3 iterations) */}
        {currentMockup === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Trigger Flows with Insights</h2>
              <p className="text-muted-foreground">Three different approaches to connecting insights with automated flows</p>
            </div>

            {/* Iteration 1: Inline Flow Triggers */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Iteration 1: Inline Flow Suggestions</h3>
              <div className="grid gap-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {getSeverityIcon(insight.severity)}
                          <div className="flex-1">
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-sm text-muted-foreground">{insight.summary}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                                {insight.severity}
                              </Badge>
                              <Badge variant="outline">{insight.category}</Badge>
                              <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-green-600 border-green-300">
                            <Play className="h-4 w-4 mr-1" />
                            {insight.suggestedFlow}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Iteration 2: Modal Flow Selector */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Iteration 2: Flow Selection Modal</h3>
              <div className="grid gap-4">
                {insights.slice(0, 2).map((insight) => (
                  <Card key={`modal-${insight.id}`} className="border-l-4 border-l-purple-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {getSeverityIcon(insight.severity)}
                          <div className="flex-1">
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-sm text-muted-foreground">{insight.summary}</div>
                            <div className="text-xs text-muted-foreground mt-1">{insight.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Target className="h-4 w-4 mr-1" />
                            Choose Flow
                          </Button>
                          <div className="text-xs text-center text-muted-foreground">3 flows available</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Iteration 3: Bulk Flow Actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Iteration 3: Bulk Flow Triggers</h3>
              <Card className="border-l-4 border-l-green-400">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Critical Issues Detected</CardTitle>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Run All Flows
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {insights.map((insight) => (
                      <div key={`bulk-${insight.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(insight.severity)}
                          <div>
                            <div className="font-medium text-sm">{insight.title}</div>
                            <div className="text-xs text-muted-foreground">→ {insight.suggestedFlow}</div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

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
