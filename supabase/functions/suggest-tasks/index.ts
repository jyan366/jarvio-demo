
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { insight } = await req.json();

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
            content: `You are a business assistant that suggests actionable tasks based on business insights. 
            Generate 3 specific, practical tasks that would help address the insight.
            Each task should be clear and actionable.`
          },
          {
            role: 'user',
            content: `Generate 3 tasks for this business insight: "${insight.title}". Context: ${insight.description}. Category: ${insight.category}`
          }
        ],
      }),
    });

    const data = await response.json();
    const suggestedTasks = data.choices[0].message.content
      .split('\n')
      .filter(task => task.trim())
      .map((task, index) => ({
        id: crypto.randomUUID(),
        name: task.replace(/^\d+\.\s*/, '').trim(),
        completed: false
      }));

    return new Response(JSON.stringify({ tasks: suggestedTasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-tasks function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
