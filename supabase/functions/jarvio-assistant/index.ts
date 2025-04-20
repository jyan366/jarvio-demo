
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
    const { message, taskContext, subtasks, currentSubtaskIndex, conversationHistory } = await req.json();
    
    console.log("Received request for Jarvio:", { 
      taskContext, 
      currentSubtaskIndex,
      subtasksCount: subtasks?.length || 0 
    });

    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please set it in your Supabase edge function secrets.");
    }

    // Prepare the system prompt for Jarvio
    const systemPrompt = `You are Jarvio, an AI assistant specialized in helping users complete tasks step by step.
You are currently helping the user complete a task: "${taskContext.title}".
Description: "${taskContext.description || 'No description provided'}"

Your job is to help the user complete the current subtask they are working on. The subtasks are:
${subtasks.map((s, i) => `${i + 1}. ${s.title} ${s.done ? '(COMPLETED)' : ''}`).join('\n')}

CURRENT SUBTASK: ${subtasks[currentSubtaskIndex]?.title || 'No subtask selected'}
DESCRIPTION: ${subtasks[currentSubtaskIndex]?.description || 'No description available'}

GUIDELINES:
1. Focus on helping the user complete the CURRENT subtask only.
2. Provide specific, actionable guidance related to the current subtask.
3. Ask clarifying questions if needed to better understand the user's needs.
4. If the subtask is unclear, help the user break it down into smaller steps.
5. If you need information from the user to proceed, ask clearly for what you need.
6. When you believe the subtask is complete, say "SUBTASK COMPLETE" and summarize what was accomplished.
7. If you need human approval before proceeding, say "APPROVAL NEEDED:" followed by what you need approval for.

Your tone should be professional, helpful, and friendly. Consider yourself a collaborative partner.`;

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

    console.log("Sending to OpenAI with messages:", JSON.stringify(messages));

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

    return new Response(
      JSON.stringify({
        reply,
        subtaskComplete,
        approvalNeeded
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
