import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle } from "lucide-react";
import type { Message, Subtask } from "./AgentChatInterface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AgentMessageAreaProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIndex: number;
  onStepClick?: (stepIndex: number) => void;
}

export function AgentMessageArea({
  messages,
  subtasks,
  activeSubtaskIndex,
  onStepClick
}: AgentMessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Group messages by sender to add logo only at the start of a sequence
  const messageGroups: Message[][] = [];
  let currentGroup: Message[] = [];
  let currentSender: boolean | null = null;
  messages.forEach(message => {
    // If this is the first message or sender changed, start a new group
    if (currentSender === null || currentSender !== message.isUser) {
      if (currentGroup.length > 0) {
        messageGroups.push([...currentGroup]);
      }
      currentGroup = [message];
      currentSender = message.isUser;
    } else {
      // Same sender, add to current group
      currentGroup.push(message);
    }
  });

  // Add the last group if not empty
  if (currentGroup.length > 0) {
    messageGroups.push(currentGroup);
  }

  // Get step title based on step number
  const getStepTitle = (stepNumber: number): string => {
    if (stepNumber > 0 && stepNumber <= subtasks.length) {
      return subtasks[stepNumber - 1]?.title || `Step ${stepNumber}`;
    }
    return `Step ${stepNumber}`;
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#fcfbf8]">
      <ScrollArea className="h-full">
        <div className="p-2 pb-4">
          {messageGroups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`}>
              {/* Agent messages */}
              {!group[0].isUser && (
                <>
                  {/* Jarvio branded header at start of agent message sequence */}
                  <div className="flex items-center mb-1 text-xs text-gray-600">
                    <img alt="Jarvio" src="/lovable-uploads/ba87deb0-bc72-4989-90bd-fdc7cdcc5b9e.png" className="w-[24px] h-auto" />
                    <span className="ml-1 font-bold mx-[2px] text-base text-gray-800">Jarvio</span>
                  </div>
                  {group.map(message => (
                    <div key={message.id} className="flex mb-2 gap-1">
                      <div className="flex-shrink-0 w-6 self-start"></div>
                      <div className="max-w-[85%]">
                        {/* Loading execution message - "Here's what I'm about to do" */}
                        {message.isLoading && (
                          <div className="bg-[#f5f7fa] border border-[#e6e9f0] rounded-lg p-3 mb-2 cursor-pointer transition-all duration-300 hover:bg-[#f0f4fa]" 
                               onClick={() => message.stepNumber && onStepClick && onStepClick(message.stepNumber - 1)}>
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <div className="rounded-full bg-[#eef0fe] p-1.5 flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin text-[#4457ff]" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-[#4457ff] mb-1">
                                  {message.stepNumber ? `Step ${message.stepNumber}: ${getStepTitle(message.stepNumber)}` : 'Processing...'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {message.text || 'Analyzing information...'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Step completion box */}
                        {message.isStepCompletion && message.stepNumber && (
                          <div className="bg-[#f0f7f0] border border-[#e0efe0] rounded-lg p-3 mb-2 cursor-pointer transition-all duration-300 hover:bg-[#e9f5e9]" 
                               onClick={() => message.stepNumber && onStepClick && onStepClick(message.stepNumber - 1)}>
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <div className="rounded-full bg-[#e0f5e0] p-1.5 flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-green-700 mb-1">
                                  Step {message.stepNumber} completed: {getStepTitle(message.stepNumber)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Regular message - Summary of what's been done - NO BORDER */}
                        {!message.isLoading && (!message.isStepCompletion || (message.isStepCompletion && message.text)) && (
                          <div className="p-1 mb-2 text-gray-900">
                            <div className="text-[15px]">{message.text}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {/* User messages - no avatar, right aligned */}
              {group[0].isUser && (
                <>
                  {group.map(message => (
                    <div key={message.id} className="flex justify-end mb-2">
                      <div className="max-w-[85%]">
                        <div className="bg-[#f8f4ed] border border-[#e6e6e6] rounded-lg p-2 mb-1 text-gray-900 flex flex-col">
                          <div className="text-[15px]">{message.text}</div>
                          <div className="text-xs text-gray-400 mt-1 self-end">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
