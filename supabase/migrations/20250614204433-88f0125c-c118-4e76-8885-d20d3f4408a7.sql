
-- Add step execution tracking fields to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS steps_completed jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS step_execution_log jsonb DEFAULT '[]'::jsonb;

-- Add comment to clarify the new fields
COMMENT ON COLUMN public.tasks.steps_completed IS 'Array of step indices that have been completed by the agent';
COMMENT ON COLUMN public.tasks.step_execution_log IS 'Log of agent execution history for each step';

-- Update the task_type constraint to ensure we support all unified types
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_task_type_check;

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_task_type_check 
CHECK (task_type IN ('task', 'flow', 'step'));

-- Add index for better parent-child relationship queries
CREATE INDEX IF NOT EXISTS idx_tasks_parent_id_user_id ON public.tasks(parent_id, user_id) WHERE parent_id IS NOT NULL;

-- Add index for task type filtering
CREATE INDEX IF NOT EXISTS idx_tasks_type_status ON public.tasks(task_type, status);
