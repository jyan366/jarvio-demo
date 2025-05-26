
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  if (!selectedBlock) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {selectedBlock.logo ? (
              <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                <img 
                  src={selectedBlock.logo} 
                  alt={`${selectedBlock.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                <selectedBlock.icon className="h-7 w-7 text-gray-700" />
              </div>
            )}
            <span>{selectedBlock.name}</span>
          </DialogTitle>
          <DialogDescription className="mt-4">
            {selectedBlock.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          {selectedBlock.needsConnection && selectedBlock.connectionService && !connectedServices[selectedBlock.connectionService] ? (
            <Button 
              onClick={() => onServiceConnection(selectedBlock.connectionService!)}
              className="w-full"
            >
              Connect {selectedBlock.connectionService}
            </Button>
          ) : (
            <Button 
              onClick={() => onActivateBlock(selectedBlock.name)}
              className="w-full"
            >
              Activate Block
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
