
import React from "react";
import { useRef, useState } from "react";
import { Text } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface JarvioFormatMenuProps {
  onFormatSelect: (format: string) => void;
}

// Flow block options organized by type
const flowBlockOptions = {
  collect: [
    'User Text',
    'Upload Sheet',
    'All Listing Info',
    'Get Keywords',
    'Estimate Sales',
    'Review Information',
    'Scrape Sheet',
    'Seller Account Feedback',
    'Email Parsing'
  ],
  think: [
    'Basic AI Analysis',
    'Listing Analysis',
    'Insights Generation',
    'Review Analysis'
  ],
  act: [
    'AI Summary',
    'Push to Amazon',
    'Send Email',
    'Human in the Loop'
  ]
};

export const JarvioFormatMenu: React.FC<JarvioFormatMenuProps> = ({ 
  onFormatSelect 
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 p-2 text-muted-foreground hover:bg-muted"
        >
          <Text className="h-4 w-4" />
          <span className="sr-only">Format</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="start" 
        side="top"
      >
        <Command>
          <CommandList className="max-h-[400px]">
            {/* Collect Flow Blocks */}
            <CommandGroup heading="Collect Flow Blocks">
              {flowBlockOptions.collect.map((option) => (
                <CommandItem
                  key={`collect-${option}`}
                  onSelect={() => {
                    onFormatSelect(`**COLLECT: ${option}**\n\n`);
                    setOpen(false);
                  }}
                  className="py-2"
                >
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Think Flow Blocks */}
            <CommandGroup heading="Think Flow Blocks">
              {flowBlockOptions.think.map((option) => (
                <CommandItem
                  key={`think-${option}`}
                  onSelect={() => {
                    onFormatSelect(`**THINK: ${option}**\n\n`);
                    setOpen(false);
                  }}
                  className="py-2"
                >
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Act Flow Blocks */}
            <CommandGroup heading="Act Flow Blocks">
              {flowBlockOptions.act.map((option) => (
                <CommandItem
                  key={`act-${option}`}
                  onSelect={() => {
                    onFormatSelect(`**ACT: ${option}**\n\n`);
                    setOpen(false);
                  }}
                  className="py-2"
                >
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
