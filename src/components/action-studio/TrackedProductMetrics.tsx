import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Star, Package, DollarSign, BarChart3 } from 'lucide-react';
import { accountHealthMetrics, productSections } from '@/data/productsData';

export const TrackedProductMetrics: React.FC = () => {
  // Get all tracked metrics from account health
  const trackedHealthMetrics = accountHealthMetrics.filter(metric => metric.isTracked);

  // Get all tracked product metrics
  const trackedProductMetrics = productSections.flatMap(section => 
    section.products.flatMap(product => 
      product.metrics
        .filter(metric => metric.isTracked)
        .map(metric => ({
          ...metric,
          productName: product.name,
          productSku: product.sku,
          sectionTitle: section.title,
          sectionCategory: section.id
        }))
    )
  );

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decrease': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'neutral': return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSectionIcon = (category: string) => {
    switch (category) {
      case 'sales': return <DollarSign className="h-4 w-4" />;
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'listings': return <BarChart3 className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const totalTrackedMetrics = trackedHealthMetrics.length + trackedProductMetrics.length;

  if (totalTrackedMetrics === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Tracked Metrics from My Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">No metrics being tracked</h3>
            <p className="text-sm mb-4">
              Star metrics in My Products to track them here and get automated insights.
            </p>
            <Button variant="outline" className="text-xs">
              Go to My Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Tracked Metrics from My Products
            <Badge variant="secondary" className="ml-2">
              {totalTrackedMetrics} tracked
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            Manage Tracking
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Health Metrics */}
        {trackedHealthMetrics.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Account Health Metrics ({trackedHealthMetrics.length})
            </h3>
            <div className="grid gap-3">
              {trackedHealthMetrics.map((metric) => (
                <Card key={metric.id} className={`p-3 ${getStatusColor(metric.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {metric.lastUpdated}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{metric.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg">{metric.value}</span>
                        {metric.change && getChangeIcon(metric.changeType)}
                      </div>
                      {metric.change && (
                        <span className="text-xs text-muted-foreground">
                          {metric.change > 0 ? '+' : ''}{metric.change}% vs prev
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Product Metrics */}
        {trackedProductMetrics.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Product Metrics ({trackedProductMetrics.length})
            </h3>
            <div className="space-y-3">
              {Object.entries(
                trackedProductMetrics.reduce((acc, metric) => {
                  const key = metric.sectionCategory;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(metric);
                  return acc;
                }, {} as Record<string, typeof trackedProductMetrics>)
              ).map(([sectionId, metrics]) => (
                <div key={sectionId} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    {getSectionIcon(sectionId)}
                    {metrics[0]?.sectionTitle} Section
                  </div>
                  <div className="grid gap-2 ml-6">
                    {metrics.map((metric, idx) => (
                      <Card key={`${metric.productSku}-${metric.id}`} className="p-3 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {metric.productName.slice(0, 40)}...
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs bg-background px-1.5 py-0.5 rounded">
                                {metric.productSku}
                              </code>
                              <span className="text-xs text-muted-foreground">
                                {metric.title}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="font-bold">{metric.value}</span>
                              {metric.change && getChangeIcon(metric.changeType)}
                            </div>
                            {metric.change && (
                              <span className="text-xs text-muted-foreground">
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};