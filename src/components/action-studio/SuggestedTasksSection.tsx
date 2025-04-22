import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LinkedInsight {
  id: string;
  title: string;
  summary: string;
}

interface SuggestedTask {
  id: string;
  title: string;
  category: 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';
  linkedInsights: LinkedInsight[];
}

export const suggestedTasks: SuggestedTask[] = [
  {
    id: '1',
    title: 'Fix Suppressed Listings',
    category: 'Listings',
    linkedInsights: [
      { id: '1', title: 'Listing Suppression Alert', summary: 'Multiple listings suppressed due to ingredient compliance issues' },
      { id: '2', title: 'Ingredient Mislabel Detected', summary: 'System detected "Guava" in product description but not in ingredients list' }
    ]
  },
  {
    id: '2',
    title: 'Restock Best Sellers',
    category: 'Inventory',
    linkedInsights: [
      { id: '3', title: 'Inventory Alert', summary: 'Top-selling product "Beetroot Kimchi" inventory below 20% threshold' },
      { id: '4', title: 'Sales Velocity Increase', summary: '47% increase in daily sales rate for "Beetroot Kimchi" detected' }
    ]
  },
  {
    id: '3',
    title: 'Optimize PPC Campaign',
    category: 'Advertising',
    linkedInsights: [
      { id: '5', title: 'High ACoS Alert', summary: 'Campaign "Summer Probiotic" has 43% ACoS, exceeding target by 18%' },
      { id: '6', title: 'Keyword Performance', summary: '3 keywords with CTR below threshold in "Summer Probiotic" campaign' }
    ]
  },
  {
    id: '4',
    title: 'Address Negative Reviews',
    category: 'Customers',
    linkedInsights: [
      { id: '7', title: 'Review Pattern Alert', summary: '3 recent 1-star reviews mention "leaking packaging" on Chilli Kimchi product' },
      { id: '8', title: 'Product Return Increase', summary: '15% increase in returns for Chilli Kimchi in the past week' }
    ]
  },
  {
    id: '5',
    title: 'Price Match Competitor',
    category: 'Competitors',
    linkedInsights: [
      { id: '9', title: 'Competitor Price Drop', summary: 'Main competitor lowered price on similar Kimchi product by 12%' },
      { id: '10', title: 'Buy Box Loss', summary: 'Buy Box win rate dropped from 94% to 76% in past 3 days' }
    ]
  },
  {
    id: '6',
    title: 'Replenish Low Stock Items',
    category: 'Inventory',
    linkedInsights: [
      { id: '11', title: 'Stock Level Alert', summary: 'Multiple products approaching reorder point within 7 days' },
      { id: '12', title: 'Lead Time Warning', summary: 'Supplier has increased lead time for next shipment by 5 days' }
    ]
  },
  {
    id: '7',
    title: 'Investigate Sales Decline',
    category: 'Sales',
    linkedInsights: [
      { id: '13', title: 'Sales Trend Alert', summary: '22% week-over-week decline in Carrot & Fennel Kimchi sales' },
      { id: '14', title: 'Category Performance', summary: 'Overall fermented foods category growing while our products declining' }
    ]
  },
  {
    id: '8',
    title: 'Update Product Images',
    category: 'Listings',
    linkedInsights: [
      { id: '15', title: 'Listing Quality Alert', summary: 'Product images for 3 variants don\'t meet Amazon\'s requirements' },
      { id: '16', title: 'Click-Through Rate Drop', summary: '27% decrease in CTR potentially related to image quality' }
    ]
  },
  {
    id: '9',
    title: 'Respond to Customer Questions',
    category: 'Customers',
    linkedInsights: [
      { id: '17', title: 'Unanswered Questions Alert', summary: '4 customer questions pending for more than 48 hours' },
      { id: '18', title: 'Question Topic Analysis', summary: 'Multiple questions about product storage requirements' }
    ]
  },
  {
    id: '10',
    title: 'Review Advertising Budget',
    category: 'Advertising',
    linkedInsights: [
      { id: '19', title: 'Budget Utilization', summary: 'Daily budget exhausted before 2pm for 5 consecutive days' },
      { id: '20', title: 'Impression Share Loss', summary: 'Losing 42% of possible impressions due to budget constraints' }
    ]
  }
];

const categoryColors: Record<SuggestedTask['category'], string> = {
  Sales: 'bg-red-100 text-red-800',
  Inventory: 'bg-blue-100 text-blue-800',
  Listings: 'bg-green-100 text-green-800',
  Customers: 'bg-purple-100 text-purple-800',
  Competitors: 'bg-orange-100 text-orange-800',
  Advertising: 'bg-yellow-100 text-yellow-800'
};

export const SuggestedTasksSection: React.FC = () => {
  const [openTaskIds, setOpenTaskIds] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setOpenTaskIds(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="space-y-2 px-2 sm:px-0">
      <h2 className="text-base sm:text-xl font-semibold pl-2 sm:pl-0">Suggested Tasks</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {suggestedTasks.map(task => (
          <Card key={task.id} className="p-2 sm:p-3 border hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-1 sm:gap-2">
                <div>
                  <h3 className="font-medium text-sm sm:text-base">{task.title}</h3>
                  <Badge className={`mt-1 text-xs ${categoryColors[task.category]}`}>
                    {task.category}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto mt-1 sm:mt-0">
                  <span className="mr-1 text-xs sm:text-sm">Create Task</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              
              <Collapsible
                open={openTaskIds.includes(task.id)}
                onOpenChange={() => toggleTask(task.id)}
                className="mt-1"
              >
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Based on {task.linkedInsights.length} insights</span>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-6 w-6 ml-1">
                      {openTaskIds.includes(task.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-1 space-y-1">
                  {task.linkedInsights.map(insight => (
                    <div key={insight.id} className="bg-muted/50 p-1 rounded-md">
                      <p className="font-medium text-xs">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.summary}</p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
