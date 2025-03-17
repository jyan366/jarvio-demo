import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  LineChart, 
  Download, 
  RefreshCw, 
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Equal,
  ArrowLeft,
  PieChart
} from 'lucide-react';
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
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format, sub, parseISO, eachDayOfInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProductSelector } from '@/components/marketplace/ProductSelector';

const products = [
  { id: 'all', name: 'All Products' },
  { id: 'B08P5P3QCG', name: 'Kimchi 1kg Jar - Raw & Unpasteurised' },
  { id: 'B08P5KYH1P', name: 'Ruby Red Sauerkraut 1kg Jar' },
  { id: 'B09F3Q1XZL', name: 'Organic Kombucha Starter Kit' },
  { id: 'B09H7N9QPB', name: 'Probiotic Yogurt Making Kit' },
  { id: 'B07X5KSBMF', name: 'Premium Fermentation Weights Set of 8' },
];

const timeframes = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

const metrics = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'units', label: 'Units Sold' },
  { value: 'orders', label: 'Orders' },
  { value: 'profit', label: 'Profit' },
  { value: 'fees', label: 'Amazon Fees' },
];

const generateSampleData = (timeframe, product, metric, isComparison = false) => {
  const now = new Date();
  let startDate, endDate;
  
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
  
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  const productFactor = product === 'all' ? 1 : 
    products.findIndex(p => p.id === product) * 0.2 + 0.5;
  
  const metricFactor = metrics.findIndex(m => m.value === metric) * 0.3 + 0.7;
  
  const comparisonFactor = isComparison ? 0.8 : 1;
  
  return dates.map(date => {
    const baseValue = Math.floor(
      (Math.random() * 1000 + 500) * 
      productFactor * 
      metricFactor * 
      comparisonFactor
    );
    
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

const generateMonthlyData = (timeframe, product, metric, isComparison = false) => {
  const now = new Date();
  let months = 12;
  
  if (timeframe === '6months') months = 6;
  if (timeframe === '90days') months = 3;
  if (timeframe === '30days') months = 1;
  
  const productFactor = product === 'all' ? 1 : 
    products.findIndex(p => p.id === product) * 0.2 + 0.5;
  
  const metricFactor = metrics.findIndex(m => m.value === metric) * 0.3 + 0.7;
  
  const comparisonFactor = isComparison ? 0.8 : 1;
  
  return Array.from({ length: months }).map((_, index) => {
    const date = sub(now, { months: months - index - 1 });
    
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

interface DateRangeType {
  from: Date;
  to: Date | undefined;
}

const COLORS = ['#4457ff', '#10b981', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#f43f5e', '#f59e0b'];

export default function AnalyticsStudio() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('overall');
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('revenue');
  const [timeframe, setTimeframe] = useState('30days');
  const [product, setProduct] = useState('all');
  const [comparisonProduct, setComparisonProduct] = useState('');
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeType>({ from: sub(new Date(), { days: 30 }), to: new Date() });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['all']);
  
  const chartData = useMemo(() => {
    if (timeframe === '12months' || timeframe === '6months') {
      return generateMonthlyData(timeframe, product, metric);
    }
    return generateSampleData(timeframe, product, metric);
  }, [timeframe, product, metric]);
  
  const comparisonData = useMemo(() => {
    if (!compareWithPrevious && !comparisonProduct) return null;
    
    if (compareWithPrevious) {
      return timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(timeframe, product, metric, true)
        : generateSampleData(timeframe, product, metric, true);
    }
    
    if (comparisonProduct) {
      return timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(timeframe, comparisonProduct, metric)
        : generateSampleData(timeframe, comparisonProduct, metric);
    }
    
    return null;
  }, [timeframe, product, metric, compareWithPrevious, comparisonProduct]);
  
  const formatMetricValue = (value) => {
    if (metric === 'revenue' || metric === 'profit' || metric === 'fees') {
      return `£${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };
  
  useEffect(() => {
    if (viewType !== 'comparison') {
      setCompareWithPrevious(false);
      setComparisonProduct('');
    }
  }, [viewType]);
  
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
  
  const dateRangeText = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return '';
    return `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`;
  }, [dateRange]);
  
  const getComparisonLabel = () => {
    if (compareWithPrevious) return 'Previous Period';
    if (comparisonProduct) {
      return products.find(p => p.id === comparisonProduct)?.name || 'Comparison Product';
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

  const summaryData = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    
    const currentTotal = chartData.reduce((sum, item) => sum + item[metric], 0);
    
    let previousTotal = 0;
    let percentChange = 0;
    
    if (comparisonData && comparisonData.length > 0) {
      previousTotal = comparisonData.reduce((sum, item) => sum + item[metric], 0);
      percentChange = previousTotal !== 0 
        ? ((currentTotal - previousTotal) / previousTotal) * 100 
        : 0;
    }
    
    return {
      currentTotal,
      previousTotal,
      percentChange
    };
  }, [chartData, comparisonData, metric]);

  const getTrendIcon = (percentChange) => {
    if (percentChange > 5) return <TrendingUp className="text-green-500" />;
    if (percentChange < -5) return <TrendingDown className="text-red-500" />;
    return <Equal className="text-yellow-500" />;
  };

  const combinedChartData = useMemo(() => {
    if (!chartData) return [];
    
    return chartData.map((item, index) => {
      const result = { ...item };
      if (comparisonData && comparisonData[index]) {
        result[`${metric}_comparison`] = comparisonData[index][metric];
      }
      return result;
    });
  }, [chartData, comparisonData, metric]);

  const productComparisonData = useMemo(() => {
    if (selectedProducts.length <= 1) return null;
    
    return selectedProducts.map((productId, index) => {
      const productName = products.find(p => p.id === productId)?.name || productId;
      const baseValue = Math.floor(Math.random() * 100000 + 10000);
      
      return {
        name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
        value: baseValue,
        fullName: productName,
        color: COLORS[index % COLORS.length]
      };
    });
  }, [selectedProducts]);

  const productTimeSeriesData = useMemo(() => {
    if (selectedProducts.length <= 1) return null;
    
    const periods = timeframe === '12months' || timeframe === '6months' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, timeframe === '6months' ? 6 : 12)
      : Array.from({ length: 7 }, (_, i) => `Day ${i+1}`);
    
    return periods.map(period => {
      const result: any = { period };
      
      selectedProducts.forEach((productId) => {
        const productName = products.find(p => p.id === productId)?.name || productId;
        const displayName = productId;
        result[displayName] = Math.floor(Math.random() * 20000 + 5000);
      });
      
      return result;
    });
  }, [selectedProducts, timeframe]);

  const handleProductSelection = (productId: string) => {
    if (productId === 'all') {
      setSelectedProducts(['all']);
    } else {
      setSelectedProducts(prev => {
        if (prev.includes(productId)) {
          const newSelection = prev.filter(id => id !== productId);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          const newSelection = prev.filter(id => id !== 'all').concat(productId);
          return newSelection;
        }
      });
    }
  };

  const renderMainChart = () => {
    if (chartType === 'bar') {
      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={selectedProducts.length > 1 ? totalProductsData : combinedChartData}
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
                formatter={(value) => [formatMetricValue(value as number), metrics.find(m => m.value === metric)?.label]}
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
                name={selectedProducts.length > 1 ? "Combined Total" : metrics.find(m => m.value === metric)?.label}
                radius={[4, 4, 0, 0]}
              />
              {(compareWithPrevious || comparisonProduct) && selectedProducts.length <= 1 && (
                <Bar 
                  dataKey={`${metric}_comparison`}
                  fill={getColor(metric)}
                  fillOpacity={0.6}
                  name={getComparisonLabel()}
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
            data={selectedProducts.length > 1 ? totalProductsData : chartData}
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
              formatter={(value) => [formatMetricValue(value as number), metrics.find(m => m.value === metric)?.label]}
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
              name={selectedProducts.length > 1 ? "Combined Total" : metrics.find(m => m.value === metric)?.label}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {(compareWithPrevious || comparisonProduct) && comparisonData && selectedProducts.length <= 1 && (
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

  const renderProductComparisonCharts = () => {
    if (selectedProducts.length <= 1) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Product Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={productComparisonData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productComparisonData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${formatMetricValue(value as number)}`, `Total ${metrics.find(m => m.value === metric)?.label}`]}
                    contentStyle={{ 
                      background: 'white',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={productTimeSeriesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
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
                    formatter={(value) => [formatMetricValue(value as number), metrics.find(m => m.value === metric)?.label]}
                    contentStyle={{ 
                      background: 'white',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend />
                  {selectedProducts.map((productId, index) => (
                    <Bar 
                      key={productId}
                      dataKey={productId} 
                      name={products.find(p => p.id === productId)?.name || productId}
                      fill={COLORS[index % COLORS.length]} 
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

  const totalProductsData = useMemo(() => {
    if (selectedProducts.length <= 1 || selectedProducts.includes('all')) return chartData;
    
    const productsData = selectedProducts.map(productId => 
      timeframe === '12months' || timeframe === '6months'
        ? generateMonthlyData(timeframe, productId, metric)
        : generateSampleData(timeframe, productId, metric)
    );
    
    if (productsData.length === 0) return chartData;
    
    return productsData[0].map((item, dateIndex) => {
      const result = { ...item };
      result[metric] = productsData.reduce((sum, productData) => 
        sum + (productData[dateIndex]?.[metric] || 0), 0
      );
      return result;
    });
  }, [selectedProducts, timeframe, metric, chartData]);

  const productComparisonTableData = useMemo(() => {
    if (selectedProducts.length <= 1) return null;
    
    return selectedProducts.map(productId => {
      const productName = products.find(p => p.id === productId)?.name || productId;
      const baseValue = Math.floor(Math.random() * 100000 + 10000);
      
      return {
        productId,
        productName,
        value: baseValue,
        percentOfTotal: 0,
        trend: Math.floor(Math.random() * 60) - 30,
      };
    }).map(item => {
      const total = productComparisonData?.reduce((sum, pd) => sum + pd.value, 0) || 1;
      return {
        ...item,
        percentOfTotal: (item.value / total) * 100
      };
    });
  }, [selectedProducts, productComparisonData]);

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
                          to: dateRange.to || dateRange.from,
                        }}
                        onSelect={handleDateRangeSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {viewType === 'comparison' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Products to Compare</label>
                  <ProductSelector 
                    products={products}
                    selectedProducts={selectedProducts}
                    onProductSelect={handleProductSelection}
                  />
                </div>
              )}

              {viewType === 'comparison' && selectedProducts.length <= 1 && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium">Comparison Options</label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="compare-previous"
                        checked={compareWithPrevious}
                        onChange={(e) => {
                          setCompareWithPrevious(e.target.checked);
                          if (e.target.checked) {
                            setComparisonProduct('');
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="compare-previous" className="text-sm">
                        Compare with Previous Period
                      </label>
                    </div>
                  
                    {!compareWithPrevious && (
                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Compare With Product</label>
                        <Select 
                          value={comparisonProduct} 
                          onValueChange={(value) => {
                            setComparisonProduct(value);
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
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-9">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                {viewType === 'overall' 
                  ? 'Overall Performance' 
                  : viewType === 'product' 
                    ? `Product Performance: ${products.find(p => p.id === product)?.name || 'All Products'}`
                    : selectedProducts.length > 1 
                      ? `Comparing ${selectedProducts.length} Products` 
                      : 'Performance Comparison'}
              </CardTitle>
              <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value)}>
                <ToggleGroupItem value="line" aria-label="Line Chart">
                  <LineChart className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="bar" aria-label="Bar Chart">
                  <BarChart className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent>
              {renderMainChart()}
            </CardContent>
          </Card>
        </div>
        
        {renderProductComparisonCharts()}
        
        {selectedProducts.length > 1 && productComparisonTableData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Total {metrics.find(m => m.value === metric)?.label}</TableHead>
                    <TableHead>% of Total</TableHead>
                    <TableHead>30-Day Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productComparisonTableData.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{formatMetricValue(item.value)}</TableCell>
                      <TableCell>{item.percentOfTotal.toFixed(2)}%</TableCell>
                      <TableCell className={
                        item.trend > 0 
                          ? 'text-green-600'
                          : item.trend < 0
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }>
                        <div className="flex items-center">
                          {getTrendIcon(item.trend)}
                          <span className="ml-2">{item.trend > 0 ? '+' : ''}{item.trend.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {summaryData && (compareWithPrevious || comparisonProduct) && selectedProducts.length <= 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Current Period</TableHead>
                    <TableHead>Previous Period</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {metrics.find(m => m.value === metric)?.label}
                    </TableCell>
                    <TableCell>{formatMetricValue(summaryData.currentTotal)}</TableCell>
                    <TableCell>{formatMetricValue(summaryData.previousTotal)}</TableCell>
                    <TableCell className={
                      summaryData.percentChange > 0 
                        ? 'text-green-600'
                        : summaryData.percentChange < 0
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }>
                      {summaryData.percentChange.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getTrendIcon(summaryData.percentChange)}
                        <span className="ml-2">
                          {Math.abs(summaryData.percentChange) > 30
                            ? 'Significant change'
                            : Math.abs(summaryData.percentChange) > 10
                              ? 'Moderate change'
                              : 'Minor change'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
