'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

export default function SegmentedControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const options = config.manualValues || [];
  
  const handleSelect = (optionValue: any) => {
    onChange(optionValue === value ? null : optionValue);
  };

  const handleClear = () => {
    onChange(null);
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
      <div className="space-y-2">
        <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
          {options.slice(0, 7).map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${isSelected 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-300' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {option.displayValue || option.value}
              </button>
            );
          })}
        </div>
        
        {config.showClearOption && value !== null && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear selection
          </button>
        )}
      </div>
    </ControlContainer>
  );
}
