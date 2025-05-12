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
          <h2 className="font-semibold text-lg text-[#4a4a4a]">
            Jarvio Assistant
          </h2>
        </div>
      </div>
    </div>
  );
}
