
import React from "react";

export type MenuItemType = "blocks" | "agents";

export interface JarvioFormatMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onFormatSelect: (format: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  menuType: MenuItemType;
}
