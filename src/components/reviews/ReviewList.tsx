
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  rating: number;
  text: string;
  date: string;
  author: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
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
  );
}
