
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Grid, List, Plus } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Category, ViewMode } from '@/types/knowledge-base';

interface DocumentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  categories: Category[];
}

export function DocumentFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  categories
}: DocumentFiltersProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 w-full bg-gray-50 dark:bg-gray-900 border-0"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select 
          value={selectedCategory} 
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
            className="bg-gray-50 dark:bg-gray-900 text-sm sm:text-base flex-1 sm:flex-none"
            size={isMobile ? "sm" : "default"}
          >
            {viewMode === 'grid' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base flex-1 sm:flex-none"
            size={isMobile ? "sm" : "default"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>
    </div>
  );
}
