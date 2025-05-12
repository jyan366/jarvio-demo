import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Update CORS headers to explicitly include localhost:8085
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8085',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Better handling of CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { 
      taskId, 
      subtaskId, 
      stepIndex,
      taskTitle, 
      taskDescription,
      subtaskTitle,
      subtaskDescription,
      flowType 
    } = await req.json();
    
    console.log("Received request for step data generation:", { 
      taskId, 
      subtaskId, 
      stepIndex,
      taskTitle, 
      flowType 
    });

    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please set it in your Supabase edge function secrets.");
    }

    // System prompt for generating step data
    const systemPrompt = `
You are an AI assistant that generates detailed, professional analysis for a specific step in a workflow.

You are currently working on:
- Task: "${taskTitle}"
- Task Description: "${taskDescription || 'No description provided'}"
- Step: "${subtaskTitle}" (step ${stepIndex + 1})
- Step Description: "${subtaskDescription || 'No description provided'}"
- Flow Type: "${flowType || 'generic'}"

Your job is to generate THREE outputs:
1. A concise summary of the analysis (1-3 sentences)
2. Detailed markdown-formatted findings/analysis for this step
3. A brief transition to the next step (1-2 sentences)

The detailed output should:
- Be professionally formatted in Markdown with proper headers, tables, and bullet points
- Include realistic, data-rich content with specific metrics, numbers, and statistics
- Include tables with product data, metrics, or comparisons when relevant
- Show actual dollar amounts, percentages, inventory counts, or other relevant figures
- Include specific, actionable recommendations based on the data
- Be specific to the step's purpose and the flow type
- Maintain a professional business tone

For the transition to the next step (which you should include at the very end of your response):
- Reference specific insights or data points from your analysis
- Make a clear connection between the findings from this step and why the next step is necessary
- Make it sound natural and conversational, like a knowledgeable colleague guiding someone
- Do not use generic phrases like "Now let's" or "Great job" at the beginning
- Start directly with substance, connecting the current findings to the next step's purpose
- Keep it under 40 words
- Be specific and contextual, showing how the steps build upon each other
- Use specific numbers or metrics from your analysis

IMPORTANT: Generate content that looks like REAL DATA, not placeholder text. Make up specific products, metrics, percentages, dollar amounts, and dates that would be found in a real business intelligence report.

FOR INVENTORY STEPS:
- Include product lists with SKUs, quantities, reorder points
- Show low stock alerts and actual stock levels
- Include inventory turnover metrics and days-in-inventory figures

FOR SALES ANALYSIS:
- Show revenue figures, growth rates, and unit sales
- Include month-by-month breakdowns with dollar amounts
- List top-performing products with actual percentages

FOR MARKET ANALYSIS:
- Include competitor data with specific metrics (prices, ratings)
- Show keyword data with search volumes
- Include market share percentages and growth trends

FOR FORECASTING:
- Show month-by-month predictions with actual numbers
- Include confidence levels as percentages
- Show growth projections with specific percentage increases

Do NOT include text indicating this is simulated data. Treat this as if you are presenting real findings.
`;

    // Get documents for additional context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Get documents metadata
    const { data: documents } = await supabaseClient
      .from('ai_documents')
      .select('*')
      .eq('category', flowType)
      .order('created_at', { ascending: false })
      .limit(2);

    // Get document contents
    const documentsContent = [];
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        const { data } = await supabaseClient
          .storage
          .from('documents')
          .download(doc.file_path);
        
        if (data) {
          const text = await data.text();
          documentsContent.push({
            title: doc.title,
            content: text
          });
        }
      }
    }

    // Add documents to system prompt
    const documentsContext = documentsContent.length > 0 
      ? `\nAvailable documents for reference:\n${documentsContent.map(doc => 
          `${doc.title}:\n${doc.content.substring(0, 1000)}...\n`).join('\n')}`
      : '';

    const systemPromptWithContext = `
      ${systemPrompt}
      ${documentsContext}
    `;

    // Generate step-specific examples based on flow type and step index
    let promptExample = "";
    if (subtaskTitle.toLowerCase().includes("inventory") || subtaskTitle.toLowerCase().includes("stock")) {
      promptExample = `
Example for Inventory Analysis:

# Current Inventory Levels

## Inventory Summary
- **Total SKUs**: 157
- **Total Units**: 12,834
- **Low Stock Items**: 23
- **Out of Stock Items**: 5

## Low Stock Alerts
- **Premium Chef Knife** (KN-CHEF-001): 8 units remaining (Reorder Point: 15)
- **Bamboo Cutting Board** (CB-BAM-002): 12 units remaining (Reorder Point: 20)
- **Ceramic Bakeware Set** (BW-CER-005): 5 units remaining (Reorder Point: 10)

## Inventory by Product Category
| Category | SKUs | Avg Stock | Turnover Rate | Days in Inventory |
|----------|------|-----------|---------------|-------------------|
| Cutlery | 28 | 85 | 4.2 | 28 |
| Cookware | 42 | 67 | 3.8 | 31 |
| Bakeware | 37 | 74 | 5.1 | 22 |
| Kitchen Tools | 50 | 96 | 4.5 | 25 |

## Recommendations
- Immediate restock needed for Premium Chef Knife, Bamboo Cutting Board, and Ceramic Bakeware Set
- Consider increasing reorder points for seasonal items by 25%
- Review lead times with suppliers for frequently low stock items
`;
    } else if (subtaskTitle.toLowerCase().includes("sales")) {
      promptExample = `
Example for Sales Analysis:

# Monthly Sales Analysis

## Sales Overview (Last 6 Months)
- **Total Revenue**: $427,892
- **Total Units Sold**: 8,745
- **Average Order Value**: $48.93
- **YoY Growth**: 18.7%
- **Best Performing Month**: March

## Monthly Breakdown
| Month | Revenue | Units Sold | Avg Order Value |
|-------|---------|------------|-----------------|
| January | $64,521 | 1,285 | $50.21 |
| February | $71,349 | 1,398 | $51.04 |
| March | $89,764 | 1,876 | $47.85 |
| April | $75,832 | 1,592 | $47.63 |
| May | $68,427 | 1,389 | $49.26 |
| June | $57,999 | 1,205 | $48.13 |

## Product Performance
- **Top Selling Product**: Premium Chef Knife Set (23.5% of total revenue)
- **Fastest Growing**: Silicone Kitchen Utensil Set (+42.3%)
- **Declining Products**: Ceramic Cookware (-7.2%)

## Recommendations
- Increase inventory for Premium Chef Knife Sets before holiday season
- Review pricing strategy for Ceramic Cookware line
- Implement bundle offers pairing top sellers with slower moving items
`;
    }

    const messages = [
      { role: "system", content: systemPromptWithContext + promptExample },
      { role: "user", content: `Generate step data for "${subtaskTitle}" in the "${taskTitle}" workflow. This is step ${stepIndex + 1} in the process. Make the data realistic with specific numbers, products, and metrics. Include tables and bullet points where appropriate.` }
    ];

    console.log("Sending to OpenAI...");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    // Split the content into summary and details
    const lines = reply.split('\n');
    let summary = "";
    let details = "";
    let nextStepIntro = "";
    
    // Try to find the transition message to the next step (typically at the end)
    // Look for transition patterns in the last few paragraphs
    const transitionPattern = /next step|moving (on|forward)|now (let's|we'll|we can)|with this (data|information|analysis)|having (analyzed|completed)|based on|given (the|these)|using (this|these|the)|looking at|considering|after|from|with|to (better|further|continue)/i;
    
    // First approach: check the last 3 paragraphs
    const lastParagraphs = reply.split('\n\n').slice(-3);
    
    for (const paragraph of lastParagraphs) {
      // Check if this is a transition paragraph (short and has transition-like wording)
      if (paragraph && 
          paragraph.length < 200 && 
          (transitionPattern.test(paragraph) || 
           paragraph.includes("next") || 
           paragraph.includes("step") || 
           paragraph.includes("analysis"))) {
        nextStepIntro = paragraph.trim();
        // Remove the transition from the main content
        const index = reply.lastIndexOf(paragraph);
        if (index !== -1) {
          // Remove the transition and any trailing newlines
          const updatedReply = reply.substring(0, index).trim();
          if (updatedReply) {
            details = updatedReply;
          } else {
            details = reply.replace(paragraph, '').trim();
          }
          break;
        }
      }
    }
    
    // If transition still not found, try looking at the last few lines
    if (!nextStepIntro) {
      // Second approach: check the last 5-10 lines
      const lastLines = lines.slice(-10);
      let transitionStartIndex = -1;
      
      for (let i = 0; i < lastLines.length; i++) {
        const line = lastLines[i].trim();
        if (line && 
            line.length > 15 && 
            line.length < 150 && 
            (transitionPattern.test(line) || 
             (line.includes("next") && line.includes("step")))) {
          transitionStartIndex = i;
          break;
        }
      }
      
      if (transitionStartIndex !== -1) {
        // Extract transition from the lines
        nextStepIntro = lastLines.slice(transitionStartIndex).join(' ').trim();
        
        // Remove from the full reply to create details
        const fullLineIndex = lines.length - (10 - transitionStartIndex);
        if (fullLineIndex > 0) {
          details = lines.slice(0, fullLineIndex).join('\n').trim();
        } else {
          details = reply;
        }
      } else {
        // No transition found, use the full content
        details = reply.trim();
      }
    }
    
    // Extract summary from the beginning of the content
    // Find where the detailed content begins (usually after blank lines or markdown headers)
    let detailsStartIndex = 0;
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 0 && !line.startsWith('#') && !line.startsWith('>')) {
        // This is likely the summary - take first 1-3 sentences
        const sentences = line.match(/[^.!?]+[.!?]+/g) || [];
        summary = sentences.slice(0, 3).join(' ').trim();
      }
      if (line.startsWith('#')) {
        detailsStartIndex = i;
        break;
      }
    }
    
    // Default summary if none found
    if (summary === "") {
      summary = `Analysis complete for ${subtaskTitle.toLowerCase()}.`;
    }
    
    // Default details if extraction failed
    if (!details || details === "") {
      details = lines.slice(detailsStartIndex).join('\n').trim();
      if (!details) {
        details = reply.trim();
      }
    }
    
    console.log("Generated summary:", summary);
    console.log("Generated details length:", details.length);
    console.log("Generated transition:", nextStepIntro || "None found");

    return new Response(
      JSON.stringify({
        summary,
        details,
        nextStepIntro
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in generate-step-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 