'use client';

import { Category } from '../data/integrations';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) {
  const sortedByCategories = categories.slice(0, 4);
  const topicCategories = categories.slice(4);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col max-h-full">
      {/* Filters Section */}
      <div className="p-6 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Filters
        </h3>
        
        <div className="space-y-2">
          {sortedByCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all group ${
                selectedCategory === category.name
                  ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-sm">{category.name}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                selectedCategory === category.name
                  ? 'bg-cyan-100 text-cyan-600'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
            Categories
          </h3>
          
          <div className="space-y-1 pb-4">
            {topicCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group ${
                  selectedCategory === category.name
                    ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  selectedCategory === category.name
                    ? 'bg-cyan-100 text-cyan-600'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
