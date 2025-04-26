
import React from "react";
import { Button } from "@/components/ui/button";
import { CirclePlay, CirclePause } from "lucide-react";

interface AutoRunControlsProps {
  autoRunMode: boolean;
  autoRunPaused: boolean;
  onToggleAutoRun: () => void;
  onTogglePause: () => void;
  className?: string;
}

export const AutoRunControls: React.FC<AutoRunControlsProps> = ({
  autoRunMode,
  autoRunPaused,
  onToggleAutoRun,
  onTogglePause,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {autoRunMode ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePause}
            className="text-primary"
          >
            {autoRunPaused ? (
              <CirclePlay className="h-5 w-5" />
            ) : (
              <CirclePause className="h-5 w-5" />
            )}
            <span className="ml-2">{autoRunPaused ? "Resume" : "Pause"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAutoRun}
            className="text-destructive"
          >
            Stop Auto-Run
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAutoRun}
          className="text-primary"
        >
          <CirclePlay className="h-5 w-5 mr-2" />
          Start Auto-Run
        </Button>
      )}
    </div>
  );
};
