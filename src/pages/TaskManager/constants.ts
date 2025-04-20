
import { InsightData } from '@/components/tasks/InsightCard';

export const initialTasks = {
  todo: [
    {
      id: '1',
      title: 'Fix Main Images for Suppressed Listings',
      description: 'Update main product images to comply with Amazon\'s policy requirements to get listings unsuppressed.',
      status: 'Not Started',
      priority: 'HIGH',
      category: 'LISTINGS',
      date: '16 Apr 2025',
      commentsCount: 3,
    },
    {
      id: '2',
      title: 'Monitor Listing Status',
      description: 'After updating the main images, continuously monitor the status of the affected listings to ensure they are no longer suppressed.',
      status: 'Not Started',
      priority: 'MEDIUM',
      category: 'LISTINGS',
      date: '16 Apr 2025',
    },
    {
      id: '3',
      title: 'Resolve Support Cases 2101',
      description: 'My listing was removed due to an ingredient detected in the product "Guava". This is not in the product and appears to be a listing error.',
      status: 'Not Started',
      priority: 'HIGH',
      category: 'SUPPORT',
      date: '16 Apr 2025',
      commentsCount: 1,
    },
    {
      id: '4',
      title: 'Identify Suppressed Listings',
      description: 'Review listings to identify those that are currently suppressed due to non-compliance with Amazon\'s policies.',
      status: 'Not Started',
      priority: 'LOW',
      category: 'LISTINGS',
      date: '17 Apr 2025',
    }
  ],
  inProgress: [
    {
      id: '5',
      title: 'Review and Address Customer Feedback',
      description: 'Analyze all 1-star reviews to understand issues raised by customers, focusing on listing inaccuracies and quality concerns.',
      status: 'In Progress',
      priority: 'HIGH',
      category: 'REVIEWS',
      date: '14 Apr 2025',
      commentsCount: 2,
    },
    {
      id: '6',
      title: 'Analyze Reviews for Keyword Opportunities',
      description: 'Examine 5-star reviews to identify any keywords frequently mentioned that are not currently included in product metadata.',
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'KEYWORDS',
      date: '14 Apr 2025',
      commentsCount: 5,
    },
    {
      id: '7',
      title: 'Update Product Descriptions',
      description: 'Revise product descriptions to include new keywords identified from customer reviews and improve SEO ranking.',
      status: 'In Progress',
      priority: 'LOW',
      category: 'LISTINGS',
      date: '15 Apr 2025',
    }
  ],
  done: [
    {
      id: '8',
      title: 'Resolve Listing Suppression',
      description: 'Identified and resolved issues with suppressed listings to reinstate them on the marketplace.',
      status: 'Done',
      priority: 'HIGH',
      category: 'LISTINGS',
      date: '10 Apr 2025',
      commentsCount: 4,
    },
    {
      id: '9',
      title: 'Assess Inventory Impact',
      description: 'Evaluated the potential impact on sales and inventory turnover due to the suppression of best-seller listings.',
      status: 'Done',
      priority: 'MEDIUM',
      category: 'INVENTORY',
      date: '12 Apr 2025',
    },
    {
      id: '10',
      title: 'Analyze Competitor Pricing',
      description: 'Examined competitor pricing for best sellers to identify if price adjustments are needed to win back the Buy Box.',
      status: 'Done',
      priority: 'LOW',
      category: 'PRICING',
      date: '09 Apr 2025',
      commentsCount: 1,
    }
  ]
};

export const COLUMN_CONFIG = [
  {
    id: 'todo',
    label: 'To Do',
    bg: 'bg-[#F1F0FB]',
    headerColor: 'text-[#3527A0]',
  },
  {
    id: 'inProgress',
    label: 'In Progress',
    bg: 'bg-[#FFF8E8]',
    headerColor: 'text-[#AB860B]',
  },
  {
    id: 'done',
    label: 'Done',
    bg: 'bg-[#F1FBF5]',
    headerColor: 'text-[#199255]',
  },
];

export const insightsData: InsightData[] = [
  {
    id: '1',
    title: '1 Star Review Detected',
    description: 'A new 1-star review was detected for Kimchi 1kg Jar mentioning "product arrived damaged".',
    category: 'REVIEW',
    severity: 'HIGH',
    date: '20 Apr 2025',
  },
  {
    id: '2',
    title: 'Lost Buy Box on Kimchi 500g',
    description: 'You are no longer the Buy Box winner for Kimchi 500g. Current winner is offering 5% lower price.',
    category: 'PRICING',
    severity: 'HIGH',
    date: '19 Apr 2025',
  },
  {
    id: '3',
    title: 'New Listing Opportunity',
    description: 'Based on search trends, "Vegan Kimchi" has high search volume with low competition. Consider creating a listing.',
    category: 'LISTING',
    severity: 'MEDIUM',
    date: '18 Apr 2025',
  },
  {
    id: '4',
    title: 'Competitor Price Drop',
    description: 'A main competitor has reduced prices across their fermented food products by an average of 8%.',
    category: 'COMPETITION',
    severity: 'MEDIUM',
    date: '17 Apr 2025',
  },
];
