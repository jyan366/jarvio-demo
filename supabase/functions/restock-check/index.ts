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

    // First, check if the Best Sellers Restock process already exists
    const { data: existingProcess } = await supabase
      .from('tasks')
      .select('*')
      .eq('title', 'Monthly Best Sellers Restock Check')
      .eq('category', 'PROCESS')
      .single();

    // If the process doesn't exist, create it
    if (!existingProcess) {
      const processData = {
        name: 'Monthly Best Sellers Restock Check',
        steps: [
          { id: "check-stock-levels", content: "Check current stock levels of best sellers", completed: false },
          { id: "analyze-sales", content: "Analyze sales velocity for the past 30 days", completed: false },
          { id: "create-restock-plan", content: "Create restock plan based on sales analysis", completed: false },
          { id: "contact-suppliers", content: "Contact suppliers with purchase orders", completed: false },
          { id: "update-inventory", content: "Update inventory system with new orders", completed: false }
        ],
        schedule: 'monthly',
        autoRun: true,
        products: [
          {
            name: "Beetroot Kimchi 1kg Jar",
            sku: "BK1000",
            threshold: 20,
            supplier: "Organic Farms Ltd"
          }
        ]
      };

      await supabase
        .from('tasks')
        .insert({
          title: 'Monthly Best Sellers Restock Check',
          description: 'Inventory restock process with 5 steps - runs monthly',
          category: 'PROCESS',
          data: processData,
          user_id: "00000000-0000-0000-0000-000000000000" // Demo user ID
        });
    }

    // Get all restock processes that are set to auto-run
    const { data: processes, error: processError } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', 'PROCESS')
      .eq('status', 'Not Started');
      
    if (processError) {
      throw processError;
    }

    const restockProcesses = processes?.filter(process => {
      const processData = process.data as any;
      return processData?.autoRun === true && processData?.schedule === 'monthly';
    });

    if (!restockProcesses || restockProcesses.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No autorun restock processes found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Process each restock task
    const results = await Promise.all(restockProcesses.map(async (process) => {
      try {
        // Create a new task based on the process template
        const processData = process.data as any;
        
        // Create subtasks based on process steps
        const subtasks = processData.steps.map((step: any) => ({
          task_id: null, // Will be updated after task creation
          title: step.content,
          completed: false,
          description: `Automated step from monthly restock process: ${process.title}`
        }));
        
        // Create the main task
        const { data: newTask, error: taskError } = await supabase
          .from('tasks')
          .insert({
            title: `${process.title} - ${new Date().toLocaleDateString()}`,
            description: `Automatically generated from restock process template. Check inventory levels and restock as needed.`,
            status: 'Not Started',
            priority: 'HIGH',
            category: 'INVENTORY',
            source: 'process',
            data: {
              ...processData,
              generatedAt: new Date().toISOString(),
              parentProcessId: process.id
            },
            user_id: "00000000-0000-0000-0000-000000000000" // Demo user ID
          })
          .select()
          .single();
          
        if (taskError) {
          throw taskError;
        }
        
        // Now add the subtasks with the task ID
        if (subtasks.length > 0) {
          const withTaskId = subtasks.map(st => ({ ...st, task_id: newTask.id }));
          const { error: subtaskError } = await supabase
            .from('subtasks')
            .insert(withTaskId);
            
          if (subtaskError) {
            throw subtaskError;
          }
        }
        
        return { 
          success: true, 
          processId: process.id, 
          taskId: newTask.id, 
          message: `Created new task ${newTask.title} with ${subtasks.length} steps` 
        };
      } catch (err) {
        console.error(`Error processing restock task ${process.id}:`, err);
        return { 
          success: false, 
          processId: process.id, 
          error: err.message 
        };
      }
    }));

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in restock-check function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
