
import React from 'react';
import { Category } from '../types/blockTypes';

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  getCategoryColor: (category: string) => string;
}

export function CategoryFilters({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  getCategoryColor 
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            selectedCategory === category.id
              ? 'bg-blue-50 border border-blue-200 text-blue-700'
              : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.id)}`} />
          <span className="font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
