
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ReviewTopic {
  name: string;
  isPositive?: boolean;
}

export function ReviewSummarySection() {
  const topics: ReviewTopic[] = [
    { name: "Taste", isPositive: true },
    { name: "Quality", isPositive: true },
    { name: "Gut health", isPositive: true },
    { name: "Bacteria", isPositive: true },
    { name: "Value for money" },
    { name: "Kimchi quality" },
    { name: "Fermented content" },
    { name: "Leakage" },
  ];

  return (
    <Card className="p-6 mb-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Customers say
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Customers find the sauerkraut and kimchi tasty, with one noting it complements beef and stirfrys well. The product is made of good quality ingredients and is great for gut health, helping with digestion. While some customers consider it well worth the price, others find it fairly expensive. The fermented content receives mixed reviews, with some praising it as an organic unpasteurized product while others find the kimchi boring. Customers disagree on whether the jars leak.
          </p>
          <p className="text-sm text-gray-500 mt-2">AI-generated from the text of customer reviews</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Select to learn more</h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Button
                key={topic.name}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                {topic.isPositive && <Check className="mr-1 h-4 w-4 text-green-600" />}
                {topic.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
