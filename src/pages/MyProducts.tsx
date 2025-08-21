
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AccountHealthWidgets } from '@/components/products/AccountHealthWidgets';
import { ProductSections } from '@/components/products/ProductSections';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import { useTrackedMetrics } from '@/hooks/useTrackedMetrics';
import { useToast } from '@/hooks/use-toast';

export default function MyProducts() {
  const { healthMetrics, productSections, updateHealthMetricTracking, updateProductMetricTracking } = useTrackedMetrics();
  const { toast } = useToast();

  const handleToggleHealthTracking = (metricId: string) => {
    const metric = healthMetrics.find(m => m.id === metricId);
    const newTrackedState = !metric?.isTracked;
    
    updateHealthMetricTracking(metricId, newTrackedState);
    
    toast({
      title: newTrackedState ? "Now tracking" : "Stopped tracking",
      description: `${metric?.title} ${newTrackedState ? 'added to' : 'removed from'} Action Studio insights.`,
    });
  };

  const handleToggleMetricTracking = (sectionId: string, productId: string, metricId: string) => {
    const section = productSections.find(s => s.id === sectionId);
    const product = section?.products.find(p => p.id === productId);
    const metric = product?.metrics.find(m => m.id === metricId);
    const newTrackedState = !metric?.isTracked;
    
    updateProductMetricTracking(sectionId, productId, metricId, newTrackedState);

    toast({
      title: newTrackedState ? "Now tracking" : "Stopped tracking",
      description: `${metric?.title} for ${product?.name.slice(0, 30)}... ${newTrackedState ? 'added to' : 'removed from'} Action Studio insights.`,
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
          sections={productSections}
          onToggleMetricTracking={handleToggleMetricTracking}
        />
      </div>
    </MainLayout>
  );
}
