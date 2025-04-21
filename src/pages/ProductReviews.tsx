import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewSummarySection } from '@/components/reviews/ReviewSummarySection';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { InsightData, InsightCategory, InsightSeverity } from '@/components/tasks/InsightCard';
import { useToast } from '@/hooks/use-toast';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewQuestionSection } from '@/components/reviews/ReviewQuestionSection';
import { ReviewInsights } from '@/components/reviews/ReviewInsights';

interface Review {
  rating: number;
  text: string;
  date: string;
  author: string;
}

export default function ProductReviews() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<string | null>(null);
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

  const insights: InsightData[] = [{
    id: '1',
    title: 'Quality Feedback Pattern',
    description: 'Multiple reviews mention consistent product quality and fermentation levels.',
    category: 'REVIEW' as InsightCategory,
    severity: 'LOW' as InsightSeverity,
    date: '2024-03-21'
  }, {
    id: '2',
    title: 'Packaging Feedback',
    description: 'Glass jar packaging receives positive feedback but environmental concerns noted.',
    category: 'LISTING' as InsightCategory,
    severity: 'MEDIUM' as InsightSeverity,
    date: '2024-03-21'
  }, {
    id: '3',
    title: 'Product Size Consideration',
    description: 'Several customers requesting larger size options.',
    category: 'PRICING' as InsightCategory,
    severity: 'HIGH' as InsightSeverity,
    date: '2024-03-21'
  }];

  const handleCreateTaskFromInsight = (insight: InsightData) => {
    toast({
      title: "Task Created",
      description: `"${insight.title}" has been added to your tasks.`,
    });
  };

  const handleAskQuestion = (question: string) => {
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
  };

  // Fix: Store the multi-line string correctly without errors
  const reviewSummary = 
    "Based on a comprehensive analysis of " + reviews.length + " customer reviews, this product maintains a strong positive reception. Key findings include:\n\n" +
    "• Quality & Taste: 80% of reviewers praise the authentic taste and consistent fermentation quality\n" +
    "• Probiotic Benefits: 65% mention improved digestion and health benefits\n" +
    "• Packaging: Multiple customers appreciate the glass jar packaging, though some suggest eco-friendly improvements\n" +
    "• Areas for Improvement: Common suggestions include offering different spice levels, larger size options, and more consistent shipping times\n" +
    "• Price Point: While some find it expensive, most agree the quality justifies the cost\n" +
    "• Customer Loyalty: Notable number of repeat customers, indicating strong product satisfaction";

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
          <ReviewInsights 
            insights={insights}
            onCreateTask={handleCreateTaskFromInsight}
          />
        </div>

        <ReviewSummarySection />
        
        <ReviewQuestionSection 
          onAskQuestion={handleAskQuestion}
          answer={answer}
        />

        <ReviewList reviews={reviews} />
      </div>
      <FloatingChatButton />
    </MainLayout>
  );
}
