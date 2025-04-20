
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

    // Prepare the system prompt for Jarvio
    const systemPrompt = `You are Jarvio, an AI Amazon brand seller assistant specialized in helping users complete tasks step by step.
You are currently helping the user complete a task: "${taskContext.title}".
Description: "${taskContext.description || 'No description provided'}"

Your job is to help the user complete the current subtask they are working on. The subtasks are:
${subtasks.map((s, i) => `${i + 1}. ${s.title} ${s.done ? '(COMPLETED)' : ''}`).join('\n')}

CURRENT SUBTASK: ${subtasks[currentSubtaskIndex]?.title || 'No subtask selected'}
DESCRIPTION: ${subtasks[currentSubtaskIndex]?.description || 'No description available'}

${previousContext ? `IMPORTANT - Here is data from previous steps that you should use: \n${previousContext}\n` : ''}

GUIDELINES:
1. Focus on helping the user complete the CURRENT subtask only.
2. For each subtask, collect specific data or information needed to complete it.
3. When data is collected, clearly indicate what information was gathered that will be useful for subsequent steps.
4. Ask clarifying questions if needed to better understand the user's needs.
5. When you believe the subtask is complete, say "SUBTASK COMPLETE" and provide a structured summary of what was accomplished and data collected.
6. If you need human approval before proceeding, say "APPROVAL NEEDED:" followed by what you need approval for.
7. When in auto-run mode, be more autonomous and proactive in completing the subtask.
8. For Amazon seller tasks, provide specific and actionable advice based on best practices.

For each subtask you complete, provide a clear, concise data summary that can be used in subsequent steps. This data should be clearly labeled with "COLLECTED DATA:" followed by the information in a structured format.

Your tone should be professional, helpful, and friendly. Consider yourself a collaborative partner for Amazon sellers.`;

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
