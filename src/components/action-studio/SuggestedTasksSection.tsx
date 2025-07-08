
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X, Grid3X3, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createTask } from '@/lib/supabaseTasks';

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
  priority: PriorityLevel;
}

type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
const priorityOrder: Record<PriorityLevel, number> = {
  'CRITICAL': 0,
  'HIGH': 1,
  'MEDIUM': 2,
  'LOW': 3,
};

export const suggestedTasks: (SuggestedTask & { priority: PriorityLevel })[] = [
  {
    id: '1',
    title: 'Fix Suppressed Listings',
    category: 'Listings',
    priority: 'CRITICAL',
    linkedInsights: [
      { id: '1', title: 'Listing Suppression Alert', summary: 'Multiple listings suppressed due to ingredient compliance issues' },
      { id: '2', title: 'Ingredient Mislabel Detected', summary: 'System detected "Guava" in product description but not in ingredients list' }
    ]
  },
  {
    id: '2',
    title: 'Restock Best Sellers',
    category: 'Inventory',
    priority: 'HIGH',
    linkedInsights: [
      { id: '3', title: 'Inventory Alert', summary: 'Top-selling product "Beetroot Kimchi" inventory below 20% threshold' },
      { id: '4', title: 'Sales Velocity Increase', summary: '47% increase in daily sales rate for "Beetroot Kimchi" detected' }
    ]
  },
  {
    id: '3',
    title: 'Optimize PPC Campaign',
    category: 'Advertising',
    priority: 'MEDIUM',
    linkedInsights: [
      { id: '5', title: 'High ACoS Alert', summary: 'Campaign "Summer Probiotic" has 43% ACoS, exceeding target by 18%' },
      { id: '6', title: 'Keyword Performance', summary: '3 keywords with CTR below threshold in "Summer Probiotic" campaign' }
    ]
  },
  {
    id: '4',
    title: 'Address Negative Reviews',
    category: 'Customers',
    priority: 'LOW',
    linkedInsights: [
      { id: '7', title: 'Review Pattern Alert', summary: '3 recent 1-star reviews mention "leaking packaging" on Chilli Kimchi product' },
      { id: '8', title: 'Product Return Increase', summary: '15% increase in returns for Chilli Kimchi in the past week' }
    ]
  },
  {
    id: '5',
    title: 'Price Match Competitor',
    category: 'Competitors',
    priority: 'MEDIUM',
    linkedInsights: [
      { id: '9', title: 'Competitor Price Drop', summary: 'Main competitor lowered price on similar Kimchi product by 12%' },
      { id: '10', title: 'Buy Box Loss', summary: 'Buy Box win rate dropped from 94% to 76% in past 3 days' }
    ]
  },
  {
    id: '7',
    title: 'Investigate Sales Decline',
    category: 'Sales',
    priority: 'CRITICAL',
    linkedInsights: [
      { id: '13', title: 'Sales Trend Alert', summary: '22% week-over-week decline in Carrot & Fennel Kimchi sales' },
      { id: '14', title: 'Category Performance', summary: 'Overall fermented foods category growing while our products declining' }
    ]
  }
];

const priorityIndicators: Record<PriorityLevel, string> = {
  'CRITICAL': 'border-l-red-500',
  'HIGH': 'border-l-orange-500', 
  'MEDIUM': 'border-l-blue-500',
  'LOW': 'border-l-gray-400',
};

export const SuggestedTasksSection: React.FC = () => {
  const [openTaskIds, setOpenTaskIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [processingTasks, setProcessingTasks] = useState<string[]>([]);
  const [handledTasks, setHandledTasks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [focusIndex, setFocusIndex] = useState(0);

  const toggleTask = (taskId: string) => {
    setOpenTaskIds(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleTaskAction = async (task: SuggestedTask, accepted: boolean) => {
    if (processingTasks.includes(task.id)) return;
    
    setProcessingTasks(prev => [...prev, task.id]);
    
    try {
      if (accepted) {
        await createTask({
          title: task.title,
          category: task.category,
          priority: task.priority,
          description: `Created from suggested task with priority ${task.priority}.\n\nLinked Insights:\n${task.linkedInsights.map(i => `- ${i.title}: ${i.summary}`).join('\n')}`,
        });

        toast({
          title: "Task Created",
          description: `Added "${task.title}" to your tasks`,
        });
      } else {
        toast({
          description: `Dismissed "${task.title}"`,
        });
      }
      setHandledTasks(prev => [...prev, task.id]);
      
      // If in focus mode and we're at the last task, go to previous
      if (viewMode === 'focus' && focusIndex >= sortedTasks.length - 1) {
        setFocusIndex(Math.max(0, focusIndex - 1));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process task",
        variant: "destructive",
      });
    } finally {
      setProcessingTasks(prev => prev.filter(id => id !== task.id));
    }
  };

  const sortedTasks = [...suggestedTasks]
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .filter(task => !handledTasks.includes(task.id));

  const nextTask = () => {
    if (focusIndex < sortedTasks.length - 1) {
      setFocusIndex(focusIndex + 1);
    }
  };

  const previousTask = () => {
    if (focusIndex > 0) {
      setFocusIndex(focusIndex - 1);
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Suggested Tasks</h2>
        <Card className="p-8 text-center text-muted-foreground">
          No suggested tasks available
        </Card>
      </div>
    );
  }

  const TaskCard = ({ task, isExpanded = false }: { task: SuggestedTask; isExpanded?: boolean }) => (
    <Card 
      className={cn(
        "border-l-4 hover:shadow-sm transition-all duration-200",
        isExpanded ? "p-6" : "p-4",
        priorityIndicators[task.priority]
      )}
    >
      <div className={cn("flex flex-col", isExpanded ? "space-y-4" : "space-y-3")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "inline-block w-2 h-2 rounded-full",
                task.priority === 'CRITICAL' ? 'bg-red-500' :
                task.priority === 'HIGH' ? 'bg-orange-500' :
                task.priority === 'MEDIUM' ? 'bg-blue-500' : 'bg-gray-400'
              )} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {task.priority}
              </span>
            </div>
            <h3 className={cn(
              "font-medium text-foreground leading-tight",
              isExpanded ? "text-lg mb-2" : "text-base mb-1"
            )}>
              {task.title}
            </h3>
            <span className="text-xs text-muted-foreground">
              {task.category}
            </span>
            {isExpanded && (
              <div className="mt-3 text-sm text-muted-foreground">
                Based on {task.linkedInsights.length} insights from your monitoring flows
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:bg-green-50 text-green-600 hover:text-green-700 border border-transparent hover:border-green-200",
                isExpanded ? "h-10 w-10" : "h-8 w-8"
              )}
              onClick={() => handleTaskAction(task, true)}
              disabled={processingTasks.includes(task.id)}
            >
              <Check className={cn(isExpanded ? "h-5 w-5" : "h-4 w-4")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:bg-red-50 text-red-600 hover:text-red-700 border border-transparent hover:border-red-200",
                isExpanded ? "h-10 w-10" : "h-8 w-8"
              )}
              onClick={() => handleTaskAction(task, false)}
              disabled={processingTasks.includes(task.id)}
            >
              <X className={cn(isExpanded ? "h-5 w-5" : "h-4 w-4")} />
            </Button>
          </div>
        </div>
        
        <Collapsible
          open={isExpanded || openTaskIds.includes(task.id)}
          onOpenChange={() => !isExpanded && toggleTask(task.id)}
          className="mt-2"
        >
          {!isExpanded && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Based on {task.linkedInsights.length} insights</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6 ml-1 hover:bg-muted">
                  {openTaskIds.includes(task.id) ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          )}

          <CollapsibleContent className={cn("space-y-2", isExpanded ? "mt-4" : "mt-2")}>
            {task.linkedInsights.map(insight => (
              <div key={insight.id} className={cn(
                "bg-muted/30 border border-border rounded-lg",
                isExpanded ? "p-3" : "p-2"
              )}>
                <p className={cn(
                  "font-medium text-foreground",
                  isExpanded ? "text-sm mb-1" : "text-xs"
                )}>
                  {insight.title}
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isExpanded ? "text-sm" : "text-xs"
                )}>
                  {insight.summary}
                </p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Suggested Tasks</h2>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
              "h-8 px-3 rounded-md",
              viewMode === 'grid' 
                ? "bg-background shadow-sm" 
                : "hover:bg-background/50"
            )}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'focus' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('focus')}
            className={cn(
              "h-8 px-3 rounded-md",
              viewMode === 'focus' 
                ? "bg-background shadow-sm" 
                : "hover:bg-background/50"
            )}
          >
            <Eye className="h-4 w-4 mr-1" />
            Focus
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {focusIndex + 1} of {sortedTasks.length} tasks
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={previousTask}
                disabled={focusIndex === 0}
                className="hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTask}
                disabled={focusIndex >= sortedTasks.length - 1}
                className="hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TaskCard task={sortedTasks[focusIndex]} isExpanded={true} />
        </div>
      )}
    </div>
  );
};
