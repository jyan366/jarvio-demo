
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JarvioTab } from "./hooks/useJarvioAssistantTabs";
import { Workflow } from "lucide-react";

interface JarvioHeaderProps {
  tab: JarvioTab;
  setTab: (tab: JarvioTab) => void;
  currentStep: number;
  totalSteps: number;
  currentStepTitle?: string;
  isFlowTask?: boolean;
}

export function JarvioHeader({
  tab,
  setTab,
  currentStep,
  totalSteps,
  currentStepTitle,
  isFlowTask
}: JarvioHeaderProps) {
  return (
    <div className="border-b px-3 py-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-[#3527A0] mr-1">Jarvio</span>
          <span className="text-xs px-1.5 py-0.5 bg-[#F4F2FF] text-[#3527A0] rounded">AI</span>
          {isFlowTask && (
            <div className="ml-2 flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              <Workflow className="w-3 h-3 mr-1" />
              <span className="text-xs font-medium">Flow</span>
            </div>
          )}
        </div>
        {totalSteps > 0 && (
          <div className="text-xs text-muted-foreground flex items-center">
            <span>Step {currentStep}/{totalSteps}</span>
          </div>
        )}
      </div>
      
      {currentStepTitle && (
        <div className="text-sm font-semibold mb-3 max-w-[90%] truncate">
          {currentStepTitle}
        </div>
      )}
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as JarvioTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="datalog">Data Log</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
