import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Shuffle, Lightbulb } from 'lucide-react';

interface EmptyFlowsStateProps {
  onCreateFlow: () => void;
  isFiltered?: boolean;
  searchTerm?: string;
}

export function EmptyFlowsState({ 
  onCreateFlow, 
  isFiltered = false, 
  searchTerm = '' 
}: EmptyFlowsStateProps) {
  if (isFiltered) {
    return (
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground mb-4">
            <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No flows found</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            {searchTerm 
              ? `No flows match "${searchTerm}". Try adjusting your search terms or filters.`
              : "No flows match your current filters. Try adjusting your filter selection."
            }
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear all filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-muted-foreground mb-6">
          <div className="relative">
            <Shuffle className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <div className="absolute -top-2 -right-2">
              <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center">
                <Plus className="h-3 w-3 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">Create your first automated flow</h3>
        <p className="text-muted-foreground text-center mb-8 max-w-lg">
          Automate your business processes with AI-powered workflows. Create flows to handle 
          inventory management, listing optimization, competitor analysis, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button onClick={onCreateFlow} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Flow
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Use AI prompts to generate flows automatically</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-medium mb-2 text-sm">Popular flow types:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Inventory Management</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Listing Optimization</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Price Monitoring</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Review Analysis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}