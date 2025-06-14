
-- Add parent_id column to tasks table to support parent-child relationships
ALTER TABLE public.tasks 
ADD COLUMN parent_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Add index for better performance on parent-child queries
CREATE INDEX idx_tasks_parent_id ON public.tasks(parent_id);

-- Add a check to prevent circular references (a task cannot be its own parent)
ALTER TABLE public.tasks 
ADD CONSTRAINT check_no_self_reference 
CHECK (id != parent_id);

-- Add a column to track if a task was originally a flow
ALTER TABLE public.tasks 
ADD COLUMN task_type text DEFAULT 'task' CHECK (task_type IN ('task', 'flow', 'step'));

-- Update existing flow-based tasks to be marked as flows
UPDATE public.tasks 
SET task_type = 'flow' 
WHERE category = 'FLOW' OR (data IS NOT NULL AND data::text LIKE '%flowId%');

-- Migrate subtasks to child tasks, but only where parent task exists and has user_id
INSERT INTO public.tasks (id, title, description, status, priority, category, parent_id, user_id, created_at, task_type)
SELECT 
  s.id,
  s.title,
  COALESCE(s.description, '') as description,
  COALESCE(s.status, 'Not Started') as status,
  s.priority,
  s.category,
  s.task_id as parent_id,
  t.user_id,
  now() as created_at,
  'step' as task_type
FROM public.subtasks s
INNER JOIN public.tasks t ON s.task_id = t.id
WHERE t.user_id IS NOT NULL;

-- Clean up orphaned subtasks that don't have valid parent tasks
DELETE FROM public.subtasks 
WHERE task_id NOT IN (SELECT id FROM public.tasks WHERE user_id IS NOT NULL);
