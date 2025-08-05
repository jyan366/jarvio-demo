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
    const { prompt, message, type = 'flow' } = await req.json();
    const userPrompt = prompt || message;

    // Determine system prompt based on request type
    let systemPrompt;
    let responseFormat = { type: "json_object" };
    
    if (type === 'parameters') {
      systemPrompt = `
You are an AI assistant that helps configure block parameters for workflow automation.
Your task is to generate appropriate parameter values based on the user's description.

IMPORTANT RULES:
1. Your response MUST be ONLY a valid JSON object with parameter names as keys and appropriate values.
2. Base your parameter values on the user's prompt and the context of what they want to achieve.
3. Use realistic, practical values that make sense for Amazon seller workflows.
4. For text fields, provide clear, descriptive values.
5. For numbers, use reasonable limits and counts.
6. For boolean values, use true/false appropriately.

Return ONLY the JSON object with the parameters, no explanations or extra text.
`;
    } else {
      systemPrompt = `
You are an AI assistant specialized in helping Amazon sellers create workflow automation.
Your task is to generate a flow based on the user's description.

IMPORTANT RULES:
1. Your response MUST be ONLY a valid JSON object with NO explanations or extra text.
2. JSON structure must follow this exact format:
{
  "name": "Short descriptive name for the flow",
  "description": "One sentence description of what this flow accomplishes",
  "blocks": [
    {
      "type": "collect|think|act", 
      "option": "exact option name from available options",
      "name": "Clear descriptive name for what this specific block does"
    },
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

IMPORTANT: The "name" field for each block MUST be clear and descriptive of what that specific step does. For example:
- "Gather Product Listings" (not just "Collect Data")
- "Analyze Customer Reviews" (not just "Think Step")
- "Update Amazon Descriptions" (not just "Act Step")

Return ONLY the JSON object, no other text or formatting.
`;
    }

    console.log("Sending request to OpenAI with prompt:", userPrompt, "Type:", type);
    
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: responseFormat
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
    
    // Extract content from the response
    const rawContent = data.choices[0].message.content;
    console.log("Raw response from OpenAI:", rawContent);
    
    let responseData;
    
    if (type === 'parameters') {
      // Handle parameter population
      try {
        const parametersData = JSON.parse(rawContent);
        responseData = {
          success: true,
          response: JSON.stringify(parametersData)
        };
      } catch (parseError) {
        console.error('Error parsing parameters JSON from OpenAI:', parseError, 'Raw content:', rawContent);
        responseData = {
          success: false,
          error: 'Failed to parse AI-generated parameters'
        };
      }
    } else {
      // Handle flow generation
      let flowData;
      try {
        // Attempt to parse the JSON directly
        flowData = JSON.parse(rawContent);
        
        // Validate required fields
        if (!flowData.name || !flowData.description || !Array.isArray(flowData.blocks)) {
          throw new Error("Invalid flow structure. Missing required properties.");
        }
        
        // Validate blocks
        flowData.blocks.forEach(block => {
          if (!block.type || !["collect", "think", "act"].includes(block.type)) {
            throw new Error(`Invalid block type: ${block.type}`);
          }
          
          const validOptions = {
            collect: ["User Text", "Upload Sheet", "All Listing Info", "Get Keywords", "Estimate Sales", 
                     "Review Information", "Scrape Sheet", "Seller Account Feedback", "Email Parsing"],
            think: ["Basic AI Analysis", "Listing Analysis", "Insights Generation", "Review Analysis"],
            act: ["AI Summary", "Push to Amazon", "Send Email", "Human in the Loop"]
          };
          
          if (!block.option || !validOptions[block.type].includes(block.option)) {
            throw new Error(`Invalid option for ${block.type}: ${block.option}`);
          }
          
          // Ensure each block has a descriptive name
          if (!block.name) {
            // Generate a fallback descriptive name based on type and option
            const actionPrefix = {
              collect: "Gather",
              think: "Analyze",
              act: "Execute"
            };
            block.name = `${actionPrefix[block.type]} ${block.option}`;
          }
        });
        
      } catch (parseError) {
        console.error('Error parsing or validating JSON from OpenAI:', parseError, 'Raw content:', rawContent);
        
        // Create a default flow based on the user's prompt
        const flowName = userPrompt.split(' ').slice(0, 4).join(' ') + "...";
        flowData = {
          name: flowName,
          description: `This flow helps Amazon sellers to ${userPrompt}.`,
          blocks: [
            { type: "collect", option: "All Listing Info", name: "Collect Product Data" },
            { type: "think", option: "Basic AI Analysis", name: "Analyze Product Information" },
            { type: "act", option: "AI Summary", name: "Generate Optimization Report" }
          ]
        };
      }

      responseData = {
        success: true,
        generatedFlow: flowData
      };
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
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
