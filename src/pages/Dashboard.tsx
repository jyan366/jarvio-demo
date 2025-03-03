
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight, FileCheck, ArrowRight, TrendingUp, Package, ChevronDown } from 'lucide-react';
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
  Bar
} from 'recharts';

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

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7');
  const [rankTimeframe, setRankTimeframe] = useState('30');
  const userName = "Hazel";
  const timeOfDay = getTimeOfDay();

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }

  const formatCurrency = (value: number) => {
    return `£${value.toFixed(2)}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Good {timeOfDay}, {userName}!
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="p-6 overflow-hidden">
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="text-red-500 h-8 w-8 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/task-manager">View All</Link>
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileCheck className="text-red-500 h-8 w-8 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-3xl font-bold">11</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/task-manager">View All</Link>
                </Button>
              </div>
              
              <div className="mt-auto">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/task-manager">
                    Go to workflow
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            
            <div className="space-y-4">
              {/* Growth Opportunities */}
              <Card className="p-4 border">
                <h3 className="text-lg font-medium mb-2">Growth Opportunities</h3>
                <p className="mb-3">You have 3 new high potential growth opportunities!</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    All Growth Opportunities
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              {/* Inventory Levels */}
              <Card className="p-4 border">
                <h3 className="text-lg font-medium mb-2">Inventory Levels</h3>
                <p className="mb-3">You have 1 product with less than 30 days of stock remaining!</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild className="flex items-center gap-1">
                    <Link to="/inventory">
                      Go to Inventory
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Sales */}
          <Card className="p-6 shadow-md rounded-xl">
            <h3 className="text-lg font-medium text-gray-700">Today's Sales:</h3>
            <p className="text-3xl font-bold mt-2">£572.87</p>
          </Card>
          
          {/* Today's Profit */}
          <Card className="p-6 shadow-md rounded-xl">
            <h3 className="text-lg font-medium text-gray-700">Today's Profit:</h3>
            <p className="text-3xl font-bold mt-2">£117.87</p>
          </Card>
          
          {/* Brand Rank */}
          <Card className="p-6 shadow-md rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Brand Rank:</h3>
              <p className="text-3xl font-bold mt-2">13</p>
            </div>
            <div className="flex items-center justify-center bg-black text-white rounded-full w-8 h-8 font-bold">
              4
            </div>
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
                    formatter={(value, name) => [
                      formatCurrency(Number(value)), 
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]} 
                  />
                  <Legend />
                  <Bar dataKey="profit" fill="#FD8A8A" />
                  <Bar dataKey="sales" fill="#E74C3C" />
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
                    stroke="#E74C3C"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6, fill: '#E74C3C' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
