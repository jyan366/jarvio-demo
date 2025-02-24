
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "Sales",
  "Inventory",
  "Listings",
  "Advertising",
  "Customers",
  "Competitors",
  "Other"
];

interface CreateInsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsightCreate: (insight: {
    title: string;
    description: string;
    category: string;
    tasks: { id: string; name: string; completed: boolean; }[];
  }) => void;
}

export function CreateInsightDialog({
  open,
  onOpenChange,
  onInsightCreate,
}: CreateInsightDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Listings",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get AI-suggested tasks
      const { data, error } = await supabase.functions.invoke('suggest-tasks', {
        body: { insight: formData }
      });

      if (error) throw error;

      // Create the insight with AI-suggested tasks
      onInsightCreate({
        ...formData,
        tasks: data.tasks || [
          { id: "1", name: "Review Impact", completed: false },
          { id: "2", name: "Take Action", completed: false },
          { id: "3", name: "Monitor Results", completed: false },
        ]
      });

      onOpenChange(false);
      setFormData({ title: "", description: "", category: "Listings" });
    } catch (error) {
      console.error('Error creating insight:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Create Insight</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Insight Title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter insight description..."
                required
                className="min-h-[100px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              'Add Insight'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
