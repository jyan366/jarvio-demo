import { Insight, InsightCluster } from '../types';

export const clusterInsights = (insights: Insight[]): InsightCluster[] => {
  const clusters: Map<string, InsightCluster> = new Map();

  insights.forEach(insight => {
    // Determine cluster based on category and keywords
    let clusterKey = '';
    const title = insight.title.toLowerCase();
    
    // Sales clusters
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
    // Inventory clusters
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
    // Listings clusters
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
    // Customer clusters
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
    // Competitor clusters
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
    // Advertising clusters
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

    // Default cluster if no specific match
    if (!clusterKey) {
      clusterKey = `${insight.category.toLowerCase()}-other`;
    }

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, {
        id: clusterKey,
        title: clusterKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Key insights related to ${clusterKey.replace('-', ' ')}`,
        insights: [],
        category: insight.category,
        severity: insight.severity
      });
    }

    const cluster = clusters.get(clusterKey)!;
    cluster.insights.push(insight);
    
    // Update cluster severity based on highest severity insight
    if (insight.severity === 'high') {
      cluster.severity = 'high';
    } else if (insight.severity === 'medium' && cluster.severity !== 'high') {
      cluster.severity = 'medium';
    }
  });

  return Array.from(clusters.values());
};
