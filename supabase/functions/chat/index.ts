
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const formatAssistantResponse = (text: string) => {
  // Remove double asterisks and replace with appropriate formatting
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Add line breaks before numbered points
  formattedText = formattedText.replace(/(\d+\.)/g, '\n$1');
  
  // Add bullet points for sub-items
  formattedText = formattedText.replace(/- /g, '\n• ');
  
  return formattedText;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an Amazon seller support assistant. Format your responses with:\n- Clear headings (no asterisks)\n- Bullet points for lists\n- Line breaks between sections\n- No markdown formatting' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const formattedText = formatAssistantResponse(data.choices[0].message.content);
    
    return new Response(JSON.stringify({ 
      text: formattedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
