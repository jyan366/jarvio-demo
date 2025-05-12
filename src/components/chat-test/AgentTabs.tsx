import React from "react";
import { cn } from "@/lib/utils";

type TabType = "chat" | "log";

interface AgentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function AgentTabs({ activeTab, onTabChange }: AgentTabsProps) {
  return (
    <div className="border-b">
      <div className="flex">
        <TabButton
          active={activeTab === "chat"}
          onClick={() => onTabChange("chat")}
        >
          Chat
        </TabButton>
        <TabButton
          active={activeTab === "log"}
          onClick={() => onTabChange("log")}
        >
          Data Log
        </TabButton>
      </div>
    </div>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
        active
          ? "border-[#4457ff] text-[#4457ff]"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
