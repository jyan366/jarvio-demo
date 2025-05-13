import React from "react";
import { Card } from "@/components/ui/card";

interface AgentDataDetailsProps {
  subtaskIndex: number;
  subtaskTitle: string;
  isDone: boolean;
  subtaskData?: string | null;
}

export function AgentDataDetails({ 
  subtaskIndex,
  subtaskTitle,
  isDone,
  subtaskData
}: AgentDataDetailsProps) {
  // Use provided data if available, otherwise fall back to sample data
  const stepData = subtaskData || getStepResultDetails(subtaskIndex);
  
  // Clean up any raw markdown syntax that might be misinterpreted
  const cleanedStepData = stepData?.replace(/(?<![#])[#](?![#])\s*/g, '');
  
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
      
      {isDone && cleanedStepData && (
        <div>
          <h3 className="text-sm font-medium mb-2">Result Data</h3>
          <Card className="p-4 overflow-auto max-h-96">
            <div className="text-sm">
              <FormattedDataContent data={cleanedStepData} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Component to format data content dynamically
const FormattedDataContent = ({ data }: { data: string }) => {
  if (!data) return null;

  // Split the content by sections (# headers)
  const sections = data.split(/(?=# )/g).filter(Boolean);

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <FormattedSection key={i} content={section} />
      ))}
    </div>
  );
};

// Component to format a single section
const FormattedSection = ({ content }: { content: string }) => {
  // Extract section title and content
  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Remove the title from content and split by subsections
  const contentWithoutTitle = content.replace(/^# .+$/m, '').trim();
  const subsections = contentWithoutTitle.split(/(?=## )/g).filter(Boolean);

  return (
    <div className="space-y-4">
      {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
      
      {subsections.map((subsection, i) => (
        <FormattedSubsection key={i} content={subsection} />
      ))}
    </div>
  );
};

// Component to format a subsection
const FormattedSubsection = ({ content }: { content: string }) => {
  // Extract subsection title and content
  const titleMatch = content.match(/^## (.+)$/m);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Remove the title and format the content
  let contentWithoutTitle = content.replace(/^## .+$/m, '').trim();
  
  // Clean up any standalone # characters that might be left
  contentWithoutTitle = contentWithoutTitle.replace(/^\s*#\s*$/gm, '').replace(/\s+#\s*$/gm, '');
  
  // Check if content is a list (bullet points)
  const isList = contentWithoutTitle.match(/^- /m) !== null;
  
  // Check if content looks like a price
  const isPriceContent = title.toLowerCase().includes('price') && 
                         contentWithoutTitle.match(/\$[\d,.]+/) !== null;
  
  // Check if content might be keywords
  const isKeywords = title.toLowerCase().includes('keyword') || 
                     contentWithoutTitle.match(/^- [a-z ]+$/m) !== null;
                     
  // Parse content based on type
  return (
    <div className="mb-4">
      {title && (
        <h3 className="text-base font-medium text-gray-700 mb-2">{title}</h3>
      )}
      
      {/* Format based on content type */}
      {isList ? (
        <FormattedList content={contentWithoutTitle} 
                       isKeywords={isKeywords} />
      ) : isPriceContent ? (
        <FormattedPriceContent content={contentWithoutTitle} />
      ) : contentWithoutTitle.match(/^\d+\.\s/m) !== null ? (
        <FormattedNumberedList content={contentWithoutTitle} />
      ) : (
        <p className="text-gray-600">{contentWithoutTitle.replace(/#/g, '')}</p>
      )}
    </div>
  );
};

// Format bullet point lists
const FormattedList = ({ content, isKeywords }: { content: string, isKeywords?: boolean }) => {
  const items = content.split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace(/^- /, '').trim().replace(/#/g, ''));

  if (isKeywords) {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};

// Format numbered lists
const FormattedNumberedList = ({ content }: { content: string }) => {
  const items = content.split('\n')
    .filter(line => line.trim().match(/^\d+\.\s/))
    .map(line => {
      // Remove any stray hash characters
      const cleanLine = line.replace(/#/g, '');
      const parts = cleanLine.match(/^(\d+)\.\s(.*?)(?:\s-\s(.*))?$/);
      if (parts) {
        const [_, number, title, description] = parts;
        return { number, title, description };
      }
      return { title: cleanLine.replace(/^\d+\.\s/, '') };
    });

  return (
    <ol className="list-decimal pl-5 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="p-2 bg-gray-50 rounded-md">
          {item.title && item.description ? (
            <>
              <span className="font-semibold">{item.title}</span> - {item.description}
            </>
          ) : (
            item.title
          )}
        </li>
      ))}
    </ol>
  );
};

// Format price content
const FormattedPriceContent = ({ content }: { content: string }) => {
  // Extract price values
  const priceMatch = content.match(/\$[\d,.]+/);
  const price = priceMatch ? priceMatch[0] : '';
  
  // Clean the content to remove any stray # characters
  const cleanContent = content.replace(/#/g, '').trim();
  
  return (
    <div className="p-3 bg-blue-50 rounded-md">
      <p className="text-xl font-bold text-[#4457ff]">{price}</p>
      <p className="text-xs text-gray-500">{cleanContent}</p>
    </div>
  );
};

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
