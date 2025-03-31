
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Search, Download, Filter, Calendar, ChartLine, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const performanceData = [
  { date: 'Jan', spend: 5000, sales: 15000, acos: 33.33 },
  { date: 'Feb', spend: 5500, sales: 18000, acos: 30.56 },
  { date: 'Mar', spend: 6000, sales: 22000, acos: 27.27 },
  { date: 'Apr', spend: 5800, sales: 21000, acos: 27.62 },
  { date: 'May', spend: 6200, sales: 23500, acos: 26.38 },
  { date: 'Jun', spend: 6500, sales: 25000, acos: 26.00 }
];

const campaignMetrics = [
  { name: 'Auto Campaign', spend: 2500, sales: 8500, acos: 29.41, roas: 3.4, clicks: 4200, impressions: 125000, ctr: 3.36 },
  { name: 'Brand Defense', spend: 1500, sales: 6000, acos: 25.00, roas: 4.0, clicks: 2100, impressions: 72000, ctr: 2.92 },
  { name: 'Category Targeting', spend: 2000, sales: 7500, acos: 26.67, roas: 3.75, clicks: 3500, impressions: 98000, ctr: 3.57 },
  { name: 'Competitor Keywords', spend: 1800, sales: 6200, acos: 29.03, roas: 3.44, clicks: 3100, impressions: 86000, ctr: 3.60 }
];

const timeRanges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Year to Date", value: "ytd" },
  { label: "Custom", value: "custom" },
];

export default function AdsPerformance() {
  const [timeRange, setTimeRange] = useState("30d");

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value}%`;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Advertising Performance</h1>
            <p className="text-muted-foreground mt-1">Monitor and optimize your Amazon PPC campaigns</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Ad Spend"
            value="$16,500"
            trend="+20%"
            trendUp={true}
            icon={<DollarSign />}
            description="Total advertising investment"
          />
          
          <MetricsCard
            title="Ad Sales"
            value="$55,000"
            trend="+25%"
            trendUp={true}
            icon={<BarChart3 />}
            description="Revenue from ad campaigns"
          />
          
          <MetricsCard
            title="ACoS"
            value="27.27%"
            trend="-3%"
            trendUp={false}
            icon={<Target />}
            description="Advertising cost of sales"
            good={false}
          />
          
          <MetricsCard
            title="ROAS"
            value="3.67x"
            trend="+0.5"
            trendUp={true}
            icon={<ChartLine />}
            description="Return on ad spend"
          />
        </div>
        
        {/* Performance Trends */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Performance Trends</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-8">
                  <Info className="h-4 w-4 mr-1" />
                  About This Chart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="line" className="mt-2">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Metrics
                  </Button>
                </div>
              </div>
              
              <TabsContent value="line" className="mt-0">
                <div className="h-[350px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis 
                        yAxisId="left" 
                        tickFormatter={formatCurrency} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tickFormatter={formatPercent}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "acos") return [`${value}%`, "ACoS"];
                          return [`$${Number(value).toLocaleString()}`, name === "spend" ? "Ad Spend" : "Ad Sales"];
                        }}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="spend" 
                        stroke="#8884d8" 
                        name="Ad Spend" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#4ade80" 
                        name="Ad Sales" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="acos" 
                        stroke="#ff7f50" 
                        name="ACoS" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="bar" className="mt-0">
                <div className="h-[350px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar dataKey="spend" name="Ad Spend" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sales" name="Ad Sales" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Campaign Performance</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-3.5 h-3.5 mr-1" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Campaign</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">ACoS</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Impr.</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignMetrics.map((campaign) => (
                    <TableRow key={campaign.name} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${campaign.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={campaign.acos < 28 ? "text-green-600" : "text-orange-500"}>
                          {campaign.acos}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={campaign.roas >= 3.5 ? "text-green-600" : "text-orange-500"}>
                          {campaign.roas}x
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.impressions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.ctr}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendationCard 
                title="Lower bids on low-performing keywords"
                description="5 keywords in your Auto Campaign have high spend but low conversion rates"
                impact="Estimated savings: $320/month"
                actionLabel="View Keywords"
              />
              
              <RecommendationCard 
                title="Increase budget for top performers"
                description="Brand Defense campaign is hitting its daily budget limit with excellent ROAS"
                impact="Potential revenue increase: $1,200/month"
                actionLabel="Adjust Budget"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

interface MetricsCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  description: string;
  good?: boolean;
}

function MetricsCard({ title, value, trend, trendUp, icon, description, good = true }: MetricsCardProps) {
  // Default to trend direction determining if it's good, but allow override
  const isPositive = good ? trendUp : !trendUp;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold">{value}</span>
          <div className={`text-sm flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-orange-500'}`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend} vs. last period
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
}

function RecommendationCard({ title, description, impact, actionLabel }: RecommendationCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-base">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center text-sm text-green-600 font-medium">
        <TrendingUp className="w-3.5 h-3.5 mr-1" />
        {impact}
      </div>
      <div>
        <Button size="sm" className="mt-2">{actionLabel}</Button>
      </div>
    </div>
  );
}
