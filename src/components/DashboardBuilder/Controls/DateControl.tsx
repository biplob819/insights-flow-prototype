'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { Calendar } from 'lucide-react';

export default function DateControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const dateFormat = config.dateFormat || 'yyyy-MM-dd';
  const currentValue = value || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  // Convert date format to HTML input format
  const getInputType = () => {
    if (dateFormat.includes('HH') || dateFormat.includes('mm')) {
      return 'datetime-local';
    }
    return 'date';
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
        <div className="relative">
          <input
            type={getInputType()}
            value={currentValue}
            onChange={handleChange}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Relative date presets */}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => onChange(new Date().toISOString().split('T')[0])}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              onChange(yesterday.toISOString().split('T')[0]);
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => {
              const lastWeek = new Date();
              lastWeek.setDate(lastWeek.getDate() - 7);
              onChange(lastWeek.toISOString().split('T')[0]);
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Last Week
          </button>
          {currentValue && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </ControlContainer>
  );
}
