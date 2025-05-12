import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, Loader2 } from "lucide-react";
import { AgentDataDetails } from "./AgentDataDetails";
import type { Subtask } from "./AgentChatInterface";

interface ExtendedSubtask extends Subtask {
  data?: string | null;
}

interface AgentDataLogTabProps {
  subtasks: ExtendedSubtask[];
  activeSubtaskIndex: number;
}

export function AgentDataLogTab({ subtasks, activeSubtaskIndex }: AgentDataLogTabProps) {
  const [selectedSubtask, setSelectedSubtask] = useState<number>(activeSubtaskIndex);
  
  return (
    <div className="h-full flex">
      <div className="w-1/2 border-r">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Execution Log</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subtasks.map((subtask, index) => (
                  <TableRow 
                    key={subtask.id}
                    className={`cursor-pointer ${selectedSubtask === index ? "bg-gray-100" : ""}`}
                    onClick={() => setSelectedSubtask(index)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subtask.title}</TableCell>
                    <TableCell>
                      {subtask.done ? (
                        <span className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" /> Completed
                        </span>
                      ) : index === activeSubtaskIndex ? (
                        <span className="flex items-center text-amber-600">
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" /> In Progress
                        </span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      
      <div className="w-1/2 p-4">
        <h3 className="text-lg font-medium mb-4">Step Details</h3>
        <AgentDataDetails 
          subtaskIndex={selectedSubtask}
          subtaskTitle={subtasks[selectedSubtask]?.title || ""}
          isDone={subtasks[selectedSubtask]?.done || false}
          subtaskData={subtasks[selectedSubtask]?.data || null}
        />
      </div>
    </div>
  );
}
