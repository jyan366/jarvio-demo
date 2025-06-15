
-- Add trigger and saved_to_flows columns to the tasks table to unify flows and tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS trigger text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS saved_to_flows boolean DEFAULT false;

-- Update the data column to ensure it can store flow-related data (steps and blocks)
-- No need to change the data column type as it's already jsonb

-- Create an index on saved_to_flows for better performance when filtering flows
CREATE INDEX IF NOT EXISTS idx_tasks_saved_to_flows ON public.tasks(saved_to_flows) WHERE saved_to_flows = true;

-- Create an index on trigger for better performance when filtering by trigger type
CREATE INDEX IF NOT EXISTS idx_tasks_trigger ON public.tasks(trigger);
