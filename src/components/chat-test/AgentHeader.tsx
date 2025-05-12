
import React from "react";

interface AgentHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export function AgentHeader({ currentStep, totalSteps, stepTitle }: AgentHeaderProps) {
  return (
    <div className="border-b p-4 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-sm text-[#9b87f5]">
            Step {currentStep} of {totalSteps}
          </h2>
          <h3 className="font-medium text-lg">{stepTitle}</h3>
        </div>
      </div>
    </div>
  );
}
