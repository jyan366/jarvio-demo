import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, StarOff, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { ProductSection, ProductMetric } from '@/types/products';

interface ProductSectionsProps {
  sections: ProductSection[];
  onToggleMetricTracking: (sectionId: string, productId: string, metricId: string) => void;
}

export const ProductSections: React.FC<ProductSectionsProps> = ({ 
  sections, 
  onToggleMetricTracking 
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const getChangeIcon = (changeType: ProductMetric['changeType']) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decrease': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'neutral': return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const formatRevenue = (value: string) => {
    // Extract number from value for demo purposes
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return `$${num.toLocaleString()}`;
  };

  const renderStarRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-1">({reviewCount.toLocaleString()})</span>
      </div>
    );
  };

  return (
    <Tabs defaultValue="sales" className="space-y-6">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        {sections.map((section) => (
          <TabsTrigger 
            key={section.id} 
            value={section.id} 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm capitalize"
          >
            {section.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section.id} value={section.id} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Products Overview</h2>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-0 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="font-medium text-muted-foreground py-4">Product</TableHead>
                  <TableHead className="font-medium text-muted-foreground py-4">Quality Score</TableHead>
                  <TableHead className="font-medium text-muted-foreground py-4">Revenue</TableHead>
                  <TableHead className="font-medium text-muted-foreground py-4">Stock</TableHead>
                  <TableHead className="font-medium text-muted-foreground py-4">Reviews</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.products.map((product) => (
                  <TableRow key={product.id} className="group hover:bg-muted/20 border-b border-border/40">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm leading-tight">
                            {product.name.slice(0, 50)}{product.name.length > 50 ? '...' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 font-mono">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getQualityScoreColor(Math.floor(Math.random() * 40) + 50)}`}></div>
                        <span className="font-medium">{Math.floor(Math.random() * 40) + 50}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="font-semibold text-foreground">
                          {formatRevenue(product.metrics[0]?.value || '$0')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 1000) + 100} orders
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="font-semibold text-foreground">
                          {Math.floor(Math.random() * 10000) + 500}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 100) + 10}d left
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-between">
                        {renderStarRating(4.5, Math.floor(Math.random() * 5000) + 100)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          onClick={() => onToggleMetricTracking(section.id, product.id, product.metrics[0]?.id || 'revenue')}
                        >
                          {product.metrics[0]?.isTracked ? (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};