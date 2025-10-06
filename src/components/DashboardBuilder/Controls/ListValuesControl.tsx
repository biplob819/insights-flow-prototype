'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { ChevronDown, X, Check, ArrowUpDown, ArrowUp, ArrowDown, Hash, Type, Play } from 'lucide-react';

type SortOption = 'none' | 'asc-alpha' | 'desc-alpha' | 'asc-count' | 'desc-count';

export default function ListValuesControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  
  // Use provided options or generate dummy data for demonstration
  const baseOptions = config.manualValues && config.manualValues.length > 0 
    ? config.manualValues 
    : [
        { value: '2024', displayValue: '2024' },
        { value: '2023', displayValue: '2023' },
        { value: '2022', displayValue: '2022' },
        { value: '2021', displayValue: '2021' },
        { value: '2020', displayValue: '2020' },
        { value: 'Q1/2024', displayValue: 'Q1/2024' },
        { value: 'Q2/2024', displayValue: 'Q2/2024' },
        { value: 'Q3/2024', displayValue: 'Q3/2024' },
        { value: 'Q4/2024', displayValue: 'Q4/2024' },
        { value: 'January', displayValue: 'January' },
        { value: 'February', displayValue: 'February' },
        { value: 'March', displayValue: 'March' },
        { value: 'April', displayValue: 'April' },
        { value: 'May', displayValue: 'May' },
        { value: 'June', displayValue: 'June' },
        { value: 'North America', displayValue: 'North America' },
        { value: 'Europe', displayValue: 'Europe' },
        { value: 'Asia Pacific', displayValue: 'Asia Pacific' },
        { value: 'Latin America', displayValue: 'Latin America' },
        { value: 'Middle East', displayValue: 'Middle East' }
      ];
  
  // Generate realistic counts for demonstration
  const optionsWithCounts = baseOptions.map((option, index) => ({
    ...option,
    count: Math.floor(Math.random() * 50000) + 10000 + (index * 1000) // Varied realistic counts
  }));
  
  const filteredOptions = optionsWithCounts.filter(option => 
    option.displayValue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort options based on selected sort method
  const sortedOptions = [...filteredOptions].sort((a, b) => {
    switch (sortBy) {
      case 'asc-alpha':
        return (a.displayValue || a.value || '').toString().localeCompare((b.displayValue || b.value || '').toString());
      case 'desc-alpha':
        return (b.displayValue || b.value || '').toString().localeCompare((a.displayValue || a.value || '').toString());
      case 'asc-count':
        return a.count - b.count;
      case 'desc-count':
        return b.count - a.count;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: any) => {
    if (config.multiSelect !== false) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClearAll = () => {
    onChange(config.multiSelect !== false ? [] : null);
  };

  const handleSelectAll = () => {
    if (config.multiSelect !== false) {
      onChange(sortedOptions.map(opt => opt.value));
    }
  };

  const getSortIcon = (sortOption: SortOption) => {
    if (sortBy === sortOption) {
      if (sortOption.includes('asc')) return <ArrowUp className="w-3 h-3" />;
      if (sortOption.includes('desc')) return <ArrowDown className="w-3 h-3" />;
    }
    return null;
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return config.placeholderText || 'Select...';
    }
    if (selectedValues.length === 1) {
      const option = baseOptions.find(opt => opt.value === selectedValues[0]);
      return option?.displayValue || option?.value || 'Selected';
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <ControlContainer
      label={config.label}
      description={config.description}
      required={config.required}
      showLabel={config.showLabel}
      labelPosition={config.labelPosition}
      alignment={config.alignment}
      className={className}
    >
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 flex items-center justify-between transition-all ${
            isOpen 
              ? 'border-cyan-500 ring-2 ring-cyan-100' 
              : selectedValues.length > 0 
                ? 'border-cyan-300 bg-cyan-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className={`truncate ${selectedValues.length > 0 ? 'font-medium text-cyan-900' : 'text-gray-700'}`}>
              {getDisplayText()}
            </span>
            {selectedValues.length > 1 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-100 text-cyan-800 font-medium">
                +{selectedValues.length - 1}
              </span>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180 text-cyan-500' : 'text-gray-400'}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Search input - only show when search is enabled and multiselect is off */}
            {config.enableSearch !== false && config.multiSelect === false && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <div className="absolute right-1 top-1">
                    <div className="relative">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle sort dropdown
                        }}
                      >
                        <ArrowUpDown className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search input for multiselect mode */}
            {config.multiSelect !== false && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <div className="absolute right-1 top-1">
                    <div className="relative">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle sort dropdown
                        }}
                      >
                        <ArrowUpDown className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort options - show for both single and multiselect */}
            <div className="px-2 py-1 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="font-medium">SORT BY</span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setSortBy(sortBy === 'asc-count' ? 'desc-count' : 'asc-count')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors ${
                      sortBy.includes('count') ? 'bg-cyan-100 text-cyan-700' : ''
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    <span>Count</span>
                    {getSortIcon(sortBy.includes('count') ? sortBy as SortOption : 'asc-count')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy(sortBy === 'asc-alpha' ? 'desc-alpha' : 'asc-alpha')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors ${
                      sortBy.includes('alpha') ? 'bg-cyan-100 text-cyan-700' : ''
                    }`}
                  >
                    <Type className="w-3 h-3" />
                    <span>A-Z</span>
                    {getSortIcon(sortBy.includes('alpha') ? sortBy as SortOption : 'asc-alpha')}
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons - show when multiselect is enabled */}
            {config.multiSelect !== false && (
              <div className={`px-3 py-2 border-b border-gray-200 ${
                config.filterWithApply ? 'bg-cyan-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between min-h-[24px]">
                  <div className="flex items-center space-x-4 flex-1">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium hover:underline whitespace-nowrap"
                    >
                      <Check className="w-3 h-3 flex-shrink-0" />
                      <span>Select All</span>
                    </button>
                    {config.showClearOption !== false && (
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="flex items-center space-x-1 text-xs text-gray-600 hover:text-red-600 font-medium hover:underline whitespace-nowrap"
                      >
                        <X className="w-3 h-3 flex-shrink-0" />
                        <span>Clear {config.filterWithApply ? 'all' : 'All'}</span>
                      </button>
                    )}
                  </div>
                  {config.filterWithApply && (
                    <button
                      type="button"
                      onClick={() => {
                        // Apply the current selection
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors font-medium ml-3 flex-shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Apply</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              {sortedOptions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-sm text-gray-500 mb-1">No options found</div>
                  {searchTerm && (
                    <div className="text-xs text-gray-400">
                      Try adjusting your search term
                    </div>
                  )}
                </div>
              ) : (
                sortedOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={index}
                      onClick={() => handleToggleOption(option.value)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-cyan-50 hover:bg-cyan-100 border-l-2 border-cyan-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {config.showCheckboxes !== false && config.multiSelect !== false && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent click
                            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                          />
                        )}
                        <span className={`text-sm truncate ${isSelected ? 'font-medium text-cyan-900' : 'text-gray-900'}`}>
                          {option.displayValue || option.value}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {option.count.toLocaleString()}
                        </span>
                        {!config.showCheckboxes && isSelected && (
                          <Check className="h-4 w-4 text-cyan-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </ControlContainer>
  );
}
