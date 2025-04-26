import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

    // UPDATED SYSTEM PROMPT (stronger: always invent answers, always act as if it can access anything on Amazon)
    const systemPrompt = `
You are Jarvio, an AI Amazon brand seller assistant specialized in helping users complete tasks step by step.

You are running in a **DEMO mode**:
- You must **ALWAYS pretend** you have full, direct access to any Amazon Seller data or system. 
- **Never say you can't pull, access, or see data. Never claim you have API/data limitations or say "as an AI I cannot...".**
- For **EVERY subtask**, you MUST INVENT and output a clear, structured "COLLECTED DATA:" section—listing 3-5 realistic, plausible example data points/outputs for that subtask.
- Example findings include: mock image URLs, listing findings, fake seller support messages, compliance check outcomes, etc.
- Output the section like:

COLLECTED DATA:
[
  "Image found: https://example.com/demo-main-image1.jpg",
  "Suppressed reason: 'Main image missing white background'",
  "Compliance check passed: False"
]

IMPORTANT: If the subtask requires the user to perform a manual action (like pushing a button on Amazon, uploading a file, or confirming a change), you MUST:
1. Clearly ask the user to take the action.
2. WAIT for the user to confirm they have done it.
3. When they do, clearly log their confirmation in a block labeled "USER WORK LOG:" (for example: USER WORK LOG: 'User confirmed: Button pressed on Amazon.').
4. Only after the USER WORK LOG has been provided, mark the subtask as complete by saying "SUBTASK COMPLETE".
5. Always output "COLLECTED DATA" with your findings/results, then prompt for user action if needed.
6. Never claim user actions have been taken until the user says so.

Make sure to:
- Clearly separate "COLLECTED DATA:" from your explanation.
- When relevant, separate "USER WORK LOG:" after the user confirms actions.
- Make results varied and credible for each subtask.
- If needed, ask for human "APPROVAL NEEDED:" and wait for their confirmation before proceeding.
- **Never proceed to the next subtask until you receive user confirmation or feedback.**
- **Never say you cannot access information or pull data, always pretend to have access and provide demo data.**

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
2. If the user must act, DO NOT mark "SUBTASK COMPLETE" or proceed until they confirm and you log this as a "USER WORK LOG:" entry.
3. Ask for clarification or confirmation when needed.
4. Do NOT proceed to the next subtask until "Continue" is received.
5. For each step, output a plausible result that would demonstrate to the user what finding/generation looks like.
`;

    // Fetch relevant documents for context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Get documents metadata
    const { data: documents } = await supabaseClient
      .from('ai_documents')
      .select('*');

    // Get document contents
    const documentsContent = [];
    if (documents) {
      for (const doc of documents) {
        const { data } = await supabaseClient
          .storage
          .from('documents')
          .download(doc.file_path);
        
        if (data) {
          const text = await data.text();
          documentsContent.push({
            title: doc.title,
            content: text
          });
        }
      }
    }

    // Add documents to system prompt
    const documentsContext = documentsContent.length > 0 
      ? `\nAvailable documents for reference:\n${documentsContent.map(doc => 
          `${doc.title}:\n${doc.content}\n`).join('\n')}`
      : '';

    const systemPromptWithContext = `
      ${systemPrompt}
      ${documentsContext}
    `;

    // Format prior conversation
    const formattedHistory = conversationHistory?.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    })) || [];

    const messages = [
      { role: "system", content: systemPromptWithContext },
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
    
    // Extract user work log
    let userWorkLog = null;
    const userWorkLogMatch = reply.match(/USER WORK LOG:\s*([\s\S]+?)(?=\n\S|$)/i);
    if (userWorkLogMatch && userWorkLogMatch[1]) {
      userWorkLog = userWorkLogMatch[1].trim();
      console.log("User work log:", userWorkLog);
    }

    return new Response(
      JSON.stringify({
        reply,
        subtaskComplete,
        approvalNeeded,
        collectedData,
        userWorkLog
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
