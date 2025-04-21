
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CollapseNavButtonProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CollapseNavButton: React.FC<CollapseNavButtonProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => (
  <SidebarTrigger 
    className="mb-2"
    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
  />
);
