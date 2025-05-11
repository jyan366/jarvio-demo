
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  prompt: string;
  blockOptions?: Record<string, string[]>;
}

// Helper to format the API response
function formatResponse(data: any) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('Missing OpenAI API key');
      return formatResponse({ success: false, error: 'OpenAI API key not configured' });
    }

    // Parse request body
    let body: RequestBody;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Invalid request body:', error);
      return formatResponse({ success: false, error: 'Invalid request body' });
    }

    if (!body.prompt) {
      console.error('No prompt provided');
      return formatResponse({ success: false, error: 'No prompt provided' });
    }

    console.log('Generating flow for prompt:', body.prompt);

    // Call OpenAI API to generate flow
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a flow generation assistant for Amazon sellers. 
            You create automation flows based on user descriptions.
            Return your response as a valid JSON object with the following structure:
            {
              "name": "Flow Name",
              "description": "Flow Description",
              "blocks": [
                { "type": "collect/think/act", "option": "Block Option Name", "name": "Descriptive Block Name" }
              ]
            }`
          },
          {
            role: 'user',
            content: `Create a flow for an Amazon seller based on this description: "${body.prompt}".
            The flow should include appropriate blocks from these available options:
            ${JSON.stringify(body.blockOptions || {})}.
            
            A flow typically has 3-5 blocks, usually starting with collect blocks, followed by think blocks, and ending with act blocks.
            
            Important: Provide descriptive names for each block that clearly explain what each step does.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return formatResponse({ 
        success: false, 
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const openAIResponse = await response.json();
    console.log('OpenAI response received');

    try {
      // Extract the JSON content from the response
      const content = openAIResponse.choices[0].message.content;
      console.log('Extracted content:', content);
      
      const generatedFlow = JSON.parse(content);
      
      // Validate the flow structure
      if (!generatedFlow.name || !generatedFlow.description || !Array.isArray(generatedFlow.blocks)) {
        throw new Error('Invalid flow structure from OpenAI');
      }
      
      console.log('Successfully parsed flow:', generatedFlow);
      return formatResponse({ success: true, generatedFlow });
      
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response content:', openAIResponse.choices[0].message.content);
      return formatResponse({ 
        success: false, 
        error: 'Failed to parse the AI-generated flow', 
        rawContent: openAIResponse.choices[0].message.content 
      });
    }
    
  } catch (error) {
    console.error('Error in flow generation:', error);
    return formatResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});
