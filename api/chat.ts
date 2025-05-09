
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

IMPORTANT RULES:
1. Your response MUST be ONLY a valid JSON object with NO explanations or extra text.
2. JSON structure must follow this exact format:
{
  "name": "Short descriptive name for the flow",
  "description": "One sentence description of what this flow accomplishes",
  "blocks": [
    {"type": "collect|think|act", "option": "exact option name from available options"},
    ...more blocks
  ]
}

The flow typically has 3-5 blocks that should:
- Start with collect blocks (to gather information)
- Follow with think blocks (to process information)
- End with act blocks (to take actions based on processed information)

ONLY USE options from this exact list for each block type:
- collect: ["User Text", "Upload Sheet", "All Listing Info", "Get Keywords", "Estimate Sales", "Review Information", "Scrape Sheet", "Seller Account Feedback", "Email Parsing"]
- think: ["Basic AI Analysis", "Listing Analysis", "Insights Generation", "Review Analysis"]
- act: ["AI Summary", "Push to Amazon", "Send Email", "Human in the Loop"]

Do not add any extra text, comments, explanations, or formatting. Return ONLY the JSON object.
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
    try {
      // Attempt to parse the JSON to validate it
      const parsedJson = JSON.parse(generatedText);
      
      // Further validate the expected structure
      if (!parsedJson.name || !parsedJson.description || !Array.isArray(parsedJson.blocks)) {
        throw new Error("Invalid flow structure. Missing required properties.");
      }
      
      // If we get here, we have valid JSON with the expected structure
      return new Response(JSON.stringify({ 
        success: true,
        generatedFlow: parsedJson
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI:', parseError, 'Raw content:', generatedText);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid JSON received from AI", 
        rawResponse: generatedText 
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
