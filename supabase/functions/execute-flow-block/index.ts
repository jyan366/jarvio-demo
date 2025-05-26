import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request
    const { blockId, blockType, blockName, inputData } = await req.json();
    
    console.log(`Executing flow block: ${blockType}:${blockName} (${blockId})`);
    console.log(`Input data:`, inputData);
    
    // Get block configuration from database
    let blockConfig;
    let blockConfigError;
    
    try {
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('*')
        .eq('block_type', blockType)
        .eq('block_name', blockName)
        .single();
      
      if (error) throw error;
      blockConfig = data;
    } catch (error) {
      console.warn(`Error fetching block config by type and name: ${error.message}`);
      console.log('Trying to fetch by blockId instead...');
      
      // Try fetching by ID as fallback
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('*')
        .eq('id', blockId)
        .single();
      
      if (error) {
        blockConfigError = error;
        console.error('Error fetching block config by ID:', error);
      } else {
        blockConfig = data;
      }
    }
    
    // If block configuration doesn't exist or has error, log and return demo data
    if (!blockConfig || blockConfigError) {
      console.warn(`Block configuration not found, using demo mode for ${blockType}:${blockName}`);
      
      // Generate demo output based on block type and option
      const demoOutput = generateDemoOutput(blockType, blockName, inputData);
      
      // Record the execution in the database
      const { data: execution, error: executionError } = await supabase
        .from('block_executions')
        .insert({
          block_id: blockId,
          block_type: blockType, 
          block_name: blockName,
          input_data: inputData,
          output_data: demoOutput,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (executionError) {
        console.error('Error recording execution:', executionError);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          demoMode: true,
          result: demoOutput,
          executionId: execution?.id,
          blockConfig: blockConfig
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If block is not marked as functional, return demo data
    if (!blockConfig.is_functional) {
      console.log(`Block ${blockName} is in demo mode, returning demo data`);
      
      // Get demo output based on block type and option
      const demoOutput = generateDemoOutput(blockType, blockName, inputData);
      
      // Record the execution in the database
      const { data: execution, error: executionError } = await supabase
        .from('block_executions')
        .insert({
          block_id: blockId,
          block_type: blockType, 
          block_name: blockName,
          input_data: inputData,
          output_data: demoOutput,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (executionError) {
        console.error('Error recording execution:', executionError);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          demoMode: true,
          result: demoOutput,
          executionId: execution?.id,
          blockConfig: blockConfig
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For functional blocks, implement the actual functionality
    // This will depend on block type and option
    console.log(`Executing functional block ${blockName} with config:`, blockConfig);
    
    // Record the start of execution
    const { data: execution, error: executionError } = await supabase
      .from('block_executions')
      .insert({
        block_id: blockId,
        block_type: blockType,
        block_name: blockName,
        input_data: inputData,
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (executionError) {
      console.error('Error recording execution start:', executionError);
      throw executionError;
    }
    
    // For now, we'll simulate this with a delay
    // In a real implementation, this would execute the actual block logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let output;
    
    try {
      // Try to use the configured function if it exists
      if (blockConfig?.config_data?.implementation_function) {
        // This is just a placeholder - in the future we could implement
        // a way to execute custom function code from the config
        console.log(`Using custom implementation function: ${blockConfig.config_data.implementation_function}`);
        // For now, we still use the demo data generator
        output = generateDemoOutput(blockType, blockName, inputData);
      } else {
        // Otherwise use the demo output generator
        console.log(`No custom implementation function found, using demo output`);
        output = generateDemoOutput(blockType, blockName, inputData);
      }
    } catch (implementationError) {
      console.error(`Error executing implementation:`, implementationError);
      // Fallback to demo output
      output = generateDemoOutput(blockType, blockName, inputData);
    }
    
    // Update the execution record
    const { error: updateError } = await supabase
      .from('block_executions')
      .update({
        output_data: output,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', execution.id);
      
    if (updateError) {
      console.error('Error updating execution record:', updateError);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        demoMode: false,
        result: output,
        executionId: execution.id,
        blockConfig: blockConfig
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error executing flow block:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to generate demo output based on block type and name
function generateDemoOutput(blockType: string, blockName: string, inputData: any) {
  switch (blockType) {
    case 'collect':
      switch (blockName) {
        case 'Pull from Amazon':
          return {
            endpoint: inputData?.endpoint || '/orders/v0/orders',
            marketplace: inputData?.marketplace || 'ATVPDKIKX0DER',
            parameters: inputData?.parameters || { CreatedAfter: '2023-01-01T00:00:00Z' },
            responseData: {
              orders: [
                {
                  amazonOrderId: 'ORDER-123-4567890',
                  purchaseDate: '2023-12-15T14:30:00Z',
                  orderStatus: 'Shipped',
                  fulfillmentChannel: 'AFN',
                  salesChannel: 'Amazon.com',
                  orderTotal: { currencyCode: 'USD', amount: '89.99' },
                  numberOfItemsShipped: 2,
                  numberOfItemsUnshipped: 0,
                  marketplaceId: 'ATVPDKIKX0DER'
                },
                {
                  amazonOrderId: 'ORDER-789-1234567',
                  purchaseDate: '2023-12-14T09:15:00Z',
                  orderStatus: 'Pending',
                  fulfillmentChannel: 'MFN',
                  salesChannel: 'Amazon.com',
                  orderTotal: { currencyCode: 'USD', amount: '45.50' },
                  numberOfItemsShipped: 0,
                  numberOfItemsUnshipped: 1,
                  marketplaceId: 'ATVPDKIKX0DER'
                }
              ],
              nextToken: 'NEXT_TOKEN_123',
              totalCount: 2
            },
            executionTime: '1.2s',
            apiVersion: 'v0'
          };
        case 'User Text':
          return { text: inputData?.text || 'Sample user input', processed: true };
        case 'Upload Sheet':
          return { 
            rows: 42, 
            columns: 8, 
            sampleData: [
              { SKU: 'ABC123', Title: 'Premium Widget', Price: 19.99 },
              { SKU: 'DEF456', Title: 'Deluxe Gadget', Price: 29.99 },
              { SKU: 'GHI789', Title: 'Ultimate Tool', Price: 39.99 }
            ],
            fileName: inputData?.fileName || 'sample-data.xlsx'
          };
        case 'All Listing Info':
          return {
            listings: [
              { asin: 'B00TEST123', title: 'Premium Product A', price: 24.99, rating: 4.5, reviewCount: 127 },
              { asin: 'B00TEST456', title: 'Deluxe Product B', price: 34.99, rating: 4.2, reviewCount: 89 },
              { asin: 'B00TEST789', title: 'Ultimate Product C', price: 44.99, rating: 4.7, reviewCount: 203 }
            ],
            totalCount: 3,
            marketplaceId: 'ATVPDKIKX0DER'
          };
        case 'Get Keywords':
          return {
            keywords: [
              { keyword: 'premium widget', searchVolume: 12500, competition: 'high' },
              { keyword: 'best gadget 2023', searchVolume: 8700, competition: 'medium' },
              { keyword: 'affordable tool kit', searchVolume: 5300, competition: 'low' },
              { keyword: 'professional grade widgets', searchVolume: 3200, competition: 'medium' }
            ],
            category: inputData?.category || 'Tools & Home Improvement'
          };
        case 'Estimate Sales':
          return {
            estimatedSales: 342,
            timeframe: '30 days',
            confidence: 'high',
            similarProducts: [
              { asin: 'B00COMP123', sales: 412 },
              { asin: 'B00COMP456', sales: 287 },
              { asin: 'B00COMP789', sales: 376 }
            ],
            seasonalTrend: 'upward'
          };
        case 'Review Information':
          return {
            reviews: [
              { rating: 5, title: 'Excellent product!', text: 'This product exceeded my expectations.' },
              { rating: 4, title: 'Very good', text: 'Works as expected, fast shipping.' },
              { rating: 2, title: 'Disappointing', text: 'Not as described, poor quality materials.' },
              { rating: 5, title: 'Perfect!', text: 'Exactly what I was looking for!' }
            ],
            averageRating: 4.0,
            totalReviews: 124,
            sentimentBreakdown: {
              positive: 78,
              neutral: 31,
              negative: 15
            }
          };
        case 'Scrape Sheet':
          return {
            sheetTitle: 'Q4 Inventory Planning',
            tabName: 'Product Forecast',
            rows: 36,
            columns: 9,
            sampleData: [
              { product: 'Widget A', forecast: 1250, currentStock: 485 },
              { product: 'Gadget B', forecast: 780, currentStock: 320 },
              { product: 'Tool C', forecast: 950, currentStock: 175 }
            ]
          };
        case 'Seller Account Feedback':
          return {
            feedbackRating: 97,
            totalFeedbacks: 1243,
            recentFeedbacks: [
              { rating: 5, comment: 'Great seller, fast shipping!' },
              { rating: 5, comment: 'Item exactly as described.' },
              { rating: 4, comment: 'Good product, shipping was a bit slow.' }
            ],
            metrics: {
              orderDefectRate: 0.8,
              lateShipmentRate: 1.2,
              policyComplianceRate: 99.7
            }
          };
        case 'Email Parsing':
          return {
            sender: 'supplier@example.com',
            subject: 'Updated Price List - July 2023',
            extractedData: {
              priceChanges: [
                { sku: 'SUP-123', oldPrice: 12.50, newPrice: 13.75 },
                { sku: 'SUP-456', oldPrice: 18.25, newPrice: 17.99 },
                { sku: 'SUP-789', oldPrice: 24.99, newPrice: 24.99 }
              ],
              effectiveDate: '2023-07-15',
              contactPerson: 'John Smith'
            },
            attachments: ['PriceList_July2023.xlsx']
          };
        default:
          return { message: 'Demo data for ' + blockName };
      }
    
    case 'think':
      switch (blockName) {
        case 'Basic AI Analysis':
          return {
            analysis: 'Based on the provided data, there appears to be a strong correlation between product image quality and conversion rate. Products with multiple high-quality images show a 32% higher conversion rate on average.',
            keyInsights: [
              'Higher image count correlates with higher conversion',
              'Products with video content outperform those without by 27%',
              'Mobile optimization is critical - 68% of traffic comes from mobile devices'
            ],
            confidenceScore: 87
          };
        case 'Listing Analysis':
          return {
            optimizationScore: 76,
            titleRecommendations: 'Add more relevant keywords, reduce redundant terms',
            bulletPointIssues: 'Too short, not highlighting key benefits',
            imageSuggestions: 'Add lifestyle images showing product in use',
            keywordGaps: ['premium', 'professional', 'high-quality'],
            competitorComparison: {
              pricePosition: 'mid-range',
              featureCoverage: 'comprehensive',
              imageQuality: 'below average'
            }
          };
        case 'Insights Generation':
          return {
            marketTrends: [
              'Increasing demand for eco-friendly packaging',
              'Shift toward premium positioning in this category',
              'Growing importance of mobile-first shopping experience'
            ],
            opportunityAreas: [
              'Bundle offerings could increase average order value',
              'Expanded color options based on seasonal trends',
              'Highlight durability features more prominently'
            ],
            riskFactors: [
              'Increasing competition from new market entrants',
              'Price sensitivity in current economic climate',
              'Supply chain vulnerabilities for key components'
            ],
            strategicRecommendations: [
              'Develop premium product tier',
              'Improve mobile listing experience',
              'Create content focusing on sustainability'
            ]
          };
        case 'Review Analysis':
          return {
            commonPraises: [
              'Easy to use',
              'Great value for money',
              'Durable construction'
            ],
            commonComplaints: [
              'Confusing instructions',
              'Packaging issues',
              'Size smaller than expected'
            ],
            sentimentTrend: 'improving',
            wordCloud: ['quality', 'value', 'easy', 'durable', 'instructions', 'small'],
            competitorComparison: 'Above average satisfaction vs. category',
            actionableInsights: [
              'Revise instruction manual',
              'Add more precise dimensions to listing',
              'Address packaging feedback with supplier'
            ]
          };
        default:
          return { message: 'Demo analysis for ' + blockName };
      }
    
    case 'act':
      switch (blockName) {
        case 'AI Summary':
          return {
            summary: 'The analysis indicates strong performance overall with specific opportunities for optimization. Your products are well-positioned in the marketplace, but several key improvements could drive significant growth in conversion and sales volume.',
            keyPoints: [
              'Listings with complete A+ content show 23% higher conversion rates',
              '4 products require immediate inventory reordering',
              'Customer reviews highlight quality as a key strength',
              'Mobile optimization should be prioritized for 3 top sellers'
            ],
            recommendations: [
              'Update main images for 5 underperforming listings',
              'Revise titles to include high-value keywords identified in the analysis',
              'Add video content to top 3 products by traffic',
              'Address recurring packaging feedback in product design'
            ],
            priorityScore: 87
          };
        case 'Push to Amazon':
          return {
            status: 'success',
            updatedListings: [
              { asin: 'B00TEST123', fieldsUpdated: ['title', 'description', 'bullets'] },
              { asin: 'B00TEST456', fieldsUpdated: ['keywords', 'images'] },
              { asin: 'B00TEST789', fieldsUpdated: ['title', 'aplus'] }
            ],
            errors: [],
            warnings: ['Image for B00TEST456 is near size limit'],
            timestamp: new Date().toISOString()
          };
        case 'Send Email':
          return {
            status: 'sent',
            recipient: 'team@example.com',
            subject: 'Weekly Performance Report',
            templateUsed: 'performance-summary',
            attachments: ['report.pdf'],
            trackingEnabled: true,
            deliveryTime: new Date().toISOString()
          };
        case 'Human in the Loop':
          return {
            requestId: 'req-123456',
            status: 'approved',
            approvedBy: 'john@example.com',
            approvalTime: new Date().toISOString(),
            comments: 'Looks good, proceed with the changes.',
            originalRequest: {
              type: 'listing-update',
              asins: ['B00TEST123', 'B00TEST456'],
              changes: 'Update product titles and main images'
            }
          };
        case 'Agent':
          return {
            agentId: 'agent-123',
            agentName: 'Listing Optimization Agent',
            status: 'completed',
            tasksDelegated: [
              'Keyword research',
              'Competitor analysis',
              'Title optimization',
              'Bullet point enhancement'
            ],
            outputs: {
              optimizedTitle: 'Premium Widget Pro - Professional Grade Tool with Ergonomic Design for Home & Workshop Use',
              optimizedBullets: [
                'PROFESSIONAL QUALITY: Industrial-grade materials ensure long-lasting performance',
                'VERSATILE USE: Perfect for both home DIY projects and professional applications'
              ]
            },
            completionTime: new Date().toISOString()
          };
        default:
          return { message: 'Demo action result for ' + blockName };
      }
      
    case 'agent':
      return {
        agentResponse: 'I have analyzed the data and completed the requested task. Here are my findings and recommendations...',
        taskType: 'analysis',
        confidence: 0.92,
        processedItems: 15,
        generatedOutputs: [
          { type: 'text', content: 'Detailed analysis of Q2 performance' },
          { type: 'recommendation', content: '5 key action items for Q3' }
        ],
        completionTime: new Date().toISOString()
      };
      
    default:
      return { message: 'Demo data for unknown block type: ' + blockType };
  }
}
