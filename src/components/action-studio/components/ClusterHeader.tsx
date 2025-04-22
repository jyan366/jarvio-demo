
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { InsightCluster } from '../types';
import { categoryColors, getSeverityIcon } from '../utils/insightStyles';

interface ClusterHeaderProps {
  cluster: InsightCluster;
}

export const ClusterHeader: React.FC<ClusterHeaderProps> = ({ cluster }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">
        {getSeverityIcon(cluster.severity)}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">{cluster.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{cluster.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={categoryColors[cluster.category]}>
                {cluster.category}
              </Badge>
              <Badge variant="outline">
                {cluster.insights.length} insights
              </Badge>
            </div>
          </div>

          <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-md">
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
        </div>
      </div>
    </div>
  );
};
