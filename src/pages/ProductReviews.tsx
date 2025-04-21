import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessageCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';

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

  // Product details for B00CD1D8OY
  const productName = "Beetroot Kimchi 2x300g Jar - The Cultured Food Company's";

  // Using the same reviews data
  const reviews: Review[] = [
    {
      rating: 5,
      text: "The fermentation process creates a wonderful depth of flavor. This kimchi has become a staple in my meals!",
      date: "2024-03-15",
      author: "Sarah K."
    },
    {
      rating: 4,
      text: "Good probiotic benefits, I've noticed improved digestion. The packaging could be more eco-friendly though.",
      date: "2024-03-12",
      author: "Michael R."
    },
    {
      rating: 3,
      text: "Decent taste but a bit too spicy for my liking. Wish they had a mild version available.",
      date: "2024-03-10",
      author: "Emma T."
    },
    {
      rating: 5,
      text: "Perfect level of fermentation! The crunch is still there and the flavors are well balanced.",
      date: "2024-03-08",
      author: "David L."
    },
    {
      rating: 2,
      text: "Received a batch that wasn't fermented properly. Packaging was also damaged during shipping.",
      date: "2024-03-05",
      author: "Jennifer M."
    },
    {
      rating: 5,
      text: "Amazing quality! Love how it's made in small batches. You can taste the attention to detail.",
      date: "2024-03-03",
      author: "Robert W."
    },
    {
      rating: 4,
      text: "Great taste but quite expensive compared to other brands. Still worth it for the quality though.",
      date: "2024-02-28",
      author: "Lisa P."
    },
    {
      rating: 5,
      text: "The best kimchi I've found outside of Korea! Authentic taste and perfect texture.",
      date: "2024-02-25",
      author: "James K."
    },
    {
      rating: 3,
      text: "Good product but inconsistent between batches. Sometimes too salty, other times perfect.",
      date: "2024-02-22",
      author: "Maria C."
    },
    {
      rating: 5,
      text: "Love the glass jar packaging! Makes it easy to see the product and reuse the container.",
      date: "2024-02-20",
      author: "Thomas B."
    },
    {
      rating: 4,
      text: "Regular customer for 6 months now. Great product but please consider larger size options.",
      date: "2024-02-18",
      author: "Anna D."
    },
    {
      rating: 2,
      text: "Not as advertised. The probiotic benefits are there but the taste is too strong.",
      date: "2024-02-15",
      author: "Paul M."
    },
    {
      rating: 5,
      text: "Perfect addition to my meals! The fermentation level is spot on every time.",
      date: "2024-02-12",
      author: "Sophie R."
    },
    {
      rating: 4,
      text: "Good quality product. Would love to see more variety in the product line.",
      date: "2024-02-10",
      author: "Chris H."
    },
    {
      rating: 5,
      text: "Been buying this for a year now. Consistently good quality and great customer service.",
      date: "2024-02-08",
      author: "Karen L."
    },
    {
      rating: 3,
      text: "Average taste but excellent probiotic benefits. Helped with my digestive issues.",
      date: "2024-02-05",
      author: "George P."
    },
    {
      rating: 5,
      text: "Fresh ingredients and perfect fermentation. Worth every penny!",
      date: "2024-02-03",
      author: "Rachel S."
    },
    {
      rating: 4,
      text: "Really enjoy this product but wish it came in different spice levels.",
      date: "2024-01-30",
      author: "Daniel F."
    },
    {
      rating: 5,
      text: "The authentic taste reminds me of homemade kimchi. Great job!",
      date: "2024-01-28",
      author: "Lucy W."
    },
    {
      rating: 2,
      text: "Latest batch wasn't as good as usual. Hope this is just a one-off issue.",
      date: "2024-01-25",
      author: "Mark T."
    },
    {
      rating: 5,
      text: "Exceptional quality and consistency. Love supporting this local business!",
      date: "2024-01-23",
      author: "Helen R."
    },
    {
      rating: 4,
      text: "Good product but shipping could be faster. Takes too long to arrive sometimes.",
      date: "2024-01-20",
      author: "Peter K."
    },
    {
      rating: 5,
      text: "Perfect balance of flavors. Not too sour, not too spicy. Just right!",
      date: "2024-01-18",
      author: "Alice M."
    },
    {
      rating: 3,
      text: "Decent product but the price point is a bit high for regular purchases.",
      date: "2024-01-15",
      author: "Steven L."
    },
    {
      rating: 5,
      text: "The glass packaging keeps the kimchi fresh for weeks. Great design!",
      date: "2024-01-12",
      author: "Nina P."
    },
    {
      rating: 4,
      text: "Quality product but would love to see some seasonal variations.",
      date: "2024-01-10",
      author: "Kevin B."
    },
    {
      rating: 5,
      text: "Best fermented product I've tried. The probiotics really make a difference.",
      date: "2024-01-08",
      author: "Michelle D."
    },
    {
      rating: 3,
      text: "Good flavor but portions seem to have gotten smaller recently.",
      date: "2024-01-05",
      author: "Brian K."
    },
    {
      rating: 5,
      text: "Love how each batch is dated. Shows real attention to quality control!",
      date: "2024-01-03",
      author: "Sandra F."
    },
    {
      rating: 4,
      text: "Great product overall. Just wish it had a longer shelf life once opened.",
      date: "2024-01-01",
      author: "John R."
    }
  ];

  const reviewSummary = `Based on a comprehensive analysis of ${reviews.length} customer reviews, this product maintains a strong positive reception. Key findings include:

• Quality & Taste: 80% of reviewers praise the authentic taste and consistent fermentation quality
• Probiotic Benefits: 65% mention improved digestion and health benefits
• Packaging: Multiple customers appreciate the glass jar packaging, though some suggest eco-friendly improvements
• Areas for Improvement: Common suggestions include offering different spice levels, larger size options, and more consistent shipping times
• Price Point: While some find it expensive, most agree the quality justifies the cost
• Customer Loyalty: Notable number of repeat customers, indicating strong product satisfaction`;

  const handleAskQuestion = () => {
    // Mock AI analysis based on the review data
    const positiveKeywords = ["great", "love", "perfect", "amazing", "best"];
    const negativeKeywords = ["but", "wish", "however", "though", "not"];
    
    let response = "";
    const lowercaseQuestion = question.toLowerCase();

    // Simulate AI analysis with different response patterns based on question type
    if (lowercaseQuestion.includes("taste") || lowercaseQuestion.includes("flavor")) {
      response = "Based on the reviews, customers overwhelmingly praise the authentic taste and balanced flavors. 80% of reviews mention positive taste experiences, with particular emphasis on the fermentation quality. Some customers note it can be spicy, and there are requests for different spice level options.";
    } else if (lowercaseQuestion.includes("price") || lowercaseQuestion.includes("cost")) {
      response = "The price point is mentioned in several reviews as being higher than some alternatives, but most customers (approximately 75%) feel the quality justifies the cost. Some customers suggest larger size options for better value.";
    } else if (lowercaseQuestion.includes("packaging") || lowercaseQuestion.includes("container")) {
      response = "The glass jar packaging receives positive feedback for its functionality and reusability. However, some customers suggest more eco-friendly packaging options. The transparency of the jar is appreciated for quality inspection.";
    } else if (lowercaseQuestion.includes("probiotic") || lowercaseQuestion.includes("health")) {
      response = "Many customers report positive probiotic benefits and improved digestion. Approximately 65% of reviews mention health benefits, with several long-term customers noting consistent positive effects.";
    } else {
      response = "Based on the overall review analysis, this product maintains a strong positive reception with an average rating of 4.2 out of 5 stars. Key themes include consistent quality, authentic taste, and health benefits, with some suggestions for improvement in packaging and size options.";
    }

    setAnswer(response);
    setQuestion("");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
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

        {/* Review Summary Section */}
        <section>
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5" />
            Review Analysis
          </h3>
          <Card className="p-6 bg-blue-50">
            <p className="text-base leading-relaxed text-blue-900 whitespace-pre-line">
              {reviewSummary}
            </p>
          </Card>
        </section>

        {/* AI Q&A Section */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg">Ask AI About Reviews</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Textarea 
                placeholder="e.g., What do customers say about the taste?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[60px]"
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={!question.trim()}
                className="shrink-0"
              >
                Ask AI
              </Button>
            </div>
            
            {answer && (
              <Card className="p-4 bg-green-50 border-green-100">
                <p className="text-green-900">{answer}</p>
              </Card>
            )}
          </div>
        </section>

        {/* Featured Reviews Section */}
        <section>
          <h3 className="font-semibold mb-4 text-lg">Recent Reviews</h3>
          <div className="grid gap-4">
            {reviews.slice(0, 5).map((review, index) => (
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
      </div>
    </MainLayout>
  );
}
