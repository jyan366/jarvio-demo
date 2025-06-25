
interface Insight {
  id: string;
  title: string;
  summary: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export const getFlowInsights = (flowId: string): Insight[] => {
  const insights: Record<string, Insight[]> = {
    'buybox-monitor': [
      {
        id: 'bb-001',
        title: 'Lost Buy Box on Kimchi 500g',
        summary: 'You are no longer the Buy Box winner for Kimchi 500g. Current winner is offering 8% lower price at £12.99.',
        severity: 'high',
        timestamp: '2 hours ago',
        status: 'new'
      },
      {
        id: 'bb-002',
        title: 'Buy Box regained for Sauerkraut 1kg',
        summary: 'Your listing has regained the Buy Box after competitor went out of stock. Consider increasing price to maximize profit.',
        severity: 'medium',
        timestamp: '4 hours ago',
        status: 'acknowledged'
      },
      {
        id: 'bb-003',
        title: 'Buy Box at risk for Fermented Carrots',
        summary: 'Competitor has matched your price. Your Buy Box share has dropped to 60%. Consider adjusting strategy.',
        severity: 'medium',
        timestamp: '6 hours ago',
        status: 'resolved'
      },
      {
        id: 'bb-004',
        title: 'Strong Buy Box performance',
        summary: 'Maintained Buy Box for Pickle Mix 750g for 7 consecutive days. Price optimization working well.',
        severity: 'info',
        timestamp: '1 day ago',
        status: 'resolved'
      }
    ],
    'listing-suppression': [
      {
        id: 'ls-001',
        title: 'Listing suppressed: Ruby Red Kimchi',
        summary: 'Amazon has suppressed your Ruby Red Kimchi listing due to missing nutritional information. Requires immediate action.',
        severity: 'high',
        timestamp: '1 hour ago',
        status: 'new'
      },
      {
        id: 'ls-002',
        title: 'Listing warning: Missing A+ content',
        summary: 'Beetroot Kimchi listing flagged for missing Enhanced Brand Content. May affect conversion rates.',
        severity: 'medium',
        timestamp: '12 hours ago',
        status: 'acknowledged'
      },
      {
        id: 'ls-003',
        title: 'Image quality warning detected',
        summary: 'Main product image for Fermented Vegetables Mix does not meet quality guidelines. Consider updating.',
        severity: 'low',
        timestamp: '18 hours ago',
        status: 'new'
      },
      {
        id: 'ls-004',
        title: 'Compliance check passed',
        summary: 'All listings for Kimchi Traditional 1kg passed Amazon compliance review successfully.',
        severity: 'info',
        timestamp: '2 days ago',
        status: 'resolved'
      },
      {
        id: 'ls-005',
        title: 'Keywords optimization needed',
        summary: 'Backend search terms for Spicy Kimchi are not fully utilized. 47 characters remaining.',
        severity: 'low',
        timestamp: '3 days ago',
        status: 'acknowledged'
      }
    ],
    'account-health': [
      {
        id: 'ah-001',
        title: 'Account health declining',
        summary: 'Your account health score has dropped to 180. Late shipment rate increased to 3.2%. Review fulfillment processes.',
        severity: 'high',
        timestamp: '8 hours ago',
        status: 'new'
      },
      {
        id: 'ah-002',
        title: 'Return rate spike detected',
        summary: 'Return rate for Spicy Kimchi has increased to 12% this week, citing "too spicy" as main reason.',
        severity: 'medium',
        timestamp: '1 day ago',
        status: 'acknowledged'
      },
      {
        id: 'ah-003',
        title: 'Customer service metrics improved',
        summary: 'Response time to customer messages improved by 40% this week. Great progress!',
        severity: 'info',
        timestamp: '2 days ago',
        status: 'resolved'
      }
    ],
    'sales-dip': [
      {
        id: 'sd-001',
        title: 'Significant sales drop: Kimchi 1kg',
        summary: 'Sales for Kimchi 1kg dropped 35% this week compared to last week. Competitor launched similar product.',
        severity: 'high',
        timestamp: '5 hours ago',
        status: 'new'
      },
      {
        id: 'sd-002',
        title: 'Weekend sales pattern changed',
        summary: 'Weekend sales typically 40% higher, but this weekend only 15% increase. Investigate weekend targeting.',
        severity: 'medium',
        timestamp: '16 hours ago',
        status: 'new'
      },
      {
        id: 'sd-003',
        title: 'Seasonal trend starting early',
        summary: 'Fermented foods typically spike in autumn, but sales increasing 3 weeks early this year. Consider inventory increase.',
        severity: 'low',
        timestamp: '20 hours ago',
        status: 'acknowledged'
      },
      {
        id: 'sd-004',
        title: 'Strong performer identified',
        summary: 'Kimchi Variety Pack showing 25% week-over-week growth. Consider expanding this product line.',
        severity: 'info',
        timestamp: '2 days ago',
        status: 'resolved'
      }
    ],
    'policy-breach': [
      {
        id: 'pb-001',
        title: 'Potential trademark violation',
        summary: 'Product title for "Premium Korean Kimchi" may contain trademarked terms. Legal review recommended.',
        severity: 'high',
        timestamp: '3 hours ago',
        status: 'new'
      },
      {
        id: 'pb-002',
        title: 'Keyword stuffing detected',
        summary: 'Backend keywords for Sauerkraut listing exceed recommended density. May affect search ranking.',
        severity: 'medium',
        timestamp: '14 hours ago',
        status: 'acknowledged'
      },
      {
        id: 'pb-003',
        title: 'Review incentive language found',
        summary: 'Product insert mentions "5-star review discount" which violates Amazon review policies. Remove immediately.',
        severity: 'high',
        timestamp: '7 hours ago',
        status: 'new'
      },
      {
        id: 'pb-004',
        title: 'Content guidelines compliance',
        summary: 'All product descriptions now comply with Amazon content guidelines after recent updates.',
        severity: 'info',
        timestamp: '3 days ago',
        status: 'resolved'
      },
      {
        id: 'pb-005',
        title: 'Category classification review',
        summary: 'Fermented Vegetables Mix may be better suited for Health & Personal Care category. Consider reclassification.',
        severity: 'low',
        timestamp: '4 days ago',
        status: 'acknowledged'
      }
    ]
  };

  return insights[flowId] || [];
};
