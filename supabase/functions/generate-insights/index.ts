
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blockId, flowId, taskId, context } = await req.json();
    
    console.log('Generating insights for:', { blockId, flowId, taskId });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Analyze the context and previous block results to generate insights
    const contextSummary = Array.isArray(context) && context.length > 0 
      ? context.map(result => JSON.stringify(result)).join('\n') 
      : 'No previous context available';
    
    const prompt = `
    Based on the following workflow execution context, generate actionable business insights:
    
    Context: ${contextSummary}
    
    Please generate 1-3 specific, actionable insights that could help improve business operations. 
    Each insight should include:
    - A clear title (max 60 characters)
    - A brief summary explaining the insight and recommended action
    - A category (Sales, Inventory, Listings, Customers, Competitors, or Advertising)
    - A severity level (high, medium, low, or info)
    
    Format your response as a JSON array of insights with this structure:
    [{
      "title": "insight title",
      "summary": "detailed summary with actionable recommendations",
      "category": "category name",
      "severity": "severity level"
    }]
    `;
    
    // Call OpenAI to generate insights
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a business intelligence assistant that generates actionable insights from workflow data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });
    
    if (!openAIResponse.ok) {
      throw new Error('Failed to generate insights from OpenAI');
    }
    
    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0].message.content;
    
    // Parse the generated insights
    let insights;
    try {
      insights = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      // Fallback to a single generic insight
      insights = [{
        title: "Workflow Analysis Complete",
        summary: "The workflow has been executed successfully. Review the results and consider optimizing based on the outcomes.",
        category: "Listings",
        severity: "info"
      }];
    }
    
    console.log('Generated insights:', insights);
    
    // Return the generated insights
    return new Response(JSON.stringify({
      success: true,
      insights: insights,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
