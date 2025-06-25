
import { Insight } from './types';

// Generate sample insights from monitoring flows
export const generateSampleInsights = (): Insight[] => {
  const insights: Insight[] = [];
  
  // Buy Box Loss Monitor insights
  const buyBoxInsights = [
    {
      id: 'buybox-001',
      title: 'Lost Buy Box on Kimchi 500g',
      summary: 'You are no longer the Buy Box winner for Kimchi 500g. Current winner is offering 8% lower price at £12.99.',
      category: 'Sales' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 hours ago
    },
    {
      id: 'buybox-002', 
      title: 'Buy Box regained for Sauerkraut 1kg',
      summary: 'Your listing has regained the Buy Box after competitor went out of stock. Consider increasing price to maximize profit.',
      category: 'Sales' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().split('T')[0] // 4 hours ago
    },
    {
      id: 'buybox-003',
      title: 'Buy Box at risk for Fermented Carrots',
      summary: 'Competitor has matched your price. Your Buy Box share has dropped to 60%. Consider adjusting strategy.',
      category: 'Sales' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 hours ago
    }
  ];

  // Listing Suppression Monitor insights
  const suppressionInsights = [
    {
      id: 'suppress-001',
      title: 'Listing suppressed: Ruby Red Kimchi',
      summary: 'Amazon has suppressed your Ruby Red Kimchi listing due to missing nutritional information. Requires immediate action.',
      category: 'Listings' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 hour ago
    },
    {
      id: 'suppress-002',
      title: 'Listing warning: Missing A+ content',
      summary: 'Beetroot Kimchi listing flagged for missing Enhanced Brand Content. May affect conversion rates.',
      category: 'Listings' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0] // 12 hours ago
    },
    {
      id: 'suppress-003',
      title: 'Image quality warning detected',
      summary: 'Main product image for Fermented Vegetables Mix does not meet quality guidelines. Consider updating.',
      category: 'Listings' as const,
      severity: 'low' as const,
      date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString().split('T')[0] // 18 hours ago
    }
  ];

  // Account Health Monitor insights
  const healthInsights = [
    {
      id: 'health-001',
      title: 'Account health declining',
      summary: 'Your account health score has dropped to 180. Late shipment rate increased to 3.2%. Review fulfillment processes.',
      category: 'Inventory' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().split('T')[0] // 8 hours ago
    },
    {
      id: 'health-002',
      title: 'Return rate spike detected',
      summary: 'Return rate for Spicy Kimchi has increased to 12% this week, citing "too spicy" as main reason.',
      category: 'Customers' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 day ago
    }
  ];

  // Sales Dip Checker insights  
  const salesInsights = [
    {
      id: 'sales-001',
      title: 'Significant sales drop: Kimchi 1kg',
      summary: 'Sales for Kimchi 1kg dropped 35% this week compared to last week. Competitor launched similar product.',
      category: 'Sales' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 hours ago
    },
    {
      id: 'sales-002',
      title: 'Weekend sales pattern changed',
      summary: 'Weekend sales typically 40% higher, but this weekend only 15% increase. Investigate weekend targeting.',
      category: 'Sales' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString().split('T')[0] // 16 hours ago
    },
    {
      id: 'sales-003',
      title: 'Seasonal trend starting early',
      summary: 'Fermented foods typically spike in autumn, but sales increasing 3 weeks early this year. Consider inventory increase.',
      category: 'Inventory' as const,
      severity: 'low' as const,
      date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString().split('T')[0] // 20 hours ago
    }
  ];

  // Listing Policy Breach Checker insights
  const policyInsights = [
    {
      id: 'policy-001',
      title: 'Potential trademark violation',
      summary: 'Product title for "Premium Korean Kimchi" may contain trademarked terms. Legal review recommended.',
      category: 'Listings' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 hours ago
    },
    {
      id: 'policy-002',
      title: 'Keyword stuffing detected',
      summary: 'Backend keywords for Sauerkraut listing exceed recommended density. May affect search ranking.',
      category: 'Listings' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 hours ago
    },
    {
      id: 'policy-003',
      title: 'Review incentive language found',
      summary: 'Product insert mentions "5-star review discount" which violates Amazon review policies. Remove immediately.',
      category: 'Customers' as const,
      severity: 'high' as const,
      date: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 hours ago
    }
  ];

  // Competitor monitoring insights
  const competitorInsights = [
    {
      id: 'competitor-001',
      title: 'New competitor product launched',
      summary: 'FreshFerments launched "Artisan Kimchi" targeting same keywords. Price positioned 15% below yours.',
      category: 'Competitors' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 hours ago
    },
    {
      id: 'competitor-002',
      title: 'Competitor stockout opportunity',
      summary: 'Main competitor for Fermented Vegetables is out of stock. Increase advertising spend to capture traffic.',
      category: 'Advertising' as const,
      severity: 'medium' as const,
      date: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString().split('T')[0] // 9 hours ago
    }
  ];

  return [
    ...buyBoxInsights,
    ...suppressionInsights, 
    ...healthInsights,
    ...salesInsights,
    ...policyInsights,
    ...competitorInsights
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
