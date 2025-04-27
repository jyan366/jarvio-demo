
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutoRunControls } from "./AutoRunControls";
import { JarvioTab } from "./hooks/useJarvioAssistantTabs";

interface JarvioHeaderProps {
  tab: JarvioTab;
  setTab: (tab: JarvioTab) => void;
  autoRunMode: boolean;
  autoRunPaused: boolean;
  onToggleAutoRun: () => void;
  onTogglePause: () => void;
}

export const JarvioHeader: React.FC<JarvioHeaderProps> = ({
  tab,
  setTab,
  autoRunMode,
  autoRunPaused,
  onToggleAutoRun,
  onTogglePause
}) => {
  return (
    <>
      <div className="border-b">
        <Tabs 
          value={tab} 
          onValueChange={(value) => setTab(value as JarvioTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="datalog">Data Log</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "chat" && (
        <div className="flex justify-between items-center p-3 border-b">
          <AutoRunControls
            autoRunMode={autoRunMode}
            autoRunPaused={autoRunPaused}
            onToggleAutoRun={onToggleAutoRun}
            onTogglePause={onTogglePause}
            className="w-full"
          />
        </div>
      )}
    </>
  );
};
