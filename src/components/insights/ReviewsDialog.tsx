
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, Star } from "lucide-react";

interface Review {
  rating: number;
  text: string;
  date: string;
  author: string;
}

interface ReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function ReviewsDialog({ open, onOpenChange, productName }: ReviewsDialogProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  // Mock reviews data
  const reviews: Review[] = Array.from({ length: 5 }, (_, i) => ({
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    text: "This product is amazing! The fermentation process creates such a unique and delicious flavor. The probiotics have really helped with my digestion. I've been buying this regularly and love how it complements my meals.",
    date: "2024-02-15",
    author: `Customer ${i + 1}`
  }));

  const reviewSummary = `Based on the analysis of recent reviews, customers consistently praise the product's unique fermentation process and probiotic benefits. 85% of reviewers mention improved digestion, while 72% specifically commend the authentic taste. The product receives particularly high marks for quality consistency and packaging. Some suggestions for improvement include offering larger size options and providing more detailed serving suggestions.`;

  const handleAskQuestion = () => {
    // Mock AI response
    setAnswer("Based on the reviews, customers particularly appreciate the probiotic benefits and unique flavor profile of this product. The fermentation process is frequently mentioned as a key factor in the product's quality. Many customers report regular purchases, indicating strong product loyalty.");
    setQuestion("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{productName} - Customer Reviews</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* Summary Card */}
          <Card className="p-4 bg-blue-50/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Review Summary
            </h3>
            <p className="text-sm text-muted-foreground">{reviewSummary}</p>
          </Card>

          {/* AI Q&A Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Ask about these reviews</h3>
            <div className="flex gap-2">
              <Textarea 
                placeholder="e.g., What are the main things customers love about this product?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px]"
              />
              <Button 
                className="self-start"
                onClick={handleAskQuestion}
                disabled={!question.trim()}
              >
                Ask
              </Button>
            </div>
            
            {answer && (
              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="text-blue-800">{answer}</p>
              </div>
            )}
          </div>

          {/* Featured Reviews */}
          <div className="space-y-2">
            <h3 className="font-medium">Featured Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <Card key={index} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">by {review.author}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm">{review.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
