import { MainLayout } from '@/components/layout/MainLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Zap, TrendingUp, BookOpen, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
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

export default function CustomerInsights() {
  const navigate = useNavigate();

  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [detailInsight, setDetailInsight] = useState<InsightData | null>(null);
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
      id: "1",
      title: "Unmet Feature Expectations",
      description: "Customers frequently mention certain functionalities they expected but didn't find, highlighting missed opportunities for product enhancements.",
      category: "REVIEW" as const,
      severity: "HIGH" as const,
      date: "2025-04-20"
    },
    {
      id: "2",
      title: "Consistent Quality Concerns",
      description: "Reviews show patterns questioning product durability and performance, indicating potential quality control improvements needed.",
      category: "REVIEW" as const,
      severity: "MEDIUM" as const,
      date: "2025-04-19"
    },
    {
      id: "3",
      title: "Value vs. Price Perception",
      description: "Customer reviews consistently comment on price-value relationship, providing insights for pricing strategy optimization.",
      category: "PRICING" as const,
      severity: "LOW" as const,
      date: "2025-04-18"
    },
    {
      id: "4",
      title: "Positive Differentiators",
      description: "Specific product elements like packaging and setup receive consistent praise, offering potential marketing advantages.",
      category: "LISTING" as const,
      severity: "LOW" as const,
      date: "2025-04-17"
    }
  ];

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

  const handleInsightClick = (insight: InsightData) => {
    setDetailInsight(insight);
  };

  const openMainInsightsDialog = () => {
    setCurrentProduct("");
    setInsightsDialogOpen(true);
  };

  return <MainLayout>
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Customer Insights</h1>
          <p className="text-muted-foreground">
            Analyze customer feedback and compare product performance
          </p>
        </div>
        <Button onClick={() => navigate('/all-product-reviews')} variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          View All Reviews
        </Button>
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

      <Card className="p-4 md:p-6 my-[20px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-lg md:text-xl font-semibold">Customer Insights Assistant</h2>
          </div>
          <Button 
            onClick={openMainInsightsDialog}
            className="flex items-center gap-2"
            variant="outline"
          >
            <BarChart2 className="w-4 h-4" />
            View Insights
          </Button>
        </div>
        <Card className={`p-4 md:p-6 border transition-all duration-300 min-h-[200px] flex flex-col`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3 items-center">
              {currentInsight.category === "REVIEW" && <Star className="w-5 h-5" />}
              {currentInsight.category === "PRICING" && <TrendingUp className="w-5 h-5" />}
              {currentInsight.category === "LISTING" && <BookOpen className="w-5 h-5" />}
              <h3 className="font-medium">{currentInsight.title}</h3>
            </div>
            <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
              {currentInsightIndex + 1} of {insights.length}
            </span>
          </div>
          <p className="text-sm font-medium mb-2">{currentInsight.title}</p>
          <p className="text-sm flex-1">{currentInsight.description}</p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-current/10">
            <Button variant="outline" size="icon" onClick={previousInsight} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextInsight} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Card>
    </div>

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
    
    <FloatingChatButton />
  </MainLayout>;
}
