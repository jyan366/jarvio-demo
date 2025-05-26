
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
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
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

  // Default everything to connected and activated
  const isConnected = selectedBlock.needsConnection ? 
    (connectedServices[selectedBlock.connectionService!] ?? true) : true;
  const isActivated = true; // Default to activated

  const formatDescription = (description: string) => {
    // Split by sentences and create paragraphs for better readability
    const sentences = description.split('. ');
    const paragraphs = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const paragraph = sentences.slice(i, i + 2).join('. ') + (i + 2 < sentences.length ? '.' : '');
      paragraphs.push(paragraph);
    }
    
    return paragraphs;
  };

  const descriptionParagraphs = formatDescription(selectedBlock.description);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
            <div>
              <span className="text-lg font-semibold">{selectedBlock.name}</span>
              <div className="flex items-center gap-2 mt-1">
                {selectedBlock.needsConnection && (
                  <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                    {isConnected ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      'Not Connected'
                    )}
                  </Badge>
                )}
                <Badge variant={isActivated ? "default" : "secondary"} className="text-xs">
                  {isActivated ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Activated
                    </>
                  ) : (
                    'Not Activated'
                  )}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {descriptionParagraphs.map((paragraph, index) => (
            <DialogDescription key={index} className="text-sm text-gray-600 leading-relaxed">
              {paragraph}
            </DialogDescription>
          ))}
        </div>

        <DialogFooter className="mt-6 gap-2">
          {selectedBlock.needsConnection && !isConnected ? (
            <>
              <Button 
                variant="outline"
                onClick={() => onServiceConnection(selectedBlock.connectionService!)}
                className="flex-1"
              >
                Connect {selectedBlock.connectionService}
              </Button>
              <Button 
                onClick={() => onActivateBlock(selectedBlock.name)}
                className="flex-1"
                disabled={!isConnected}
              >
                Activate Block
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                className="flex-1"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Connected
              </Button>
              <Button 
                className="flex-1"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Activated
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
