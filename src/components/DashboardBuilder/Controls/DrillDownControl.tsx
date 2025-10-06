'use client';

import React, { useState } from 'react';
import { BaseControlProps, ControlContainer } from './BaseControl';
import { ChevronRight, Home, RotateCcw } from 'lucide-react';

export default function DrillDownControl({ 
  config, 
  value, 
  onChange, 
  className 
}: BaseControlProps) {
  // Value should be an array representing the drill path
  const drillPath = Array.isArray(value) ? value : [];
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock drill hierarchy - in real implementation, this would come from data
  const drillHierarchy = [
    { level: 0, name: 'Region', values: ['North America', 'Europe', 'Asia Pacific'] },
    { level: 1, name: 'Country', values: ['USA', 'Canada', 'Mexico'] },
    { level: 2, name: 'State', values: ['California', 'Texas', 'New York'] },
    { level: 3, name: 'City', values: ['Los Angeles', 'San Francisco', 'San Diego'] }
  ];

  const currentLevel = drillPath.length;
  const currentHierarchy = drillHierarchy[currentLevel];

  const handleDrillDown = (selectedValue: string) => {
    const newPath = [...drillPath, selectedValue];
    onChange(newPath);
  };

  const handleDrillUp = (targetLevel: number) => {
    const newPath = drillPath.slice(0, targetLevel);
    onChange(newPath);
  };

  const handleReset = () => {
    onChange([]);
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
        {/* Breadcrumb navigation */}
        {drillPath.length > 0 && (
          <div className="flex items-center space-x-1 text-sm">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Home className="h-3 w-3 mr-1" />
              All
            </button>
            
            {drillPath.map((pathItem, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <button
                  type="button"
                  onClick={() => handleDrillUp(index + 1)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {pathItem}
                </button>
              </React.Fragment>
            ))}
            
            {currentHierarchy && (
              <>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">{currentHierarchy.name}</span>
              </>
            )}
          </div>
        )}

        {/* Current level options */}
        {currentHierarchy && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Select {currentHierarchy.name}:
              </h4>
              {drillPath.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto scrollbar-thin">
              {currentHierarchy.values.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDrillDown(option)}
                  className="text-left px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End of hierarchy message */}
        {!currentHierarchy && drillPath.length > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>You&apos;ve reached the end of the drill-down hierarchy.</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              Start over
            </button>
          </div>
        )}

        {/* Drill path summary */}
        {drillPath.length > 0 && (
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <strong>Current Filter Path:</strong>
            <div className="mt-1">
              {drillPath.map((item, index) => (
                <span key={index}>
                  {index > 0 && ' → '}
                  {drillHierarchy[index]?.name}: {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ControlContainer>
  );
}
