
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

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
  const reviews: Review[] = Array.from({ length: 20 }, (_, i) => ({
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    text: "This product is amazing! The fermentation process creates such a unique and delicious flavor. The probiotics have really helped with my digestion. I've been buying this regularly and love how it complements my meals.",
    date: "2024-02-15",
    author: `Customer ${i + 1}`
  }));

  const handleAskQuestion = () => {
    // Mock AI response
    setAnswer("Based on the reviews, customers particularly appreciate the probiotic benefits and unique flavor profile of this product. The fermentation process is frequently mentioned as a key factor in the product's quality. Many customers report regular purchases, indicating strong product loyalty.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{productName} - Customer Reviews</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div className="p-4 bg-muted rounded-lg space-y-4">
            <h3 className="font-medium">Ask about these reviews</h3>
            <Textarea 
              placeholder="e.g., What are the main things customers love about this product?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px]"
            />
            <Button onClick={handleAskQuestion}>Ask Question</Button>
            
            {answer && (
              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="text-blue-800">{answer}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">by {review.author}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
