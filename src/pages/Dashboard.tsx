
import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  ChevronRight, 
  FileCheck, 
  Package, 
  Calendar, 
  Plus,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Percent,
  AlertCircle,
  BarChart3,
  ArrowRight,
  Check,
  Clock,
  ListChecks
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

// Sample data for charts and metrics
const salesData = [
  {day: '05 Nov', sales: 430, profit: 120},
  {day: '06 Nov', sales: 380, profit: 100},
  {day: '07 Nov', sales: 410, profit: 110},
  {day: '08 Nov', sales: 480, profit: 120},
  {day: '09 Nov', sales: 600, profit: 180},
  {day: '10 Nov', sales: 450, profit: 120},
  {day: '11 Nov', sales: 550, profit: 170},
];

const rankingData = [
  {day: '05 Nov', rank: 23},
  {day: '07 Nov', rank: 18},
  {day: '11 Nov', rank: 21},
  {day: '15 Nov', rank: 17},
  {day: '21 Nov', rank: 14},
  {day: '2 Dec', rank: 13},
];

// Task completion data for the week
const taskCompletionData = [
  { day: 'Mon', completed: 8, total: 10 },
  { day: 'Tue', completed: 6, total: 7 },
  { day: 'Wed', completed: 9, total: 12 },
  { day: 'Thu', completed: 7, total: 8 },
  { day: 'Fri', completed: 4, total: 9 },
  { day: 'Sat', completed: 3, total: 5 },
  { day: 'Sun', completed: 2, total: 3 },
];

// Top insights data
const topInsights = [
  { 
    title: "Competitor Price Drop", 
    description: "Your main competitor dropped prices by 15% on similar products.", 
    impact: "high",
    category: "Pricing"
  },
  { 
    title: "Keyword Opportunity", 
    description: "Adding 'organic' to your product titles could increase visibility by 23%.", 
    impact: "medium",
    category: "SEO"
  },
  { 
    title: "Inventory Alert", 
    description: "Kimchi 1kg Jar will run out in 5 days at current sales velocity.", 
    impact: "high",
    category: "Inventory"
  },
  { 
    title: "Review Sentiment", 
    description: "Positive sentiment increased by 12% this week compared to last week.", 
    impact: "low",
    category: "Reviews"
  },
];

// This is the set of metrics from the Task Manager
const metrics = [
  { label: 'Total Sales', value: '$112,443.74', change: 35.65, inverseColor: false },
  { label: 'Total Cost', value: '$65,589.51', change: -8.71, inverseColor: true },
  { label: 'Total Profit', value: '$46,854.23', change: 68.32, inverseColor: false },
  { label: 'Advertising Cost', value: '$3,612.50', change: -12.5, inverseColor: true },
  { label: 'Inventory Value', value: '$178,213.09', change: 45.3, inverseColor: false },
  { label: 'Profit Margin', value: '41.67%', change: 28.58, inverseColor: false },
  { label: 'Units Sold', value: '4,950', change: 55.44, inverseColor: false },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7');
  const [rankTimeframe, setRankTimeframe] = useState('30');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if scroll is possible in either direction
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
      };
    }
  }, []);

  const formatCurrency = (value: number) => {
    return `£${value.toFixed(2)}`;
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Calculate the overall task completion rate
  const calculateCompletionRate = () => {
    const totalTasks = taskCompletionData.reduce((sum, day) => sum + day.total, 0);
    const completedTasks = taskCompletionData.reduce((sum, day) => sum + day.completed, 0);
    return (completedTasks / totalTasks * 100).toFixed(1);
  };

  // Colors for the pie chart
  const COLORS = ['#8B5CF6', '#E2E8F0'];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Products
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Jan 24, 2025 - Feb 23, 2025
            </Button>
          </div>
        </div>

        {/* Metrics from TaskManager.tsx */}
        <div className="relative -mx-4 md:mx-0">
          <div className="relative overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide pb-4 md:pb-0"
            >
              <div className="flex gap-4 px-4 md:px-0 min-w-max">
                {metrics.map((metric, index) => (
                  <Card 
                    key={index} 
                    className="p-4 border rounded-2xl w-[180px] shrink-0"
                  >
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground font-medium truncate">{metric.label}</p>
                      <p className="text-lg md:text-xl font-bold">{metric.value}</p>
                      {metric.change !== 0 && (
                        <div className={`flex items-center ${
                          metric.inverseColor 
                            ? (metric.change < 0 ? 'text-green-500' : 'text-red-500')
                            : (metric.change < 0 ? 'text-red-500' : 'text-green-500')
                        } text-sm font-medium`}>
                          {metric.change < 0 ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Left scroll button */}
            <div 
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-r-lg shadow-md opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${!canScrollLeft && 'pointer-events-none'}`}
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </div>
            
            {/* Right scroll button */}
            <div 
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-l-lg shadow-md opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${!canScrollRight && 'pointer-events-none'}`}
              onClick={scrollRight}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* New Task Overview + Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gray-50 rounded-lg mx-6 mb-4">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Bell className="text-primary h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Due</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary" asChild>
                    <Link to="/task-manager">View All</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg mx-6 mb-6">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <FileCheck className="text-primary h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Upcoming</p>
                      <p className="text-3xl font-bold">11</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary" asChild>
                    <Link to="/task-manager">View All</Link>
                  </Button>
                </div>
              </div>
              
              <div className="p-3 px-6 pb-6">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/task-manager">
                    Go to workflow
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Completion Rate */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-semibold">Task Completion Rate</CardTitle>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-around gap-4 mb-4">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: parseFloat(calculateCompletionRate()) },
                          { name: 'Remaining', value: 100 - parseFloat(calculateCompletionRate()) }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-bold text-primary">{calculateCompletionRate()}%</h3>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">39</span> completed of <span className="font-medium">54</span> total tasks
                  </p>
                </div>
              </div>
              
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'completed' ? 'Completed Tasks' : 'Total Tasks']} 
                    />
                    <Bar dataKey="completed" name="Completed" fill="#8B5CF6" />
                    <Bar dataKey="total" name="Total" fill="#E2E8F0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Today's Top Insights */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Today's Top Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 max-h-[285px] overflow-auto">
                {topInsights.map((insight, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {insight.impact === 'high' && 
                        <AlertCircle className="text-primary h-5 w-5 mt-0.5 shrink-0" />}
                      {insight.impact === 'medium' && 
                        <BarChart3 className="text-amber-500 h-5 w-5 mt-0.5 shrink-0" />}
                      {insight.impact === 'low' && 
                        <BarChart3 className="text-green-500 h-5 w-5 mt-0.5 shrink-0" />}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{insight.title}</h3>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            {insight.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                    </div>
                    {index < topInsights.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
              <div className="p-6 pt-3">
                <Button variant="ghost" className="w-full justify-between text-primary" asChild>
                  <Link to="/customer-insights">
                    View all insights
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales & Profit Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Sales & Profit</h2>
              <Button variant="outline" className="gap-1">
                Last {timeframe} Days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (typeof name === 'string') {
                        return [
                          formatCurrency(Number(value)), 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ];
                      }
                      return ['', ''];
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="profit" fill="#8B5CF6" />
                  <Bar dataKey="sales" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Brand Ranking Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Brand Ranking</h2>
              <Button variant="outline" className="gap-1">
                Last {rankTimeframe} Days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={rankingData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis reversed domain={[10, 25]} />
                  <Tooltip
                    formatter={(value) => [`Rank: ${value}`, 'Brand Rank']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rank"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Quick Access to Key Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-white">
            <Link to="/inventory" className="flex flex-col items-center text-center">
              <Package className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Inventory Management</h3>
              <p className="text-sm text-muted-foreground mt-2">Track stock levels and manage your inventory</p>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-white">
            <Link to="/sales-hub" className="flex flex-col items-center text-center">
              <Bell className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Sales Center</h3>
              <p className="text-sm text-muted-foreground mt-2">Monitor sales performance across all channels</p>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-white">
            <Link to="/listing-quality" className="flex flex-col items-center text-center">
              <FileCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Listing Hub</h3>
              <p className="text-sm text-muted-foreground mt-2">Optimize product listings and improve visibility</p>
            </Link>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-white">
            <Link to="/ads-manager" className="flex flex-col items-center text-center">
              <Percent className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Advertising</h3>
              <p className="text-sm text-muted-foreground mt-2">Manage campaigns and track ad performance</p>
            </Link>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
