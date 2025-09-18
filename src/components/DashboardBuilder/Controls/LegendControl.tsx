'use client';

import React, { useState } from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { Eye, EyeOff } from 'lucide-react';

export default function LegendControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  // Value should be an object with series visibility states
  const legendState = value || {};
  const [selectAll, setSelectAll] = useState(true);

  // Mock legend items - in real implementation, this would come from chart data
  const legendItems = [
    { id: 'series1', name: 'Sales', color: '#3b82f6', visible: legendState.series1 !== false },
    { id: 'series2', name: 'Revenue', color: '#ef4444', visible: legendState.series2 !== false },
    { id: 'series3', name: 'Profit', color: '#10b981', visible: legendState.series3 !== false },
    { id: 'series4', name: 'Expenses', color: '#f59e0b', visible: legendState.series4 !== false },
    { id: 'series5', name: 'Growth', color: '#8b5cf6', visible: legendState.series5 !== false }
  ];

  const handleToggleItem = (itemId: string) => {
    const newState = {
      ...legendState,
      [itemId]: !legendState[itemId]
    };
    onChange(newState);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newState: { [key: string]: boolean } = {};
    legendItems.forEach(item => {
      newState[item.id] = newSelectAll;
    });
    onChange(newState);
  };

  const visibleCount = legendItems.filter(item => item.visible).length;

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
      <div className="space-y-3">
        {/* Header with select all */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            Chart Series ({visibleCount}/{legendItems.length} visible)
          </h4>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {selectAll ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Legend items */}
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {legendItems.map((item) => (
            <div
              key={item.id}
              className={`
                flex items-center justify-between p-2 rounded border cursor-pointer transition-colors
                ${item.visible 
                  ? 'bg-white border-gray-300 hover:bg-gray-50' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
                }
              `}
              onClick={() => handleToggleItem(item.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.visible ? item.color : '#d1d5db' }}
                />
                <span className={`text-sm ${item.visible ? 'text-gray-900' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleItem(item.id);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                {item.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Legend position options */}
        <div className="border-t pt-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Legend Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['top', 'bottom', 'left', 'right'].map((position) => (
              <button
                key={position}
                type="button"
                className={`
                  px-2 py-1 text-xs rounded border capitalize
                  ${(config as any).legendPosition === position
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }
                `}
                onClick={() => {
                  if ((config as any).onConfigChange) {
                    (config as any).onConfigChange({ legendPosition: position as any });
                  }
                }}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {visibleCount === 0 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ All series are hidden. Chart may not display any data.
          </div>
        )}
      </div>
    </ControlContainer>
  );
}
