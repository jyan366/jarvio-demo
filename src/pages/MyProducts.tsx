
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import { AccountHealthWidgets } from '@/components/products/AccountHealthWidgets';
import { ProductSections } from '@/components/products/ProductSections';
import { accountHealthMetrics, productSections } from '@/data/productsData';
import { useToast } from '@/hooks/use-toast';

export default function MyProducts() {
  console.log('MyProducts component loading...');
  console.log('Account health metrics:', accountHealthMetrics);
  console.log('Product sections:', productSections);
  const [healthMetrics, setHealthMetrics] = useState(accountHealthMetrics);
  const [sections, setSections] = useState(productSections);
  const { toast } = useToast();

  const handleToggleHealthTracking = (metricId: string) => {
    setHealthMetrics(prev => 
      prev.map(metric => 
        metric.id === metricId 
          ? { ...metric, isTracked: !metric.isTracked }
          : metric
      )
    );
    
    const metric = healthMetrics.find(m => m.id === metricId);
    toast({
      title: metric?.isTracked ? "Stopped tracking" : "Now tracking",
      description: `${metric?.title} ${metric?.isTracked ? 'removed from' : 'added to'} Action Studio insights.`,
    });
  };

  const handleToggleMetricTracking = (sectionId: string, productId: string, metricId: string) => {
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
                          ? { ...metric, isTracked: !metric.isTracked }
                          : metric
                      )
                    }
                  : product
              )
            }
          : section
      )
    );

    const section = sections.find(s => s.id === sectionId);
    const product = section?.products.find(p => p.id === productId);
    const metric = product?.metrics.find(m => m.id === metricId);
    
    toast({
      title: metric?.isTracked ? "Stopped tracking" : "Now tracking",
      description: `${metric?.title} for ${product?.name.slice(0, 30)}... ${metric?.isTracked ? 'removed from' : 'added to'} Action Studio insights.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your Amazon catalog with real-time SP-API data
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>Select Tags</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>Select Products</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>24 Jan 2025 - 23 Feb 2025</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Account Health Widgets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Account Health Overview</h2>
            <p className="text-sm text-muted-foreground">
              ⭐ Star metrics to track them in Action Studio
            </p>
          </div>
          <AccountHealthWidgets 
            metrics={healthMetrics}
            onToggleTracking={handleToggleHealthTracking}
          />
        </div>

        {/* Product Sections */}
        <ProductSections 
          sections={sections}
          onToggleMetricTracking={handleToggleMetricTracking}
        />
      </div>
    </MainLayout>
  );
}
