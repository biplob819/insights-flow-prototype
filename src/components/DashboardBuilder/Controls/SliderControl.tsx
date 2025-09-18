'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

export default function SliderControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const minValue = config.minValue ?? 0;
  const maxValue = config.maxValue ?? 100;
  const step = config.step ?? 1;
  const currentValue = value ?? minValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;

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
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{minValue}</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{currentValue}</span>
          </div>
          <span>{maxValue}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </ControlContainer>
  );
}
