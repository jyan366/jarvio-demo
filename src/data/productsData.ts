import { AccountHealthMetric, ProductSection } from '@/types/products';

export const accountHealthMetrics: AccountHealthMetric[] = [
  {
    id: 'account-health',
    title: 'Account Health Status',
    value: 'Healthy',
    previousValue: 'At Risk',
    change: 15,
    changeType: 'increase',
    status: 'healthy',
    isTracked: true,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'total-sales',
    title: 'Total Sales (30 days)',
    value: '$42,600',
    previousValue: '$38,200',
    change: 11.5,
    changeType: 'increase',
    status: 'healthy',
    isTracked: true,
    lastUpdated: '6 hours ago'
  },
  {
    id: 'buybox-rate',
    title: 'Buy Box Win Rate',
    value: '86%',
    previousValue: '78%',
    change: 10.3,
    changeType: 'increase',
    status: 'healthy',
    isTracked: true,
    lastUpdated: '8 hours ago'
  },
  {
    id: 'out-of-stock',
    title: 'SKUs Out of Stock',
    value: '6',
    previousValue: '2',
    change: 200,
    changeType: 'increase',
    status: 'critical',
    isTracked: false,
    lastUpdated: '3 hours ago'
  }
];

export const productSections: ProductSection[] = [
  {
    id: 'sales',
    title: 'Sales',
    description: 'Sales performance and revenue metrics',
    products: [
      {
        id: 'sales-1',
        name: 'Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg',
        asin: 'B08X1234',
        sku: 'KIM-1KG-001',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$2,450',
            previousValue: '$2,100',
            change: 16.7,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '115',
            previousValue: '98',
            change: 17.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '12.4%',
            previousValue: '11.8%',
            change: 5.1,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '24.5%',
            previousValue: '28.2%',
            change: -13.1,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-2',
        name: 'Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg',
        asin: 'B07ABC12',
        sku: 'RRS-1KG-002',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$1,890',
            previousValue: '$2,200',
            change: -14.1,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '89',
            previousValue: '104',
            change: -14.4,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '9.8%',
            previousValue: '11.2%',
            change: -12.5,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '31.2%',
            previousValue: '25.8%',
            change: 20.9,
            changeType: 'increase',
            isTracked: false
          }
        ]
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Stock levels and inventory management',
    products: [
      {
        id: 'inventory-1',
        name: 'Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg',
        asin: 'B08X1234',
        sku: 'KIM-1KG-001',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '245',
            previousValue: '278',
            change: -11.9,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '18',
            previousValue: '24',
            change: -25.0,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '13.6',
            previousValue: '11.8',
            change: 15.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '68',
            previousValue: '68',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-2',
        name: 'Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg',
        asin: 'B07ABC12',
        sku: 'RRS-1KG-002',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '12',
            previousValue: '45',
            change: -73.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '4',
            previousValue: '15',
            change: -73.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '3.2',
            previousValue: '3.8',
            change: -15.8,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '19',
            previousValue: '19',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      }
    ]
  },
  {
    id: 'listings',
    title: 'All Listings',
    description: 'Listing quality and optimization metrics',
    products: [
      {
        id: 'listings-1',
        name: 'Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg',
        asin: 'B08X1234',
        sku: 'KIM-1KG-001',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '92%',
            previousValue: '88%',
            change: 4.5,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '12',
            previousValue: '18',
            change: -33.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '7',
            previousValue: '5',
            change: 40.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '247',
            previousValue: '235',
            change: 5.1,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-2',
        name: 'Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented',
        image: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg',
        asin: 'B07ABC12',
        sku: 'RRS-1KG-002',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '78%',
            previousValue: '82%',
            change: -4.9,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '25',
            previousValue: '22',
            change: 13.6,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '4',
            previousValue: '4',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '143',
            previousValue: '138',
            change: 3.6,
            changeType: 'increase',
            isTracked: false
          }
        ]
      }
    ]
  }
];