
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { prompt } = await req.json();

    // AI system instructions for generating flow blocks
    const systemPrompt = `
You are an AI assistant specialized in helping Amazon sellers create workflow automation.
Your task is to generate a flow based on the user's description.

IMPORTANT: You must ALWAYS respond with valid JSON only. Do not include any explanations, backticks, or markdown formatting.
The JSON should have this structure:
{
  "name": "Short descriptive name for the flow",
  "description": "One sentence description of what this flow accomplishes",
  "blocks": [
    {"type": "collect|think|act", "option": "exact option name from available options"},
    ...more blocks
  ]
}

Keep in mind:
1. Flows typically have 3-5 blocks
2. Flows usually start with collect blocks, followed by think blocks, and end with act blocks
3. ONLY use the exact option names provided to you
4. If a capability seems missing, use "Human in the Loop" for act blocks or "User Text" for collect blocks
    `;

    console.log("Sending request to OpenAI with prompt:", prompt);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // Force JSON response format
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected OpenAI response format:", JSON.stringify(data));
      throw new Error("Invalid response format from OpenAI API");
    }
    
    const generatedText = data.choices[0].message.content;
    console.log("Raw response from OpenAI:", generatedText);
    
    // Validate that the response is proper JSON before sending it back
    let parsedJson;
    try {
      parsedJson = JSON.parse(generatedText);
      
      // Further validate the expected structure
      if (!parsedJson.name || !parsedJson.description || !Array.isArray(parsedJson.blocks)) {
        throw new Error("Invalid flow structure. Missing required properties.");
      }
      
      return new Response(JSON.stringify({ generatedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI:', parseError, 'Raw content:', generatedText);
      return new Response(JSON.stringify({ 
        error: "Invalid JSON received from AI", 
        rawResponse: generatedText 
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
