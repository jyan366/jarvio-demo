
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Set up CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlockExecutionRequest {
  blockType: string;
  blockName: string;
  blockId: string;
  flowId: string;
  taskId: string;
  configId: string;
  context?: Record<string, any>;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    // Parse request body
    const requestData: BlockExecutionRequest = await req.json();
    const { blockType, blockName, blockId, flowId, taskId, configId, context } = requestData;
    
    console.log(`Executing block: ${blockType} - ${blockName} (${blockId})`);
    
    // Get the block configuration from the database
    const { data: blockConfig, error: configError } = await supabase
      .from('flow_block_configs')
      .select('*')
      .eq('id', configId)
      .single();
    
    if (configError) {
      throw new Error(`Block configuration not found: ${configError.message}`);
    }
    
    if (!blockConfig.is_functional) {
      throw new Error(`Block ${blockName} is not functional. It can only run in demo mode.`);
    }
    
    // Execute the appropriate block handler based on type and name
    let result: any;
    
    switch (`${blockType}:${blockName}`) {
      case 'collect:get_account_health':
        result = await executeGetAccountHealth(blockConfig, context);
        break;
      // Add more block implementations here as they become functional
      default:
        throw new Error(`No implementation found for block type ${blockType}:${blockName}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error executing flow block:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

/**
 * Implementation for 'get_account_health' block
 * This could fetch real account health data from an e-commerce platform API
 */
async function executeGetAccountHealth(config: any, context?: Record<string, any>) {
  // In a real implementation, you would make an API call to the e-commerce platform
  // For now, return realistic looking data
  return {
    accountHealth: {
      sellerRating: 98,
      feedbackCount: 156,
      orderDefectRate: 0.015,
      lateShipmentRate: 0.02,
      customerServicePerformance: "Excellent"
    },
    recentFeedback: [
      { rating: 5, comment: "Fast delivery and excellent product" },
      { rating: 4, comment: "Good value for money" }
    ],
    timestamp: new Date().toISOString()
  };
}
