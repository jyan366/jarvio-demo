
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
    const { title, description } = await req.json();

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
            content: `You are a helpful business operations assistant. Return a JSON array (no markdown or text before/after), 2-5 items, of clear actionable subtasks (steps) for the user's task. Each subtask must have:
- "title": max 12 words,  summarize the step.
- "description": 1-2 sentences, explain what should be done.
Reply strictly as a valid JSON array ONLY.`
          },
          {
            role: 'user',
            content: `Main task: ${title}. Details: ${description}.`
          }
        ]
      }),
    });

    const data = await response.json();
    let steps: any[] = [];
    // Expecting data.choices[0].message.content to be a JSON array of steps
    let content = data.choices?.[0]?.message?.content ?? "";
    try {
      const start = content.indexOf("[");
      const end = content.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        steps = JSON.parse(content.substring(start, end + 1));
      }
    } catch {}

    // Fallback if OpenAI fails to respond correctly
    if (!Array.isArray(steps) || steps.length === 0) {
      steps = [
        { title: "Break down the work", description: "Manually split your main goal into smaller actionable steps." }
      ];
    }
    // Generate IDs for the steps (frontend will replace as necessary)
    steps = steps.map((step: any) => ({
      id: crypto.randomUUID(),
      title: typeof step.title === "string" ? step.title : "Step",
      description: typeof step.description === "string" ? step.description : "",
    }));

    return new Response(JSON.stringify({ steps }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[generate-task-steps] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
