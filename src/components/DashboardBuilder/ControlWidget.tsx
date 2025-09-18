'use client';

import React, { useCallback } from 'react';
import { Settings, Copy, Trash2, MoreVertical, Grip } from 'lucide-react';
import { WidgetConfig, ControlType } from './types';
import { createControl, getDefaultControlConfig } from './Controls';

interface ControlWidgetProps {
  widget: WidgetConfig;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
  onDelete: () => void;
  onClone: () => void;
}

export default function ControlWidget({
  widget,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onClone
}: ControlWidgetProps) {
  const controlType = widget.type as ControlType;
  const controlConfig = widget.controlConfig || getDefaultControlConfig(controlType);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleValueChange = useCallback((value: any) => {
    // Update the widget's data to store the current control value
    onUpdate({
      data: {
        ...widget.data,
        currentValue: value
      }
    });
  }, [widget.data, onUpdate]);

  const handleConfigChange = useCallback((configUpdates: any) => {
    onUpdate({
      controlConfig: {
        ...controlConfig,
        ...configUpdates
      }
    });
  }, [controlConfig, onUpdate]);

  const currentValue = widget.data?.currentValue;

  // Use widget title as the control label if no label is set in config
  // Hide the label in the control since we show it in the header
  const effectiveConfig = {
    ...controlConfig,
    label: controlConfig.label || widget.title,
    showLabel: false // Don't show label in the control itself
  };

  const controlElement = createControl(controlType, {
    id: widget.id,
    type: controlType,
    config: effectiveConfig,
    value: currentValue,
    onChange: handleValueChange,
    onConfigChange: handleConfigChange,
    isSelected,
    className: 'w-full'
  });

  if (!controlElement) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">Control type "{controlType}" not implemented</p>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative p-4 bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md
        ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-gray-200'}
      `}
      onClick={onSelect}
    >
      {/* Control Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="widget-drag-handle cursor-move">
            <Grip className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {effectiveConfig.label || widget.title}
          </h3>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  // Open configuration panel
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onClone();
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Control Content */}
      <div className="control-content">
        {controlElement}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}
