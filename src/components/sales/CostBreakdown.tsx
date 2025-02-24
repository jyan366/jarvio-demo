
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CostBreakdownItem } from '@/types/sales';

interface CostBreakdownProps {
  data: CostBreakdownItem[];
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span>Cost Breakdown</span>
          <span className="text-sm text-muted-foreground">
            1-31 January 2025
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.item}
                </span>
                {item.item === 'Total Sales' && (
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total sales before deductions</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                )}
              </div>
              <span className={`font-medium ${
                item.value < 0 ? 'text-red-500' : ''
              }`}>
                {item.value < 0 ? '-' : ''}£{Math.abs(item.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
