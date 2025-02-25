
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Lightbulb, Star, ThumbsUp, TrendingUp, ArrowUpDown, UserCheck, PieChart, Heart, HelpCircle } from "lucide-react";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productNames: string[];
}

export function InsightsDialog({ open, onOpenChange, productNames }: InsightsDialogProps) {
  // Single product insights
  const singleProductInsights = [
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

  // Cross-product comparison insights
  const groupInsights = [
    {
      icon: ArrowUpDown,
      title: "Product Performance Comparison",
      description: `Comparing ${productNames.length} products: The Beetroot variant leads in overall satisfaction (4.7/5), while the Chilli variant shows highest engagement with 293 reviews.`
    },
    {
      icon: UserCheck,
      title: "Cross-Product Customer Behavior",
      description: "32% of customers have purchased multiple variants, with Beetroot + Chilli being the most common combination."
    },
    {
      icon: PieChart,
      title: "Variant Preferences",
      description: "Traditional flavors (Beetroot, Chilli) receive 40% more positive sentiment than experimental ones (Carrot & Fennel)."
    },
    {
      icon: Heart,
      title: "Shared Positive Attributes",
      description: "Across all variants, 'probiotic benefits' and 'authentic taste' are consistently mentioned as key selling points."
    },
    {
      icon: HelpCircle,
      title: "Common Improvement Areas",
      description: "Packaging durability and seal quality are mentioned as areas for improvement across all product variants."
    }
  ];

  const insights = productNames.length > 1 ? groupInsights : singleProductInsights;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {productNames.length > 1 
              ? `Cross-Product Insights (${productNames.length} products)`
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

        {productNames.length > 1 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Selected Products:</h4>
            <ul className="list-disc list-inside space-y-1">
              {productNames.map((name, index) => (
                <li key={index} className="text-sm text-blue-700">{name}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
