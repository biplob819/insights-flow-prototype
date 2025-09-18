'use client';

import React, { useCallback } from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

interface SwitchControlProps extends BaseControlProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function SwitchControl({
  id,
  config,
  value = false,
  onChange,
  className = ''
}: SwitchControlProps) {
  const handleToggle = useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

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
      <div className="flex items-center space-x-4">
        {/* False Label */}
        <span className={`text-sm font-medium ${!value ? 'text-gray-900' : 'text-gray-400'}`}>
          False
        </span>
        
        {/* Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
            ${value ? 'bg-cyan-600' : 'bg-gray-200'}
          `}
        >
          <span className="sr-only">Toggle switch</span>
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${value ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        
        {/* True Label */}
        <span className={`text-sm font-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          True
        </span>
      </div>
      
      {/* Current Value Display */}
      <div className="mt-2 text-xs text-gray-500">
        Current value: <span className="font-mono">{value.toString()}</span>
      </div>
    </ControlContainer>
  );
}
