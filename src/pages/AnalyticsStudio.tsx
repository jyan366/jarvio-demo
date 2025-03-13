import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Calendar,
  ChevronDown 
} from 'lucide-react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import { format, sub, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Sample data for products
const products = [
  { id: 'all', name: 'All Products' },
  { id: 'B08P5P3QCG', name: 'Kimchi 1kg Jar - Raw & Unpasteurised' },
  { id: 'B08P5KYH1P', name: 'Ruby Red Sauerkraut 1kg Jar' },
  { id: 'B09F3Q1XZL', name: 'Organic Kombucha Starter Kit' },
  { id: 'B09H7N9QPB', name: 'Probiotic Yogurt Making Kit' },
  { id: 'B07X5KSBMF', name: 'Premium Fermentation Weights Set of 8' },
];

// Timeframe options
const timeframes = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

// Metric options
const metrics = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'units', label: 'Units Sold' },
  { value: 'orders', label: 'Orders' },
  { value: 'profit', label: 'Profit' },
  { value: 'fees', label: 'Amazon Fees' },
];

// Function to generate sample data based on selected parameters
const generateSampleData = (timeframe, product, metric, isComparison = false) => {
  const now = new Date();
  let startDate, endDate;
  
  // Define date range based on timeframe
  switch(timeframe) {
    case '7days':
      startDate = sub(now, { days: 7 });
      endDate = now;
      break;
    case '90days':
      startDate = sub(now, { days: 90 });
      endDate = now;
      break;
    case '6months':
      startDate = sub(now, { months: 6 });
      endDate = now;
      break;
    case '12months':
      startDate = sub(now, { months: 12 });
      endDate = now;
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    default: // 30days is default
      startDate = sub(now, { days: 30 });
      endDate = now;
  }
  
  // Generate daily data for selected date range
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Add some randomness based on product
  const productFactor = product === 'all' ? 1 : 
    products.findIndex(p => p.id === product) * 0.2 + 0.5;
  
  // Add randomness based on metric
  const metricFactor = metrics.findIndex(m => m.value === metric) * 0.3 + 0.7;
  
  // Comparison data will be slightly different
  const comparisonFactor = isComparison ? 0.8 : 1;
  
  // Generate data points
  return dates.map(date => {
    // Base value with some randomness
    const baseValue = Math.floor(
      (Math.random() * 1000 + 500) * 
      productFactor * 
      metricFactor * 
      comparisonFactor
    );
    
    // Add trends and patterns
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
    
    const value = Math.floor(baseValue * weekendFactor);
    
    return {
      date: format(date, 'dd MMM'),
      [metric]: value,
      fullDate: date
    };
  });
};

// Generate monthly aggregate data
const generateMonthlyData = (timeframe, product, metric, isComparison = false) => {
  const now = new Date();
  let months = 12;
  
  if (timeframe === '6months') months = 6;
  if (timeframe === '90days') months = 3;
  if (timeframe === '30days') months = 1;
  
  // Add some randomness based on product
  const productFactor = product === 'all' ? 1 : 
    products.findIndex(p => p.id === product) * 0.2 + 0.5;
  
  // Add randomness based on metric
  const metricFactor = metrics.findIndex(m => m.value === metric) * 0.3 + 0.7;
  
  // Comparison data will be slightly different
  const comparisonFactor = isComparison ? 0.8 : 1;
  
  return Array.from({ length: months }).map((_, index) => {
    const date = sub(now, { months: months - index - 1 });
    
    // Base value with some randomness
    const baseValue = Math.floor(
      (Math.random() * 30000 + 5000) * 
      productFactor * 
      metricFactor * 
      comparisonFactor
    );
    
    const value = baseValue;
    
    return {
      date: format(date, 'MMM yyyy'),
      [metric]: value,
      fullDate: date
    };
  });
};

// Define a type for our date range to match the Calendar component
interface DateRangeType {
  from: Date;
  to: Date | undefined;
}

export default function AnalyticsStudio() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('overall'); // overall, product, comparison
  const [chartType, setChartType] = useState('line'); // line, bar, table
  const [metric, setMetric] = useState('revenue'); // revenue, units, orders, profit, fees
  const [timeframe, setTimeframe] = useState('30days');
  const [product, setProduct] = useState('all');
  const [comparisonProduct, setComparisonProduct] = useState('');
  const [comparisonTimeframe, setComparisonTimeframe] = useState('');
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeType>({ from: sub(new Date(), { days: 30 }), to: new Date() });
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Generate chart data based on selected parameters
  const chartData = useMemo(() => {
    if (timeframe === '12months' || timeframe === '6months') {
      return generateMonthlyData(timeframe, product, metric);
    }
    return generateSampleData(timeframe, product, metric);
  }, [timeframe, product, metric]);
  
  // Generate comparison data
  const comparisonData = useMemo(() => {
    if (!compareWithPrevious && !comparisonProduct && !comparisonTimeframe) return null;
    
    if (compareWithPrevious) {
      // Compare with previous period
      return timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(timeframe, product, metric, true)
        : generateSampleData(timeframe, product, metric, true);
    }
    
    if (comparisonProduct) {
      // Compare with another product
      return timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(timeframe, comparisonProduct, metric)
        : generateSampleData(timeframe, comparisonProduct, metric);
    }
    
    if (comparisonTimeframe) {
      // Compare with another timeframe
      return timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(comparisonTimeframe, product, metric)
        : generateSampleData(comparisonTimeframe, product, metric);
    }
    
    return null;
  }, [timeframe, product, metric, compareWithPrevious, comparisonProduct, comparisonTimeframe]);
  
  // Format metric values appropriately
  const formatMetricValue = (value) => {
    if (metric === 'revenue' || metric === 'profit' || metric === 'fees') {
      return `£${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };
  
  // Clear comparison selections when view type changes
  useEffect(() => {
    if (viewType !== 'comparison') {
      setCompareWithPrevious(false);
      setComparisonProduct('');
      setComparisonTimeframe('');
    }
  }, [viewType]);
  
  // Update dateRange when timeframe changes
  useEffect(() => {
    if (timeframe !== 'custom') {
      const now = new Date();
      let from;
      
      switch(timeframe) {
        case '7days':
          from = sub(now, { days: 7 });
          break;
        case '90days':
          from = sub(now, { days: 90 });
          break;
        case '6months':
          from = sub(now, { months: 6 });
          break;
        case '12months':
          from = sub(now, { months: 12 });
          break;
        case 'ytd':
          from = new Date(now.getFullYear(), 0, 1);
          break;
        default: // 30days is default
          from = sub(now, { days: 30 });
      }
      
      setDateRange({ from, to: now });
    }
  }, [timeframe]);
  
  // Format date range for display
  const dateRangeText = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return '';
    return `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`;
  }, [dateRange]);
  
  const getComparisonLabel = () => {
    if (compareWithPrevious) return 'Previous Period';
    if (comparisonProduct) {
      return products.find(p => p.id === comparisonProduct)?.name || 'Comparison Product';
    }
    if (comparisonTimeframe) {
      return timeframes.find(t => t.value === comparisonTimeframe)?.label || 'Comparison Period';
    }
    return 'Comparison';
  };
  
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
  
  const goBackToSalesHub = () => {
    navigate('/sales-hub');
  };

  const renderChart = () => {
    if (chartType === 'table') {
      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">{metrics.find(m => m.value === metric)?.label}</TableHead>
                {viewType === 'comparison' && (comparisonProduct || comparisonTimeframe || compareWithPrevious) && (
                  <TableHead className="text-right">{getComparisonLabel()}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell className="text-right">{formatMetricValue(row[metric])}</TableCell>
                  {viewType === 'comparison' && comparisonData && (
                    <TableCell className="text-right">
                      {comparisonData[index] ? formatMetricValue(comparisonData[index][metric]) : 'N/A'}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    
    if (chartType === 'bar') {
      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => {
                  if (metric === 'revenue' || metric === 'profit' || metric === 'fees') {
                    return `£${value.toLocaleString(undefined, { 
                      notation: 'compact', 
                      compactDisplay: 'short' 
                    })}`;
                  }
                  return value.toLocaleString(undefined, { 
                    notation: 'compact', 
                    compactDisplay: 'short' 
                  });
                }}
              />
              <Tooltip 
                formatter={(value) => [formatMetricValue(value), metrics.find(m => m.value === metric)?.label]}
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
                name={metrics.find(m => m.value === metric)?.label}
                radius={[4, 4, 0, 0]}
              />
              {viewType === 'comparison' && comparisonData && (
                <RechartsBarChart data={comparisonData}>
                  <Bar 
                    dataKey={metric} 
                    fill={getColor(metric)}
                    fillOpacity={0.6}
                    name={getComparisonLabel()}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
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
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => {
                if (metric === 'revenue' || metric === 'profit' || metric === 'fees') {
                  return `£${value.toLocaleString(undefined, { 
                    notation: 'compact', 
                    compactDisplay: 'short' 
                  })}`;
                }
                return value.toLocaleString(undefined, { 
                  notation: 'compact', 
                  compactDisplay: 'short' 
                });
              }}
            />
            <Tooltip 
              formatter={(value) => [formatMetricValue(value), metrics.find(m => m.value === metric)?.label]}
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
              name={metrics.find(m => m.value === metric)?.label}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {viewType === 'comparison' && comparisonData && (
              <Line 
                type="monotone" 
                dataKey={metric} 
                data={comparisonData}
                stroke={getColor(metric)}
                strokeOpacity={0.7}
                name={getComparisonLabel()}
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

  // Using updated handler that properly handles the DateRange type
  const handleDateRangeSelect = (selectedRange: DateRangeType | undefined) => {
    if (selectedRange?.from) {
      setDateRange({
        from: selectedRange.from,
        to: selectedRange.to || selectedRange.from
      });
      if (selectedRange.to) {
        setShowCalendar(false);
      }
    }
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
                    {metrics.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                
                {timeframe === 'custom' && (
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between text-left font-normal"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {dateRangeText || "Select date range"}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to,
                        }}
                        onSelect={handleDateRangeSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
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
                  <div className="pt-4 border-t">
                    <label className="text-sm font-medium">Comparison Options</label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="compare-previous"
                          checked={compareWithPrevious}
                          onChange={(e) => {
                            setCompareWithPrevious(e.target.checked);
                            if (e.target.checked) {
                              setComparisonProduct('');
                              setComparisonTimeframe('');
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="compare-previous" className="text-sm">
                          Compare with Previous Period
                        </label>
                      </div>
                    
                      {!compareWithPrevious && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Compare With Product</label>
                            <Select 
                              value={comparisonProduct} 
                              onValueChange={(value) => {
                                setComparisonProduct(value);
                                setComparisonTimeframe('');
                              }}
                              disabled={compareWithPrevious}
                            >
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
                            <Select 
                              value={comparisonTimeframe} 
                              onValueChange={(value) => {
                                setComparisonTimeframe(value);
                                setComparisonProduct('');
                              }}
                              disabled={compareWithPrevious || !!comparisonProduct}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe to compare" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeframes.filter(t => t.value !== timeframe && t.value !== 'custom').map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
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

