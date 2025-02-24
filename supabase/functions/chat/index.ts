
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_GENERAL_ASSISTANT_ID');

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
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    // Create a thread
    console.log('Creating thread...');
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!threadResponse.ok) {
      const error = await threadResponse.text();
      console.error('Thread creation failed:', error);
      throw new Error('Failed to create thread');
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Add a message to the thread
    console.log('Adding message to thread...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content: prompt
      })
    });

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Message creation failed:', error);
      throw new Error('Failed to create message');
    }

    // Run the assistant
    console.log('Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('Run creation failed:', error);
      throw new Error('Failed to start run');
    }

    const run = await runResponse.json();
    console.log('Run created:', run.id);

    // Poll for the run completion
    let runStatus;
    let runResult;
    console.log('Polling for run completion...');
    
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!runStatus.ok) {
        const error = await runStatus.text();
        console.error('Run status check failed:', error);
        throw new Error('Failed to check run status');
      }

      runResult = await runStatus.json();
      console.log('Run status:', runResult.status);
      
    } while (runResult.status === 'queued' || runResult.status === 'in_progress');

    if (runResult.status !== 'completed') {
      console.error('Run failed:', runResult);
      throw new Error(`Run failed with status: ${runResult.status}`);
    }

    // Get the messages
    console.log('Fetching messages...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text();
      console.error('Messages fetch failed:', error);
      throw new Error('Failed to fetch messages');
    }

    const messages = await messagesResponse.json();
    console.log('Messages received:', messages);

    if (!messages.data || messages.data.length === 0) {
      throw new Error('No messages received from assistant');
    }

    const lastMessage = messages.data[0];
    if (!lastMessage.content || !lastMessage.content[0] || !lastMessage.content[0].text) {
      throw new Error('Invalid message format received from assistant');
    }

    const generatedText = lastMessage.content[0].text.value;
    console.log('Generated response:', generatedText);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
