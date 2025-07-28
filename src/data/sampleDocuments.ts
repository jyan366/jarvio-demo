import { DocumentMetadata } from '@/types/docs';

export const sampleDocuments: DocumentMetadata[] = [
  {
    id: 'doc-1',
    title: 'Amazon Listing Optimization Guide',
    type: 'text',
    category: 'documents',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    wordCount: 1247,
    characterCount: 7580,
    icon: '📝',
    description: 'Complete guide for optimizing product listings on Amazon marketplace'
  },
  {
    id: 'doc-2',
    title: 'Q4 Inventory Restock Plan',
    type: 'table',
    category: 'documents',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    wordCount: 456,
    characterCount: 2890,
    icon: '📊',
    description: 'Quarterly inventory planning and restock analysis'
  },
  {
    id: 'output-1',
    title: 'Product Performance Analysis',
    type: 'output',
    category: 'outputs',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    wordCount: 892,
    characterCount: 5320,
    icon: '📈',
    description: 'AI-generated analysis of product performance metrics'
  },
  {
    id: 'output-2',
    title: 'Competitor Pricing Report',
    type: 'output',
    category: 'outputs',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    wordCount: 634,
    characterCount: 3890,
    icon: '💰',
    description: 'Automated competitor pricing analysis and recommendations'
  },
  {
    id: 'template-1',
    title: 'Product Launch Checklist',
    type: 'template',
    category: 'templates',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    wordCount: 523,
    characterCount: 3210,
    icon: '✅',
    description: 'Template for new product launch planning'
  },
  {
    id: 'template-2',
    title: 'Monthly Review Template',
    type: 'template',
    category: 'templates',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    wordCount: 287,
    characterCount: 1890,
    icon: '📅',
    description: 'Template for monthly business performance reviews'
  }
];

// Sample document contents
export const sampleDocumentContents: Record<string, string> = {
  'doc-1': `# Amazon Listing Optimization Guide

## Overview
This comprehensive guide covers best practices for optimizing Amazon product listings to maximize visibility and conversions.

## Key Optimization Areas

### 1. Title Optimization
- Include primary keywords naturally
- Mention key features and benefits
- Follow Amazon's title guidelines
- Keep under 200 characters

### 2. Product Images
- High-quality, professional images
- Multiple angles and lifestyle shots
- Infographic highlighting key features
- A+ Content integration

### 3. Bullet Points
- Focus on benefits, not just features
- Use relevant keywords naturally
- Address common customer concerns
- Highlight unique selling propositions

### 4. Product Description
- Detailed feature explanations
- Use cases and applications
- Technical specifications
- Brand story integration

## Performance Tracking
Monitor key metrics:
- Click-through rate (CTR)
- Conversion rate
- Search ranking positions
- Customer review sentiment`,

  'doc-2': `# Q4 Inventory Restock Plan

| Product | Current Stock | Projected Demand | Restock Quantity | Supplier | Lead Time | Priority |
|---------|---------------|------------------|------------------|----------|-----------|----------|
| Wireless Headphones | 45 | 200 | 180 | TechSupply Co | 14 days | High |
| Phone Cases | 120 | 300 | 200 | CaseWorld | 7 days | High |
| Screen Protectors | 80 | 250 | 190 | ProtectPro | 10 days | Medium |
| Charging Cables | 200 | 400 | 250 | ElectroSupply | 12 days | Medium |
| Bluetooth Speakers | 30 | 150 | 130 | AudioTech | 21 days | High |

## Key Insights
- Total investment needed: $45,000
- Expected ROI: 35%
- Critical items: Headphones, Speakers (low stock)
- Supplier diversification needed for cables`,

  'output-1': `# Product Performance Analysis Report

Generated on: January 18, 2024

## Executive Summary
This automated analysis reveals key performance trends across your product portfolio for the past quarter.

## Top Performers
1. **Wireless Headphones Pro** - 156% growth
2. **Premium Phone Case Series** - 89% growth  
3. **Fast Charging Bundle** - 67% growth

## Areas for Improvement
- Bluetooth speakers showing declining sales (-12%)
- Screen protector conversion rate below average (2.1%)
- Customer complaints increasing for charging cables

## Recommendations
1. Increase marketing spend on top performers
2. Review pricing strategy for bluetooth speakers
3. Improve product images for screen protectors
4. Address quality issues with charging cables`,

  'output-2': `# Competitor Pricing Report

Analysis Date: January 16, 2024
Market: Consumer Electronics

## Pricing Comparison Matrix

**Wireless Headphones Category:**
- Our Price: $89.99
- Competitor A: $94.99 (+5.6%)
- Competitor B: $84.99 (-5.6%)
- Market Average: $88.45

**Phone Cases Category:**
- Our Price: $24.99
- Competitor A: $27.99 (+12%)
- Competitor B: $22.99 (-8%)
- Market Average: $25.32

## Strategic Recommendations
1. Consider price reduction for headphones to match market leader
2. Maintain current phone case pricing - well positioned
3. Monitor Competitor B's aggressive pricing strategy`,

  'template-1': `# Product Launch Checklist Template

## Pre-Launch Phase (8 weeks before)
- [ ] Market research and competitor analysis
- [ ] Product photography and content creation
- [ ] Amazon listing optimization
- [ ] Inventory planning and procurement
- [ ] PPC campaign setup

## Launch Phase (Launch week)
- [ ] Product listing goes live
- [ ] Launch PPC campaigns
- [ ] Social media announcements
- [ ] Email marketing to existing customers
- [ ] Monitor for any issues

## Post-Launch Phase (4 weeks after)
- [ ] Performance review and optimization
- [ ] Customer feedback analysis
- [ ] Inventory level monitoring
- [ ] PPC campaign optimization
- [ ] Plan next phase strategies`,

  'template-2': `# Monthly Review Template

## Sales Performance
- Total Revenue: $______
- Units Sold: ______
- Average Order Value: $______
- Conversion Rate: _____%

## Key Metrics
- Traffic Growth: _____%
- Customer Acquisition Cost: $______
- Return Rate: _____%
- Customer Satisfaction Score: ______

## Top Performing Products
1. ________________
2. ________________
3. ________________

## Areas for Improvement
- ________________
- ________________
- ________________

## Action Items for Next Month
- [ ] ________________
- [ ] ________________
- [ ] ________________`
};