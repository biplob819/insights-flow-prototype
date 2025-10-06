'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, Hash } from 'lucide-react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { NumberOperator } from '../types';

interface NumberInputControlProps extends BaseControlProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const numberOperators: { value: NumberOperator; label: string; symbol: string }[] = [
  { value: 'equal-to', label: 'Equal to', symbol: '=' },
  { value: 'less-than-or-equal', label: 'Less than or equal to', symbol: '≤' },
  { value: 'greater-than-or-equal', label: 'Greater than or equal to', symbol: '≥' }
];

export default function NumberInputControl({
  id,
  config,
  value = null,
  onChange,
  onConfigChange,
  className = ''
}: NumberInputControlProps) {
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  
  const currentOperator = config.operator as NumberOperator || 'equal-to';
  const showOperator = config.valueSource !== 'manual';

  const handleOperatorChange = useCallback((operator: NumberOperator) => {
    if (onConfigChange) {
      onConfigChange({ operator });
    }
    setShowOperatorDropdown(false);
  }, [onConfigChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(null);
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  }, [onChange]);

  const operatorInfo = numberOperators.find(op => op.value === currentOperator);
  const operatorLabel = operatorInfo?.label || 'Equal to';
  const operatorSymbol = operatorInfo?.symbol || '=';

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
              <span className="text-gray-700 font-mono">{operatorSymbol}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            {showOperatorDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {numberOperators.map((operator) => (
                  <button
                    key={operator.value}
                    onClick={() => handleOperatorChange(operator.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                      currentOperator === operator.value ? 'bg-cyan-50 text-cyan-700' : 'text-gray-700'
                    }`}
                  >
                    <span>{operator.label}</span>
                    <span className="font-mono text-gray-500">{operator.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Number Input */}
        <div className="flex-1 relative">
          <input
            type="number"
            id={id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder="Enter number..."
            min={config.minValue}
            max={config.maxValue}
            step={config.step || 'any'}
            className={`w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
              showOperator ? 'rounded-r-md' : 'rounded-md'
            }`}
          />
          <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Min/Max Value Display */}
      {(config.minValue !== undefined || config.maxValue !== undefined) && (
        <div className="mt-1 text-xs text-gray-500">
          {config.minValue !== undefined && config.maxValue !== undefined && (
            <span>Range: {config.minValue} - {config.maxValue}</span>
          )}
          {config.minValue !== undefined && config.maxValue === undefined && (
            <span>Minimum: {config.minValue}</span>
          )}
          {config.minValue === undefined && config.maxValue !== undefined && (
            <span>Maximum: {config.maxValue}</span>
          )}
        </div>
      )}
    </ControlContainer>
  );
}
