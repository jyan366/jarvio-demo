
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusIcon, 
  TrendingUp, 
  Users, 
  Star, 
  MessageSquare, 
  ShoppingBag 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function CustomerInsights() {
  const navigate = useNavigate();

  // Sample customer sentiment data
  const sentimentData = [
    { id: 1, productName: "Organic Kimchi", asin: "B08P5PVDS3", positive: 85, negative: 15, neutral: 0 },
    { id: 2, productName: "Probiotic Kefir", asin: "B082J56YCV", positive: 78, negative: 8, neutral: 14 },
    { id: 3, productName: "Fermented Vegetables", asin: "B0CJYLQQS8", positive: 62, negative: 23, neutral: 15 },
    { id: 4, productName: "Kombucha Starter Kit", asin: "B0CK4XV6QV", positive: 91, negative: 4, neutral: 5 },
    { id: 5, productName: "Sauerkraut", asin: "B0CVL54ZDV", positive: 73, negative: 17, neutral: 10 },
  ];

  // Sample stats data
  const statsData = [
    {
      title: "Customer Satisfaction",
      value: "87%",
      description: "Overall satisfaction rating",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      trend: "+5.2%",
      trendPositive: true
    },
    {
      title: "Review Response Rate",
      value: "92%",
      description: "Seller response to customer reviews",
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      trend: "+7.8%",
      trendPositive: true
    },
    {
      title: "Repeat Customers",
      value: "63%",
      description: "Customers who made multiple purchases",
      icon: <ShoppingBag className="h-4 w-4 text-green-500" />,
      trend: "+2.4%",
      trendPositive: true
    },
    {
      title: "Customer Growth",
      value: "1,284",
      description: "New customers this month",
      icon: <Users className="h-4 w-4 text-purple-500" />,
      trend: "+12.3%",
      trendPositive: true
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Customer Insights</h1>
            <p className="text-muted-foreground mt-1">Analyze and understand your customer behavior</p>
          </div>
          <Button 
            onClick={() => navigate('/task-manager/new')}
            className="bg-[#4457ff] hover:bg-[#4457ff]/90"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="rounded-full p-1 bg-muted">
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-xs font-medium flex items-center gap-1 ${
                    stat.trendPositive ? "text-green-500" : "text-red-500"
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </div>
                <CardDescription className="mt-1 text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Sentiment Analysis</CardTitle>
            <CardDescription>
              Analyze customer sentiment across your product range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>ASIN</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentimentData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.asin}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Positive</span>
                          <span>{item.positive}%</span>
                        </div>
                        <Progress value={item.positive} className="bg-muted h-2" />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>Negative</span>
                          <span>{item.negative}%</span>
                        </div>
                        <Progress value={item.negative} className="bg-muted h-2" />

                        <div className="flex items-center justify-between text-xs">
                          <span>Neutral</span>
                          <span>{item.neutral}%</span>
                        </div>
                        <Progress value={item.neutral} className="bg-muted h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/product-reviews/${item.asin}`)}
                      >
                        View Reviews
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>
              Understand your customer base demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-4">
                <h4 className="text-sm font-semibold">Age Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">18-24</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">25-34</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">35-44</span>
                    <span className="text-sm font-medium">29%</span>
                  </div>
                  <Progress value={29} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">45-54</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">55+</span>
                    <span className="text-sm font-medium">6%</span>
                  </div>
                  <Progress value={6} className="h-2" />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <h4 className="text-sm font-semibold">Purchase Frequency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">One-time</span>
                    <span className="text-sm font-medium">37%</span>
                  </div>
                  <Progress value={37} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekly</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily</span>
                    <span className="text-sm font-medium">3%</span>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
