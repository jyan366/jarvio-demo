
import React from "react";
import { useParams } from "react-router-dom";
import UnifiedTaskWorkContainer from "./UnifiedTaskWorkContainer";

export default function TaskWork() {
  const { taskId } = useParams<{ taskId: string }>();
  
  if (!taskId) {
    return <div className="flex items-center justify-center min-h-screen">No task ID provided</div>;
  }
  
  return <UnifiedTaskWorkContainer />;
}
