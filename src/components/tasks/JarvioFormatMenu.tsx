
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
import { agentsData } from "@/data/agentsData";

interface JarvioFormatMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onFormatSelect: (format: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  menuType: "blocks" | "agents";
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
  triggerRef,
  menuType
}) => {
  // Filter blocks or agents based on search value
  const getFilteredItems = () => {
    if (menuType === "blocks") {
      const allBlocks: { category: string; option: string }[] = [];
      
      Object.entries(flowBlockOptions).forEach(([category, options]) => {
        options.forEach(option => {
          if (searchValue === '' || option.toLowerCase().includes(searchValue.toLowerCase())) {
            allBlocks.push({ category, option });
          }
        });
      });
      
      return allBlocks;
    } else {
      return agentsData.filter(agent => 
        searchValue === '' || 
        agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        agent.domain.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  };

  const filteredItems = getFilteredItems();
  
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
            placeholder={menuType === "blocks" ? "Search blocks..." : "Search agents..."}
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-none focus:ring-0"
            autoFocus
          />
          <CommandList>
            {menuType === "blocks" ? (
              searchValue === '' ? (
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
                  {filteredItems.length > 0 ? (
                    (filteredItems as { category: string, option: string }[]).map(({ category, option }) => (
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
              )
            ) : (
              // Agents menu
              <CommandGroup heading="Agents">
                {(filteredItems as typeof agentsData).length > 0 ? (
                  (filteredItems as typeof agentsData).map((agent) => (
                    <CommandItem
                      key={agent.id}
                      onSelect={() => {
                        onFormatSelect(`@${agent.name}`);
                        setOpen(false);
                      }}
                      className="py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: agent.avatarColor }}
                        />
                        <span>{agent.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {agent.domain} Specialist
                        </span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No agents found
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
