
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

            Generate 3 specific and practical tasks or subtasks (JSON array).
            For each, output:
            - "title": a brief title for the subtask (max 12 words)
            - "description": a concise 1-2 sentence description explaining what should be done.

            Only reply with a valid JSON array with keys: "title" & "description".`
          },
          {
            role: 'user',
            content: `Suggest 3 subtasks for this insight: "${insight.title}". Context: ${insight.description}. Category: ${insight.category}`
          }
        ],
      }),
    });

    const data = await response.json();

    // Try to robustly parse a JSON array in the large string
    let jsonStart = -1, jsonEnd = -1, content = data.choices[0]?.message?.content || "";
    jsonStart = content.indexOf("[");
    jsonEnd = content.lastIndexOf("]");
    let array: any[] = [];
    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        // Parse as array
        array = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
      } catch (e) {
        // fallback: single object or failed parsing, ignore for now
      }
    }

    // fallback: if parsing failed, create generic structure
    if (!Array.isArray(array) || array.length === 0) {
      array = [{
        title: "Review Insight Details",
        description: "Read through the insight to understand the issue and context."
      }, {
        title: "Plan Action",
        description: "Create a step-by-step strategy to address the problem."
      }, {
        title: "Monitor Progress",
        description: "Track implementation and verify if the issue is resolved."
      }];
    }

    // Add id and completed
    const suggestedTasks = array.map((task) => ({
      id: crypto.randomUUID(),
      title: typeof task.title === "string" ? task.title : "Untitled Task",
      description: typeof task.description === "string" ? task.description : "",
      completed: false,
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

