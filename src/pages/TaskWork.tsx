
import React from "react";
import { useParams } from "react-router-dom";
import TaskWorkContainer from "./TaskWorkContainer";

export default function TaskWork() {
  const { taskId } = useParams<{ taskId: string }>();
  
  return <TaskWorkContainer />;
}
