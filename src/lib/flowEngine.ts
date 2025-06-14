
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Flow, FlowBlock } from '@/components/jarvi-flows/FlowsGrid';

// Simplified types to avoid circular references
export interface SimpleFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  blocks: SimpleFlowBlock[];
}

export interface SimpleFlowBlock {
  id: string;
  type: 'collect' | 'think' | 'act' | 'agent';
  option: string;
  name: string;
  agentId?: string;
  agentName?: string;
}

export interface BlockExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  requiresUserAction?: boolean;
  userActionPrompt?: string;
}

export interface BlockConfig {
  id: string;
  block_type: string;
  block_name: string;
  is_functional: boolean;
  config_data: Record<string, any>;
  credentials?: Record<string, any>;
}

export interface FlowExecutionOptions {
  flow: SimpleFlow;
  taskId: string;
  onBlockStart?: (blockIndex: number) => void;
  onBlockComplete?: (blockIndex: number, result: any) => void;
  onUserActionRequired?: (
    blockIndex: number, 
    actionPrompt: string, 
    callback: (response: any) => void
  ) => void;
  onError?: (error: Error, blockIndex: number) => void;
  onComplete?: () => void;
}

export class FlowExecutionEngine {
  private flow: SimpleFlow;
  private taskId: string;
  private currentBlockIndex: number = 0;
  private executionId: string | null = null;
  private blockResults: Record<string, any> = {};
  private isExecuting: boolean = false;
  private isCompleted: boolean = false;
  private blockConfigs: Record<string, BlockConfig> = {};
  private options: FlowExecutionOptions;

  constructor(options: FlowExecutionOptions) {
    this.flow = options.flow;
    this.taskId = options.taskId;
    this.options = options;
  }

  /**
   * Initialize the execution engine by loading block configurations
   */
  async initialize(): Promise<void> {
    try {
      // Get block configurations from the database
      const { data: configs, error } = await supabase
        .from('flow_block_configs')
        .select('*');
      
      if (error) throw error;
      
      // Create a map of block type+name to config for quick access
      if (configs) {
        configs.forEach((item: any) => {
          const config: BlockConfig = {
            ...item,
            config_data: typeof item.config_data === 'string' 
              ? JSON.parse(item.config_data) 
              : item.config_data,
            credentials: typeof item.credentials === 'string' 
              ? JSON.parse(item.credentials) 
              : item.credentials
          };
          
          const key = `${config.block_type}:${config.block_name}`;
          this.blockConfigs[key] = config;
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to initialize flow engine:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Start executing the flow
   */
  async startExecution(): Promise<string | null> {
    if (this.isExecuting || this.isCompleted) return null;
    
    try {
      this.isExecuting = true;
      
      // Create a flow execution record
      const { data: executionRecord, error } = await supabase
        .from('flow_executions')
        .insert({
          flow_id: this.flow.id,
          task_id: this.taskId,
          status: 'running'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      this.executionId = executionRecord.id;
      
      // Start executing the first block
      await this.executeCurrentBlock();
      
      return this.executionId;
    } catch (error) {
      console.error("Error starting flow execution:", error);
      this.isExecuting = false;
      
      if (this.options.onError) {
        this.options.onError(error as Error, -1);
      }
      
      return null;
    }
  }

  /**
   * Execute the current block in the flow
   */
  private async executeCurrentBlock(): Promise<void> {
    if (!this.flow.blocks || this.currentBlockIndex >= this.flow.blocks.length) {
      this.completeFlow();
      return;
    }

    const block = this.flow.blocks[this.currentBlockIndex];
    if (!block) {
      this.moveToNextBlock();
      return;
    }

    try {
      // Notify the start of block execution
      if (this.options.onBlockStart) {
        this.options.onBlockStart(this.currentBlockIndex);
      }
      
      // Create a block execution record
      await supabase
        .from('block_executions')
        .insert({
          task_id: this.taskId,
          block_id: block.id,
          block_type: block.type,
          block_name: block.option,
          status: 'running'
        });

      // Check if the block is functional or demo
      const blockConfigKey = `${block.type}:${block.option}`;
      const blockConfig = this.blockConfigs[blockConfigKey];
      const isFunctional = blockConfig?.is_functional || false;
      
      let result: BlockExecutionResult;
      
      if (isFunctional) {
        // Execute a functional block
        result = await this.executeFunctionalBlock(block, blockConfig);
      } else {
        // Execute a demo block with simulated data
        result = await this.executeDemoBlock(block);
      }
      
      // Save the block result
      this.blockResults[block.id] = result.data;
      
      // Update block execution record
      await supabase
        .from('block_executions')
        .update({
          status: result.success ? 'completed' : 'failed',
          output_data: result.data || {},
          error_message: result.error,
          completed_at: new Date().toISOString()
        })
        .eq('task_id', this.taskId)
        .eq('block_id', block.id);

      // FIXED: Update the parent flow task's step completion instead of child tasks
      try {
        const { markStepCompleted } = await import('@/lib/unifiedTasks');
        await markStepCompleted(
          this.taskId, 
          this.currentBlockIndex, 
          `Block "${block.option}" completed: ${result.success ? 'Success' : 'Failed'}`
        );
      } catch (stepError) {
        console.error("Error updating task step:", stepError);
      }
      
      // Handle user action if required
      if (result.requiresUserAction && result.userActionPrompt && this.options.onUserActionRequired) {
        this.options.onUserActionRequired(
          this.currentBlockIndex,
          result.userActionPrompt,
          (userResponse) => {
            // Update block with user response
            this.blockResults[block.id] = {
              ...this.blockResults[block.id],
              userResponse
            };
            
            // Continue to next block
            this.moveToNextBlock();
          }
        );
        return;
      }

      // Notify block completion
      if (this.options.onBlockComplete) {
        this.options.onBlockComplete(this.currentBlockIndex, result.data);
      }
      
      // Move to the next block
      this.moveToNextBlock();
    } catch (error) {
      console.error(`Error executing block ${block.name || block.option}:`, error);
      
      // Update block execution record with error
      await supabase
        .from('block_executions')
        .update({
          status: 'failed',
          error_message: (error as Error).message,
          completed_at: new Date().toISOString()
        })
        .eq('task_id', this.taskId)
        .eq('block_id', block.id);
      
      if (this.options.onError) {
        this.options.onError(error as Error, this.currentBlockIndex);
      }
      
      // Stop execution on error
      this.isExecuting = false;
    }
  }

  /**
   * Execute a functional block using real implementation
   */
  private async executeFunctionalBlock(block: SimpleFlowBlock, config: BlockConfig): Promise<BlockExecutionResult> {
    try {
      // Call the edge function to execute the block
      const { data, error } = await supabase.functions.invoke('execute-flow-block', {
        body: {
          blockType: block.type,
          blockName: block.option,
          blockId: block.id,
          flowId: this.flow.id,
          taskId: this.taskId,
          configId: config.id,
          context: this.blockResults // Pass previous results as context
        }
      });
      
      if (error) throw new Error(error.message);
      
      return {
        success: true,
        data: data.result,
        requiresUserAction: data.requiresUserAction || false,
        userActionPrompt: data.userActionPrompt
      };
    } catch (error) {
      console.error("Error in functional block execution:", error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Execute a demo block with simulated data
   */
  private async executeDemoBlock(block: SimpleFlowBlock): Promise<BlockExecutionResult> {
    // Wait to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate demo result based on block type
    let demoResult: any;
    
    switch (block.type) {
      case 'collect':
        demoResult = this.generateDemoCollectResult(block);
        break;
      case 'think':
        demoResult = this.generateDemoThinkResult(block);
        break;
      case 'act':
        demoResult = this.generateDemoActResult(block);
        break;
      case 'agent':
        demoResult = this.generateDemoAgentResult(block);
        break;
      default:
        demoResult = { message: "Demo block executed", timestamp: new Date().toISOString() };
    }
    
    // Some blocks should require user action in demo mode
    const requiresUserAction = block.type === 'act' && 
      (block.option === 'Human in the Loop' || block.option === 'Send Email');
    
    return {
      success: true,
      data: demoResult,
      requiresUserAction,
      userActionPrompt: requiresUserAction ? 
        `This "${block.name || block.option}" step requires your input. Please provide the necessary information or confirm that you've manually completed this step.` : 
        undefined
    };
  }

  /**
   * Generate demo results for collect blocks
   */
  private generateDemoCollectResult(block: SimpleFlowBlock): any {
    switch (block.option) {
      case 'User Text':
        return { 
          userInput: "Simulated user text data for " + block.name,
          timestamp: new Date().toISOString()
        };
      
      case 'Upload Sheet':
        return { 
          sheetData: "Simulated uploaded spreadsheet data",
          rows: 15,
          columns: 5,
          timestamp: new Date().toISOString()
        };
      // ... handle other collect block options
      default:
        return {
          data: `Demo data for ${block.option}`,
          timestamp: new Date().toISOString()
        };
    }
  }

  /**
   * Generate demo results for think blocks
   */
  private generateDemoThinkResult(block: SimpleFlowBlock): any {
    return {
      analysisResults: "Simulated AI analysis of collected data",
      insights: [
        "Demo insight 1 for " + (block.name || block.option),
        "Demo insight 2 for " + (block.name || block.option),
        "Demo insight 3 for " + (block.name || block.option)
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate demo results for act blocks
   */
  private generateDemoActResult(block: SimpleFlowBlock): any {
    switch (block.option) {
      case 'Send Email':
        return {
          emailStatus: {
            sent: true,
            recipients: 3,
            subject: "Demo Email Subject",
            deliveredAt: new Date().toISOString()
          },
          demoNote: "This is a simulated email. No actual email was sent."
        };
      
      case 'Human in the Loop':
        return {
          approvalStatus: "Waiting for approval",
          requestType: "Review and approve changes",
          submittedTo: "Demo Manager",
          demoNote: "This step requires manual handling in a real scenario."
        };
      // ... handle other act block options
      default:
        return {
          action: `Demo action for ${block.option}`,
          status: "Simulated success",
          timestamp: new Date().toISOString()
        };
    }
  }

  /**
   * Generate demo results for agent blocks
   */
  private generateDemoAgentResult(block: SimpleFlowBlock): any {
    return {
      agentName: block.agentName || "Simulated Agent",
      actions: [
        "Simulated agent action 1",
        "Simulated agent action 2",
        "Simulated agent action 3"
      ],
      result: "Simulated successful outcome",
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Move to the next block in the flow
   */
  private moveToNextBlock(): void {
    if (this.currentBlockIndex < this.flow.blocks.length - 1) {
      // Move to next block
      this.currentBlockIndex++;
      // Execute the next block
      setTimeout(() => this.executeCurrentBlock(), 500);
    } else {
      // All blocks completed
      this.completeFlow();
    }
  }

  /**
   * Complete the flow execution
   */
  private async completeFlow(): Promise<void> {
    this.isExecuting = false;
    this.isCompleted = true;
    
    // Update flow execution record
    await supabase
      .from('flow_executions')
      .update({
        status: 'completed',
        metadata: { results: this.blockResults },
        completed_at: new Date().toISOString()
      })
      .eq('id', this.executionId);

    // FIXED: Update the flow task itself to Done status
    try {
      const { updateUnifiedTask } = await import('@/lib/unifiedTasks');
      await updateUnifiedTask(this.taskId, { status: 'Done' });
    } catch (taskError) {
      console.error("Error updating task status:", taskError);
    }
    
    if (this.options.onComplete) {
      this.options.onComplete();
    }
  }

  /**
   * Get the current execution status
   */
  getStatus() {
    return {
      isExecuting: this.isExecuting,
      isCompleted: this.isCompleted,
      currentBlockIndex: this.currentBlockIndex,
      blockResults: this.blockResults,
      executionId: this.executionId
    };
  }
}
