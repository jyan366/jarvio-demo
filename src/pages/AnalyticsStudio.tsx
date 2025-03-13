
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

// Sample data for visualization
const sampleData = [
  { month: 'Jan', revenue: 5000, units: 120, orders: 110, profit: 1800, fees: 700 },
  { month: 'Feb', revenue: 6200, units: 150, orders: 135, profit: 2200, fees: 850 },
  { month: 'Mar', revenue: 7800, units: 190, orders: 170, profit: 2850, fees: 1050 },
  { month: 'Apr', revenue: 7200, units: 180, orders: 160, profit: 2600, fees: 980 },
  { month: 'May', revenue: 8500, units: 210, orders: 190, profit: 3100, fees: 1150 },
  { month: 'Jun', revenue: 9200, units: 230, orders: 205, profit: 3400, fees: 1250 },
];

const products = [
  { id: 'all', name: 'All Products' },
  { id: 'B08P5P3QCG', name: 'Kimchi 1kg Jar' },
  { id: 'B08P5KYH1P', name: 'Ruby Red Sauerkraut 1kg Jar' },
];

const timeframes = [
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
];

export default function AnalyticsStudio() {
  const [viewType, setViewType] = useState('overall'); // overall, product, comparison
  const [chartType, setChartType] = useState('line'); // line, bar, table
  const [metric, setMetric] = useState('revenue'); // revenue, units, orders, profit, fees
  const [timeframe, setTimeframe] = useState('30days');
  const [product, setProduct] = useState('all');
  const [comparisonProduct, setComparisonProduct] = useState('');
  const [comparisonTimeframe, setComparisonTimeframe] = useState('');
  
  const goBackToSalesHub = () => {
    window.history.back();
  };

  const renderChart = () => {
    if (chartType === 'table') {
      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Amazon Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">£{row.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.units}</TableCell>
                  <TableCell className="text-right">{row.orders}</TableCell>
                  <TableCell className="text-right">£{row.profit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">£{row.fees.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    
    const getColor = (metricName) => {
      const colors = {
        revenue: "#4457ff",
        units: "#10b981",
        orders: "#8b5cf6",
        profit: "#3b82f6",
        fees: "#f97316"
      };
      return colors[metricName] || "#4457ff";
    };
    
    if (chartType === 'bar') {
      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={sampleData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`£${value.toLocaleString()}`, metric.charAt(0).toUpperCase() + metric.slice(1)]}
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Bar 
                dataKey={metric} 
                fill={getColor(metric)} 
                name={metric.charAt(0).toUpperCase() + metric.slice(1)}
                radius={[4, 4, 0, 0]}
              />
              {viewType === 'comparison' && comparisonProduct && (
                <Bar 
                  dataKey={metric} 
                  fill={getColor(metric)}
                  fillOpacity={0.6}
                  name={`Comparison ${metric}`}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={sampleData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`£${value.toLocaleString()}`, metric.charAt(0).toUpperCase() + metric.slice(1)]}
              contentStyle={{ 
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={getColor(metric)} 
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {viewType === 'comparison' && comparisonProduct && (
              <Line 
                type="monotone" 
                dataKey={metric} 
                stroke={getColor(metric)}
                strokeOpacity={0.6}
                name={`Comparison ${metric}`}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goBackToSalesHub}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Studio</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Visualize and compare your sales performance data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">View Type</label>
                <Tabs value={viewType} onValueChange={setViewType} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overall">Overall</TabsTrigger>
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="comparison">Compare</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chart Type</label>
                <div className="flex gap-2">
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'outline'} 
                    size="icon" 
                    onClick={() => setChartType('line')}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'outline'} 
                    size="icon" 
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'table' ? 'default' : 'outline'} 
                    size="icon" 
                    onClick={() => setChartType('table')}
                    className="flex-1"
                  >
                    Table View
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Metric</label>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="units">Units Sold</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="fees">Amazon Fees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(viewType === 'product' || viewType === 'comparison') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {viewType === 'comparison' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compare With</label>
                    <Select value={comparisonProduct} onValueChange={setComparisonProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product to compare" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.filter(p => p.id !== product).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Or Compare Timeframe</label>
                    <Select value={comparisonTimeframe} onValueChange={setComparisonTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe to compare" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.filter(t => t.value !== timeframe).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-9">
            <CardHeader>
              <CardTitle className="text-lg">
                {viewType === 'overall' 
                  ? 'Overall Performance' 
                  : viewType === 'product' 
                    ? `Product Performance: ${products.find(p => p.id === product)?.name || 'All Products'}`
                    : 'Performance Comparison'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
