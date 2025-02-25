
export interface StatsCard {
  title: string;
  value: string;
  icon: React.ComponentType;
}

export interface SalesDataPoint {
  date: string;
  amount: number;
}

export interface CostBreakdownItem {
  item: string;
  value: number;
}

export interface CostDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ProductItem {
  name: string;
  asin: string;
  unitsSold: number;
  totalSales: string;
  totalCosts: string;
  avgPrice: string;
  profit: string;
  image?: string; // Added image property as optional
}
