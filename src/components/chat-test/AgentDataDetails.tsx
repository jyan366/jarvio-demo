
import React from "react";
import { Card } from "@/components/ui/card";

interface AgentDataDetailsProps {
  subtaskIndex: number;
  subtaskTitle: string;
  isDone: boolean;
}

export function AgentDataDetails({ 
  subtaskIndex,
  subtaskTitle,
  isDone
}: AgentDataDetailsProps) {
  const stepData = getStepResultDetails(subtaskIndex);
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Title:</span>
            <p className="text-sm font-medium">{subtaskTitle}</p>
          </div>
          
          <div>
            <span className="text-xs text-muted-foreground">Status:</span>
            <p className="text-sm">
              {isDone ? 
                <span className="text-green-600 font-medium">Complete</span> : 
                <span className="text-amber-600 font-medium">In Progress</span>
              }
            </p>
          </div>
          
          {isDone && (
            <div>
              <span className="text-xs text-muted-foreground">Completed at:</span>
              <p className="text-sm">{new Date().toLocaleString()}</p>
            </div>
          )}
        </div>
      </Card>
      
      {isDone && stepData && (
        <div>
          <h3 className="text-sm font-medium mb-2">Result Data</h3>
          <Card className="p-4 overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap">{stepData}</pre>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper function to get detailed results for each step
function getStepResultDetails(stepIndex: number): string | null {
  const details = [
    `# Market Competition Analysis

## Main Competitors
- GoodKnives (4.6★) - $45.99
- KitchenElite (4.4★) - $39.99
- ChefsPro (4.7★) - $49.99

## Average Price Point
$42.99

## Key Features Highlighted
- Stainless steel construction
- Dishwasher safe components
- Ergonomic handles
- Full tang design
- Block storage included

## Common Keywords
- professional knife set
- chef knife set
- kitchen knife set
- stainless steel knives
- dishwasher safe knives`,

    `# Optimized Listing Content

## Title
"Professional 15-Piece Kitchen Knife Set with Block | Premium Stainless Steel Chef Knives with Ergonomic Handles"

## Bullet Points
1. COMPLETE PREMIUM SET - 15-piece professional-grade knife set including chef knife, bread knife, carving knife, utility knife, paring knife, steak knives, and kitchen scissors
2. SUPERIOR MATERIALS - Forged from high-carbon stainless steel ensuring lasting sharpness and durability
3. COMFORT GRIP HANDLES - Ergonomically designed handles provide perfect balance and control while cutting
4. ELEGANT STORAGE - Included wooden block keeps your knives organized, protected and displays beautifully on your countertop
5. DISHWASHER SAFE - Easy to clean and maintain; though hand washing recommended to maintain edge retention`,

    `# Pricing Strategy

## Launch Price
$39.99 (below market average to gain initial sales and reviews)

## Post-Launch Price
$47.99 (after 30 days and 25+ reviews)

## Coupon Strategy
- 15% off coupon for first 2 weeks
- Buy One Get One 50% off for complementary products

## Bundle Option
Consider creating a bundle with your cutting board at $54.99

## Competitor Pricing Analysis
Your price positioning is slightly below the market average during launch to gain market share, then establishing premium positioning once reviews accumulate.`,

    `# PPC Advertising Strategy

## Campaign Structure
- Day 1-7: Discovery campaign with $25/day budget targeting broad keywords
- Day 8-21: Auto campaign at $40/day + manual campaign for top 20 converting keywords
- Day 22+: Consolidate and optimize best performers

## Bid Strategy
- Suggested Bid Range: $0.65-$1.20
- Target ACOS: 35% during launch, 25% post-stabilization

## Primary Keywords
- professional knife set
- stainless steel knives
- chef knife set
- kitchen knife block set
- dishwasher safe knife set`,

    `# Launch Schedule

## Week 1: Soft Launch Phase
- Friends & family purchases + reviews
- Initial PPC campaigns
- Early bird discount distribution

## Week 2: Public Launch Phase
- Social media announcement
- Influencer outreach (3-5 micro-influencers identified)
- Email blast to existing customers

## Week 3: Momentum Building
- Begin email marketing campaign
- Increase PPC budget by 30%
- Launch Amazon Posts

## Week 4-5: Optimization Phase
- Review performance metrics
- Adjust pricing if needed
- Scale successful ad campaigns

## Recommended Launch Date
Tuesday, June 4th (optimal day based on category traffic)`
  ];
  
  return details[stepIndex] || null;
}
