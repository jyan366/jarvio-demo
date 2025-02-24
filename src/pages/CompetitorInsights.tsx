
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Check, X } from 'lucide-react';

export default function CompetitorInsights() {
  const marketShareData = [
    { name: 'Your Brand', marketShare: 23, revenue: 3.2 },
    { name: 'Competitor A', marketShare: 18, revenue: 2.5 },
    { name: 'Competitor B', marketShare: 15, revenue: 2.1 },
    { name: 'Competitor C', marketShare: 12, revenue: 1.7 },
    { name: 'Others', marketShare: 32, revenue: 4.5 },
  ];

  const revenueData = [
    { month: 'Jan', subcategory: 12.5, yours: 3.2 },
    { month: 'Feb', subcategory: 12.8, yours: 3.3 },
    { month: 'Mar', subcategory: 13.2, yours: 3.1 },
    { month: 'Apr', subcategory: 13.1, yours: 3.2 },
    { month: 'May', subcategory: 12.4, yours: 3.1 },
    { month: 'Jun', subcategory: 13.5, yours: 3.4 },
    { month: 'Jul', subcategory: 11.8, yours: 3.0 },
    { month: 'Aug', subcategory: 12.9, yours: 2.9 },
    { month: 'Sep', subcategory: 12.5, yours: 2.8 },
    { month: 'Oct', subcategory: 12.8, yours: 2.7 },
    { month: 'Nov', subcategory: 12.6, yours: 2.9 },
    { month: 'Dec', subcategory: 12.2, yours: 3.1 },
  ];

  const features = [
    { name: 'Premium Packaging', competitors: 4, hasFeature: true },
    { name: 'Bundle Offers', competitors: 3, hasFeature: false },
    { name: 'Subscribe & Save', competitors: 5, hasFeature: true },
    { name: 'Multiple Variants', competitors: 2, hasFeature: false },
    { name: 'Video Content', competitors: 3, hasFeature: true },
  ];

  const actions = [
    {
      title: 'Implement Bundle Offers',
      description: '3 competitors are seeing 15% higher conversion rates with bundle offers',
      priority: 'High',
    },
    {
      title: 'Add Product Variants',
      description: 'Market leaders have 2x more variants in their product line',
      priority: 'Medium',
    },
    {
      title: 'Optimize Pricing Strategy',
      description: 'Your prices are 12% above category average',
      priority: 'High',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Beauty & Personal Care</h1>
            <p className="text-lg text-muted-foreground mt-1">Subcategory: Hair Care Products</p>
          </div>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Monthly Revenue</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$12.5M</span>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2% growth
              </span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Growth Comparison */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Your Growth vs Market</h2>
            <p className="text-sm text-green-600 mb-6">Growing 2.3x faster than category average</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Your Growth</span>
                  <span className="text-sm text-green-600">+18.5%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Category Growth</span>
                  <span className="text-sm text-muted-foreground">+8.2%</span>
                </div>
                <Progress value={37} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Market Share Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Market Share Distribution</h2>
            <p className="text-sm text-muted-foreground mb-6">Revenue share across top competitors</p>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marketShare" fill="#8884d8" name="Market Share %" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (M$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Revenue Trend */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Subcategory Revenue Trend</h2>
            <p className="text-sm text-muted-foreground mb-6">Monthly revenue performance</p>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="subcategory" stroke="#8884d8" name="Subcategory Revenue" />
                  <Line type="monotone" dataKey="yours" stroke="#82ca9d" name="Your Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Feature Analysis */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Competitor Feature Analysis</h2>
            <p className="text-sm text-muted-foreground mb-6">Features implemented by top competitors</p>
            
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{feature.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.competitors} competitors have this
                    </p>
                  </div>
                  {feature.hasFeature ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommended Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-2">Recommended Actions</h2>
          <p className="text-sm text-muted-foreground mb-6">Based on competitor analysis</p>
          
          <div className="space-y-4">
            {actions.map((action) => (
              <Card key={action.title} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${
                      action.priority === 'High' ? 'text-red-600' : 
                      action.priority === 'Medium' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {action.priority}
                    </span>
                    <Button variant="default">Take Action</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
