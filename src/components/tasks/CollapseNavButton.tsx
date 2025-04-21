
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface CollapseNavButtonProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CollapseNavButton: React.FC<CollapseNavButtonProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setSidebarOpen((open) => !open)}
    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
    className="mb-2"
  >
    <ChevronLeft
      className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
    />
  </Button>
);
