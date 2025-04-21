
import { useState } from "react";
export function useJarvioAssistantTabs() {
  const [tab, setTab] = useState<"chat" | "datalog">("chat");
  return { tab, setTab };
}
