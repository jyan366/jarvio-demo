import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Zap, TrendingUp, AlertCircle, DollarSign, ThumbsUp, ChevronLeft, ChevronRight, BookOpen, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ReviewsDialog } from '@/components/insights/ReviewsDialog';
import { InsightsDialog } from '@/components/insights/InsightsDialog';

export default function CustomerInsights() {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<string>("");

  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 3 }
  ];

  const products = [{
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
  }];

  const insights = [{
    title: "Unmet Feature Expectations",
    icon: AlertCircle,
    preview: "27% of customers expected additional features",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    details: "Customers frequently mention certain functionalities they expected but didn't find, highlighting missed opportunities for product enhancements."
  }, {
    title: "Consistent Quality Concerns",
    icon: Zap,
    preview: "Quality mentioned in 42% of recent reviews",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    details: "Reviews show patterns questioning product durability and performance, indicating potential quality control improvements needed."
  }, {
    title: "Value vs. Price Perception",
    icon: DollarSign,
    preview: "68% consider the product fairly priced",
    color: "bg-green-50 text-green-700 border-green-200",
    details: "Customer reviews consistently comment on price-value relationship, providing insights for pricing strategy optimization."
  }, {
    title: "Positive Differentiators",
    icon: ThumbsUp,
    preview: "Packaging praised in 89% of reviews",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    details: "Specific product elements like packaging and setup receive consistent praise, offering potential marketing advantages."
  }];

  const nextInsight = () => {
    setCurrentInsightIndex(prev => (prev + 1) % insights.length);
  };

  const previousInsight = () => {
    setCurrentInsightIndex(prev => (prev - 1 + insights.length) % insights.length);
  };

  const currentInsight = insights[currentInsightIndex];

  const handleProductSelect = (asin: string) => {
    setSelectedProducts(prev => 
      prev.includes(asin)
        ? prev.filter(p => p !== asin)
        : [...prev, asin]
    );
  };

  const handleViewReviews = (productName: string) => {
    setCurrentProduct(productName);
    setReviewsDialogOpen(true);
  };

  const handleViewInsights = (productName: string) => {
    setCurrentProduct(productName);
    setInsightsDialogOpen(true);
  };

  const handleGroupInsights = () => {
    const selectedProductNames = products
      .filter(p => selectedProducts.includes(p.asin))
      .map(p => p.name);
    setCurrentProduct("");
    setInsightsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Customer Insights</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={handleGroupInsights}
              disabled={selectedProducts.length === 0}
            >
              Get Group Insights ({selectedProducts.length})
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold">Customer Insights Assistant</h2>
            </div>
            <div className="space-y-6">
              <Card className={`p-4 md:p-6 border ${currentInsight.color} transition-all duration-300 min-h-[200px] flex flex-col`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 items-center">
                    <currentInsight.icon className="w-5 h-5" />
                    <h3 className="font-medium">{currentInsight.title}</h3>
                  </div>
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
                    {currentInsightIndex + 1} of {insights.length}
                  </span>
                </div>
                <p className="text-sm font-medium mb-2">{currentInsight.preview}</p>
                <p className="text-sm flex-1">{currentInsight.details}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-current/10">
                  <Button variant="outline" size="icon" onClick={previousInsight} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextInsight} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
              <div className="flex gap-4">
                <Button variant="default" className="flex-1">
                  Generate Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <span className="sr-only">Select</span>
                  </TableHead>
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
                {products.map(product => (
                  <TableRow key={product.asin}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.asin)}
                        onCheckedChange={() => handleProductSelect(product.asin)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] md:max-w-[300px]">{product.name}</TableCell>
                    <TableCell>{product.asin}</TableCell>
                    <TableCell>{product.rating}</TableCell>
                    <TableCell>{product.reviews}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.quality === 'Good' ? 'bg-green-100 text-green-800' : 
                        product.quality === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quality}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReviews(product.name)}
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Reviews
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInsights(product.name)}
                        className="w-full"
                      >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        View Insights
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <ReviewsDialog 
        open={reviewsDialogOpen}
        onOpenChange={setReviewsDialogOpen}
        productName={currentProduct}
      />

      <InsightsDialog
        open={insightsDialogOpen}
        onOpenChange={setInsightsDialogOpen}
        productNames={currentProduct ? [currentProduct] : products.filter(p => selectedProducts.includes(p.asin)).map(p => p.name)}
      />
    </MainLayout>
  );
}
