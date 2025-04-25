
import React from 'react';
import { CreateTaskStepProps } from '../types/createTask';

export function CreateTaskStepThree({ taskData, setTaskData }: CreateTaskStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={taskData.priority}
          onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
    </div>
  );
}
