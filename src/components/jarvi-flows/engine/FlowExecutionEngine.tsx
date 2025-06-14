
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FlowExecutionEngineProps {
  flow: any;
  taskId: string;
  onBlockStart?: (blockIndex: number) => void;
  onBlockComplete?: (blockIndex: number, result: any) => void;
  onUserActionRequired?: (blockIndex: number, prompt: string, callback: (response: any) => void) => void;
  onError?: (error: Error, blockIndex?: number) => void;
  onComplete?: () => void;
}

export class FlowExecutionEngine {
  private flow: any;
  private taskId: string;
  private callbacks: Omit<FlowExecutionEngineProps, 'flow' | 'taskId'>;
  private currentBlockIndex: number = -1;
  private isExecuting: boolean = false;
  private blockResults: Record<string, any> = {};

  constructor(props: FlowExecutionEngineProps) {
    this.flow = props.flow;
    this.taskId = props.taskId;
    this.callbacks = {
      onBlockStart: props.onBlockStart,
      onBlockComplete: props.onBlockComplete,
      onUserActionRequired: props.onUserActionRequired,
      onError: props.onError,
      onComplete: props.onComplete
    };
  }

  async initialize() {
    try {
      console.log("Initializing flow execution engine for flow:", this.flow.name);
      
      // Check if we have any existing block executions for this task
      const { data: existingExecutions } = await supabase
        .from('block_executions')
        .select('*')
        .eq('task_id', this.taskId)
        .order('execution_order');

      if (existingExecutions && existingExecutions.length > 0) {
        console.log("Found existing block executions:", existingExecutions);
        // Load existing results
        existingExecutions.forEach(execution => {
          if (execution.output_data) {
            this.blockResults[execution.block_id] = execution.output_data;
          }
        });
      }

      return true;
    } catch (error) {
      console.error("Error initializing flow execution engine:", error);
      throw error;
    }
  }

  async startExecution() {
    if (this.isExecuting) {
      console.warn("Execution already in progress");
      return;
    }

    this.isExecuting = true;
    this.currentBlockIndex = 0;

    try {
      console.log("Starting flow execution with", this.flow.blocks.length, "blocks");
      
      for (let i = 0; i < this.flow.blocks.length; i++) {
        await this.executeBlock(i);
      }

      this.callbacks.onComplete?.();
    } catch (error) {
      console.error("Error in flow execution:", error);
      this.callbacks.onError?.(error as Error, this.currentBlockIndex);
    } finally {
      this.isExecuting = false;
    }
  }

  private async executeBlock(blockIndex: number) {
    const block = this.flow.blocks[blockIndex];
    this.currentBlockIndex = blockIndex;
    
    console.log(`Executing block ${blockIndex + 1}/${this.flow.blocks.length}:`, block.name);
    
    this.callbacks.onBlockStart?.(blockIndex);

    try {
      // Create block execution record
      const { data: executionRecord, error: insertError } = await supabase
        .from('block_executions')
        .insert({
          task_id: this.taskId,
          block_id: block.id,
          block_type: block.type,
          block_name: block.name,
          status: 'running',
          execution_order: blockIndex,
          input_data: this.getPreviousBlockResults()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Execute the block based on its type
      const result = await this.executeBlockLogic(block, blockIndex);

      // Update execution record with results
      await supabase
        .from('block_executions')
        .update({
          status: 'completed',
          output_data: result,
          completed_at: new Date().toISOString()
        })
        .eq('id', executionRecord.id);

      // Store result for next blocks
      this.blockResults[block.id] = result;
      
      this.callbacks.onBlockComplete?.(blockIndex, result);

    } catch (error) {
      console.error(`Error executing block ${blockIndex}:`, error);
      
      // Update execution record with error
      await supabase
        .from('block_executions')
        .update({
          status: 'failed',
          error_message: (error as Error).message,
          completed_at: new Date().toISOString()
        })
        .eq('task_id', this.taskId)
        .eq('block_id', block.id);

      throw error;
    }
  }

  private async executeBlockLogic(block: any, blockIndex: number): Promise<any> {
    // Simulate block execution based on type
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    switch (block.type) {
      case 'collect':
        return await this.executeCollectBlock(block, blockIndex);
      case 'think':
        return await this.executeThinkBlock(block, blockIndex);
      case 'act':
        return await this.executeActBlock(block, blockIndex);
      case 'agent':
        return await this.executeAgentBlock(block, blockIndex);
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  }

  private async executeCollectBlock(block: any, blockIndex: number): Promise<any> {
    // Simulate data collection
    const mockData = {
      blockType: 'collect',
      blockName: block.name,
      option: block.option,
      collectedData: `Mock data collected from ${block.option}`,
      timestamp: new Date().toISOString()
    };

    // For user input blocks, we might need user action
    if (block.option === 'User Text') {
      return new Promise((resolve) => {
        this.callbacks.onUserActionRequired?.(
          blockIndex,
          `Please provide input for: ${block.name}`,
          (userResponse) => {
            resolve({ ...mockData, userInput: userResponse });
          }
        );
      });
    }

    return mockData;
  }

  private async executeThinkBlock(block: any, blockIndex: number): Promise<any> {
    const previousData = this.getPreviousBlockResults();
    
    return {
      blockType: 'think',
      blockName: block.name,
      option: block.option,
      analysis: `AI analysis of previous data using ${block.option}`,
      insights: [
        "Key insight 1 from analysis",
        "Key insight 2 from analysis",
        "Key insight 3 from analysis"
      ],
      inputData: previousData,
      timestamp: new Date().toISOString()
    };
  }

  private async executeActBlock(block: any, blockIndex: number): Promise<any> {
    const previousData = this.getPreviousBlockResults();

    return {
      blockType: 'act',
      blockName: block.name,
      option: block.option,
      action: `Action performed: ${block.option}`,
      actionResults: `Successfully executed ${block.name}`,
      inputData: previousData,
      timestamp: new Date().toISOString()
    };
  }

  private async executeAgentBlock(block: any, blockIndex: number): Promise<any> {
    const previousData = this.getPreviousBlockResults();

    return {
      blockType: 'agent',
      blockName: block.name,
      agentId: block.agentId,
      agentName: block.agentName,
      agentResults: `Agent ${block.agentName} completed the task`,
      inputData: previousData,
      timestamp: new Date().toISOString()
    };
  }

  private getPreviousBlockResults(): any {
    return Object.values(this.blockResults);
  }

  getExecutionStatus() {
    return {
      isExecuting: this.isExecuting,
      currentBlockIndex: this.currentBlockIndex,
      totalBlocks: this.flow.blocks.length,
      blockResults: this.blockResults
    };
  }

  stopExecution() {
    this.isExecuting = false;
    console.log("Flow execution stopped");
  }
}
