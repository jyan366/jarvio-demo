import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RecentChanges } from './RecentChanges';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Trophy, 
  Package, 
  AlertTriangle,
  Calendar,
  Star,
  Users,
  Target,
  Search,
  Image,
  Type,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Settings,
  Filter,
  Plus
} from 'lucide-react';

interface HealthCheck {
  id: string;
  question: string;
  answer: string;
  status: 'healthy' | 'warning' | 'critical' | 'info';
  icon: React.ComponentType<any>;
  category: 'account' | 'sales' | 'inventory' | 'listings' | 'customers' | 'competitors';
  checkerActive: boolean;
  frequency: string;
  checkerWorkflowActive: boolean; // All checkers should have this as true
  hasReactWorkflow?: boolean;
  reactWorkflowActive?: boolean;
  previousValue?: string;
  lastUpdated?: string;
}

const healthChecks: HealthCheck[] = [
  // Account Health
  {
    id: 'account-health',
    question: 'My account health status is:',
    answer: 'Healthy',
    status: 'healthy',
    icon: ShieldCheck,
    category: 'account',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: 'At Risk',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'total-sales',
    question: 'My total sales in the last 30 days were:',
    answer: '$42,600',
    status: 'healthy',
    icon: DollarSign,
    category: 'sales',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: '$38,200',
    lastUpdated: '6 days ago'
  },
  {
    id: 'profit-margin',
    question: 'My average profit margin across all SKUs is:',
    answer: '24%',
    status: 'healthy',
    icon: TrendingUp,
    category: 'sales',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '22%',
    lastUpdated: '5 days ago'
  },
  {
    id: 'buybox-rate',
    question: 'My Buy Box win rate across the catalogue is:',
    answer: '86%',
    status: 'healthy',
    icon: Trophy,
    category: 'sales',
    checkerActive: true,
    frequency: 'Hourly',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: '78%',
    lastUpdated: '8 days ago'
  },
  {
    id: 'active-skus',
    question: 'The number of active SKUs in my catalogue is:',
    answer: '54',
    status: 'info',
    icon: Package,
    category: 'inventory',
    checkerActive: false,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '52',
    lastUpdated: '3 days ago'
  },
  {
    id: 'suppressed-listings',
    question: 'The number of suppressed or inactive listings is:',
    answer: '3',
    status: 'warning',
    icon: AlertTriangle,
    category: 'listings',
    checkerActive: true,
    frequency: 'Hourly',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: '1',
    lastUpdated: '4 days ago'
  },
  {
    id: 'monthly-sales',
    question: 'My sales for the last 30 days were:',
    answer: '$15,000',
    status: 'info',
    icon: DollarSign,
    category: 'sales',
    checkerActive: false,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '$14,200',
    lastUpdated: '1 day ago'
  },
  {
    id: 'avg-order-value',
    question: 'My average order value this month is:',
    answer: '$27.50',
    status: 'info',
    icon: DollarSign,
    category: 'sales',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '$25.80',
    lastUpdated: '2 days ago'
  },
  {
    id: 'buybox-monthly',
    question: 'My Buy Box win rate this month is:',
    answer: '84%',
    status: 'healthy',
    icon: Trophy,
    category: 'sales',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '81%',
    lastUpdated: '1 day ago'
  },
  {
    id: 'sales-trend',
    question: 'My sales trend over the past 7 days is:',
    answer: 'Increasing',
    status: 'healthy',
    icon: TrendingUp,
    category: 'sales',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: 'Stable',
    lastUpdated: '12 hours ago'
  },
  {
    id: 'top-asins',
    question: 'My top 5 ASINs by revenue for the last 30 days are:',
    answer: 'B08X1234, B07ABC12, B09KLM78, B08V999L, B09ZZY01',
    status: 'info',
    icon: Target,
    category: 'sales',
    checkerActive: false,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: 'B08X1234, B07ABC12, B09KLM78, B08V999L, B09ABC99',
    lastUpdated: '1 week ago'
  },
  {
    id: 'stockout-forecast',
    question: 'The number of SKUs forecasted to stock out in the next 10 days is:',
    answer: '3',
    status: 'warning',
    icon: AlertTriangle,
    category: 'inventory',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '2',
    lastUpdated: '6 hours ago'
  },
  {
    id: 'restock-needed',
    question: 'Days until my next restock order is needed:',
    answer: '14',
    status: 'info',
    icon: Calendar,
    category: 'inventory',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '16',
    lastUpdated: '1 day ago'
  },
  {
    id: 'out-of-stock',
    question: 'I have this many SKUs currently out of stock:',
    answer: '6',
    status: 'critical',
    icon: XCircle,
    category: 'inventory',
    checkerActive: true,
    frequency: 'Hourly',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: '2',
    lastUpdated: '3 days ago'
  },
  {
    id: 'slow-moving',
    question: 'My slowest-moving SKUs are:',
    answer: 'B08CDE23, B098YHJ4, B07MNB88',
    status: 'warning',
    icon: Package,
    category: 'inventory',
    checkerActive: false,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: 'B08CDE23, B098YHJ4, B07ABC12',
    lastUpdated: '1 week ago'
  },
  {
    id: 'inventory-health',
    question: 'My inventory health status is:',
    answer: 'Balanced',
    status: 'healthy',
    icon: CheckCircle,
    category: 'inventory',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    hasReactWorkflow: true,
    reactWorkflowActive: true,
    previousValue: 'Overstocked',
    lastUpdated: '1 week ago'
  },
  {
    id: 'feedback-score',
    question: 'My customer feedback score is:',
    answer: 'Healthy',
    status: 'healthy',
    icon: Users,
    category: 'customers',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: 'Good',
    lastUpdated: '3 days ago'
  },
  {
    id: 'product-rating',
    question: 'My average product rating is:',
    answer: '4.3 Stars',
    status: 'healthy',
    icon: Star,
    category: 'customers',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '4.1 Stars',
    lastUpdated: '5 days ago'
  },
  {
    id: 'buybox-lost',
    question: 'My Buy Box was lost to competitors on these SKUs:',
    answer: 'B08X1234, B07MNB88',
    status: 'warning',
    icon: AlertTriangle,
    category: 'competitors',
    checkerActive: true,
    frequency: 'Hourly',
    checkerWorkflowActive: true,
    previousValue: 'B08X1234',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'price-undercut',
    question: "I'm currently being undercut on price for:",
    answer: 'B09ZZY01, B08V999L',
    status: 'warning',
    icon: DollarSign,
    category: 'competitors',
    checkerActive: true,
    frequency: 'Hourly',
    checkerWorkflowActive: true,
    previousValue: 'B09ZZY01',
    lastUpdated: '4 hours ago'
  },
  {
    id: 'top-competitors',
    question: 'My top 5 competitors right now are:',
    answer: 'BrandA, BrandB, BrandC, BrandD, BrandE',
    status: 'info',
    icon: Target,
    category: 'competitors',
    checkerActive: false,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: 'BrandA, BrandB, BrandC, BrandF, BrandE',
    lastUpdated: '1 week ago'
  },
  {
    id: 'competitor-ads',
    question: 'My competitors launched ads on similar SKUs this week:',
    answer: 'Yes',
    status: 'warning',
    icon: TrendingUp,
    category: 'competitors',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: 'No',
    lastUpdated: '2 days ago'
  },
  {
    id: 'customer-retention',
    question: 'My customer retention rate is:',
    answer: '78%',
    status: 'healthy',
    icon: Users,
    category: 'customers',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '74%',
    lastUpdated: '1 week ago'
  },
  {
    id: 'repeat-purchase-rate',
    question: 'My repeat purchase rate is:',
    answer: '34%',
    status: 'healthy',
    icon: Users,
    category: 'customers',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '31%',
    lastUpdated: '1 week ago'
  },
  {
    id: 'customer-lifetime-value',
    question: 'My average customer lifetime value is:',
    answer: '$127.50',
    status: 'info',
    icon: DollarSign,
    category: 'customers',
    checkerActive: false,
    frequency: 'Monthly',
    checkerWorkflowActive: true,
    previousValue: '$118.20',
    lastUpdated: '2 weeks ago'
  },
  {
    id: 'negative-reviews',
    question: 'I have this many negative reviews in the last 7 days:',
    answer: '2',
    status: 'warning',
    icon: Star,
    category: 'customers',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '5',
    lastUpdated: '1 day ago'
  },
  {
    id: 'customer-service-response',
    question: 'My average customer service response time is:',
    answer: '4.2 hours',
    status: 'healthy',
    icon: Clock,
    category: 'customers',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '5.1 hours',
    lastUpdated: '2 days ago'
  },
  {
    id: 'competitor-price-advantage',
    question: 'My price advantage over top competitors is:',
    answer: '-2.3%',
    status: 'warning',
    icon: DollarSign,
    category: 'competitors',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '-1.8%',
    lastUpdated: '1 day ago'
  },
  {
    id: 'competitor-new-products',
    question: 'New competitor products launched this week:',
    answer: '7',
    status: 'info',
    icon: Package,
    category: 'competitors',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '4',
    lastUpdated: '3 days ago'
  },
  {
    id: 'market-share',
    question: 'My estimated market share in top categories is:',
    answer: '12.4%',
    status: 'info',
    icon: Target,
    category: 'competitors',
    checkerActive: false,
    frequency: 'Monthly',
    checkerWorkflowActive: true,
    previousValue: '11.8%',
    lastUpdated: '2 weeks ago'
  },
  {
    id: 'missing-content',
    question: 'The number of listings missing bullets or description is:',
    answer: '6',
    status: 'warning',
    icon: Type,
    category: 'listings',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: '8',
    lastUpdated: '2 days ago'
  },
  {
    id: 'image-quality',
    question: 'My image quality score across listings is:',
    answer: '92%',
    status: 'healthy',
    icon: Image,
    category: 'listings',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '89%',
    lastUpdated: '1 week ago'
  },
  {
    id: 'keyword-duplication',
    question: 'These 3 listings have keyword duplication issues:',
    answer: 'B08CDE23, B09ZZY01, B07ABC12',
    status: 'warning',
    icon: Search,
    category: 'listings',
    checkerActive: false,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: 'B08CDE23, B09ZZY01, B07ABC12, B08V999L',
    lastUpdated: '1 week ago'
  },
  {
    id: 'title-guidelines',
    question: 'All of my product titles meet the character guidelines:',
    answer: 'Yes',
    status: 'healthy',
    icon: CheckCircle,
    category: 'listings',
    checkerActive: true,
    frequency: 'Daily',
    checkerWorkflowActive: true,
    previousValue: 'No',
    lastUpdated: '3 days ago'
  },
  {
    id: 'keyword-optimization',
    question: 'My percentage of keyword-optimised listings is:',
    answer: '68%',
    status: 'warning',
    icon: Search,
    category: 'listings',
    checkerActive: true,
    frequency: 'Weekly',
    checkerWorkflowActive: true,
    previousValue: '64%',
    lastUpdated: '1 week ago'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return '✓';
    case 'warning':
      return '⚠';
    case 'critical':
      return '✗';
    case 'info':
      return 'ℹ';
    default:
      return '';
  }
};

const categoryLabels = {
  'All': 'All',
  'account': 'Account Health',
  'sales': 'Sales', 
  'inventory': 'Inventory',
  'customers': 'Customers',
  'competitors': 'Competitors',
  'listings': 'Listings'
};

export function HealthCheckers() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'account', 'sales', 'inventory', 'customers', 'competitors', 'listings'];
  
  const filteredChecks = selectedCategory === 'All' 
    ? healthChecks 
    : healthChecks.filter(check => check.category === selectedCategory);
  
  const handleCheckerWorkflow = (checkId: string) => {
    console.log('Building checker workflow for:', checkId);
    // TODO: Integrate with checker workflow builder
  };

  const handleReactWorkflow = (checkId: string) => {
    console.log('Building react workflow for:', checkId);
    // TODO: Integrate with react workflow builder
  };

  const handleCreateReactWorkflow = (checkId: string) => {
    console.log('Creating react workflow for:', checkId);
    // TODO: Integrate with react workflow creator
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Recent Changes */}
        <RecentChanges />
        
        {/* Header and Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Business Health Checkers</h2>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {filteredChecks.length} checkers
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1 border-b border-border">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-sm px-3 py-2 rounded-t-md rounded-b-none border-b-2 transition-colors ${
                  selectedCategory === category 
                    ? 'border-primary bg-background text-foreground font-medium' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
                {category !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {healthChecks.filter(check => check.category === category).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

      {/* Health Checkers List */}
      <div className="space-y-3">
        {filteredChecks.map((check) => {
          return (
            <Card key={check.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Checker Name */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {check.question}
                      </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-muted-foreground">Result:</span>
                         <div className="px-2 py-1 bg-muted/50 rounded text-sm font-semibold text-primary border">
                           {check.answer}
                         </div>
                         {check.previousValue && check.lastUpdated && (
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                             <span>•</span>
                             <span>Previous: {check.previousValue}</span>
                             <span>•</span>
                             <span>Updated: {check.lastUpdated}</span>
                           </div>
                         )}
                       </div>
                    </div>
                    
                    {/* Checker Details */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Checker Active Status */}
                      <div className="flex items-center gap-1">
                        {check.checkerActive ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Play className="h-3 w-3" />
                            <span className="text-xs">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Settings className="h-3 w-3" />
                            <span className="text-xs">Inactive</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Frequency */}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{check.frequency}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Bottom Left and Right */}
                    <div className="flex justify-between items-center mt-3">
                      <Button 
                        variant={check.checkerWorkflowActive ? "default" : "outline"}
                        size="sm" 
                        className={`text-xs h-7 px-3 ${check.checkerWorkflowActive ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                        onClick={() => handleCheckerWorkflow(check.id)}
                      >
                        <div className="flex items-center gap-1">
                          {check.checkerWorkflowActive && <CheckCircle className="h-3 w-3" />}
                          <span>Checker Workflow</span>
                        </div>
                      </Button>
                      
                      {check.hasReactWorkflow && check.reactWorkflowActive ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="text-xs h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleReactWorkflow(check.id)}
                        >
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>React Workflow</span>
                          </div>
                        </Button>
                      ) : check.hasReactWorkflow ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 px-3"
                          onClick={() => handleReactWorkflow(check.id)}
                        >
                          React Workflow
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-3 text-muted-foreground border border-dashed border-muted-foreground/30 hover:bg-muted/50 hover:text-foreground"
                          onClick={() => handleCreateReactWorkflow(check.id)}
                        >
                          <div className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            <span>Create React Workflow</span>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredChecks.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            No checkers found for the selected category
          </div>
        </Card>
      )}
    </div>
    </TooltipProvider>
  );
}
