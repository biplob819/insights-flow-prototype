'use client';

import { useMemo } from 'react';
import { WidgetConfig, ControlConfig } from '../types';
import { useControlContext } from '../contexts/ControlContext';

export interface FilterContext {
  originalData: any[];
  filteredData: any[];
  activeFilters: AppliedFilter[];
  filterCount: number;
}

export interface AppliedFilter {
  controlId: string;
  controlType: string;
  label: string;
  value: any;
  operator?: string;
}

export function useFilteredData(
  elementId: string,
  data: any[],
  controlWidgets: WidgetConfig[]
): FilterContext {
  const { state, getControlValue } = useControlContext();

  const filterContext = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        originalData: data || [],
        filteredData: data || [],
        activeFilters: [],
        filterCount: 0
      };
    }

    // Find controls that target this element
    const targetingControls = controlWidgets.filter(control => {
      const config = control.controlConfig;
      return config?.targets.some(target => target.elementId === elementId);
    });

    // Get active controls (controls with values)
    const activeControls = targetingControls.filter(control => {
      const controlState = state.controls[control.id];
      return controlState?.isActive && controlState.value !== null && controlState.value !== undefined && controlState.value !== '';
    });

    if (activeControls.length === 0) {
      return {
        originalData: data,
        filteredData: data,
        activeFilters: [],
        filterCount: 0
      };
    }

    // Apply filters sequentially
    let filteredData = [...data];
    const appliedFilters: AppliedFilter[] = [];

    activeControls.forEach(control => {
      const controlState = state.controls[control.id];
      const config = control.controlConfig!;
      
      // Find the target configuration for this element
      const targetConfig = config.targets.find(target => target.elementId === elementId);
      if (!targetConfig) return;

      const filter: AppliedFilter = {
        controlId: control.id,
        controlType: control.type,
        label: config.label,
        value: controlState.value,
        operator: config.operator as string
      };

      appliedFilters.push(filter);

      // Apply the filter based on control type
      filteredData = applyControlFilter(
        filteredData,
        control.type,
        controlState.value,
        config,
        targetConfig
      );
    });

    return {
      originalData: data,
      filteredData,
      activeFilters: appliedFilters,
      filterCount: appliedFilters.length
    };
  }, [data, controlWidgets, elementId, state.controls]);

  return filterContext;
}

function applyControlFilter(
  data: any[],
  controlType: string,
  value: any,
  config: ControlConfig,
  targetConfig: any
): any[] {
  const columnName = Object.keys(targetConfig.columnMapping)[0];
  
  if (!columnName || !value) {
    return data;
  }

  switch (controlType) {
    case 'text-input':
    case 'text-area':
      return applyTextFilter(data, value, config, columnName);
    case 'number-input':
      return applyNumberFilter(data, value, config, columnName);
    case 'switch':
    case 'checkbox':
      return applyBooleanFilter(data, value, columnName);
    case 'list-values':
      return applyListFilter(data, value, config, columnName);
    case 'segmented':
      return applySegmentedFilter(data, value, columnName);
    case 'number-range':
      return applyNumberRangeFilter(data, value, columnName);
    case 'date':
      return applyDateFilter(data, value, columnName);
    case 'date-range':
      return applyDateRangeFilter(data, value, columnName);
    case 'slider':
      return applySliderFilter(data, value, config, columnName);
    case 'range-slider':
      return applyRangeSliderFilter(data, value, columnName);
    case 'top-n-filter':
      return applyTopNFilter(data, value, config, columnName);
    case 'drill-down':
      return applyDrillDownFilter(data, value, columnName);
    case 'legend':
      return applyLegendFilter(data, value, columnName);
    default:
      return data;
  }
}

function applyTextFilter(
  data: any[],
  value: string,
  config: ControlConfig,
  columnName: string
): any[] {
  const operator = config.operator || 'contains';
  const caseSensitive = config.caseSensitive || false;

  return data.filter(item => {
    const itemValue = item[columnName];
    if (itemValue === null || itemValue === undefined) return false;

    const itemStr = caseSensitive ? String(itemValue) : String(itemValue).toLowerCase();
    const filterStr = caseSensitive ? value : value.toLowerCase();

    switch (operator) {
      case 'equal-to':
        return itemStr === filterStr;
      case 'not-equal-to':
        return itemStr !== filterStr;
      case 'contains':
        return itemStr.includes(filterStr);
      case 'does-not-contain':
        return !itemStr.includes(filterStr);
      case 'starts-with':
        return itemStr.startsWith(filterStr);
      case 'does-not-start-with':
        return !itemStr.startsWith(filterStr);
      case 'ends-with':
        return itemStr.endsWith(filterStr);
      case 'does-not-end-with':
        return !itemStr.endsWith(filterStr);
      case 'matches-regexp':
        try {
          const regex = new RegExp(filterStr, caseSensitive ? 'g' : 'gi');
          return regex.test(itemStr);
        } catch {
          return false;
        }
      case 'does-not-match-regexp':
        try {
          const regex = new RegExp(filterStr, caseSensitive ? 'g' : 'gi');
          return !regex.test(itemStr);
        } catch {
          return true;
        }
      default:
        return true;
    }
  });
}

function applyNumberFilter(
  data: any[],
  value: number,
  config: ControlConfig,
  columnName: string
): any[] {
  const operator = config.operator || 'equal-to';

  return data.filter(item => {
    const itemValue = Number(item[columnName]);
    if (isNaN(itemValue)) return false;

    switch (operator) {
      case 'equal-to':
        return itemValue === value;
      case 'less-than-or-equal':
        return itemValue <= value;
      case 'greater-than-or-equal':
        return itemValue >= value;
      default:
        return true;
    }
  });
}

function applyBooleanFilter(
  data: any[],
  value: boolean,
  columnName: string
): any[] {
  return data.filter(item => {
    const itemValue = Boolean(item[columnName]);
    return itemValue === value;
  });
}

function applyListFilter(
  data: any[],
  value: any[] | any,
  config: ControlConfig,
  columnName: string
): any[] {
  const values = Array.isArray(value) ? value : [value];
  
  if (values.length === 0) return data;

  return data.filter(item => {
    const itemValue = item[columnName];
    return values.includes(itemValue);
  });
}

function applyNumberRangeFilter(
  data: any[],
  value: { min?: number; max?: number },
  columnName: string
): any[] {
  return data.filter(item => {
    const itemValue = Number(item[columnName]);
    if (isNaN(itemValue)) return false;

    let passesMin = true;
    let passesMax = true;

    if (value.min !== undefined) {
      passesMin = itemValue >= value.min;
    }

    if (value.max !== undefined) {
      passesMax = itemValue <= value.max;
    }

    return passesMin && passesMax;
  });
}

function applyDateRangeFilter(
  data: any[],
  value: { start?: string; end?: string },
  columnName: string
): any[] {
  return data.filter(item => {
    const itemValue = new Date(item[columnName]);
    if (isNaN(itemValue.getTime())) return false;

    let passesStart = true;
    let passesEnd = true;

    if (value.start) {
      const startDate = new Date(value.start);
      if (!isNaN(startDate.getTime())) {
        passesStart = itemValue >= startDate;
      }
    }

    if (value.end) {
      const endDate = new Date(value.end);
      if (!isNaN(endDate.getTime())) {
        // Set end date to end of day for inclusive filtering
        endDate.setHours(23, 59, 59, 999);
        passesEnd = itemValue <= endDate;
      }
    }

    return passesStart && passesEnd;
  });
}

function applySliderFilter(
  data: any[],
  value: number,
  config: ControlConfig,
  columnName: string
): any[] {
  // Slider typically acts as "greater than or equal to"
  return data.filter(item => {
    const itemValue = Number(item[columnName]);
    if (isNaN(itemValue)) return false;
    return itemValue >= value;
  });
}

function applySegmentedFilter(
  data: any[],
  value: any,
  columnName: string
): any[] {
  if (!value) return data;
  
  return data.filter(item => {
    const itemValue = item[columnName];
    return itemValue === value;
  });
}

function applyDateFilter(
  data: any[],
  value: string,
  columnName: string
): any[] {
  if (!value) return data;
  
  const filterDate = new Date(value);
  if (isNaN(filterDate.getTime())) return data;

  return data.filter(item => {
    const itemValue = new Date(item[columnName]);
    if (isNaN(itemValue.getTime())) return false;
    
    // Compare dates (ignoring time)
    return itemValue.toDateString() === filterDate.toDateString();
  });
}

function applyRangeSliderFilter(
  data: any[],
  value: [number, number],
  columnName: string
): any[] {
  if (!Array.isArray(value) || value.length !== 2) return data;
  
  const [min, max] = value;
  
  return data.filter(item => {
    const itemValue = Number(item[columnName]);
    if (isNaN(itemValue)) return false;
    return itemValue >= min && itemValue <= max;
  });
}

function applyTopNFilter(
  data: any[],
  value: { ranking: string; n: number; rankingFunction: string },
  config: ControlConfig,
  columnName: string
): any[] {
  if (!value || !value.n) return data;
  
  // Sort data by the column value
  const sortedData = [...data].sort((a, b) => {
    const aVal = Number(a[columnName]) || 0;
    const bVal = Number(b[columnName]) || 0;
    
    if (value.ranking.includes('top')) {
      return bVal - aVal; // Descending for top
    } else {
      return aVal - bVal; // Ascending for bottom
    }
  });
  
  if (value.ranking.includes('percentile')) {
    const percentileIndex = Math.ceil((value.n / 100) * sortedData.length);
    return sortedData.slice(0, percentileIndex);
  } else {
    return sortedData.slice(0, value.n);
  }
}

function applyDrillDownFilter(
  data: any[],
  value: string[],
  columnName: string
): any[] {
  if (!Array.isArray(value) || value.length === 0) return data;
  
  // Apply hierarchical filtering based on drill path
  // This is a simplified implementation - in practice, you'd need to know the hierarchy
  const lastDrillValue = value[value.length - 1];
  
  return data.filter(item => {
    const itemValue = item[columnName];
    return itemValue === lastDrillValue;
  });
}

function applyLegendFilter(
  data: any[],
  value: { [seriesId: string]: boolean },
  columnName: string
): any[] {
  if (!value || Object.keys(value).length === 0) return data;
  
  // Filter based on series visibility
  const visibleSeries = Object.entries(value)
    .filter(([_, isVisible]) => isVisible !== false)
    .map(([seriesId, _]) => seriesId);
  
  if (visibleSeries.length === 0) return [];
  
  return data.filter(item => {
    const itemValue = item[columnName];
    return visibleSeries.includes(itemValue);
  });
}

// Hook for getting filter summary
export function useFilterSummary(elementId: string, controlWidgets: WidgetConfig[]) {
  const { state } = useControlContext();

  return useMemo(() => {
    const targetingControls = controlWidgets.filter(control => {
      const config = control.controlConfig;
      return config?.targets.some(target => target.elementId === elementId);
    });

    const activeFilters = targetingControls.filter(control => {
      const controlState = state.controls[control.id];
      return controlState?.isActive;
    });

    return {
      totalControls: targetingControls.length,
      activeFilters: activeFilters.length,
      hasFilters: activeFilters.length > 0
    };
  }, [elementId, controlWidgets, state.controls]);
}
