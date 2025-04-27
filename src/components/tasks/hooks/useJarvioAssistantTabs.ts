
import { useState } from "react";

export type JarvioTab = "chat" | "datalog" | "documents";

export function useJarvioAssistantTabs() {
  const [tab, setTab] = useState<JarvioTab>("chat");

  return {
    tab,
    setTab,
  };
}
