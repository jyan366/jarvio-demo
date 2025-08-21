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
      },
      {
        id: 'sales-3',
        name: 'Organic Apple Cider Vinegar with Mother - 500ml Raw Unfiltered',
        image: '/placeholder.svg',
        asin: 'B09DEF45',
        sku: 'ACV-500ML-003',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$3,200',
            previousValue: '$2,890',
            change: 10.7,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '160',
            previousValue: '144',
            change: 11.1,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '14.2%',
            previousValue: '13.5%',
            change: 5.2,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '18.9%',
            previousValue: '22.1%',
            change: -14.5,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-4',
        name: 'Premium Coconut Oil - Extra Virgin Cold Pressed 1L',
        image: '/placeholder.svg',
        asin: 'B08GHI67',
        sku: 'CO-1L-004',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$1,580',
            previousValue: '$1,920',
            change: -17.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '79',
            previousValue: '96',
            change: -17.7,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '8.9%',
            previousValue: '10.2%',
            change: -12.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '35.6%',
            previousValue: '28.9%',
            change: 23.2,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-5',
        name: 'Himalayan Pink Salt - Fine Ground 2kg Bag',
        image: '/placeholder.svg',
        asin: 'B07JKL89',
        sku: 'HPS-2KG-005',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$980',
            previousValue: '$890',
            change: 10.1,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '49',
            previousValue: '45',
            change: 8.9,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '11.3%',
            previousValue: '10.8%',
            change: 4.6,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '26.4%',
            previousValue: '29.1%',
            change: -9.3,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-6',
        name: 'Raw Manuka Honey UMF 15+ - 250g Glass Jar',
        image: '/placeholder.svg',
        asin: 'B09MNO12',
        sku: 'MH-250G-006',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$4,200',
            previousValue: '$3,850',
            change: 9.1,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '84',
            previousValue: '77',
            change: 9.1,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '15.6%',
            previousValue: '14.2%',
            change: 9.9,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '19.8%',
            previousValue: '23.4%',
            change: -15.4,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-7',
        name: 'Organic Quinoa Flour - Stone Ground 1kg',
        image: '/placeholder.svg',
        asin: 'B08PQR34',
        sku: 'QF-1KG-007',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$750',
            previousValue: '$620',
            change: 21.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '50',
            previousValue: '41',
            change: 22.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '13.2%',
            previousValue: '10.9%',
            change: 21.1,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '32.1%',
            previousValue: '38.7%',
            change: -17.1,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-8',
        name: 'Activated Charcoal Powder - Food Grade 200g',
        image: '/placeholder.svg',
        asin: 'B07STU56',
        sku: 'ACP-200G-008',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$1,120',
            previousValue: '$1,340',
            change: -16.4,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '56',
            previousValue: '67',
            change: -16.4,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '9.4%',
            previousValue: '11.2%',
            change: -16.1,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '41.2%',
            previousValue: '35.8%',
            change: 15.1,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-9',
        name: 'Collagen Peptides Powder - Grass Fed 500g',
        image: '/placeholder.svg',
        asin: 'B09VWX78',
        sku: 'CP-500G-009',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$3,680',
            previousValue: '$3,420',
            change: 7.6,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '92',
            previousValue: '85',
            change: 8.2,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '16.8%',
            previousValue: '15.4%',
            change: 9.1,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '21.3%',
            previousValue: '24.7%',
            change: -13.8,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-10',
        name: 'Spirulina Tablets - Organic Blue Green Algae 1000ct',
        image: '/placeholder.svg',
        asin: 'B08YZA90',
        sku: 'SPT-1000CT-010',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$2,340',
            previousValue: '$2,180',
            change: 7.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '78',
            previousValue: '73',
            change: 6.8,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '12.9%',
            previousValue: '11.8%',
            change: 9.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '28.5%',
            previousValue: '31.2%',
            change: -8.7,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-11',
        name: 'MCT Oil - C8 C10 Premium Coconut Derived 500ml',
        image: '/placeholder.svg',
        asin: 'B07BCD12',
        sku: 'MCT-500ML-011',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$1,980',
            previousValue: '$1,760',
            change: 12.5,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '66',
            previousValue: '59',
            change: 11.9,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '14.7%',
            previousValue: '13.1%',
            change: 12.2,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '25.8%',
            previousValue: '29.3%',
            change: -11.9,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'sales-12',
        name: 'Turmeric Curcumin with Black Pepper - 120 Capsules',
        image: '/placeholder.svg',
        asin: 'B09EFG34',
        sku: 'TC-120CAP-012',
        category: 'sales',
        metrics: [
          {
            id: 'revenue',
            title: 'Revenue (30d)',
            value: '$1,450',
            previousValue: '$1,680',
            change: -13.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'units-sold',
            title: 'Units Sold',
            value: '58',
            previousValue: '67',
            change: -13.4,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'conversion-rate',
            title: 'Conversion',
            value: '10.2%',
            previousValue: '11.8%',
            change: -13.6,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'acos',
            title: 'ACoS',
            value: '36.9%',
            previousValue: '32.4%',
            change: 13.9,
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
      },
      {
        id: 'inventory-3',
        name: 'Organic Apple Cider Vinegar with Mother - 500ml Raw Unfiltered',
        image: '/placeholder.svg',
        asin: 'B09DEF45',
        sku: 'ACV-500ML-003',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '320',
            previousValue: '340',
            change: -5.9,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '20',
            previousValue: '21',
            change: -4.8,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '16.0',
            previousValue: '16.2',
            change: -1.2,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '80',
            previousValue: '80',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-4',
        name: 'Premium Coconut Oil - Extra Virgin Cold Pressed 1L',
        image: '/placeholder.svg',
        asin: 'B08GHI67',
        sku: 'CO-1L-004',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '89',
            previousValue: '156',
            change: -43.0,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '28',
            previousValue: '50',
            change: -44.0,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '3.2',
            previousValue: '3.1',
            change: 3.2,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '16',
            previousValue: '16',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-5',
        name: 'Himalayan Pink Salt - Fine Ground 2kg Bag',
        image: '/placeholder.svg',
        asin: 'B07JKL89',
        sku: 'HPS-2KG-005',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '78',
            previousValue: '95',
            change: -17.9,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '32',
            previousValue: '42',
            change: -23.8,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '2.4',
            previousValue: '2.3',
            change: 4.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '12',
            previousValue: '12',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-6',
        name: 'Raw Manuka Honey UMF 15+ - 250g Glass Jar',
        image: '/placeholder.svg',
        asin: 'B09MNO12',
        sku: 'MH-250G-006',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '167',
            previousValue: '189',
            change: -11.6,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '40',
            previousValue: '49',
            change: -18.4,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '4.2',
            previousValue: '3.9',
            change: 7.7,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '21',
            previousValue: '21',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-7',
        name: 'Organic Quinoa Flour - Stone Ground 1kg',
        image: '/placeholder.svg',
        asin: 'B08PQR34',
        sku: 'QF-1KG-007',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '203',
            previousValue: '230',
            change: -11.7,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '81',
            previousValue: '112',
            change: -27.7,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '2.5',
            previousValue: '2.1',
            change: 19.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '13',
            previousValue: '13',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-8',
        name: 'Activated Charcoal Powder - Food Grade 200g',
        image: '/placeholder.svg',
        asin: 'B07STU56',
        sku: 'ACP-200G-008',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '134',
            previousValue: '178',
            change: -24.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '48',
            previousValue: '53',
            change: -9.4,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '2.8',
            previousValue: '3.4',
            change: -17.6,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '14',
            previousValue: '17',
            change: -17.6,
            changeType: 'decrease',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-9',
        name: 'Collagen Peptides Powder - Grass Fed 500g',
        image: '/placeholder.svg',
        asin: 'B09VWX78',
        sku: 'CP-500G-009',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '8',
            previousValue: '56',
            change: -85.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '2',
            previousValue: '14',
            change: -85.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '4.6',
            previousValue: '4.0',
            change: 15.0,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '23',
            previousValue: '20',
            change: 15.0,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-10',
        name: 'Spirulina Tablets - Organic Blue Green Algae 1000ct',
        image: '/placeholder.svg',
        asin: 'B08YZA90',
        sku: 'SPT-1000CT-010',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '156',
            previousValue: '189',
            change: -17.5,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '40',
            previousValue: '52',
            change: -23.1,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '3.9',
            previousValue: '3.6',
            change: 8.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '20',
            previousValue: '18',
            change: 11.1,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-11',
        name: 'MCT Oil - C8 C10 Premium Coconut Derived 500ml',
        image: '/placeholder.svg',
        asin: 'B07BCD12',
        sku: 'MCT-500ML-011',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '67',
            previousValue: '89',
            change: -24.7,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '30',
            previousValue: '45',
            change: -33.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '2.2',
            previousValue: '2.0',
            change: 10.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '11',
            previousValue: '10',
            change: 10.0,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'inventory-12',
        name: 'Turmeric Curcumin with Black Pepper - 120 Capsules',
        image: '/placeholder.svg',
        asin: 'B09EFG34',
        sku: 'TC-120CAP-012',
        category: 'inventory',
        metrics: [
          {
            id: 'stock-level',
            title: 'Stock Level',
            value: '112',
            previousValue: '145',
            change: -22.8,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'days-cover',
            title: 'Days Cover',
            value: '58',
            previousValue: '65',
            change: -10.8,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'velocity',
            title: 'Velocity/Day',
            value: '1.9',
            previousValue: '2.2',
            change: -13.6,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'reorder-point',
            title: 'Reorder Point',
            value: '10',
            previousValue: '11',
            change: -9.1,
            changeType: 'decrease',
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
      },
      {
        id: 'listings-3',
        name: 'Organic Apple Cider Vinegar with Mother - 500ml Raw Unfiltered',
        image: '/placeholder.svg',
        asin: 'B09DEF45',
        sku: 'ACV-500ML-003',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '95%',
            previousValue: '91%',
            change: 4.4,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '8',
            previousValue: '12',
            change: -33.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '9',
            previousValue: '7',
            change: 28.6,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '384',
            previousValue: '367',
            change: 4.6,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-4',
        name: 'Premium Coconut Oil - Extra Virgin Cold Pressed 1L',
        image: '/placeholder.svg',
        asin: 'B08GHI67',
        sku: 'CO-1L-004',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '67%',
            previousValue: '72%',
            change: -6.9,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '45',
            previousValue: '38',
            change: 18.4,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '5',
            previousValue: '5',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '89',
            previousValue: '87',
            change: 2.3,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-5',
        name: 'Himalayan Pink Salt - Fine Ground 2kg Bag',
        image: '/placeholder.svg',
        asin: 'B07JKL89',
        sku: 'HPS-2KG-005',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '88%',
            previousValue: '85%',
            change: 3.5,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '19',
            previousValue: '23',
            change: -17.4,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '6',
            previousValue: '4',
            change: 50.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '156',
            previousValue: '149',
            change: 4.7,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-6',
        name: 'Raw Manuka Honey UMF 15+ - 250g Glass Jar',
        image: '/placeholder.svg',
        asin: 'B09MNO12',
        sku: 'MH-250G-006',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '97%',
            previousValue: '94%',
            change: 3.2,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '5',
            previousValue: '7',
            change: -28.6,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '10',
            previousValue: '8',
            change: 25.0,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '512',
            previousValue: '489',
            change: 4.7,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-7',
        name: 'Organic Quinoa Flour - Stone Ground 1kg',
        image: '/placeholder.svg',
        asin: 'B08PQR34',
        sku: 'QF-1KG-007',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '74%',
            previousValue: '69%',
            change: 7.2,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '32',
            previousValue: '41',
            change: -22.0,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '7',
            previousValue: '6',
            change: 16.7,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '78',
            previousValue: '71',
            change: 9.9,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-8',
        name: 'Activated Charcoal Powder - Food Grade 200g',
        image: '/placeholder.svg',
        asin: 'B07STU56',
        sku: 'ACP-200G-008',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '83%',
            previousValue: '80%',
            change: 3.8,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '28',
            previousValue: '35',
            change: -20.0,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '8',
            previousValue: '6',
            change: 33.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '267',
            previousValue: '251',
            change: 6.4,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-9',
        name: 'Collagen Peptides Powder - Grass Fed 500g',
        image: '/placeholder.svg',
        asin: 'B09VWX78',
        sku: 'CP-500G-009',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '91%',
            previousValue: '88%',
            change: 3.4,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '11',
            previousValue: '16',
            change: -31.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '9',
            previousValue: '7',
            change: 28.6,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '423',
            previousValue: '398',
            change: 6.3,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-10',
        name: 'Spirulina Tablets - Organic Blue Green Algae 1000ct',
        image: '/placeholder.svg',
        asin: 'B08YZA90',
        sku: 'SPT-1000CT-010',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '86%',
            previousValue: '83%',
            change: 3.6,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '17',
            previousValue: '21',
            change: -19.0,
            changeType: 'decrease',
            isTracked: false
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '7',
            previousValue: '6',
            change: 16.7,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '198',
            previousValue: '186',
            change: 6.5,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-11',
        name: 'MCT Oil - C8 C10 Premium Coconut Derived 500ml',
        image: '/placeholder.svg',
        asin: 'B07BCD12',
        sku: 'MCT-500ML-011',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '89%',
            previousValue: '86%',
            change: 3.5,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '14',
            previousValue: '19',
            change: -26.3,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '8',
            previousValue: '7',
            change: 14.3,
            changeType: 'increase',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '334',
            previousValue: '318',
            change: 5.0,
            changeType: 'increase',
            isTracked: false
          }
        ]
      },
      {
        id: 'listings-12',
        name: 'Turmeric Curcumin with Black Pepper - 120 Capsules',
        image: '/placeholder.svg',
        asin: 'B09EFG34',
        sku: 'TC-120CAP-012',
        category: 'listings',
        metrics: [
          {
            id: 'listing-quality',
            title: 'Quality Score',
            value: '76%',
            previousValue: '79%',
            change: -3.8,
            changeType: 'decrease',
            isTracked: true
          },
          {
            id: 'keyword-rank',
            title: 'Avg Rank',
            value: '38',
            previousValue: '33',
            change: 15.2,
            changeType: 'increase',
            isTracked: true
          },
          {
            id: 'images-count',
            title: 'Images',
            value: '6',
            previousValue: '6',
            change: 0,
            changeType: 'neutral',
            isTracked: false
          },
          {
            id: 'reviews-count',
            title: 'Reviews',
            value: '145',
            previousValue: '142',
            change: 2.1,
            changeType: 'increase',
            isTracked: false
          }
        ]
      }
    ]
  }
];