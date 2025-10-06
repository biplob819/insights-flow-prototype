'use client';

import React, { useState, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { TextOperator } from '../types';

interface TextInputControlProps extends BaseControlProps {
  value: string;
  onChange: (value: string) => void;
}

const textOperators: { value: TextOperator; label: string }[] = [
  { value: 'equal-to', label: 'Equal to' },
  { value: 'not-equal-to', label: 'Not equal to' },
  { value: 'contains', label: 'Contains' },
  { value: 'does-not-contain', label: 'Does not contain' },
  { value: 'starts-with', label: 'Starts with' },
  { value: 'does-not-start-with', label: 'Does not start with' },
  { value: 'ends-with', label: 'Ends with' },
  { value: 'does-not-end-with', label: 'Does not end with' },
  { value: 'like', label: 'Like' },
  { value: 'not-like', label: 'Not like' },
  { value: 'matches-regexp', label: 'Matches RegExp' },
  { value: 'does-not-match-regexp', label: 'Does not match RegExp' }
];

export default function TextInputControl({
  id,
  config,
  value = '',
  onChange,
  onConfigChange,
  className = ''
}: TextInputControlProps) {
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  
  const currentOperator = config.operator as TextOperator || 'contains';
  const showOperator = config.valueSource !== 'manual';

  const handleOperatorChange = useCallback((operator: TextOperator) => {
    if (onConfigChange) {
      onConfigChange({ operator });
    }
    setShowOperatorDropdown(false);
  }, [onConfigChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const operatorLabel = textOperators.find(op => op.value === currentOperator)?.label || 'Contains';

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
      <div className="flex items-center space-x-2">
        {/* Operator Dropdown */}
        {showOperator && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOperatorDropdown(!showOperatorDropdown)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <span className="text-gray-700">{operatorLabel}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            {showOperatorDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin">
                {textOperators.map((operator) => (
                  <button
                    key={operator.value}
                    onClick={() => handleOperatorChange(operator.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      currentOperator === operator.value ? 'bg-cyan-50 text-cyan-700' : 'text-gray-700'
                    }`}
                  >
                    {operator.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            id={id}
            value={value}
            onChange={handleInputChange}
            placeholder="Enter text..."
            className={`w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
              showOperator ? 'rounded-r-md' : 'rounded-md'
            }`}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

    </ControlContainer>
  );
}
