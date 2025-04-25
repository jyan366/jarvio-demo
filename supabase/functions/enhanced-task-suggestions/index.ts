
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
    const { context } = await req.json();
    
    // Validate input to prevent errors
    if (!context || typeof context !== 'object') {
      throw new Error('Invalid context provided');
    }
    
    // Provide default values if API call fails
    const defaultSuggestion = {
      title: context.title || 'New Task',
      description: context.description || 'Task description',
      category: context.category || 'LISTINGS',
      priority: 'MEDIUM',
      subtasks: [
        {
          title: 'Review requirements',
          description: 'Analyze what needs to be done'
        },
        {
          title: 'Create action plan',
          description: 'Plan your approach'
        },
        {
          title: 'Implement solution',
          description: 'Complete the required work'
        }
      ]
    };
    
    try {
      // Call OpenAI to get enhanced suggestions
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
              content: `You are a task optimization assistant that helps create well-structured tasks with appropriate subtasks.
              Based on the task context, suggest:
              1. Refined task title and description
              2. Appropriate category and priority
              3. 3-5 specific subtasks that break down the work
              Format response as JSON with: title, description, category, priority, and subtasks array.`
            },
            {
              role: 'user',
              content: `Please suggest optimized task structure for: ${JSON.stringify(context)}`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      const aiResponse = await response.json();
      
      if (aiResponse.error || !aiResponse.choices || !aiResponse.choices[0]) {
        console.error('OpenAI API error:', aiResponse.error || 'No choices returned');
        return new Response(JSON.stringify(defaultSuggestion), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      let suggestions;
      try {
        suggestions = JSON.parse(aiResponse.choices[0].message.content);
      } catch (e) {
        console.error('Error parsing AI response:', e);
        suggestions = defaultSuggestion;
      }

      return new Response(JSON.stringify(suggestions), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAiError) {
      console.error('Error calling OpenAI:', openAiError);
      return new Response(JSON.stringify(defaultSuggestion), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in enhanced-task-suggestions:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate suggestions',
        title: 'New Task',
        description: 'Task description',
        category: 'LISTINGS',
        priority: 'MEDIUM',
        subtasks: [
          {
            title: 'Review requirements',
            description: 'Analyze what needs to be done'
          },
          {
            title: 'Create action plan',
            description: 'Plan your approach'
          },
          {
            title: 'Implement solution',
            description: 'Complete the required work'
          }
        ]
      }),
      { 
        status: 200, // Return success even if there was an error, but with default data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
