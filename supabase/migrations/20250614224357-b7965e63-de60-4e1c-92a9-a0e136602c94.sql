
-- Phase 1: Database Cleanup
-- First, let's identify and migrate data from incorrectly created child tasks to their parent flow tasks

-- Step 1: Create a temporary table to store migration data
CREATE TEMP TABLE flow_child_migration AS
SELECT 
  child.id as child_id,
  child.parent_id as parent_flow_id,
  child.title as child_title,
  child.steps_completed as child_steps_completed,
  child.step_execution_log as child_step_execution_log,
  parent.steps_completed as parent_steps_completed,
  parent.step_execution_log as parent_step_execution_log
FROM tasks child
JOIN tasks parent ON child.parent_id = parent.id
WHERE parent.task_type = 'flow' 
  AND child.parent_id IS NOT NULL
  AND parent.data->>'flowId' IS NOT NULL;

-- Step 2: Migrate step completion data from child tasks to parent flow tasks
-- For each parent flow task, merge the step completion data from its children
UPDATE tasks 
SET 
  steps_completed = (
    SELECT COALESCE(
      jsonb_agg(DISTINCT step_idx::int ORDER BY step_idx::int), 
      tasks.steps_completed
    )
    FROM (
      SELECT DISTINCT jsonb_array_elements(child.steps_completed)::text::int as step_idx
      FROM tasks child 
      WHERE child.parent_id = tasks.id
      UNION
      SELECT DISTINCT jsonb_array_elements(tasks.steps_completed)::text::int as step_idx
      WHERE tasks.steps_completed IS NOT NULL
    ) merged_steps
  ),
  step_execution_log = (
    SELECT COALESCE(
      jsonb_agg(log_entry ORDER BY (log_entry->>'completedAt')::timestamp), 
      tasks.step_execution_log
    )
    FROM (
      SELECT jsonb_array_elements(child.step_execution_log) as log_entry
      FROM tasks child 
      WHERE child.parent_id = tasks.id
        AND child.step_execution_log IS NOT NULL
      UNION ALL
      SELECT jsonb_array_elements(tasks.step_execution_log) as log_entry
      WHERE tasks.step_execution_log IS NOT NULL
    ) merged_logs
  )
WHERE task_type = 'flow' 
  AND data->>'flowId' IS NOT NULL
  AND id IN (
    SELECT DISTINCT parent_id 
    FROM tasks 
    WHERE parent_id IS NOT NULL 
      AND parent_id IN (
        SELECT id FROM tasks WHERE task_type = 'flow' AND data->>'flowId' IS NOT NULL
      )
  );

-- Step 3: Delete the incorrectly created child tasks for flow blocks
-- These are tasks that have a parent_id pointing to a flow task
DELETE FROM tasks 
WHERE parent_id IS NOT NULL 
  AND parent_id IN (
    SELECT id 
    FROM tasks 
    WHERE task_type = 'flow' 
      AND data->>'flowId' IS NOT NULL
  );

-- Step 4: Clean up any orphaned block executions that reference deleted child tasks
DELETE FROM block_executions 
WHERE task_id NOT IN (SELECT id FROM tasks);

-- Step 5: Update any remaining flow tasks to ensure they have proper step tracking arrays
UPDATE tasks 
SET 
  steps_completed = COALESCE(steps_completed, '[]'::jsonb),
  step_execution_log = COALESCE(step_execution_log, '[]'::jsonb)
WHERE task_type = 'flow' 
  AND (steps_completed IS NULL OR step_execution_log IS NULL);

-- Add a comment to document this cleanup
COMMENT ON TABLE tasks IS 'Unified task table - flows store their blocks as internal steps, not child tasks';
