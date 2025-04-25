
import React from 'react';
import { CreateTaskStepProps } from '../types/createTask';

export function CreateTaskStepTwo({ taskData, setTaskData }: CreateTaskStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={taskData.category}
          onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
        >
          <option value="LISTINGS">Listings</option>
          <option value="INVENTORY">Inventory</option>
          <option value="MARKETING">Marketing</option>
          <option value="SALES">Sales</option>
          <option value="ADVERTISING">Advertising</option>
          <option value="SUPPORT">Support</option>
        </select>
      </div>
    </div>
  );
}
