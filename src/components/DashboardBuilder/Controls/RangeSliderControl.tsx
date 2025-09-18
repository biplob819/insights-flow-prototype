'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

export default function RangeSliderControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const minValue = config.minValue ?? 0;
  const maxValue = config.maxValue ?? 100;
  const step = config.step ?? 1;
  
  // Value should be an array [min, max]
  const currentRange = Array.isArray(value) ? value : [minValue, maxValue];
  const [rangeMin, rangeMax] = currentRange;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    const newMax = Math.max(newMin, rangeMax);
    onChange([newMin, newMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    const newMin = Math.min(rangeMin, newMax);
    onChange([newMin, newMax]);
  };

  const minPercentage = ((rangeMin - minValue) / (maxValue - minValue)) * 100;
  const maxPercentage = ((rangeMax - minValue) / (maxValue - minValue)) * 100;

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
        <div className="relative h-6">
          {/* Track */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg"></div>
          
          {/* Active range */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-lg"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
          ></div>
          
          {/* Min slider */}
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={rangeMin}
            onChange={handleMinChange}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer range-slider"
          />
          
          {/* Max slider */}
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={rangeMax}
            onChange={handleMaxChange}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer range-slider"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Min:</span>
            <span className="font-medium text-gray-900">{rangeMin}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Max:</span>
            <span className="font-medium text-gray-900">{rangeMax}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
      </div>

      <style jsx>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: all;
          position: relative;
          z-index: 1;
        }

        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: all;
        }

        .range-slider::-webkit-slider-track {
          background: transparent;
        }

        .range-slider::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </ControlContainer>
  );
}
