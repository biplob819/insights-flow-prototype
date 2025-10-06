'use client';

import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import { BaseControlProps, ControlContainer } from './BaseControl';

interface CheckboxControlProps extends BaseControlProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function CheckboxControl({
  id,
  config,
  value = false,
  onChange,
  className = ''
}: CheckboxControlProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  }, [onChange]);

  return (
    <ControlContainer
      label={config.label}
      description={config.description}
      required={config.required}
      showLabel={false} // We'll handle the label inline with the checkbox
      labelPosition={config.labelPosition}
      alignment={config.alignment}
      className={className}
    >
      <div className="flex items-start space-x-3">
        {/* Custom Checkbox */}
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            checked={value}
            onChange={handleChange}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all
              ${value 
                ? 'bg-cyan-600 border-cyan-600' 
                : 'bg-white border-gray-300 hover:border-gray-400'
              }
            `}
            onClick={() => onChange(!value)}
          >
            {value && (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
        
        {/* Label and Description */}
        <div className="flex-1">
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 cursor-pointer"
          >
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {config.description && (
            <p className="text-xs text-gray-500 mt-1">{config.description}</p>
          )}
          
          {/* Current Value Display */}
          <div className="mt-2 text-xs text-gray-500">
            Status: <span className={`font-medium ${value ? 'text-green-600' : 'text-gray-400'}`}>
              {value ? 'Checked' : 'Unchecked'}
            </span>
          </div>
        </div>
      </div>
    </ControlContainer>
  );
}
