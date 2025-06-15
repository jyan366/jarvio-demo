
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to clean JSON response from OpenAI
function cleanJsonResponse(content: string): string {
  // Remove any text before the first [ and after the last ]
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");
  
  if (start === -1 || end === -1) {
    throw new Error("No valid JSON array found in response");
  }
  
  let jsonStr = content.substring(start, end + 1);
  
  // Replace smart quotes and other problematic characters
  jsonStr = jsonStr
    .replace(/[\u201C\u201D]/g, '"')  // Replace smart double quotes
    .replace(/[\u2018\u2019]/g, "'")  // Replace smart single quotes
    .replace(/[\u2013\u2014]/g, "-")  // Replace em/en dashes
    .replace(/[\u2026]/g, "...")     // Replace ellipsis
    .replace(/[\u00A0]/g, " ")       // Replace non-breaking space
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .replace(/\n\s*\n/g, "\n")       // Clean up multiple newlines
    .trim();
  
  return jsonStr;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();
    
    console.log(`Generating steps for: ${title}`);

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
- "title": max 12 words, summarize the step.
- "description": 1-2 sentences, explain what should be done.
Reply strictly as a valid JSON array ONLY. Use standard double quotes, no smart quotes.`
          },
          {
            role: 'user',
            content: `Main task: ${title}. Details: ${description}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let steps: any[] = [];
    const content = data.choices?.[0]?.message?.content ?? "";
    
    console.log("Raw OpenAI Response:", content);
    
    try {
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      
      const cleanedContent = cleanJsonResponse(content);
      console.log("Cleaned content:", cleanedContent);
      
      steps = JSON.parse(cleanedContent);
      
      // Validate the parsed steps
      if (!Array.isArray(steps)) {
        throw new Error("Response is not an array");
      }
      
      // Validate each step has required fields
      steps = steps.filter(step => 
        step && 
        typeof step === 'object' && 
        typeof step.title === 'string' && 
        step.title.trim().length > 0
      );
      
      if (steps.length === 0) {
        throw new Error("No valid steps found in response");
      }
      
      console.log("Successfully parsed steps:", steps.length);
      
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Content that failed to parse:", content);
      
      // Fallback to default steps
      steps = [
        { 
          title: "Break down the work", 
          description: "Manually split your main goal into smaller actionable steps." 
        },
        { 
          title: "Research requirements", 
          description: "Gather all necessary information and resources needed to complete the task." 
        },
        { 
          title: "Execute the plan", 
          description: "Follow through with the planned steps to achieve your goal." 
        }
      ];
    }

    // Ensure all steps have proper structure and generate IDs
    steps = steps.map((step: any, index: number) => ({
      id: crypto.randomUUID(),
      title: typeof step.title === "string" ? step.title.trim() : `Step ${index + 1}`,
      description: typeof step.description === "string" ? step.description.trim() : "Complete this step.",
    }));

    console.log("Final steps to return:", JSON.stringify(steps, null, 2));

    return new Response(JSON.stringify({ steps }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('[generate-task-steps] Error:', error);
    
    // Return fallback steps even on error
    const fallbackSteps = [
      {
        id: crypto.randomUUID(),
        title: "Plan the approach",
        description: "Define the strategy and break down the main task into manageable parts."
      },
      {
        id: crypto.randomUUID(),
        title: "Execute the work",
        description: "Complete the planned tasks step by step."
      },
      {
        id: crypto.randomUUID(),
        title: "Review and finalize",
        description: "Check the work and make any necessary adjustments."
      }
    ];
    
    return new Response(JSON.stringify({ steps: fallbackSteps }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
