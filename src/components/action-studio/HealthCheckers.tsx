import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  XCircle
} from 'lucide-react';

interface HealthCheck {
  id: string;
  question: string;
  answer: string;
  status: 'healthy' | 'warning' | 'critical' | 'info';
  icon: React.ComponentType<any>;
  category: 'account' | 'sales' | 'inventory' | 'performance' | 'listings';
}

const healthChecks: HealthCheck[] = [
  // Account Health
  {
    id: 'account-health',
    question: 'My account health status is:',
    answer: 'Healthy',
    status: 'healthy',
    icon: ShieldCheck,
    category: 'account'
  },
  {
    id: 'total-sales',
    question: 'My total sales in the last 30 days were:',
    answer: '$42,600',
    status: 'healthy',
    icon: DollarSign,
    category: 'sales'
  },
  {
    id: 'profit-margin',
    question: 'My average profit margin across all SKUs is:',
    answer: '24%',
    status: 'healthy',
    icon: TrendingUp,
    category: 'sales'
  },
  {
    id: 'buybox-rate',
    question: 'My Buy Box win rate across the catalogue is:',
    answer: '86%',
    status: 'healthy',
    icon: Trophy,
    category: 'performance'
  },
  {
    id: 'active-skus',
    question: 'The number of active SKUs in my catalogue is:',
    answer: '54',
    status: 'info',
    icon: Package,
    category: 'inventory'
  },
  {
    id: 'suppressed-listings',
    question: 'The number of suppressed or inactive listings is:',
    answer: '3',
    status: 'warning',
    icon: AlertTriangle,
    category: 'listings'
  },
  {
    id: 'monthly-sales',
    question: 'My sales for the last 30 days were:',
    answer: '$15,000',
    status: 'info',
    icon: DollarSign,
    category: 'sales'
  },
  {
    id: 'avg-order-value',
    question: 'My average order value this month is:',
    answer: '$27.50',
    status: 'info',
    icon: DollarSign,
    category: 'sales'
  },
  {
    id: 'buybox-monthly',
    question: 'My Buy Box win rate this month is:',
    answer: '84%',
    status: 'healthy',
    icon: Trophy,
    category: 'performance'
  },
  {
    id: 'sales-trend',
    question: 'My sales trend over the past 7 days is:',
    answer: 'Increasing',
    status: 'healthy',
    icon: TrendingUp,
    category: 'sales'
  },
  {
    id: 'top-asins',
    question: 'My top 5 ASINs by revenue for the last 30 days are:',
    answer: 'B08X1234, B07ABC12, B09KLM78, B08V999L, B09ZZY01',
    status: 'info',
    icon: Target,
    category: 'performance'
  },
  {
    id: 'stockout-forecast',
    question: 'The number of SKUs forecasted to stock out in the next 10 days is:',
    answer: '3',
    status: 'warning',
    icon: AlertTriangle,
    category: 'inventory'
  },
  {
    id: 'restock-needed',
    question: 'Days until my next restock order is needed:',
    answer: '14',
    status: 'info',
    icon: Calendar,
    category: 'inventory'
  },
  {
    id: 'out-of-stock',
    question: 'I have this many SKUs currently out of stock:',
    answer: '6',
    status: 'critical',
    icon: XCircle,
    category: 'inventory'
  },
  {
    id: 'slow-moving',
    question: 'My slowest-moving SKUs are:',
    answer: 'B08CDE23, B098YHJ4, B07MNB88',
    status: 'warning',
    icon: Package,
    category: 'inventory'
  },
  {
    id: 'inventory-health',
    question: 'My inventory health status is:',
    answer: 'Balanced',
    status: 'healthy',
    icon: CheckCircle,
    category: 'inventory'
  },
  {
    id: 'feedback-score',
    question: 'My customer feedback score is:',
    answer: 'Healthy',
    status: 'healthy',
    icon: Users,
    category: 'performance'
  },
  {
    id: 'product-rating',
    question: 'My average product rating is:',
    answer: '4.3 Stars',
    status: 'healthy',
    icon: Star,
    category: 'performance'
  },
  {
    id: 'buybox-lost',
    question: 'My Buy Box was lost to competitors on these SKUs:',
    answer: 'B08X1234, B07MNB88',
    status: 'warning',
    icon: AlertTriangle,
    category: 'performance'
  },
  {
    id: 'price-undercut',
    question: "I'm currently being undercut on price for:",
    answer: 'B09ZZY01, B08V999L',
    status: 'warning',
    icon: DollarSign,
    category: 'performance'
  },
  {
    id: 'top-competitors',
    question: 'My top 5 competitors right now are:',
    answer: 'BrandA, BrandB, BrandC, BrandD, BrandE',
    status: 'info',
    icon: Target,
    category: 'performance'
  },
  {
    id: 'competitor-ads',
    question: 'My competitors launched ads on similar SKUs this week:',
    answer: 'Yes',
    status: 'warning',
    icon: TrendingUp,
    category: 'performance'
  },
  {
    id: 'missing-content',
    question: 'The number of listings missing bullets or description is:',
    answer: '6',
    status: 'warning',
    icon: Type,
    category: 'listings'
  },
  {
    id: 'image-quality',
    question: 'My image quality score across listings is:',
    answer: '92%',
    status: 'healthy',
    icon: Image,
    category: 'listings'
  },
  {
    id: 'keyword-duplication',
    question: 'These 3 listings have keyword duplication issues:',
    answer: 'B08CDE23, B09ZZY01, B07ABC12',
    status: 'warning',
    icon: Search,
    category: 'listings'
  },
  {
    id: 'title-guidelines',
    question: 'All of my product titles meet the character guidelines:',
    answer: 'Yes',
    status: 'healthy',
    icon: CheckCircle,
    category: 'listings'
  },
  {
    id: 'keyword-optimization',
    question: 'My percentage of keyword-optimised listings is:',
    answer: '68%',
    status: 'warning',
    icon: Search,
    category: 'listings'
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
  account: 'Account Health',
  sales: 'Sales Performance',
  inventory: 'Inventory Management',
  performance: 'Performance Metrics',
  listings: 'Listing Quality'
};

export function HealthCheckers() {
  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryChecks = healthChecks.filter(check => check.category === category);
        
        return (
          <Card key={category} className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                {categoryLabels[category]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryChecks.map((check) => {
                  const IconComponent = check.icon;
                  
                  return (
                    <div key={check.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground">
                          <span className="font-medium">{check.question}</span>
                          <span className="ml-2 font-semibold text-primary">{check.answer}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(check.status)} text-xs px-2 py-1`}
                        >
                          {getStatusIcon(check.status)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}