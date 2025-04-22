import React from 'react';
import { ClusteredInsightsFeed } from './ClusteredInsightsFeed';
import type { InsightCategory } from '@/pages/ActionStudio';
import type { Insight } from './types';

// Define the severity levels
type SeverityLevel = 'high' | 'medium' | 'low' | 'info';

// Define the insight interface
interface Insight {
  id: string;
  title: string;
  summary: string;
  category: Exclude<InsightCategory, 'All'>;
  severity: SeverityLevel;
  date: string;
}

// Helper function to get icon based on severity
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

// Category badge color mapping
const categoryColors: Record<Exclude<InsightCategory, 'All'>, string> = {
  Sales: 'bg-red-100 text-red-800',
  Inventory: 'bg-blue-100 text-blue-800',
  Listings: 'bg-green-100 text-green-800',
  Customers: 'bg-purple-100 text-purple-800',
  Competitors: 'bg-orange-100 text-orange-800',
  Advertising: 'bg-yellow-100 text-yellow-800'
};

// Generate mock insights data (50 entries)
const generateMockInsights = (): Insight[] => {
  const categories: Array<Exclude<InsightCategory, 'All'>> = ['Sales', 'Inventory', 'Listings', 'Customers', 'Competitors', 'Advertising'];
  const severityLevels: SeverityLevel[] = ['high', 'medium', 'low', 'info'];
  
  const salesInsights = [
    "Sales spike on Beetroot Kimchi",
    "Unit sales decreased for Carrot & Fennel",
    "Revenue up 12% month-over-month",
    "Average order value increased",
    "Sales velocity slowing on top product",
    "Weekend sales trend improving",
    "Sales rank improved in category",
    "Promotion driving higher sales",
    "Sales conversion rate decreased"
  ];
  
  const inventoryInsights = [
    "Low stock warning for Ruby Red",
    "Excess inventory on Juniper Berry",
    "Inventory turnover rate decreasing",
    "Reorder point reached for Beetroot",
    "Inventory reconciliation needed",
    "Storage costs increasing due to excess",
    "Warehouse capacity reaching limit",
    "Seasonal inventory preparation needed",
    "Inventory age exceeding targets"
  ];
  
  const listingsInsights = [
    "Listing suppressed due to compliance",
    "Listing optimization opportunity",
    "Missing keywords in listing",
    "Product images need updating",
    "Competitor listings outperforming",
    "A+ content missing on top product",
    "Title character limit not maximized",
    "Product category mismatch detected",
    "Enhanced brand content underperforming"
  ];
  
  const customerInsights = [
    "Negative review trend detected",
    "Customer question unanswered",
    "High return rate on Chilli Kimchi",
    "Customer sentiment declining",
    "Positive review influx",
    "Customer feedback themes changing",
    "Product usage questions increasing",
    "Packaging concerns in reviews",
    "Taste profile feedback consistent"
  ];
  
  const competitorInsights = [
    "Competitor price decreased by 10%",
    "New competitor entered category",
    "Competitor stock-out opportunity",
    "Competitor improved listing quality",
    "Market share declining against competitors",
    "Competitor launched new variant",
    "Competitor advertising increased",
    "Competitor review sentiment improved",
    "Competitor out of stock on key products"
  ];
  
  const advertisingInsights = [
    "PPC campaign ACoS increased",
    "Click-through rate declining",
    "Advertising budget depleted early",
    "New high-performing keywords found",
    "Ad placement score improved",
    "Sponsored Products ROI decreasing",
    "Negative keywords recommendation",
    "Campaign seasonality adjustments needed",
    "Brand awareness campaigns underperforming"
  ];
  
  const categoryInsightMap = {
    Sales: salesInsights,
    Inventory: inventoryInsights,
    Listings: listingsInsights,
    Customers: customerInsights,
    Competitors: competitorInsights,
    Advertising: advertisingInsights
  };
  
  const insights: Insight[] = [];
  
  // Generate 50 insights
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const insightsList = categoryInsightMap[category];
    const insightTitle = insightsList[Math.floor(Math.random() * insightsList.length)];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const formattedDate = date.toISOString().split('T')[0];
    
    insights.push({
      id: `insight-${i}`,
      title: insightTitle,
      summary: generateSummaryForInsight(insightTitle, category),
      category,
      severity,
      date: formattedDate
    });
  }
  
  // Sort by date (newest first)
  return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate a summary based on the insight title and category
const generateSummaryForInsight = (title: string, category: Exclude<InsightCategory, 'All'>): string => {
  // Base summaries on the title and category
  if (title.includes('spike')) {
    return "Unusual increase detected in the last 24 hours, potentially requiring inventory adjustments.";
  } else if (title.includes('decreased') || title.includes('declining')) {
    return "Showing downward trend over the past 7 days compared to previous period.";
  } else if (title.includes('Low stock')) {
    return "Current stock levels will only last approximately 5 days based on current sales velocity.";
  } else if (title.includes('suppressed')) {
    return "Amazon has flagged this listing for compliance issues that need immediate attention.";
  } else if (title.includes('review')) {
    return "Pattern detected in customer feedback that may require product or listing changes.";
  } else if (title.includes('Competitor')) {
    return "Market position changing based on competitor activities in the last 48 hours.";
  } else if (title.includes('ACoS')) {
    return "Advertising cost of sale has increased above target threshold, affecting profitability.";
  }
  
  // Default summaries by category
  switch (category) {
    case 'Sales':
      return "Changes in sales patterns detected that may require attention or optimization.";
    case 'Inventory':
      return "Inventory levels or movement patterns require review to maintain optimal stock levels.";
    case 'Listings':
      return "Opportunity identified to improve listing performance and visibility.";
    case 'Customers':
      return "Customer feedback or behavior patterns suggest potential action items.";
    case 'Competitors':
      return "Market position or competitor activity changes detected that may impact strategy.";
    case 'Advertising':
      return "Campaign performance metrics indicate potential optimization opportunities.";
    default:
      return "New insight detected that may require review and action.";
  }
};

// Generate the mock insights
const mockInsights = generateMockInsights();

interface InsightsFeedProps {
  selectedCategory: InsightCategory;
}

export const InsightsFeed: React.FC<InsightsFeedProps> = ({ selectedCategory }) => {
  // Generate mock insights using existing function
  const insights = mockInsights;
  
  return (
    <div className="px-4 sm:px-0">
      <ClusteredInsightsFeed 
        selectedCategory={selectedCategory}
        insights={insights}
      />
    </div>
  );
};
