'use client';

import React from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';

export default function TextAreaControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
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
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder="Enter text..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]"
        rows={3}
      />
    </ControlContainer>
  );
}
