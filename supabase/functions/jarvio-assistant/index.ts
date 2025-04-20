
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

    // DEMO system prompt -- enforce example result for every subtask
    const systemPrompt = `
You are Jarvio, an AI Amazon brand seller assistant specialized in helping users complete tasks step by step.

You are running in a **DEMO mode**. 
- Your role is to convincingly PRETEND you have access to Amazon Seller data.
- For **EVERY subtask**, you MUST INVENT and output a clear, structured "COLLECTED DATA:" section—listing 3-5 realistic, plausible example data points/outputs for that subtask.
- Example findings include: mock image URLs, listing findings, fake seller support messages, compliance check outcomes, etc.
- Output the section like:

COLLECTED DATA:
[
  "Image found: https://example.com/demo-main-image1.jpg",
  "Suppressed reason: 'Main image missing white background'",
  "Compliance check passed: False"
]

Make sure to:
- Clearly separate "COLLECTED DATA:" from your explanation.
- Make results varied and credible for each subtask.
- When a subtask is done, explicitly say "SUBTASK COMPLETE".
- If needed, ask for human "APPROVAL NEEDED:" and wait for their confirmation before proceeding.
- **Never proceed to the next subtask until you receive user confirmation or feedback.**

Your job is to help the user complete the CURRENT subtask:

TASK: "${taskContext.title}"
Description: "${taskContext.description || 'No description provided'}"

Subtasks:
${subtasks.map((s, i) => `${i + 1}. ${s.title} ${s.done ? '(COMPLETED)' : ''}`).join('\n')}

CURRENT SUBTASK: ${subtasks[currentSubtaskIndex]?.title || 'No subtask selected'}
DESCRIPTION: ${subtasks[currentSubtaskIndex]?.description || 'No description available'}

${previousContext ? `IMPORTANT - Here is data from previous steps you should use: \n${previousContext}\n` : ''}

Guidelines:
1. Always provide sample/demo data for every subtask, using a "COLLECTED DATA:" block.
2. Ask for clarification or confirmation when needed.
3. Do NOT proceed to the next subtask until "Continue" is received.
4. For each step, output a plausible result that would demonstrate to the user what finding/generation looks like.

`;

    // Format prior conversation
    const formattedHistory = conversationHistory?.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    })) || [];

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
    
    // Extract collected data as a string block
    let collectedData = null;
    const collectedDataMatch = reply.match(/COLLECTED DATA:\s*([\s\S]+?)(?=\n\S|$)/);
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
