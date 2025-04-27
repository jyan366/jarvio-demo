
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JarvioTab } from "./hooks/useJarvioAssistantTabs";

interface JarvioHeaderProps {
  tab: JarvioTab;
  setTab: (tab: JarvioTab) => void;
  currentStep: number;
  totalSteps: number;
  currentStepTitle?: string;
}

export const JarvioHeader: React.FC<JarvioHeaderProps> = ({
  tab,
  setTab,
  currentStep,
  totalSteps,
  currentStepTitle
}) => {
  return (
    <>
      <div className="border-b">
        <div className="bg-muted/30 px-4 py-2 border-b">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
          <h3 className="font-medium truncate text-purple-700">{currentStepTitle}</h3>
        </div>
        <Tabs 
          value={tab} 
          onValueChange={(value) => setTab(value as JarvioTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="datalog">Work Log</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};
