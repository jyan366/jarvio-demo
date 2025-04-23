
import * as React from "react";
import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navigationSections = [
  { id: "workflow", label: "Workflow" },
  { id: "brand", label: "Brand Toolkit" },
  { id: "support", label: "Support" },
];

export function NavigationSettings() {
  const [visibleSections, setVisibleSections] = React.useState<string[]>(
    navigationSections.map(section => section.id)
  );

  const toggleSection = (sectionId: string) => {
    setVisibleSections(current =>
      current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group-data-[collapsible=icon]:hidden"
        >
          <Cog className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start" side="top">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Navigation Settings</h4>
          <Separator />
          <div className="space-y-4">
            {navigationSections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between space-x-2"
              >
                <Label htmlFor={section.id} className="flex flex-col space-y-1">
                  <span>{section.label}</span>
                </Label>
                <Switch
                  id={section.id}
                  checked={visibleSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
