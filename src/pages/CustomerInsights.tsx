import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Star, Zap, TrendingUp, BookOpen, ChevronLeft, ChevronRight, BarChart2, Link, ChevronDown, ArrowRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { InsightsDialog } from '@/components/insights/InsightsDialog';
import { InsightDetailDialog } from '@/components/insights/InsightDetailDialog';
import { InsightData } from '@/components/tasks/InsightCard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

export default function CustomerInsights() {
  const navigate = useNavigate();

  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [detailInsight, setDetailInsight] = useState<InsightData | null>(null);
  const [selectedInsights, setSelectedInsights] = useState<InsightData[]>([]);
  const { toast } = useToast();

  const ratings = [
    {
      stars: 5,
      percentage: 70
    }, {
      stars: 4,
      percentage: 20
    }, {
      stars: 3,
      percentage: 5
    }, {
      stars: 2,
      percentage: 2
    }, {
      stars: 1,
      percentage: 3
    }
  ];

  const products = [
    {
      image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg",
      name: "Beetroot Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B00CD1D8OY",
      rating: 4.7,
      reviews: 147,
      quality: "Good"
    }, {
      image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg",
      name: "Chilli Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B00ZGAUNYW",
      rating: 4.1,
      reviews: 293,
      quality: "Fair"
    }, {
      image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//41SF9iv9eXL.jpg",
      name: "Carrot & Fennel Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B071144YXD",
      rating: 3.7,
      reviews: 12,
      quality: "Poor"
    }
  ];

  const insights = [
    {
      title: "Unmet Feature Expectations",
      description: "Customers frequently mention certain functionalities they expected but didn't find.",
      category: "REVIEW" as const,
      severity: "HIGH" as const,
      date: "2025-04-20",
      id: "insight-1"
    },
    {
      title: "Value vs. Price Perception",
      description: "Customer reviews consistently comment on price-value relationship.",
      category: "PRICING" as const, 
      severity: "MEDIUM" as const,
      date: "2025-04-19",
      id: "insight-2"
    },
    {
      title: "Missing Integration Options",
      description: "Reviews indicate demand for integration with popular third-party services.",
      category: "REVIEW" as const,
      severity: "LOW" as const,
      date: "2025-04-18",
      id: "insight-3"
    }
  ];

  const insightGroups = [
    {
      title: "Update Product Features",
      description: "Implement missing features and improve existing functionality",
      insights: [
        {
          id: "1",
          title: "Unmet Feature Expectations",
          description: "Customers frequently mention certain functionalities they expected but didn't find.",
          category: "REVIEW" as const,
          severity: "HIGH" as const,
          date: "2025-04-20"
        },
        {
          id: "2",
          title: "Missing Integration Options",
          description: "Reviews show patterns requesting third-party integrations.",
          category: "REVIEW" as const,
          severity: "MEDIUM" as const,
          date: "2025-04-19"
        }
      ]
    },
    {
      title: "Optimize Pricing Strategy",
      description: "Review and adjust pricing based on customer feedback",
      insights: [
        {
          id: "3",
          title: "Value vs. Price Perception",
          description: "Customer reviews consistently comment on price-value relationship.",
          category: "PRICING" as const,
          severity: "LOW" as const,
          date: "2025-04-18"
        },
        {
          id: "4",
          title: "Competitive Price Analysis",
          description: "Reviews indicate price comparisons with alternatives.",
          category: "LISTING" as const,
          severity: "LOW" as const,
          date: "2025-04-17"
        }
      ]
    }
  ];

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroupExpansion = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const nextInsight = () => {
    setCurrentInsightIndex(prev => (prev + 1) % insights.length);
  };

  const previousInsight = () => {
    setCurrentInsightIndex(prev => (prev - 1 + insights.length) % insights.length);
  };

  const currentInsight = insights[currentInsightIndex];

  const handleViewReviews = (asin: string) => {
    navigate(`/product-reviews/${asin}`);
  };

  const handleViewInsights = (productName: string) => {
    setCurrentProduct(productName);
    setInsightsDialogOpen(true);
  };

  const handleCreateTaskFromInsight = (insight: InsightData) => {
    console.log("Creating task from insight:", insight);
    toast({
      title: "Task Created",
      description: `"${insight.title}" has been added to your tasks.`,
    });
  };

  const handleInsightSelect = (insight: InsightData) => {
    setSelectedInsights(prev => {
      const isSelected = prev.some(i => i.id === insight.id);
      if (isSelected) {
        return prev.filter(i => i.id !== insight.id);
      } else {
        return [...prev, insight];
      }
    });
  };

  const handleCreateTaskFromSelected = () => {
    if (selectedInsights.length === 0) return;

    const combinedTitle = selectedInsights.length === 1 
      ? selectedInsights[0].title 
      : `Combined Task: ${selectedInsights[0].title} +${selectedInsights.length - 1} more`;

    const combinedDescription = selectedInsights
      .map(insight => `- ${insight.title}: ${insight.description}`)
      .join('\n');

    const highestSeverity = selectedInsights.some(i => i.severity === "HIGH") 
      ? "HIGH" 
      : selectedInsights.some(i => i.severity === "MEDIUM") 
        ? "MEDIUM" 
        : "LOW";

    const taskInsight: InsightData = {
      id: crypto.randomUUID(),
      title: combinedTitle,
      description: combinedDescription,
      category: selectedInsights[0].category,
      severity: highestSeverity as "HIGH" | "MEDIUM" | "LOW",
      date: new Date().toISOString().split('T')[0]
    };

    handleCreateTaskFromInsight(taskInsight);
    setSelectedInsights([]);
  };

  const handleInsightClick = (insight: InsightData) => {
    setDetailInsight(insight);
  };

  const suggestedTasks = [
    {
      id: '1',
      title: 'Fix Suppressed Listings',
      category: 'LISTINGS',
      linkedInsights: [
        { id: '1', title: 'Listing Suppression Alert', summary: 'Multiple listings suppressed due to ingredient compliance issues' },
        { id: '2', title: 'Ingredient Mislabel Detected', summary: 'System detected "Guava" in product description but not in ingredients list' }
      ]
    },
    {
      id: '2',
      title: 'Restock Best Sellers',
      category: 'INVENTORY',
      linkedInsights: [
        { id: '3', title: 'Inventory Alert', summary: 'Top-selling product "Beetroot Kimchi" inventory below 20% threshold' },
        { id: '4', title: 'Sales Velocity Increase', summary: '47% increase in daily sales rate for "Beetroot Kimchi" detected' }
      ]
    },
    {
      id: '3',
      title: 'Optimize PPC Campaign',
      category: 'ADVERTISING',
      linkedInsights: [
        { id: '5', title: 'High ACoS Alert', summary: 'Campaign "Summer Probiotic" has 43% ACoS, exceeding target by 18%' },
        { id: '6', title: 'Keyword Performance', summary: '3 keywords with CTR below threshold in "Summer Probiotic" campaign' }
      ]
    },
    {
      id: '4',
      title: 'Address Negative Reviews',
      category: 'CUSTOMERS',
      linkedInsights: [
        { id: '7', title: 'Review Pattern Alert', summary: '3 recent 1-star reviews mention "leaking packaging" on Chilli Kimchi product' },
        { id: '8', title: 'Product Return Increase', summary: '15% increase in returns for Chilli Kimchi in the past week' }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Customer Insights</h1>
            <p className="text-muted-foreground">
              Analyze customer feedback and compare product performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/task-manager')}
              className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button onClick={() => navigate('/all-product-reviews')} variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              View All Reviews
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-6">Customer Feedback</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                <span className="font-semibold ml-2">4.7 out of 5</span>
              </div>
              <p className="text-sm text-muted-foreground">Based on 456 reviews</p>
              <div className="space-y-3">
                {ratings.map(rating => <div key={rating.stars} className="flex items-center gap-4">
                    <span className="w-12 text-sm">{rating.stars} Star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{
                    width: `${rating.percentage}%`
                  }} />
                    </div>
                    <span className="text-sm text-muted-foreground">{rating.percentage}%</span>
                  </div>)}
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl font-semibold">Feedback Score</h2>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full border-8 border-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <div className="absolute inset-0 border-8 border-primary rounded-full" style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)'
              }} />
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">Current Performance</p>
                <p className="font-semibold">On Track</p>
                <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +5 since last month
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 my-[20px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold">Suggested Tasks</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {suggestedTasks.slice(0, 4).map(task => (
              <Card key={task.id} className="p-2 sm:p-3 border hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-1 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-1 sm:gap-2">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{task.title}</h3>
                      <Badge 
                        className={`mt-1 text-xs ${
                          task.category === 'LISTINGS' ? 'bg-green-100 text-green-800' :
                          task.category === 'INVENTORY' ? 'bg-blue-100 text-blue-800' :
                          task.category === 'ADVERTISING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {task.category}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto mt-1 sm:mt-0">
                      <span className="mr-1 text-xs sm:text-sm">Create Task</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  
                  <Collapsible>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Based on {task.linkedInsights.length} insights</span>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-6 w-6 ml-1">
                          <ChevronDown className="h-3 w-3" />
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
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IMAGE</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>ASIN</TableHead>
                  <TableHead>Review Rating</TableHead>
                  <TableHead>Number of Reviews</TableHead>
                  <TableHead>Feedback Quality</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Insights</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => <TableRow key={product.asin}>
                    <TableCell>
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] md:max-w-[300px]">{product.name}</TableCell>
                    <TableCell>{product.asin}</TableCell>
                    <TableCell>{product.rating}</TableCell>
                    <TableCell>{product.reviews}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm ${product.quality === 'Good' ? 'bg-green-100 text-green-800' : product.quality === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {product.quality}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewReviews(product.asin)} className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Reviews
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewInsights(product.name)} 
                        className="w-full flex items-center gap-2"
                      >
                        <BarChart2 className="w-4 h-4" />
                        View Insights
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </Card>

        <InsightsDialog 
          open={insightsDialogOpen} 
          onOpenChange={setInsightsDialogOpen} 
          onCreateTask={handleCreateTaskFromInsight} 
          productNames={currentProduct ? [currentProduct] : []} 
          onInsightClick={handleInsightClick}
        />

        <InsightDetailDialog 
          insight={detailInsight}
          open={!!detailInsight}
          onClose={() => setDetailInsight(null)}
          onCreateTask={() => {
            if (detailInsight) {
              handleCreateTaskFromInsight(detailInsight);
              setDetailInsight(null);
            }
          }}
        />
      </div>
      <FloatingChatButton />
    </MainLayout>
  );
}
