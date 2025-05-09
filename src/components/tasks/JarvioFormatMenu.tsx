
import React from "react";
import { 
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BlocksMenuItems } from "./format-menu/BlocksMenuItems";
import { AgentsMenuItems } from "./format-menu/AgentsMenuItems";
import { JarvioFormatMenuProps } from "./JarvioMenuTypes";

export const JarvioFormatMenu: React.FC<JarvioFormatMenuProps> = ({ 
  open,
  setOpen,
  onFormatSelect,
  searchValue,
  setSearchValue,
  triggerRef,
  menuType
}) => {
  const handleBlockSelect = (item: string) => {
    onFormatSelect(item);
    setOpen(false);
  };
  
  const handleAgentSelect = (agentName: string) => {
    onFormatSelect(`@${agentName}`);
    setOpen(false);
  };
  
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
              <BlocksMenuItems 
                searchValue={searchValue}
                onSelect={handleBlockSelect}
              />
            ) : (
              <AgentsMenuItems 
                searchValue={searchValue}
                onSelect={handleAgentSelect}
              />
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
