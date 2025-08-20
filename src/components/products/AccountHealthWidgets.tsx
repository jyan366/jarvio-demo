import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, StarOff, TrendingUp, TrendingDown, Minus, ShieldCheck, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { AccountHealthMetric } from '@/types/products';

interface AccountHealthWidgetsProps {
  metrics: AccountHealthMetric[];
  onToggleTracking: (metricId: string) => void;
}

export const AccountHealthWidgets: React.FC<AccountHealthWidgetsProps> = ({ 
  metrics, 
  onToggleTracking 
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const getStatusColor = (status: AccountHealthMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getChangeIcon = (changeType: AccountHealthMetric['changeType']) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decrease': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'neutral': return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => (
        <TooltipProvider key={metric.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 ${getStatusColor(metric.status)}`}
                onMouseEnter={() => setHoveredMetric(metric.id)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(metric.status)}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => onToggleTracking(metric.id)}
                  >
                    {metric.isTracked ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                    {metric.title}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">
                      {hoveredMetric === metric.id && metric.previousValue 
                        ? metric.previousValue 
                        : metric.value
                      }
                    </p>
                    {metric.change && (
                      <div className="flex items-center gap-1">
                        {getChangeIcon(metric.changeType)}
                        <span className="text-xs font-medium">
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {hoveredMetric === metric.id ? 'Previous Value' : `Updated ${metric.lastUpdated}`}
                  </p>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs text-sm">
                {hoveredMetric === metric.id 
                  ? `Previous: ${metric.previousValue} → Current: ${metric.value}`
                  : 'Hover to see previous value'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};