import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronDown, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Insight, InsightCluster, SeverityLevel } from './types';
import { InsightCategory } from '@/pages/ActionStudio';

const categoryColors: Record<Exclude<InsightCategory, 'All'>, string> = {
  Sales: 'bg-red-100 text-red-800',
  Inventory: 'bg-blue-100 text-blue-800',
  Listings: 'bg-green-100 text-green-800',
  Customers: 'bg-purple-100 text-purple-800',
  Competitors: 'bg-orange-100 text-orange-800',
  Advertising: 'bg-yellow-100 text-yellow-800'
};

const getSeverityIcon = (severity: SeverityLevel) => {
  switch (severity) {
    case 'high':
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getClusterTitle = (clusterKey: string, category: Exclude<InsightCategory, 'All'>): string => {
  const titleMappings: Record<Exclude<InsightCategory, 'All'>, Record<string, string>> = {
    Sales: {
      'revenue-momentum': 'Revenue Growth Opportunities',
      'conversion-issues': 'Sales Conversion Challenges',
      'product-sales-trends': 'Product Performance Insights',
      'regional-shifts': 'Geographic Sales Variations',
      'price-sensitivity': 'Pricing Strategy Evaluation'
    },
    Inventory: {
      'stockout-risk': 'Inventory Shortage Risks',
      'excess-stock': 'Overstock Management',
      'fulfillment-issues': 'Warehouse Efficiency Alerts',
      'seasonal-demand': 'Seasonal Inventory Planning',
      'aged-inventory': 'Slow-Moving Stock Warning'
    },
    Listings: {
      'listing-compliance': 'Listing Compliance Risks',
      'listing-performance': 'Listing Optimization Opportunities',
      'seo-optimization': 'SEO and Visibility Improvements',
      'visual-content': 'Product Presentation Enhancements',
      'category-alignment': 'Category Matching Insights'
    },
    Customers: {
      'sentiment-trends': 'Customer Sentiment Analysis',
      'positive-feedback': 'Customer Satisfaction Highlights',
      'product-feedback': 'Product Experience Insights',
      'support-issues': 'Customer Support Improvement Areas',
      'user-content': 'User-Generated Content Opportunities'
    },
    Competitors: {
      'competitor-pricing': 'Competitive Pricing Intelligence',
      'competitor-content': 'Competitor Listing Strategies',
      'competitor-products': 'New Competitor Product Launches',
      'competitor-reviews': 'Competitor Review Landscape',
      'market-share': 'Market Position Tracking'
    },
    Advertising: {
      'ad-budget': 'Advertising Spend Optimization',
      'ad-performance': 'Campaign Performance Insights',
      'underperforming-ads': 'Ad Efficiency Improvement',
      'ad-placement': 'Ad Placement Strategies',
      'targeting-gaps': 'Audience Targeting Refinement'
    }
  };

  if (titleMappings[category] && titleMappings[category][clusterKey]) {
    return titleMappings[category][clusterKey];
  }

  const genericTitles: Record<string, string> = {
    'other': 'General Insights',
    'low': 'Low Priority Observations',
    'medium': 'Moderate Significance Findings',
    'high': 'Critical Action Items'
  };

  const genericKey = Object.keys(genericTitles).find(key => clusterKey.includes(key));
  if (genericKey) {
    return genericTitles[genericKey];
  }

  return `${category} Insights`;
};

const clusterInsights = (insights: Insight[]): InsightCluster[] => {
  const clusters: Map<string, InsightCluster> = new Map();

  insights.forEach(insight => {
    let clusterKey = '';
    const title = insight.title.toLowerCase();
    
    if (insight.category === 'Sales') {
      if (title.includes('revenue') || title.includes('order value')) {
        clusterKey = 'revenue-momentum';
      } else if (title.includes('conversion') || title.includes('bounce rate')) {
        clusterKey = 'conversion-issues';
      } else if (title.includes('product') || title.includes('sku')) {
        clusterKey = 'product-sales-trends';
      } else if (title.includes('region') || title.includes('market')) {
        clusterKey = 'regional-shifts';
      } else if (title.includes('price') || title.includes('discount')) {
        clusterKey = 'price-sensitivity';
      }
    }
    else if (insight.category === 'Inventory') {
      if (title.includes('stock') || title.includes('out')) {
        clusterKey = 'stockout-risk';
      } else if (title.includes('excess') || title.includes('cost')) {
        clusterKey = 'excess-stock';
      } else if (title.includes('warehouse') || title.includes('fulfil')) {
        clusterKey = 'fulfillment-issues';
      } else if (title.includes('seasonal') || title.includes('demand')) {
        clusterKey = 'seasonal-demand';
      } else if (title.includes('age') || title.includes('old')) {
        clusterKey = 'aged-inventory';
      }
    }
    else if (insight.category === 'Listings') {
      if (title.includes('suppress') || title.includes('flag')) {
        clusterKey = 'listing-compliance';
      } else if (title.includes('performance') || title.includes('convert')) {
        clusterKey = 'listing-performance';
      } else if (title.includes('keyword') || title.includes('seo')) {
        clusterKey = 'seo-optimization';
      } else if (title.includes('image') || title.includes('video')) {
        clusterKey = 'visual-content';
      } else if (title.includes('category') || title.includes('variation')) {
        clusterKey = 'category-alignment';
      }
    }
    else if (insight.category === 'Customers') {
      if (title.includes('sentiment') || title.includes('rating')) {
        clusterKey = 'sentiment-trends';
      } else if (title.includes('positive') || title.includes('promoter')) {
        clusterKey = 'positive-feedback';
      } else if (title.includes('feedback') || title.includes('profile')) {
        clusterKey = 'product-feedback';
      } else if (title.includes('support') || title.includes('refund')) {
        clusterKey = 'support-issues';
      } else if (title.includes('ugc') || title.includes('photo')) {
        clusterKey = 'user-content';
      }
    }
    else if (insight.category === 'Competitors') {
      if (title.includes('price') || title.includes('discount')) {
        clusterKey = 'competitor-pricing';
      } else if (title.includes('listing') || title.includes('content')) {
        clusterKey = 'competitor-content';
      } else if (title.includes('launch') || title.includes('variant')) {
        clusterKey = 'competitor-products';
      } else if (title.includes('review') || title.includes('rating')) {
        clusterKey = 'competitor-reviews';
      } else if (title.includes('rank') || title.includes('share')) {
        clusterKey = 'market-share';
      }
    }
    else if (insight.category === 'Advertising') {
      if (title.includes('budget') || title.includes('spend')) {
        clusterKey = 'ad-budget';
      } else if (title.includes('performance') || title.includes('converting')) {
        clusterKey = 'ad-performance';
      } else if (title.includes('underperform') || title.includes('waste')) {
        clusterKey = 'underperforming-ads';
      } else if (title.includes('placement') || title.includes('format')) {
        clusterKey = 'ad-placement';
      } else if (title.includes('target') || title.includes('audience')) {
        clusterKey = 'targeting-gaps';
      }
    }

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, {
        id: clusterKey,
        title: getClusterTitle(clusterKey, insight.category),
        description: `Key insights related to ${insight.category.toLowerCase()} performance`,
        insights: [],
        category: insight.category,
        severity: insight.severity
      });
    }

    const cluster = clusters.get(clusterKey)!;
    cluster.insights.push(insight);
    
    if (insight.severity === 'high') {
      cluster.severity = 'high';
    } else if (insight.severity === 'medium' && cluster.severity !== 'high') {
      cluster.severity = 'medium';
    }
  });

  return Array.from(clusters.values());
};

interface ClusteredInsightsFeedProps {
  selectedCategory: InsightCategory;
  insights: Insight[];
}

export const ClusteredInsightsFeed: React.FC<ClusteredInsightsFeedProps> = ({
  selectedCategory,
  insights
}) => {
  const filteredInsights = selectedCategory === 'All'
    ? insights
    : insights.filter(insight => insight.category === selectedCategory);

  const clusters = clusterInsights(filteredInsights);

  return (
    <div className="space-y-6">
      {clusters.map(cluster => (
        <Card key={cluster.id} className="p-4">
          <Collapsible>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {getSeverityIcon(cluster.severity)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{cluster.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{cluster.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={categoryColors[cluster.category]}>
                        {cluster.category}
                      </Badge>
                      <Badge variant="outline">
                        {cluster.insights.length} insights
                      </Badge>
                    </div>
                  </div>

                  <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-md">
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="mt-4 space-y-3 pl-9">
                {cluster.insights.map(insight => (
                  <Card key={insight.id} className="p-3">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <span className="mr-1">Take Action</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
