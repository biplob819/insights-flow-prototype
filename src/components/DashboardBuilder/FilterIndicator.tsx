'use client';

import React, { useState } from 'react';
import { Filter, X, Eye, EyeOff } from 'lucide-react';
import { AppliedFilter } from './hooks/useFilteredData';

interface FilterIndicatorProps {
  filters: AppliedFilter[];
  totalRecords?: number;
  filteredRecords?: number;
  onClearFilter?: (controlId: string) => void;
  onClearAllFilters?: () => void;
  className?: string;
}

export default function FilterIndicator({
  filters,
  totalRecords,
  filteredRecords,
  onClearFilter,
  onClearAllFilters,
  className = ''
}: FilterIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (filters.length === 0) {
    return null;
  }

  const reductionPercentage = totalRecords && filteredRecords 
    ? Math.round(((totalRecords - filteredRecords) / totalRecords) * 100)
    : 0;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            {filters.length} filter{filters.length !== 1 ? 's' : ''} applied
          </span>
          {totalRecords && filteredRecords && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {filteredRecords.toLocaleString()} of {totalRecords.toLocaleString()} records
              {reductionPercentage > 0 && (
                <span className="ml-1">(-{reductionPercentage}%)</span>
              )}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          
          {onClearAllFilters && (
            <button
              onClick={onClearAllFilters}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Details */}
      {isExpanded && (
        <div className="border-t border-blue-200 p-3 space-y-2">
          {filters.map((filter) => (
            <div
              key={filter.controlId}
              className="flex items-center justify-between bg-white p-2 rounded border border-blue-100"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {filter.label}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {filter.controlType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatFilterValue(filter)}
                </div>
              </div>
              
              {onClearFilter && (
                <button
                  onClick={() => onClearFilter(filter.controlId)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                  title="Remove this filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFilterValue(filter: AppliedFilter): string {
  const { controlType, value, operator } = filter;

  switch (controlType) {
    case 'text-input':
      const textOp = operator || 'contains';
      const operatorText = {
        'equal-to': 'equals',
        'not-equal-to': 'does not equal',
        'contains': 'contains',
        'does-not-contain': 'does not contain',
        'starts-with': 'starts with',
        'does-not-start-with': 'does not start with',
        'ends-with': 'ends with',
        'does-not-end-with': 'does not end with',
        'matches-regexp': 'matches pattern',
        'does-not-match-regexp': 'does not match pattern'
      }[textOp] || textOp;
      
      return `${operatorText} "${value}"`;

    case 'number-input':
      const numOp = operator || 'equal-to';
      const numberOperatorText = {
        'equal-to': '=',
        'less-than-or-equal': '≤',
        'greater-than-or-equal': '≥'
      }[numOp] || numOp;
      
      return `${numberOperatorText} ${value}`;

    case 'switch':
    case 'checkbox':
      return value ? 'True' : 'False';

    case 'list-values':
      if (Array.isArray(value)) {
        return value.length > 3 
          ? `${value.slice(0, 3).join(', ')} and ${value.length - 3} more`
          : value.join(', ');
      }
      return String(value);

    case 'number-range':
      if (typeof value === 'object' && value !== null) {
        const { min, max } = value;
        if (min !== undefined && max !== undefined) {
          return `${min} - ${max}`;
        } else if (min !== undefined) {
          return `≥ ${min}`;
        } else if (max !== undefined) {
          return `≤ ${max}`;
        }
      }
      return String(value);

    case 'date-range':
      if (typeof value === 'object' && value !== null) {
        const { start, end } = value;
        const formatDate = (date: Date) => date.toLocaleDateString();
        
        if (start && end) {
          return `${formatDate(new Date(start))} - ${formatDate(new Date(end))}`;
        } else if (start) {
          return `From ${formatDate(new Date(start))}`;
        } else if (end) {
          return `Until ${formatDate(new Date(end))}`;
        }
      }
      return String(value);

    case 'slider':
    case 'range-slider':
      return `≥ ${value}`;

    default:
      return String(value);
  }
}
