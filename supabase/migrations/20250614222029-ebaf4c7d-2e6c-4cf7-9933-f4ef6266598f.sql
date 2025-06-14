
-- Step 1: Remove the subtasks table since we now use parent_id in tasks for child tasks
DROP TABLE IF EXISTS public.subtasks CASCADE;

-- Step 2: Clean up the block_executions table to only keep essential execution tracking
-- First, let's see what data exists and preserve essential information
CREATE TABLE IF NOT EXISTS public.block_executions_backup AS 
SELECT * FROM public.block_executions;

-- Drop and recreate block_executions with simplified structure
DROP TABLE IF EXISTS public.block_executions CASCADE;

CREATE TABLE public.block_executions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  block_id text NOT NULL,
  block_type text NOT NULL,
  block_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  error_message text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  execution_order integer DEFAULT 0
);

-- Step 3: Clean up the tasks table - remove confusing step tracking fields
-- We'll keep steps_completed and step_execution_log for now but simplify their usage
ALTER TABLE public.tasks 
DROP COLUMN IF EXISTS insight_id,
DROP COLUMN IF EXISTS source;

-- Step 4: Ensure task_type constraint is clean
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_task_type_check;

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_task_type_check 
CHECK (task_type IN ('task', 'flow', 'step'));

-- Step 5: Add execution_order to tasks for proper step ordering
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS execution_order integer DEFAULT 0;

-- Step 6: Update any existing flow tasks to have proper task_type
UPDATE public.tasks 
SET task_type = 'flow' 
WHERE (data->>'flowId' IS NOT NULL OR category = 'FLOW') 
AND task_type != 'flow';

-- Step 7: Clean up flow_executions to be simpler
ALTER TABLE public.flow_executions
DROP COLUMN IF EXISTS results,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_parent_execution_order ON public.tasks(parent_id, execution_order) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_block_executions_task_order ON public.block_executions(task_id, execution_order);
