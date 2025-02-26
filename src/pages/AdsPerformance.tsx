
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Search, Download, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const performanceData = [
  { date: '2024-01', spend: 5000, sales: 15000, acos: 33.33 },
  { date: '2024-02', spend: 5500, sales: 18000, acos: 30.56 },
  { date: '2024-03', spend: 6000, sales: 22000, acos: 27.27 }
];

const campaignMetrics = [
  { name: 'Auto Campaign', spend: 2500, sales: 8500, acos: 29.41, roas: 3.4 },
  { name: 'Brand Defense', spend: 1500, sales: 6000, acos: 25.00, roas: 4.0 },
  { name: 'Category Targeting', spend: 2000, sales: 7500, acos: 26.67, roas: 3.75 }
];

export default function AdsPerformance() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Ads Performance</h1>
            <p className="text-muted-foreground mt-1">Track and analyze your advertising metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Ad Spend</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$16,500</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +20% vs. last period
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ad Sales</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$55,000</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +25% vs. last period
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ACoS</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">27.27%</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4" />
                -3% vs. last period
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ROAS</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">3.67x</span>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +0.5 vs. last period
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Performance Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#8884d8" name="Ad Spend ($)" />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales ($)" />
                <Line yAxisId="right" type="monotone" dataKey="acos" stroke="#ffc658" name="ACoS (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Campaign Performance</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">ACoS</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignMetrics.map((campaign) => (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.sales.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.acos}%</TableCell>
                    <TableCell className="text-right">{campaign.roas}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
