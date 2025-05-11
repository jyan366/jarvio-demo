
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { BlockCategory, flowBlockOptions } from '@/data/flowBlockOptions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AddFlowBlockDialogProps {
  onBlockAdded: () => void;
}

export function AddFlowBlockDialog({ onBlockAdded }: AddFlowBlockDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockType, setBlockType] = useState<BlockCategory>('collect');
  const [blockName, setBlockName] = useState('');
  const [description, setDescription] = useState('');
  const [configJson, setConfigJson] = useState('{}');

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      // Reset form
      setBlockType('collect');
      setBlockName('');
      setDescription('');
      setConfigJson('{}');
    }
  };

  const handleAddBlock = async () => {
    if (!blockName.trim()) {
      toast({
        title: "Block name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Parse the JSON config
      let configData = {};
      try {
        configData = JSON.parse(configJson);
        // Add description to the config
        configData = {
          ...configData,
          description: description,
        };
      } catch (e) {
        toast({
          title: "Invalid JSON configuration",
          description: "Please check your JSON format",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create the flow block config
      const { error } = await supabase
        .from('flow_block_configs')
        .insert({
          id: uuidv4(),
          block_type: blockType,
          block_name: blockName,
          is_functional: false, // Default to demo mode
          config_data: configData,
          credentials: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Block added successfully",
        description: `${blockName} has been added in demo mode`,
      });
      
      setOpen(false);
      onBlockAdded(); // Refresh the block list
    } catch (error) {
      console.error('Error adding block:', error);
      toast({
        title: "Failed to add block",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add New Block
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Flow Block</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="block-type" className="text-right">
              Block Type
            </Label>
            <Select
              value={blockType}
              onValueChange={(value: BlockCategory) => setBlockType(value)}
            >
              <SelectTrigger id="block-type" className="col-span-3">
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collect">Collect</SelectItem>
                <SelectItem value="think">Think</SelectItem>
                <SelectItem value="act">Act</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="block-name" className="text-right">
              Block Name
            </Label>
            <Input
              id="block-name"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="config-json" className="text-right">
              Config (JSON)
            </Label>
            <Textarea
              id="config-json"
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              className="col-span-3 font-mono"
              placeholder="{}"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAddBlock} disabled={loading}>
            {loading ? 'Adding...' : 'Add Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
