
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Block } from '../types/blockTypes';

interface BlockCardProps {
  block: Block;
  selectedCategory: string;
  getCategoryColor: (category: string) => string;
  onBlockClick: (block: Block) => void;
}

export function BlockCard({ 
  block, 
  selectedCategory, 
  getCategoryColor, 
  onBlockClick 
}: BlockCardProps) {
  const IconComponent = block.icon;
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md border border-gray-200 bg-white flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {block.logo ? (
                <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                  <img 
                    src={block.logo} 
                    alt={`${block.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                  <IconComponent className="h-7 w-7 text-gray-700" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium text-gray-900">
                {block.name}
              </CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            onClick={() => onBlockClick(block)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col flex-1">
        <CardDescription className="text-xs text-gray-600 mb-4 line-clamp-2 flex-1">
          {block.summary}
        </CardDescription>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor(selectedCategory)}`} />
            <Badge variant="secondary" className="text-xs capitalize">
              {selectedCategory}
            </Badge>
            {block.name === 'Pull from Amazon' && (
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                Nerd Mode
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
            onClick={() => onBlockClick(block)}
          >
            Learn more
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
