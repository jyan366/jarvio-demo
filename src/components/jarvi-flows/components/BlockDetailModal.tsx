import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Block } from '../types/blockTypes';

interface BlockDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBlock: Block | null;
  connectedServices: Record<string, boolean>;
  onServiceConnection: (service: string) => void;
  onActivateBlock: (blockName: string) => void;
}

export function BlockDetailModal({
  isOpen,
  onOpenChange,
  selectedBlock,
  connectedServices,
  onServiceConnection,
  onActivateBlock
}: BlockDetailModalProps) {
  if (!selectedBlock) {
    return null;
  }

  const isServiceConnected = selectedBlock.needsConnection && selectedBlock.connectionService ? connectedServices[selectedBlock.connectionService] : true;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{selectedBlock.name}</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedBlock.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {selectedBlock.logo && (
            <img
              src={selectedBlock.logo}
              alt={`${selectedBlock.name} Logo`}
              className="max-h-20 object-contain rounded-md"
            />
          )}

          {/* ClickUp Pull Tasks Block */}
          {selectedBlock?.name === 'Pull ClickUp Tasks' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What You Can Pull:</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">View detailed task information</div>
                      <div className="text-sm text-gray-600">Access comprehensive task details, including attachments and all related data</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Task titles, descriptions, and status</div>
                      <div className="text-sm text-gray-600">Retrieve complete task information and current status</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Assignees and due dates</div>
                      <div className="text-sm text-gray-600">Get team member assignments and deadline information</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Project and folder organization</div>
                      <div className="text-sm text-gray-600">Access workspace structure and organization data</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Custom fields and tags</div>
                      <div className="text-sm text-gray-600">Retrieve custom data fields and categorization tags</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Time tracking and estimates</div>
                      <div className="text-sm text-gray-600">Access time-related data and project estimates</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Filters Available:</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="text-sm text-gray-700">Task status and priority</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="text-sm text-gray-700">Assigned team members</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="text-sm text-gray-700">Due date ranges</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="text-sm text-gray-700">Tags and custom fields</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ClickUp Create Task Block */}
          {selectedBlock?.name === 'Create ClickUp Task' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">ClickUp Management Capabilities:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Add new folders</div>
                    <div className="text-sm text-gray-600">Create folders to organize your workspace</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Add new lists</div>
                    <div className="text-sm text-gray-600">Create lists within folders for better organization</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Create new tasks</div>
                    <div className="text-sm text-gray-600">Generate tasks with full customization options</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Add task comments</div>
                    <div className="text-sm text-gray-600">Leave comments on existing tasks for collaboration</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Delete tasks</div>
                    <div className="text-sm text-gray-600">Remove completed or unnecessary tasks from your workspace</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-gray-900">Update tasks</div>
                    <div className="text-sm text-gray-600">Modify existing tasks with new information and status changes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {selectedBlock.needsConnection && selectedBlock.connectionService && !isServiceConnected ? (
            <Button onClick={() => onServiceConnection(selectedBlock.connectionService!)}>
              Connect {selectedBlock.connectionService}
            </Button>
          ) : (
            <AlertDialogAction onClick={() => onActivateBlock(selectedBlock.name)}>Activate Block</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
