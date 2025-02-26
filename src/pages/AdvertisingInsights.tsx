import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Search, Download, Filter, AlertCircle, RefreshCw, Plus, Clock, ArrowRight, Clipboard, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const performanceData = [
  { month: '2023-01', adSpend: 5000, sales: 15000, acos: 33.33, impressions: 150000, clicks: 7500 },
  { month: '2023-02', adSpend: 5500, sales: 18000, acos: 30.56, impressions: 165000, clicks: 8250 },
  { month: '2023-03', adSpend: 6000, sales: 22000, acos: 27.27, impressions: 180000, clicks: 9000 },
  { month: '2023-04', adSpend: 6500, sales: 25000, acos: 26.00, impressions: 195000, clicks: 9750 },
  { month: '2023-05', adSpend: 7000, sales: 28000, acos: 25.00, impressions: 210000, clicks: 10500 },
  { month: '2023-06', adSpend: 7500, sales: 32000, acos: 23.44, impressions: 225000, clicks: 11250 },
];

const topKeywords = [
  { keyword: 'organic shampoo', impressions: 45000, clicks: 2250, conversions: 180, acos: 18.5, status: 'improving' },
  { keyword: 'natural hair care', impressions: 38000, clicks: 1900, conversions: 152, acos: 20.2, status: 'stable' },
  { keyword: 'sulfate free', impressions: 32000, clicks: 1600, conversions: 128, acos: 22.8, status: 'declining' },
  { keyword: 'vegan shampoo', impressions: 28000, clicks: 1400, conversions: 112, acos: 24.5, status: 'improving' },
  { keyword: 'organic conditioner', impressions: 25000, clicks: 1250, conversions: 100, acos: 26.1, status: 'stable' },
];

const campaignPerformance = [
  { name: 'Brand Defense', acos: 15.2, budget: 1000, spent: 850, status: 'active' },
  { name: 'Product Launch', acos: 33.3, budget: 2000, spent: 1800, status: 'warning' },
  { name: 'Category Target', acos: 25.8, budget: 1500, spent: 1200, status: 'active' },
  { name: 'Competitor Target', acos: 28.4, budget: 1200, spent: 1100, status: 'warning' },
  { name: 'Long Tail', acos: 22.1, budget: 800, spent: 600, status: 'active' },
];

const recommendations = [
  {
    title: 'Increase bid for "organic shampoo"',
    description: 'This keyword shows strong conversion rate (8%) with low ACoS (18.5%). Consider increasing bid by 15-20%.',
    impact: 'High',
    metrics: { currentAcos: 18.5, targetAcos: 15.2, potentialSales: '+$2,400/mo' }
  },
  {
    title: 'Pause underperforming campaign "Product Launch"',
    description: 'High ACoS (33.3%) exceeds target. Pause campaign and reallocate $1,800 budget to better performing campaigns.',
    impact: 'Medium',
    metrics: { currentAcos: 33.3, targetAcos: 25.0, savingsPerMonth: '$600' }
  },
  {
    title: 'Add negative keywords to "Brand Defense"',
    description: 'Identified 15 irrelevant search terms consuming 12% of campaign budget. Add as negative keywords.',
    impact: 'Low',
    metrics: { wastedSpend: '$102/mo', potentialSavings: '$1,224/yr' }
  },
];

export default function AdvertisingInsights() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleCreateTask = (recommendation: any) => {
    navigate('/tasks/new', {
      state: {
        title: recommendation.title,
        description: recommendation.description,
        category: 'Advertising',
        priority: recommendation.impact.toLowerCase(),
        metrics: recommendation.metrics
      }
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Advertising Insights</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              Optimize your Amazon advertising performance
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate('/automation/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
            <Button variant="outline" onClick={() => navigate('/bulk-operations')}>
              <Clipboard className="w-4 h-4 mr-2" />
              Bulk Operations
            </Button>
            <Button variant="default">
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Optimization
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 h-auto gap-4">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="campaigns" className="py-2">Campaigns</TabsTrigger>
            <TabsTrigger value="keywords" className="py-2">Keywords</TabsTrigger>
            <TabsTrigger value="automation" className="py-2">Automation</TabsTrigger>
            <TabsTrigger value="analytics" className="py-2">Analytics</TabsTrigger>
            <TabsTrigger value="history" className="py-2">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Target ACoS</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">25%</span>
                    <Input type="number" className="w-20 h-8" defaultValue="25" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Portfolio Average: 23.5%
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Ad-Attributed Sales</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold">$140,000</span>
                  <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    +18% from last month
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Current ACoS</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold">26.79%</span>
                  <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4" />
                    -2.3% from last month
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">CTR</span>
                </div>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold">5.2%</span>
                  <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    +0.3% from last month
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Scheduled Tasks</h3>
                    <p className="text-sm text-muted-foreground">3 tasks pending</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </div>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="font-medium">Optimization Alert</h3>
                    <p className="text-sm text-muted-foreground">2 campaigns need attention</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </div>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">Performance Goals</h3>
                    <p className="text-sm text-muted-foreground">On track: 8/10 metrics</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </div>
              </Card>
            </div>

            <Card className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-lg md:text-xl font-bold">Advertising Performance Over Time</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                </div>
              </div>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="adSpend" stroke="#8884d8" name="Ad Spend ($)" />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="acos" stroke="#ffc658" name="ACoS (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Optimization Recommendations</h2>
                  <p className="text-sm text-muted-foreground">
                    AI-powered suggestions based on your campaign performance
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Impact
                </Button>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.title} className="p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <h3 className="font-medium">{rec.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rec.impact === 'High' ? 'bg-red-100 text-red-800' : 
                            rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.impact} Impact
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {Object.entries(rec.metrics).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleCreateTask(rec)}
                        >
                          Create Task
                        </Button>
                        <Button>Apply Now</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Campaign Management</h2>
              <p className="text-muted-foreground">Select a campaign to view detailed metrics and optimizations.</p>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold">Top Performing Keywords</h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Impressions</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Conv.</TableHead>
                      <TableHead className="text-right">ACoS</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topKeywords.map((keyword) => (
                      <TableRow key={keyword.keyword}>
                        <TableCell className="min-w-[150px] font-medium">{keyword.keyword}</TableCell>
                        <TableCell className="text-right">{keyword.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{keyword.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{keyword.conversions}</TableCell>
                        <TableCell className="text-right">{keyword.acos}%</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            keyword.status === 'improving' ? 'bg-green-100 text-green-800' :
                            keyword.status === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {keyword.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4">Automation</h2>
              <p className="text-muted-foreground">Manage and optimize your automated campaigns.</p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4">Analytics</h2>
              <p className="text-muted-foreground">View detailed analytics and insights.</p>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4">History</h2>
              <p className="text-muted-foreground">Review past performance and campaigns.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
