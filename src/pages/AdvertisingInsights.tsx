
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Search, Download } from 'lucide-react';

const performanceData = [
  { month: '2023-01', adSpend: 5000, sales: 15000, acos: 33.33 },
  { month: '2023-02', adSpend: 5500, sales: 18000, acos: 30.56 },
  { month: '2023-03', adSpend: 6000, sales: 22000, acos: 27.27 },
  { month: '2023-04', adSpend: 6500, sales: 25000, acos: 26.00 },
  { month: '2023-05', adSpend: 7000, sales: 28000, acos: 25.00 },
  { month: '2023-06', adSpend: 7500, sales: 32000, acos: 23.44 },
];

const topKeywords = [
  { keyword: 'organic shampoo', impressions: 45000, clicks: 2250, conversions: 180, acos: 18.5 },
  { keyword: 'natural hair care', impressions: 38000, clicks: 1900, conversions: 152, acos: 20.2 },
  { keyword: 'sulfate free', impressions: 32000, clicks: 1600, conversions: 128, acos: 22.8 },
  { keyword: 'vegan shampoo', impressions: 28000, clicks: 1400, conversions: 112, acos: 24.5 },
  { keyword: 'organic conditioner', impressions: 25000, clicks: 1250, conversions: 100, acos: 26.1 },
];

const campaignPerformance = [
  { name: 'Brand Defense', acos: 15.2 },
  { name: 'Product Launch', acos: 33.3 },
  { name: 'Category Target', acos: 25.8 },
  { name: 'Competitor Target', acos: 28.4 },
  { name: 'Long Tail', acos: 22.1 },
];

const recommendations = [
  {
    title: 'Increase bid for "organic shampoo"',
    description: 'This keyword is performing well with a low ACoS. Increasing the bid could drive more sales.',
    impact: 'High',
  },
  {
    title: 'Pause underperforming campaign "Product Launch"',
    description: 'This campaign has a high ACoS of 33.33%. Consider pausing and reallocating budget.',
    impact: 'Medium',
  },
  {
    title: 'Add negative keywords to "Brand Defense" campaign',
    description: 'Identify and add irrelevant search terms to improve campaign efficiency.',
    impact: 'Low',
  },
];

export default function AdvertisingInsights() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Advertising Insights</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Optimize your Amazon advertising performance
            </p>
          </div>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Advertising Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">78/100</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5 points this month
              </span>
            </div>
          </Card>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Ad Spend</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$37,500</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +12% from last month
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ad-Attributed Sales</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$140,000</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +18% from last month
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ACoS</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">26.79%</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4" />
                -2.3% from last month
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Best Performing ASIN</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">B00X12345</span>
              <div className="text-sm text-muted-foreground mt-1">
                18% of ad-attributed sales
              </div>
            </div>
          </Card>
        </div>

        {/* Main Performance Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Advertising Performance Over Time</h2>
          <div className="h-[400px]">
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
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Top Performing Keywords</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Conv.</TableHead>
                  <TableHead className="text-right">ACoS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topKeywords.map((keyword) => (
                  <TableRow key={keyword.keyword}>
                    <TableCell>{keyword.keyword}</TableCell>
                    <TableCell className="text-right">{keyword.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{keyword.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{keyword.conversions}</TableCell>
                    <TableCell className="text-right">{keyword.acos}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Campaign Performance Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Campaign Performance by ACoS</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="acos" fill="#8884d8" name="ACoS %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recommendations Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-2">Ads Assistant Recommendations</h2>
          <p className="text-sm text-muted-foreground mb-6">
            AI-powered suggestions to improve your advertising performance
          </p>
          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.title} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${
                      rec.impact === 'High' ? 'text-red-600' : 
                      rec.impact === 'Medium' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {rec.impact} Impact
                    </span>
                    <Button variant="default">Apply</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Negative Keywords List
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Positive Keywords List
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
