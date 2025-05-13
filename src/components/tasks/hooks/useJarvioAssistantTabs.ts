
import { useState } from "react";

export type JarvioTab = "chat" | "datalog" | "documents";

export function useJarvioAssistantTabs() {
  const [tab, setTab] = useState<JarvioTab>("chat");
  const [hasPrioritized, setHasPrioritized] = useState(false);

  return {
    tab,
    setTab,
    hasPrioritized,
    setHasPrioritized
  };
}
