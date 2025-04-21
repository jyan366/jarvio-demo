
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, taskId, subtaskId, data } = await req.json();
    console.log("Request received:", { action, taskId, subtaskId, data });

    let result;

    switch (action) {
      case 'toggleSubtask':
        // Toggle subtask completion status
        const { completed } = data;
        const { data: updatedSubtask, error: toggleError } = await supabase
          .from('subtasks')
          .update({ completed })
          .eq('id', subtaskId)
          .select()
          .single();
        
        if (toggleError) throw toggleError;
        result = { success: true, data: updatedSubtask };
        break;

      case 'updateSubtask':
        // Update subtask details
        const { field, value } = data;
        const { data: updatedField, error: updateError } = await supabase
          .from('subtasks')
          .update({ [field]: value })
          .eq('id', subtaskId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        result = { success: true, data: updatedField };
        break;

      case 'addComment':
        // Store comment data (requires adding a comments table)
        const { text, userId, subtaskId: commentSubtaskId } = data;
        
        // Using the task data JSON field to store comments since we don't have a separate comments table yet
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('data')
          .eq('id', taskId)
          .single();
          
        if (taskError) throw taskError;
        
        // Initialize or update comments in the data JSON field
        const existingData = task.data || {};
        const comments = existingData.comments || [];
        const newComment = {
          id: crypto.randomUUID(),
          user: userId || 'user',
          text,
          subtaskId: commentSubtaskId,
          createdAt: new Date().toISOString(),
        };
        
        comments.push(newComment);
        
        const { error: commentSaveError } = await supabase
          .from('tasks')
          .update({ 
            data: { 
              ...existingData,
              comments 
            }
          })
          .eq('id', taskId);
          
        if (commentSaveError) throw commentSaveError;
        result = { success: true, comment: newComment };
        break;
        
      case 'saveSubtaskResult':
        // Save AI-generated result in subtask
        const { result: subtaskResult } = data;
        
        // First get the existing data
        const { data: existingSubtaskData, error: getError } = await supabase
          .from('subtasks')
          .select('data')
          .eq('id', subtaskId)
          .single();
          
        // Merge existing data with new result 
        const mergedData = {
          ...(existingSubtaskData?.data || {}),
          workLogResult: subtaskResult,
          lastUpdated: new Date().toISOString()
        };
        
        const { error: resultError } = await supabase
          .from('subtasks')
          .update({ 
            data: mergedData
          })
          .eq('id', subtaskId);
          
        if (resultError) throw resultError;
        result = { success: true, data: mergedData };
        
        console.log(`Successfully saved work log for subtask ${subtaskId}`);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in update-task-state:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
