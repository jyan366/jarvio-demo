import { DollarSign, ShoppingBag, Package, ArrowRight, Percent, CreditCard } from 'lucide-react';
import { StatsCard, SalesDataPoint, CostBreakdownItem, CostDistributionItem, ProductItem } from '@/types/sales';

export const statsCards: StatsCard[] = [
  {
    title: "Total Sales",
    value: "£12,635.18",
    icon: DollarSign
  },
  {
    title: "Orders",
    value: "856",
    icon: ShoppingBag
  },
  {
    title: "Units Sold",
    value: "927",
    icon: Package
  },
  {
    title: "Units Per Order",
    value: "1.08",
    icon: ArrowRight
  },
  {
    title: "Estimate Payout",
    value: "£4,945.31",
    icon: CreditCard
  },
  {
    title: "Payout Percentage",
    value: "60.86%",
    icon: Percent
  }
];

export const salesData: SalesDataPoint[] = [
  { date: '1 Jan', amount: 500 },
  { date: '2 Jan', amount: 650 },
  { date: '3 Jan', amount: 600 },
  { date: '4 Jan', amount: 450 },
  { date: '5 Jan', amount: 550 },
  { date: '6 Jan', amount: 600 },
  { date: '7 Jan', amount: 400 },
  { date: '8 Jan', amount: 350 },
  { date: '9 Jan', amount: 480 },
  { date: '10 Jan', amount: 520 },
  { date: '11 Jan', amount: 610 },
  { date: '12 Jan', amount: 590 },
  { date: '13 Jan', amount: 570 },
  { date: '14 Jan', amount: 510 },
  { date: '15 Jan', amount: 530 },
  { date: '16 Jan', amount: 640 },
  { date: '17 Jan', amount: 580 },
  { date: '18 Jan', amount: 620 },
  { date: '19 Jan', amount: 560 },
  { date: '20 Jan', amount: 490 },
  { date: '21 Jan', amount: 540 },
  { date: '22 Jan', amount: 630 },
  { date: '23 Jan', amount: 600 },
  { date: '24 Jan', amount: 550 },
  { date: '25 Jan', amount: 510 },
  { date: '26 Jan', amount: 570 },
  { date: '27 Jan', amount: 480 },
  { date: '28 Jan', amount: 520 },
  { date: '29 Jan', amount: 590 },
  { date: '30 Jan', amount: 610 }
];

export const costData = {
  breakdown: [
    { item: 'Total Sales', value: 21974.14 },
    { item: 'Shipping and Rebates', value: 80.05 },
    { item: 'Advertising Cost', value: 0 },
    { item: 'Commission', value: -3318.25 },
    { item: 'FBA Fulfillment Fee', value: -5814.30 },
    { item: 'Other Amazon Fees', value: -344.70 },
    { item: 'Estimated Payout', value: 12576.94 },
    { item: 'Cost of goods', value: 6448.23 },
    { item: 'Other Costs', value: 1768.25 },
    { item: 'Net profit', value: 4360.46 },
  ],
  distribution: [
    { name: 'Net Profit', value: 4360.46, color: '#818CF8' },
    { name: 'COGS', value: 6448.23, color: '#A855F7' },
    { item: 'Advertising Cost', value: 0, color: '#EC4899' },
    { name: 'FBA Fulfillment', value: 5814.30, color: '#60A5FA' },
    { name: 'Commission Fee', value: 3318.25, color: '#A78BFA' },
    { name: 'Other Cost', value: 1768.25, color: '#C084FC' },
    { name: 'Shipping', value: 80.05, color: '#38BDF8' },
    { name: 'Other Amazon Fees', value: 344.70, color: '#FB923C' },
  ]
};

export const productData: ProductItem[] = [
  {
    name: "Kimchi 1kg Jar - Raw & Unpasteurised - Traditionally Fermented",
    asin: "B08P5P3QCG",
    unitsSold: 25,
    totalSales: "$615.89",
    totalCosts: "$428.31",
    avgPrice: "24.64",
    profit: "$190.06"
  },
  {
    name: "Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented",
    asin: "B08P5KYH1P",
    unitsSold: 80,
    totalSales: "$1,592.69",
    totalCosts: "$1,166.19",
    avgPrice: "19.91",
    profit: "$187.75"
  }
];
