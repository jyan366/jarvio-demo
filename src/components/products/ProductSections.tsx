import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, StarOff, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

  const renderMetricCell = (sectionId: string, productId: string, metric: ProductMetric) => {
    const isHovered = hoveredMetric === `${productId}-${metric.id}`;
    
    return (
      <TableCell 
        key={metric.id}
        className="text-right relative"
        onMouseEnter={() => setHoveredMetric(`${productId}-${metric.id}`)}
        onMouseLeave={() => setHoveredMetric(null)}
      >
        <div className="flex items-center justify-end gap-2">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="font-medium">
                {isHovered && metric.previousValue ? metric.previousValue : metric.value}
              </span>
              {metric.change && getChangeIcon(metric.changeType)}
            </div>
            {metric.change && (
              <span className="text-xs text-muted-foreground">
                {isHovered ? 'Previous' : `${metric.change > 0 ? '+' : ''}${metric.change}%`}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onToggleMetricTracking(sectionId, productId, metric.id)}
          >
            {metric.isTracked ? (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-3 w-3" />
            )}
          </Button>
        </div>
      </TableCell>
    );
  };

  return (
    <Tabs defaultValue="sales" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        {sections.map((section) => (
          <TabsTrigger key={section.id} value={section.id} className="capitalize">
            {section.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section.id} value={section.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <Badge variant="secondary">
              {section.products.length} products
            </Badge>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="w-[100px]">ASIN</TableHead>
                    <TableHead className="w-[100px]">SKU</TableHead>
                    {section.products[0]?.metrics.map((metric) => (
                      <TableHead key={metric.id} className="text-right">
                        {metric.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.products.map((product) => (
                    <TableRow key={product.id} className="group">
                      <TableCell>
                        <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px]">
                        <div className="line-clamp-2">{product.name}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{product.asin}</code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                      </TableCell>
                      {product.metrics.map((metric) => 
                        renderMetricCell(section.id, product.id, metric)
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};