import React, { createContext, useContext, useState, ReactNode } from 'react';
import { accountHealthMetrics, productSections } from '@/data/productsData';
import { AccountHealthMetric, ProductSection } from '@/types/products';

interface TrackedMetricsContextType {
  healthMetrics: AccountHealthMetric[];
  productSections: ProductSection[];
  updateHealthMetricTracking: (metricId: string, isTracked: boolean) => void;
  updateProductMetricTracking: (sectionId: string, productId: string, metricId: string, isTracked: boolean) => void;
}

const TrackedMetricsContext = createContext<TrackedMetricsContextType | undefined>(undefined);

export const TrackedMetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthMetrics, setHealthMetrics] = useState(accountHealthMetrics);
  const [sections, setSections] = useState(productSections);

  const updateHealthMetricTracking = (metricId: string, isTracked: boolean) => {
    setHealthMetrics(prev => 
      prev.map(metric => 
        metric.id === metricId 
          ? { ...metric, isTracked }
          : metric
      )
    );
  };

  const updateProductMetricTracking = (sectionId: string, productId: string, metricId: string, isTracked: boolean) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              products: section.products.map(product => 
                product.id === productId 
                  ? {
                      ...product,
                      metrics: product.metrics.map(metric => 
                        metric.id === metricId 
                          ? { ...metric, isTracked }
                          : metric
                      )
                    }
                  : product
              )
            }
          : section
      )
    );
  };

  return (
    <TrackedMetricsContext.Provider value={{
      healthMetrics,
      productSections: sections,
      updateHealthMetricTracking,
      updateProductMetricTracking
    }}>
      {children}
    </TrackedMetricsContext.Provider>
  );
};

export const useTrackedMetrics = () => {
  const context = useContext(TrackedMetricsContext);
  if (context === undefined) {
    throw new Error('useTrackedMetrics must be used within a TrackedMetricsProvider');
  }
  return context;
};