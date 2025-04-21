import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { ReviewSummarySection } from '@/components/reviews/ReviewSummarySection';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { InsightsDialog } from '@/components/insights/InsightsDialog';
import { InsightDetailDialog } from '@/components/insights/InsightDetailDialog';
import { InsightData } from '@/components/tasks/InsightCard';
import { useToast } from '@/hooks/use-toast';

interface Review {
  rating: number;
  text: string;
  date: string;
  author: string;
}

export default function ProductReviews() {
  const { asin } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [detailInsight, setDetailInsight] = useState<InsightData | null>(null);
  const { toast } = useToast();

  const productName = "Beetroot Kimchi 2x300g Jar - The Cultured Food Company's";

  const reviews: Review[] = [
    {
      rating: 5,
      text: "This kimchi is absolutely fantastic! The fermentation level is perfect, giving it that authentic tangy flavor. I've tried many brands, but this one stands out for its balanced taste and crisp texture.",
      date: "2024-03-15",
      author: "Sarah K."
    },
    {
      rating: 4,
      text: "Really great product overall. The glass jar packaging is excellent for keeping the kimchi fresh. I do wish they offered different spice levels though, as this one is quite hot for my taste.",
      date: "2024-02-28",
      author: "Michael T."
    },
    {
      rating: 5,
      text: "As someone who grew up eating homemade kimchi, I was skeptical about store-bought options. But this exceeded my expectations! The flavor is complex and the quality is consistent between batches.",
      date: "2024-01-22",
      author: "Jin L."
    },
    {
      rating: 3,
      text: "Good product but inconsistent between batches. Sometimes it's perfect, other times it's too salty. I appreciate the probiotic benefits though, and will continue to purchase despite this issue.",
      date: "2024-02-10",
      author: "Maria C."
    },
    {
      rating: 5,
      text: "I've been buying this kimchi for over a year now, and it's become a staple in my meals. The health benefits are noticeable - my digestion has improved significantly. Worth every penny!",
      date: "2024-03-02",
      author: "David R."
    },
    {
      rating: 4,
      text: "Love the taste but wish it came in a larger size option. The 300g jars don't last long enough in my household! The price point is a bit high for the quantity, but the quality makes up for it.",
      date: "2024-01-05",
      author: "Emma S."
    },
    {
      rating: 5,
      text: "Wonderful, authentic flavor. The beetroot adds a unique sweetness that balances the spice perfectly. I've recommended this to all my friends who are interested in fermented foods.",
      date: "2024-03-10",
      author: "Thomas B."
    }
  ];

  const insights = [{
    id: '1',
    title: 'Quality Feedback Pattern',
    description: 'Multiple reviews mention consistent product quality and fermentation levels.',
    category: 'REVIEW',
    severity: 'LOW',
    date: '2024-03-21'
  }, {
    id: '2',
    title: 'Packaging Feedback',
    description: 'Glass jar packaging receives positive feedback but environmental concerns noted.',
    category: 'LISTING',
    severity: 'MEDIUM',
    date: '2024-03-21'
  }, {
    id: '3',
    title: 'Product Size Consideration',
    description: 'Several customers requesting larger size options.',
    category: 'PRICING',
    severity: 'HIGH',
    date: '2024-03-21'
  }];

  const handleCreateTaskFromInsight = (insight: InsightData) => {
    toast({
      title: "Task Created",
      description: `"${insight.title}" has been added to your tasks.",
    });
  };

  const handleInsightClick = (insight: InsightData) => {
    setDetailInsight(insight);
  };

  const handleAskQuestion = () => {
    const positiveKeywords = ["great", "love", "perfect", "amazing", "best"];
    const negativeKeywords = ["but", "wish", "however", "though", "not"];
    
    let response = "";
    const lowercaseQuestion = question.toLowerCase();

    if (lowercaseQuestion.includes("taste") || lowercaseQuestion.includes("flavor")) {
      response = "Based on the reviews, customers overwhelmingly praise the authentic taste and balanced flavors. 80% of reviews mention positive taste experiences, with particular emphasis on the fermentation quality. Some customers note it can be spicy, and there are requests for different spice level options.";
    } else if (lowercaseQuestion.includes("price") || lowercaseQuestion.includes("cost")) {
      response = "The price point is mentioned in several reviews as being higher than some alternatives, but most customers (approximately 75%) feel the quality justifies the cost. Some customers suggest larger size options for better value.";
    } else if (lowercaseQuestion.includes("packaging") || lowercaseQuestion.includes("container")) {
      response = "The glass jar packaging receives positive feedback for its functionality and reusability. However, some customers suggest more eco-friendly packaging options. The transparency of the jar is appreciated for quality inspection.";
    } else if (lowercaseQuestion.includes("probiotic") || lowercaseQuestion.includes("health")) {
      response = "Many customers report positive probiotic benefits and improved digestion. Approximately 65% of reviews mention health benefits, with several long-term customers noting consistent positive effects.";
    } else if (lowercaseQuestion.includes("summarize") || lowercaseQuestion.includes("summary") || lowercaseQuestion.includes("summarise")) {
      response = reviewSummary;
    } else {
      response = "Based on the overall review analysis, this product maintains a strong positive reception with an average rating of 4.2 out of 5 stars. Key themes include consistent quality, authentic taste, and health benefits, with some suggestions for improvement in packaging and size options.";
    }

    setAnswer(response);
    setQuestion("");
  };

  const reviewSummary = `Based on a comprehensive analysis of ${reviews.length} customer reviews, this product maintains a strong positive reception. Key findings include:

• Quality & Taste: 80% of reviewers praise the authentic taste and consistent fermentation quality
• Probiotic Benefits: 65% mention improved digestion and health benefits
• Packaging: Multiple customers appreciate the glass jar packaging, though some suggest eco-friendly improvements
• Areas for Improvement: Common suggestions include offering different spice levels, larger size options, and more consistent shipping times
• Price Point: While some find it expensive, most agree the quality justifies the cost
• Customer Loyalty: Notable number of repeat customers, indicating strong product satisfaction`;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/customer-insights')}
              className="hover:bg-slate-100"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Insights
            </Button>
            <h1 className="text-2xl font-bold">{productName}</h1>
          </div>
          <Button 
            onClick={() => setInsightsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            View Insights
          </Button>
        </div>

        <ReviewSummarySection />

        <section className="space-y-4">
          <h3 className="font-semibold text-lg">Ask Jarvio About Reviews</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Textarea 
                placeholder="e.g., Summarise my reviews"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[60px]"
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={!question.trim()}
                className="shrink-0"
              >
                Ask Jarvio
              </Button>
            </div>
            
            {answer && (
              <Card className="p-4 bg-green-50 border-green-100">
                <p className="text-green-900">{answer}</p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-4 text-lg">Recent Reviews</h3>
          <div className="grid gap-4">
            {reviews.map((review, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-base mb-2">{review.text}</p>
                <p className="text-sm text-muted-foreground">- {review.author}</p>
              </Card>
            ))}
          </div>
        </section>

        <InsightsDialog
          open={insightsDialogOpen}
          onOpenChange={setInsightsDialogOpen}
          onCreateTask={handleCreateTaskFromInsight}
          insights={insights}
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
