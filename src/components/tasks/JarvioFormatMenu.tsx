
import React from "react";
import { Search } from "lucide-react";
import { 
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface JarvioFormatMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onFormatSelect: (format: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
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
  open,
  setOpen,
  onFormatSelect,
  searchValue,
  setSearchValue,
  triggerRef
}) => {
  // Filter blocks based on search value
  const getFilteredBlocks = () => {
    const allBlocks: { category: string; option: string }[] = [];
    
    Object.entries(flowBlockOptions).forEach(([category, options]) => {
      options.forEach(option => {
        if (searchValue === '' || option.toLowerCase().includes(searchValue.toLowerCase())) {
          allBlocks.push({ category, option });
        }
      });
    });
    
    return allBlocks;
  };

  const filteredBlocks = getFilteredBlocks();
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div ref={triggerRef} />
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="start" 
        side="top"
        sideOffset={5}
        alignOffset={0}
        avoidCollisions={true}
      >
        <Command className="max-h-[400px] overflow-hidden">
          <CommandInput 
            placeholder="Search blocks..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-none focus:ring-0"
            autoFocus
          />
          <CommandList>
            {searchValue === '' ? (
              <>
                {/* Collect Flow Blocks */}
                <CommandGroup heading="Collect Flow Blocks">
                  {flowBlockOptions.collect.map((option) => (
                    <CommandItem
                      key={`collect-${option}`}
                      onSelect={() => {
                        onFormatSelect(`**${option}**`);
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
                        onFormatSelect(`**${option}**`);
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
                        onFormatSelect(`**${option}**`);
                        setOpen(false);
                      }}
                      className="py-2"
                    >
                      <span>{option}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : (
              <CommandGroup heading="Filtered results">
                {filteredBlocks.length > 0 ? (
                  filteredBlocks.map(({ category, option }) => (
                    <CommandItem
                      key={`${category}-${option}`}
                      onSelect={() => {
                        onFormatSelect(`**${option}**`);
                        setOpen(false);
                      }}
                      className="py-2"
                    >
                      <span>{option}</span>
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No blocks found
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
