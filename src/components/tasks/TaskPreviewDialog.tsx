
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";

interface TaskPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
}

export function TaskPreviewDialog({ open, onOpenChange, task }: TaskPreviewDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle>{task.title}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{task.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{task.status}</Badge>
                <Badge variant="secondary">{task.priority}</Badge>
                <Badge variant="outline">{task.category}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
              {task.products?.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">ASIN: {product.asin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{product.price}</p>
                    <p className="text-sm text-muted-foreground">{product.units} units</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Subtasks</h3>
                <Button variant="outline" size="sm">Add Subtask</Button>
              </div>
              <div className="space-y-2">
                {task.subtasks?.map((subtask: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{subtask.title}</span>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Comments</h3>
                <Button variant="outline" size="sm">Add Comment</Button>
              </div>
              <div className="space-y-4">
                {task.comments?.map((comment: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
