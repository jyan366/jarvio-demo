export interface AccountHealthMetric {
  id: string;
  title: string;
  value: string;
  previousValue?: string;
  change?: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  status: 'healthy' | 'warning' | 'critical' | 'info';
  isTracked: boolean;
  lastUpdated: string;
}

export interface ProductMetric {
  id: string;
  title: string;
  value: string;
  previousValue?: string;
  change?: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  isTracked: boolean;
}

export interface ProductData {
  id: string;
  name: string;
  image: string;
  asin: string;
  sku: string;
  category: 'sales' | 'inventory' | 'listings';
  metrics: ProductMetric[];
}

export interface ProductSection {
  id: 'sales' | 'inventory' | 'listings';
  title: string;
  description: string;
  products: ProductData[];
}