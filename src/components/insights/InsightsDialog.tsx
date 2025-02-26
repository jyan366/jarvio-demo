import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Loader2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productNames: string[];
}

export function InsightsDialog({ open, onOpenChange, productNames }: InsightsDialogProps) {
  const [loading, setLoading] = useState(false);

  // Mock loading state when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const insights = {
    commonPositives: [
      "Strong probiotic benefits mentioned across all variants",
      "High satisfaction with authentic fermentation process",
      "Good value for money consistently noted"
    ],
    commonNegatives: [
      "Packaging seal quality concerns across variants",
      "Inconsistent spice levels reported",
      "Limited availability in some regions"
    ],
    trends: [
      {
        icon: ArrowUp,
        trend: "Rising",
        text: "Health-conscious customers increasingly choosing fermented products"
      },
      {
        icon: ArrowDown,
        trend: "Declining",
        text: "Complaints about packaging as improvements were made"
      },
      {
        icon: Sparkles,
        trend: "Emerging",
        text: "Interest in combining different variants in recipes"
      }
    ],
    comparison: {
      bestRated: "Beetroot (4.7/5)",
      mostReviewed: "Chili (293 reviews)",
      topCombo: "Beetroot + Chili",
      crossPurchase: "32% buy multiple variants"
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {productNames.length > 1 
              ? `Cross-Product Analysis (${productNames.length} products)`
              : `Product Analysis: ${productNames[0]}`}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Analyzing customer feedback...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 my-4 max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Common Positives */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <ThumbsUp className="w-5 h-5" />
                  <h3 className="font-medium">Common Positives</h3>
                </div>
                <ul className="space-y-2">
                  {insights.commonPositives.map((item, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 text-lg leading-none">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Negatives */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-red-600">
                  <ThumbsDown className="w-5 h-5" />
                  <h3 className="font-medium">Common Negatives</h3>
                </div>
                <ul className="space-y-2">
                  {insights.commonNegatives.map((item, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-600 text-lg leading-none">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trends */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <ArrowUpDown className="w-5 h-5" />
                <h3 className="font-medium">Key Trends</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <trend.icon className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                      <span className="text-sm font-medium">{trend.trend}</span>
                      <p className="text-sm text-muted-foreground">{trend.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-medium">Quick Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Best Rated:</span>
                  <p className="font-medium">{insights.comparison.bestRated}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Most Reviewed:</span>
                  <p className="font-medium">{insights.comparison.mostReviewed}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Popular Combination:</span>
                  <p className="font-medium">{insights.comparison.topCombo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cross-Purchase Rate:</span>
                  <p className="font-medium">{insights.comparison.crossPurchase}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
