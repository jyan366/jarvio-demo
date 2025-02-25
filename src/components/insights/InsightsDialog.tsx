
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Lightbulb, Star, ThumbsUp, TrendingUp } from "lucide-react";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productNames: string[];
}

export function InsightsDialog({ open, onOpenChange, productNames }: InsightsDialogProps) {
  const insights = [
    {
      icon: Star,
      title: "Strong Product Satisfaction",
      description: "85% of customers mention high satisfaction with product quality and taste, particularly noting the authentic fermentation process."
    },
    {
      icon: ThumbsUp,
      title: "Health Benefits Appreciation",
      description: "73% of reviews specifically mention digestive health benefits, indicating this is a key value proposition for customers."
    },
    {
      icon: TrendingUp,
      title: "Repeat Purchase Behavior",
      description: "62% of reviewers indicate they are repeat customers, suggesting strong product loyalty and satisfaction."
    },
    {
      icon: Lightbulb,
      title: "Flavor Profile Feedback",
      description: "Many customers appreciate the balance of flavors, with 'not too spicy' and 'perfect tang' being common phrases."
    },
    {
      icon: AlertCircle,
      title: "Packaging Feedback",
      description: "Several customers suggested improvements to the jar seal design, though they remain satisfied with the product itself."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {productNames.length > 1 
              ? `Group Insights (${productNames.length} products)`
              : `Insights for ${productNames[0]}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg flex gap-4">
              <div className="flex-shrink-0">
                <insight.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
