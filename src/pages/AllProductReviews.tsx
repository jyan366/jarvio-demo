import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Filter, Calendar, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ReviewSummarySection } from '@/components/reviews/ReviewSummarySection';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';

type Review = {
  rating: number;
  text: string;
  date: string;
  author: string;
  productName: string;
  productAsin: string;
};

export default function AllProductReviews() {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const allReviews: Review[] = [
    {
      rating: 5,
      text: "The fermentation process creates a wonderful depth of flavor. This kimchi has become a staple in my meals!",
      date: "2024-03-15",
      author: "Sarah K.",
      productName: "Beetroot Kimchi",
      productAsin: "B00CD1D8OY"
    },
    {
      rating: 4,
      text: "Really enjoy this product but wish it came in different spice levels.",
      date: "2024-01-30",
      author: "Daniel F.",
      productName: "Chilli Kimchi",
      productAsin: "B00ZGAUNYW"
    },
    {
      rating: 3,
      text: "Good product but inconsistent between batches. Sometimes too salty, other times perfect.",
      date: "2024-02-22",
      author: "Maria C.",
      productName: "Carrot & Fennel Kimchi",
      productAsin: "B071144YXD"
    }
  ];

  const filteredReviews = allReviews
    .filter(review => selectedRating === 'all' || review.rating === parseInt(selectedRating))
    .filter(review => selectedProduct === 'all' || review.productAsin === selectedProduct)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const generateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(
        `Based on analysis of ${allReviews.length} reviews across all products:
• Overall sentiment is positive with 75% of reviews being 4 stars or above
• Most mentioned topics: taste quality, packaging, and value for money
• Common improvement suggestions: size options and shipping speed
• High customer loyalty indicated by repeat purchase mentions
• Strong probiotic benefits noted in 60% of reviews`
      );
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate('/customer-insights')} 
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">All Product Reviews</h1>
            </div>
            <p className="text-muted-foreground">
              Monitor and analyze customer feedback across all products
            </p>
          </div>
        </div>

        <ReviewSummarySection />

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Filter by Rating</label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Filter by Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="B00CD1D8OY">Beetroot Kimchi</SelectItem>
                  <SelectItem value="B00ZGAUNYW">Chilli Kimchi</SelectItem>
                  <SelectItem value="B071144YXD">Carrot & Fennel Kimchi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Sort by Date</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDateSort(prev => prev === 'newest' ? 'oldest' : 'newest')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateSort === 'newest' ? 'Newest First' : 'Oldest First'}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Button 
              onClick={generateAnalysis} 
              disabled={isAnalyzing}
              className="w-full mb-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Reviews...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Generate Review Analysis
                </>
              )}
            </Button>
            
            {analysisResult && (
              <Card className="p-4 bg-blue-50 mb-6">
                <p className="text-base leading-relaxed text-blue-900 whitespace-pre-line">
                  {analysisResult}
                </p>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <Card key={index} className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium">{review.productName}</p>
                    <p>{review.text}</p>
                    <p className="text-sm text-muted-foreground">- {review.author}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {review.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
      <FloatingChatButton />
    </MainLayout>
  );
}
