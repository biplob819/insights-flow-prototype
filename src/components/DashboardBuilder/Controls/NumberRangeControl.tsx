'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

export default function NumberRangeControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  // Value should be an object { min: number, max: number }
  const currentRange = value || { min: '', max: '' };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValue = e.target.value === '' ? '' : parseFloat(e.target.value);
    onChange({ ...currentRange, min: minValue });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxValue = e.target.value === '' ? '' : parseFloat(e.target.value);
    onChange({ ...currentRange, max: maxValue });
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
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum
            </label>
            <input
              type="number"
              value={currentRange.min}
              onChange={handleMinChange}
              placeholder="Min value"
              step={config.step || 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Maximum
            </label>
            <input
              type="number"
              value={currentRange.max}
              onChange={handleMaxChange}
              placeholder="Max value"
              step={config.step || 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Range validation feedback */}
        {currentRange.min !== '' && currentRange.max !== '' && currentRange.min > currentRange.max && (
          <div className="text-xs text-red-600">
            Minimum value cannot be greater than maximum value
          </div>
        )}
        
        {/* Current range display */}
        {(currentRange.min !== '' || currentRange.max !== '') && (
          <div className="text-xs text-gray-600">
            Range: {currentRange.min || '∞'} to {currentRange.max || '∞'}
          </div>
        )}
      </div>
    </ControlContainer>
  );
}
