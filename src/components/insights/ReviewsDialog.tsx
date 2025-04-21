
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const reviews: Review[] = Array.from({ length: 3 }, (_, i) => ({
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 my-6">
          {/* Review Summary Section */}
          <section>
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              Review Analysis
            </h3>
            <Card className="p-4 bg-blue-50">
              <p className="text-base leading-relaxed text-blue-900">{reviewSummary}</p>
            </Card>
          </section>

          {/* AI Q&A Section */}
          <section>
            <h3 className="font-semibold mb-4 text-lg">Ask AI About Reviews</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Textarea 
                  placeholder="e.g., What do customers say about the taste?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[60px] text-base"
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
                  <p className="text-green-900 text-base">{answer}</p>
                </Card>
              )}
            </div>
          </section>

          {/* Featured Reviews Section */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
