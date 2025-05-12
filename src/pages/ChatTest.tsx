
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AgentChatInterface } from "@/components/chat-test/AgentChatInterface";

export default function ChatTest() {
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Chat Test</h1>
          <p className="text-muted-foreground">Testing the redesigned agent interface</p>
        </header>
        <div className="flex-1 overflow-hidden border rounded-lg shadow-sm">
          <AgentChatInterface />
        </div>
      </div>
    </MainLayout>
  );
}
