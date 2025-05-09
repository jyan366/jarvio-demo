
import React from "react";
import {
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { flowBlockOptions, BlockCategory } from "@/data/flowBlockOptions";

interface BlocksMenuItemsProps {
  searchValue: string;
  onSelect: (option: string) => void;
}

export const BlocksMenuItems: React.FC<BlocksMenuItemsProps> = ({ searchValue, onSelect }) => {
  const getFilteredBlocks = () => {
    if (searchValue === '') {
      return null; // Return null to show the categorized view
    }
    
    const filteredBlocks: { category: string; option: string }[] = [];
    
    Object.entries(flowBlockOptions).forEach(([category, options]) => {
      options.forEach(option => {
        if (option.toLowerCase().includes(searchValue.toLowerCase())) {
          filteredBlocks.push({ category, option });
        }
      });
    });
    
    return filteredBlocks;
  };

  const filteredBlocks = getFilteredBlocks();

  if (filteredBlocks) {
    return (
      <CommandGroup heading="Filtered results">
        {filteredBlocks.length > 0 ? (
          filteredBlocks.map(({ category, option }) => (
            <CommandItem
              key={`${category}-${option}`}
              onSelect={() => onSelect(option)}
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
    );
  }

  // Show categorized blocks when no search term
  return (
    <>
      {Object.entries(flowBlockOptions).map(([category, options]) => (
        <CommandGroup key={category} heading={`${category.charAt(0).toUpperCase() + category.slice(1)} Flow Blocks`}>
          {options.map((option) => (
            <CommandItem
              key={`${category}-${option}`}
              onSelect={() => onSelect(option)}
              className="py-2"
            >
              <span>{option}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </>
  );
};
