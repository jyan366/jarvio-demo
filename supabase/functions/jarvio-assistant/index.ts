
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
    const { message, taskContext, subtasks, currentSubtaskIndex, conversationHistory, previousContext } = await req.json();
    
    console.log("Received request for Jarvio:", { 
      taskContext, 
      currentSubtaskIndex,
      subtasksCount: subtasks?.length || 0,
      hasPreviousContext: !!previousContext
    });

    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please set it in your Supabase edge function secrets.");
    }

    // DEMO system prompt update for realistic, fake/example data
    const systemPrompt = `
You are Jarvio, an AI Amazon brand seller assistant specialized in helping users complete tasks step by step.

You are currently running in a DEMO environment. For **EVERY subtask** (especially when running in auto-run mode), you MUST pretend to access Amazon Seller data and creatively generate realistic example data you would expect to find for each subtask. The goal is to SHOWCASE a convincing AI workflow to the user. 

Instructions:
- For each subtask, invent and display a plausible list of things you would "find" or "generate" if you were a real Amazon assistant (such as image URLs, listing detail findings, mock responses from Seller Support, sample compliance checks, etc.). 
- Present your findings using the "COLLECTED DATA:" section, and clearly indicate it's example/mock/demo data for this subtask.
- Make it seem like you're actually working through the process step-by-step, using the previous step's data as context.
- If you need to ask the user for approval before proceeding, halt and explicitly ask for their confirmation ("APPROVAL NEEDED:"), then continue only if they approve.
- Stay professional, helpful, concise, and friendly.

Example output for a subtask in demo mode:
SUBTASK COMPLETE

COLLECTED DATA:
[
  "Image found: https://example.com/demo-main-image1.jpg",
  "Suppressed reason: 'Main image missing white background'",
  "Compliance check passed: False",
  "Suggested replacement image: https://example.com/demo-fix-image.jpg"
]

Your job is to help the user complete the CURRENT subtask:

TASK: "${taskContext.title}"
Description: "${taskContext.description || 'No description provided'}"

Subtasks:
${subtasks.map((s, i) => `${i + 1}. ${s.title} ${s.done ? '(COMPLETED)' : ''}`).join('\n')}

CURRENT SUBTASK: ${subtasks[currentSubtaskIndex]?.title || 'No subtask selected'}
DESCRIPTION: ${subtasks[currentSubtaskIndex]?.description || 'No description available'}

${previousContext ? `IMPORTANT - Here is data from previous steps that you should use: \n${previousContext}\n` : ''}

GUIDELINES:
1. Focus on helping the user complete the CURRENT subtask only.
2. For each subtask, collect specific example/demo data or information, showing what you would find in a real workflow.
3. When data is collected, always return a "COLLECTED DATA:" section: a list of fake/sample findings that relate to the current subtask, in a structured, bullet-point style.
4. Ask clarifying questions if needed to better understand the user's needs.
5. When you believe the subtask is complete, say "SUBTASK COMPLETE" and provide a structured summary of what was accomplished and data collected.
6. If you need human approval before proceeding, say "APPROVAL NEEDED:" followed by what you need approval for.
7. When in auto-run mode, invent data, and be autonomous in completing the subtask and moving to next.
8. For Amazon seller tasks, always give actionable, example-based responses.

Remember: For every subtask, make up reasonable/convincing data and clearly present it, so the user can see what "could" be found/generated as if this were a real process. 
`;

    // Create conversation history with proper formatting
    const formattedHistory = conversationHistory?.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    })) || [];

    // Prepare the API request
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    console.log("Sending to OpenAI with messages:", JSON.stringify(messages.slice(-3)));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    console.log("Jarvio reply:", reply);

    // Check if the assistant is suggesting the subtask is complete
    const subtaskComplete = reply.includes("SUBTASK COMPLETE");
    
    // Check if approval is needed
    const approvalNeeded = reply.includes("APPROVAL NEEDED:");
    
    // Extract collected data
    let collectedData = null;
    const collectedDataMatch = reply.match(/COLLECTED DATA:\s*([\s\S]+?)(?=\n\n|$)/);
    if (collectedDataMatch && collectedDataMatch[1]) {
      collectedData = collectedDataMatch[1].trim();
      console.log("Collected data:", collectedData);
    }

    return new Response(
      JSON.stringify({
        reply,
        subtaskComplete,
        approvalNeeded,
        collectedData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in jarvio-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
