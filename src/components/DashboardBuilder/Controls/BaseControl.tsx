'use client';

import React, { useRef, useEffect } from 'react';
import { ControlType, ControlConfig } from '../types';
import { useAccessibility } from '../../../services/AccessibilityService';

export interface BaseControlProps {
  id: string;
  type: ControlType;
  config: ControlConfig;
  value: any;
  onChange: (value: any) => void;
  onConfigChange?: (config: Partial<ControlConfig>) => void;
  isSelected?: boolean;
  className?: string;
}

export interface ControlContainerProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  required?: boolean;
  showLabel?: boolean;
  labelPosition?: 'top' | 'left';
  alignment?: 'left' | 'right' | 'center' | 'stretch';
  className?: string;
}

export function ControlContainer({
  children,
  label,
  description,
  required,
  showLabel = true,
  labelPosition = 'top',
  alignment = 'left',
  className = ''
}: ControlContainerProps) {
  const alignmentClasses = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    stretch: 'justify-stretch'
  };

  const containerClass = `
    ${labelPosition === 'left' ? 'flex items-center space-x-3' : 'space-y-2'}
    ${alignmentClasses[alignment]}
    ${className}
  `.trim();

  // Generate unique IDs for accessibility
  const controlId = React.useId();
  const descriptionId = description ? `${controlId}-description` : undefined;

  return (
    <div className={containerClass}>
      {showLabel && label && (
        <div className={labelPosition === 'left' ? 'flex-shrink-0' : ''}>
          <label 
            htmlFor={controlId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && (
              <span 
                className="text-red-500 ml-1" 
                aria-label="required"
              >
                *
              </span>
            )}
          </label>
          {description && (
            <p 
              id={descriptionId}
              className="text-xs text-gray-500 mt-1"
            >
              {description}
            </p>
          )}
        </div>
      )}
      <div className={labelPosition === 'left' ? 'flex-1' : 'w-full'}>
        {React.cloneElement(children as React.ReactElement, {
          id: controlId,
          'aria-describedby': descriptionId,
          'aria-required': required,
          'aria-invalid': false // This should be set based on validation state
        } as any)}
      </div>
    </div>
  );
}

export abstract class BaseControl<T = any> extends React.Component<BaseControlProps> {
  abstract render(): React.ReactNode;
  
  protected handleChange = (value: T) => {
    this.props.onChange(value);
  };

  protected updateConfig = (updates: Partial<ControlConfig>) => {
    if (this.props.onConfigChange) {
      this.props.onConfigChange(updates);
    }
  };

  protected getContainerProps(): ControlContainerProps {
    const { config } = this.props;
    return {
      label: config.label,
      description: config.description,
      required: config.required,
      showLabel: config.showLabel,
      labelPosition: config.labelPosition,
      alignment: config.alignment,
      className: this.props.className,
      children: null // This will be overridden by the actual control
    };
  }
}
