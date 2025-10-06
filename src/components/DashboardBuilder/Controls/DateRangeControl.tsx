'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { Calendar } from 'lucide-react';

export default function DateRangeControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const dateFormat = config.dateFormat || 'yyyy-MM-dd';
  // Value should be an object { start: string, end: string }
  const currentRange = value || { start: '', end: '' };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...currentRange, start: e.target.value });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...currentRange, end: e.target.value });
  };

  const handleClear = () => {
    onChange({ start: '', end: '' });
  };

  // Convert date format to HTML input format
  const getInputType = () => {
    if (dateFormat.includes('HH') || dateFormat.includes('mm')) {
      return 'datetime-local';
    }
    return 'date';
  };

  const setPresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
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
              Start Date
            </label>
            <div className="relative">
              <input
                type={getInputType()}
                value={currentRange.start}
                onChange={handleStartChange}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type={getInputType()}
                value={currentRange.end}
                onChange={handleEndChange}
                min={currentRange.start} // Ensure end date is not before start date
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Date range validation */}
        {currentRange.start && currentRange.end && currentRange.start > currentRange.end && (
          <div className="text-xs text-red-600">
            Start date cannot be after end date
          </div>
        )}
        
        {/* Preset ranges */}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setPresetRange(7)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Last 7 days
          </button>
          <button
            type="button"
            onClick={() => setPresetRange(30)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Last 30 days
          </button>
          <button
            type="button"
            onClick={() => setPresetRange(90)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Last 90 days
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              onChange({
                start: startOfMonth.toISOString().split('T')[0],
                end: now.toISOString().split('T')[0]
              });
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
          >
            This Month
          </button>
          {(currentRange.start || currentRange.end) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded"
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Current range display */}
        {currentRange.start && currentRange.end && (
          <div className="text-xs text-gray-600">
            Range: {currentRange.start} to {currentRange.end}
          </div>
        )}
      </div>
    </ControlContainer>
  );
}
