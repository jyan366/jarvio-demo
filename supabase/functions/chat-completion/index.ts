import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, max_tokens = 150, temperature = 0.7, model = 'gpt-4o-mini' } = await req.json();
    
    console.log("Received chat completion request:", { prompt: prompt.substring(0, 100) + "..." });

    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please set it in your Supabase edge function secrets.");
    }

    // Send request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant that specializes in data analytics and business intelligence. Generate realistic-looking business data when responding, including specific metrics, product information, and actionable insights. Your outputs should look like they're from a real business dashboard or analytics report, with actual numbers and metrics rather than placeholder text. Keep your responses concise and data-focused." },
          { role: "user", content: prompt }
        ],
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log("Chat completion response:", text.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({ text }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in chat-completion function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 