
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Default flow block options to use as fallback - this ensures synchronization works even without importing
const defaultFlowBlockOptions = {
  collect: [
    'User Text',
    'Upload Sheet',
    'All Listing Info',
    'Get Keywords',
    'Estimate Sales',
    'Review Information',
    'Scrape Sheet',
    'Seller Account Feedback',
    'Email Parsing'
  ],
  think: [
    'Basic AI Analysis',
    'Listing Analysis',
    'Insights Generation',
    'Review Analysis'
  ],
  act: [
    'AI Summary',
    'Push to Amazon',
    'Send Email',
    'Human in the Loop',
    'Agent'
  ],
  agent: [
    'Agent'
  ]
};

export function FlowBlockDatabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    const syncFlowBlocks = async () => {
      try {
        setIsSyncing(true);
        
        // 1. Get all existing blocks from the database
        const { data: existingBlocks, error: fetchError } = await supabase
          .from('flow_block_configs')
          .select('block_type, block_name');
          
        if (fetchError) {
          console.error('Error fetching existing blocks:', fetchError);
          
          // If we get a permission error, it might mean the RLS policy isn't set properly
          if (fetchError.code === '42501') {
            console.warn('Permission error when fetching blocks. Check RLS policies.');
            return;
          }
          
          return;
        }
        
        // 2. Create a map of existing blocks for quick lookup
        const existingBlockMap = new Map();
        if (existingBlocks) {
          existingBlocks.forEach(block => {
            existingBlockMap.set(`${block.block_type}:${block.block_name}`, true);
          });
        }
        
        // 3. Identify blocks that need to be created
        const blocksToCreate = [];
        
        Object.entries(defaultFlowBlockOptions).forEach(([blockType, options]) => {
          options.forEach((option) => {
            // Skip if block already exists
            if (existingBlockMap.has(`${blockType}:${option}`)) {
              return;
            }
            
            // Create descriptions based on block type and name
            let description = '';
            switch (option) {
              case 'User Text':
                description = 'Allows users to provide specific instructions or data via direct text input';
                break;
              case 'Upload Sheet':
                description = 'Enables users to upload spreadsheets with product or inventory data';
                break;
              case 'All Listing Info':
                description = 'Retrieves complete information about Amazon product listings';
                break;
              case 'Get Keywords':
                description = 'Performs keyword research for product listings';
                break;
              case 'Estimate Sales':
                description = 'Calculates sales projections based on historical data and trends';
                break;
              case 'Review Information':
                description = 'Collects and analyzes customer reviews for products';
                break;
              case 'Scrape Sheet':
                description = 'Extracts data from Google Sheets or other online spreadsheets';
                break;
              case 'Seller Account Feedback':
                description = 'Gathers seller performance metrics and customer feedback';
                break;
              case 'Email Parsing':
                description = 'Processes and extracts structured data from emails';
                break;
              case 'Basic AI Analysis':
                description = 'Performs standard AI analysis on collected data';
                break;
              case 'Listing Analysis':
                description = 'Analyzes product listings for optimization opportunities';
                break;
              case 'Insights Generation':
                description = 'Creates strategic insights from analyzed data';
                break;
              case 'Review Analysis':
                description = 'Analyzes sentiment and patterns in customer reviews';
                break;
              case 'AI Summary':
                description = 'Generates concise AI summaries of complex data';
                break;
              case 'Push to Amazon':
                description = 'Uploads optimized content directly to Amazon listings';
                break;
              case 'Send Email':
                description = 'Sends automated emails with report results';
                break;
              case 'Human in the Loop':
                description = 'Pauses workflow for human review and approval';
                break;
              case 'Agent':
                description = 'Delegates tasks to specialized AI agents';
                break;
              default:
                description = `${option} block for ${blockType} operations`;
            }
            
            // Set up basic schema based on block type
            let schema = {};
            
            if (blockType === 'collect') {
              if (option === 'User Text') {
                schema = {
                  type: 'object',
                  properties: {
                    prompt: {
                      type: 'string',
                      description: 'Instructions for the user'
                    },
                    required: {
                      type: 'boolean',
                      description: 'Whether input is required'
                    }
                  }
                };
              } else if (option === 'Upload Sheet') {
                schema = {
                  type: 'object',
                  properties: {
                    fileTypes: {
                      type: 'array',
                      description: 'Allowed file extensions',
                      default: ['.xlsx', '.csv']
                    },
                    maxSizeInMb: {
                      type: 'number',
                      description: 'Maximum file size in MB',
                      default: 10
                    }
                  }
                };
              }
            }
            
            // Add to blocks to create
            blocksToCreate.push({
              id: uuidv4(),
              block_type: blockType,
              block_name: option,
              is_functional: false,
              config_data: {
                description: description,
                schema: schema
              },
              credentials: {},
            });
          });
        });
        
        if (blocksToCreate.length === 0) {
          console.log('All blocks already exist in the database');
          return;
        }
        
        console.log(`Adding ${blocksToCreate.length} flow blocks to database`);
        
        // 4. Insert blocks into database in batches to avoid payload size limits
        const batchSize = 20;
        for (let i = 0; i < blocksToCreate.length; i += batchSize) {
          const batch = blocksToCreate.slice(i, i + batchSize);
          const { error } = await supabase
            .from('flow_block_configs')
            .insert(batch);
            
          if (error) {
            console.error(`Error creating batch ${Math.floor(i/batchSize) + 1}:`, error);
            
            // Show a toast with the error message
            toast({
              title: "Error syncing flow blocks",
              description: `${error.message}. Please check RLS policies or database permissions.`,
              variant: "destructive"
            });
            
            break; // Stop trying if we hit an error
          } else {
            console.log(`Batch ${Math.floor(i/batchSize) + 1} created successfully`);
          }
        }
        
        console.log('Flow blocks synchronization complete');
        
        // Show success toast when complete
        toast({
          title: "Flow blocks synchronized",
          description: `${blocksToCreate.length} new flow blocks have been added to the database.`
        });
        
      } catch (error) {
        console.error('Error syncing flow blocks:', error);
        
        // If any error occurs, show a toast
        toast({
          title: "Error syncing flow blocks",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
        
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Run the sync when the component mounts
    syncFlowBlocks();
  }, []);
  
  // This component doesn't render anything
  return null;
}
