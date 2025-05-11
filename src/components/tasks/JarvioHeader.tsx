
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { JarvioTab } from "./hooks/useJarvioAssistantTabs";

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
  isFlowTask = false
}: JarvioHeaderProps) {
  return (
    <div className="flex flex-col border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {isFlowTask ? "Flow Assistant" : "Jarvio AI Assistant"}
          </span>
          <div className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-sm">
            {isFlowTask ? `Step ${currentStep}/${totalSteps}` : `Subtask ${currentStep}/${totalSteps}`}
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50/80 flex items-center justify-between">
        <div className="flex-1 text-sm font-medium truncate text-blue-700">
          {currentStepTitle || (isFlowTask ? "Current Flow Step" : "Current Subtask")}
        </div>

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Wrap TabsList inside a Tabs component with the current tab value */}
      <Tabs value={tab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="chat" onClick={() => setTab("chat")}>
            Chat
          </TabsTrigger>
          <TabsTrigger value="datalog" onClick={() => setTab("datalog")}>
            Data Log
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
