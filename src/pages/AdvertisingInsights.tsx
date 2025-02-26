
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Search, Download, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Advertising Insights</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              Optimize your Amazon advertising performance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Card className="p-4 flex-1">
              <div className="text-sm text-muted-foreground">Target ACoS</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">25%</span>
                <Input type="number" className="w-20 h-8" defaultValue="25" />
              </div>
            </Card>
            <Card className="p-4 flex-1">
              <div className="text-sm text-muted-foreground">Performance Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">78/100</span>
                <span className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Ad Spend</span>
            </div>
            <div className="mt-2">
              <span className="text-xl md:text-2xl font-bold">$37,500</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +12% from last month
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
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

          <Card className="p-4 md:p-6">
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

          <Card className="p-4 md:p-6">
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

        {/* Main Performance Chart */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keywords Table */}
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

          {/* Campaign Performance Chart */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold">Campaign Budget Utilization</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="space-y-4">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.name} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">ACoS: {campaign.acos}%</p>
                    </div>
                    {campaign.status === 'warning' && (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (campaign.spent / campaign.budget) > 0.9 
                          ? 'bg-red-500' 
                          : (campaign.spent / campaign.budget) > 0.7 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${campaign.spent.toLocaleString()} spent
                    </span>
                    <span className="text-muted-foreground">
                      ${campaign.budget.toLocaleString()} budget
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommendations Section */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">Optimization Recommendations</h2>
          <p className="text-sm text-muted-foreground mb-6">
            AI-powered suggestions to improve your advertising performance
          </p>
          
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
                  <Button variant="default">Apply</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <Download className="w-4 h-4" />
              Download Negative Keywords
            </Button>
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <Download className="w-4 h-4" />
              Download Search Terms
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
