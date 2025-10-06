'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { ControlState, ControlType, ControlConfig, WidgetConfig } from '../types';
import { urlParameterService, useURLParameters } from '../../../services/URLParameterService';

// Action types for control state management
type ControlAction =
  | { type: 'SET_CONTROL_VALUE'; controlId: string; value: any; updateURL?: boolean }
  | { type: 'UPDATE_CONTROL_CONFIG'; controlId: string; config: Partial<ControlConfig> }
  | { type: 'ADD_CONTROL'; control: ControlState }
  | { type: 'REMOVE_CONTROL'; controlId: string }
  | { type: 'CLEAR_ALL_CONTROLS' }
  | { type: 'SYNC_CONTROLS'; syncGroupId: string; value: any; updateURL?: boolean }
  | { type: 'APPLY_FILTERS'; targetElementId: string; filters: any }
  | { type: 'INITIALIZE_FROM_URL'; controlValues: Record<string, any> };

// Control context state
interface ControlContextState {
  controls: { [controlId: string]: ControlState };
  activeFilters: { [elementId: string]: any[] };
  syncGroups: { [groupId: string]: string[] }; // Maps sync group to control IDs
  controlTypes: { [controlId: string]: ControlType }; // Track control types for URL encoding
}

// Context value interface
interface ControlContextValue {
  state: ControlContextState;
  setControlValue: (controlId: string, value: any) => void;
  updateControlConfig: (controlId: string, config: Partial<ControlConfig>) => void;
  addControl: (controlId: string, type: ControlType, initialValue?: any) => void;
  removeControl: (controlId: string) => void;
  clearAllControls: () => void;
  syncControls: (controlIds: string[], groupId: string) => void;
  unsyncControl: (controlId: string) => void;
  getControlValue: (controlId: string) => any;
  getControlsByType: (type: ControlType) => ControlState[];
  getFilteredData: (elementId: string, data: any[]) => any[];
  applyControlFilters: (elementId: string, controls: WidgetConfig[]) => void;
  initializeFromURL: () => void;
  generateShareableURL: () => string;
}

// Reducer function
function controlReducer(state: ControlContextState, action: ControlAction): ControlContextState {
  switch (action.type) {
    case 'SET_CONTROL_VALUE':
      return {
        ...state,
        controls: {
          ...state.controls,
          [action.controlId]: {
            ...state.controls[action.controlId],
            value: action.value,
            lastUpdated: new Date(),
            isActive: action.value !== null && action.value !== undefined && action.value !== ''
          }
        }
      };

    case 'UPDATE_CONTROL_CONFIG':
      return {
        ...state,
        controls: {
          ...state.controls,
          [action.controlId]: {
            ...state.controls[action.controlId],
            lastUpdated: new Date()
          }
        }
      };

    case 'ADD_CONTROL':
      return {
        ...state,
        controls: {
          ...state.controls,
          [action.control.id]: action.control
        },
        controlTypes: {
          ...state.controlTypes,
          [action.control.id]: action.control.type
        }
      };

    case 'REMOVE_CONTROL':
      const { [action.controlId]: removed, ...remainingControls } = state.controls;
      const { [action.controlId]: removedType, ...remainingTypes } = state.controlTypes;
      
      // Remove from sync groups
      const updatedSyncGroups = { ...state.syncGroups };
      Object.keys(updatedSyncGroups).forEach(groupId => {
        updatedSyncGroups[groupId] = updatedSyncGroups[groupId].filter(id => id !== action.controlId);
        if (updatedSyncGroups[groupId].length <= 1) {
          delete updatedSyncGroups[groupId];
        }
      });

      return {
        ...state,
        controls: remainingControls,
        controlTypes: remainingTypes,
        syncGroups: updatedSyncGroups
      };

    case 'CLEAR_ALL_CONTROLS':
      return {
        ...state,
        controls: {},
        controlTypes: {},
        activeFilters: {},
        syncGroups: {}
      };

    case 'SYNC_CONTROLS':
      // Update all controls in the sync group with the same value
      const syncGroupControls = state.syncGroups[action.syncGroupId] || [];
      const updatedControls = { ...state.controls };
      
      syncGroupControls.forEach(controlId => {
        if (updatedControls[controlId]) {
          updatedControls[controlId] = {
            ...updatedControls[controlId],
            value: action.value,
            lastUpdated: new Date(),
            isActive: action.value !== null && action.value !== undefined && action.value !== ''
          };
        }
      });

      return {
        ...state,
        controls: updatedControls
      };

    case 'APPLY_FILTERS':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.targetElementId]: action.filters
        }
      };

    case 'INITIALIZE_FROM_URL':
      const updatedControlsFromURL = { ...state.controls };
      
      Object.entries(action.controlValues).forEach(([controlId, value]) => {
        if (updatedControlsFromURL[controlId]) {
          updatedControlsFromURL[controlId] = {
            ...updatedControlsFromURL[controlId],
            value,
            isActive: value !== null && value !== undefined && value !== '',
            lastUpdated: new Date()
          };
        }
      });

      return {
        ...state,
        controls: updatedControlsFromURL
      };

    default:
      return state;
  }
}

// Initial state
const initialState: ControlContextState = {
  controls: {},
  controlTypes: {},
  activeFilters: {},
  syncGroups: {}
};

// Create context
const ControlContext = createContext<ControlContextValue | undefined>(undefined);

// Provider component
interface ControlProviderProps {
  children: ReactNode;
}

export function ControlProvider({ children }: ControlProviderProps) {
  const [state, dispatch] = useReducer(controlReducer, initialState);

  // Initialize from URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const controlValues = urlParameterService.parseControlValues(urlParams);
      
      if (Object.keys(controlValues).length > 0) {
        dispatch({ type: 'INITIALIZE_FROM_URL', controlValues });
      }
    }
  }, []);

  const setControlValue = useCallback((controlId: string, value: any) => {
    // Check if this control is part of a sync group
    const syncGroupId = Object.keys(state.syncGroups).find(groupId =>
      state.syncGroups[groupId].includes(controlId)
    );

    if (syncGroupId) {
      dispatch({ type: 'SYNC_CONTROLS', syncGroupId, value, updateURL: true });
    } else {
      dispatch({ type: 'SET_CONTROL_VALUE', controlId, value, updateURL: true });
    }

    // Update URL parameter
    const controlType = state.controlTypes[controlId];
    if (controlType) {
      urlParameterService.updateURL(controlId, value, controlType);
    }
  }, [state.syncGroups, state.controlTypes]);

  const updateControlConfig = useCallback((controlId: string, config: Partial<ControlConfig>) => {
    dispatch({ type: 'UPDATE_CONTROL_CONFIG', controlId, config });
  }, []);

  const addControl = useCallback((controlId: string, type: ControlType, initialValue: any = null) => {
    const control: ControlState = {
      id: controlId,
      type,
      value: initialValue,
      isActive: false,
      lastUpdated: new Date()
    };
    dispatch({ type: 'ADD_CONTROL', control });
  }, []);

  const removeControl = useCallback((controlId: string) => {
    dispatch({ type: 'REMOVE_CONTROL', controlId });
  }, []);

  const clearAllControls = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_CONTROLS' });
  }, []);

  const syncControls = useCallback((controlIds: string[], groupId: string) => {
    const updatedSyncGroups = {
      ...state.syncGroups,
      [groupId]: controlIds
    };
    
    // Remove controls from other sync groups
    Object.keys(updatedSyncGroups).forEach(existingGroupId => {
      if (existingGroupId !== groupId) {
        updatedSyncGroups[existingGroupId] = updatedSyncGroups[existingGroupId].filter(
          id => !controlIds.includes(id)
        );
        if (updatedSyncGroups[existingGroupId].length <= 1) {
          delete updatedSyncGroups[existingGroupId];
        }
      }
    });
  }, [state.syncGroups]);

  const unsyncControl = useCallback((controlId: string) => {
    const updatedSyncGroups = { ...state.syncGroups };
    
    Object.keys(updatedSyncGroups).forEach(groupId => {
      updatedSyncGroups[groupId] = updatedSyncGroups[groupId].filter(id => id !== controlId);
      if (updatedSyncGroups[groupId].length <= 1) {
        delete updatedSyncGroups[groupId];
      }
    });
  }, [state.syncGroups]);

  const getControlValue = useCallback((controlId: string) => {
    return state.controls[controlId]?.value;
  }, [state.controls]);

  const getControlsByType = useCallback((type: ControlType) => {
    return Object.values(state.controls).filter(control => control.type === type);
  }, [state.controls]);

  const getFilteredData = useCallback((elementId: string, data: any[]) => {
    const filters = state.activeFilters[elementId];
    if (!filters || filters.length === 0) {
      return data;
    }

    // Apply filters to data
    return data.filter(item => {
      return filters.every(filter => {
        // Apply filter logic based on filter type
        return applyFilterToItem(item, filter);
      });
    });
  }, [state.activeFilters]);

  const applyControlFilters = useCallback((elementId: string, controls: WidgetConfig[]) => {
    const activeControls = controls.filter(control => 
      state.controls[control.id]?.isActive
    );

    const filters = activeControls.map(control => {
      const controlState = state.controls[control.id];
      const controlConfig = control.controlConfig;

      return {
        controlId: control.id,
        type: control.type,
        value: controlState.value,
        config: controlConfig
      };
    });

    dispatch({ type: 'APPLY_FILTERS', targetElementId: elementId, filters });
  }, [state.controls]);

  const initializeFromURL = useCallback(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const controlValues = urlParameterService.parseControlValues(urlParams);
      
      if (Object.keys(controlValues).length > 0) {
        dispatch({ type: 'INITIALIZE_FROM_URL', controlValues });
      }
    }
  }, []);

  const generateShareableURL = useCallback(() => {
    const controlStates: Record<string, any> = {};
    Object.entries(state.controls).forEach(([controlId, controlState]) => {
      if (controlState.isActive) {
        controlStates[controlId] = controlState.value;
      }
    });

    return urlParameterService.generateShareableURL(controlStates, state.controlTypes);
  }, [state.controls, state.controlTypes]);

  const contextValue: ControlContextValue = {
    state,
    setControlValue,
    updateControlConfig,
    addControl,
    removeControl,
    clearAllControls,
    syncControls,
    unsyncControl,
    getControlValue,
    getControlsByType,
    getFilteredData,
    applyControlFilters,
    initializeFromURL,
    generateShareableURL
  };

  return (
    <ControlContext.Provider value={contextValue}>
      {children}
    </ControlContext.Provider>
  );
}

// Helper function to apply a single filter to a data item
function applyFilterToItem(item: any, filter: any): boolean {
  const { type, value, config } = filter;

  if (!config?.targets || config.targets.length === 0) {
    return true;
  }

  // Apply filter based on control type
  switch (type) {
    case 'text-input':
      return applyTextFilter(item, value, config);
    case 'number-input':
      return applyNumberFilter(item, value, config);
    case 'switch':
    case 'checkbox':
      return applyBooleanFilter(item, value, config);
    default:
      return true;
  }
}

function applyTextFilter(item: any, value: string, config: any): boolean {
  if (!value) return true;

  const operator = config.operator || 'contains';
  const caseSensitive = config.caseSensitive || false;

  return config.targets.some((target: any) => {
    const column = Object.keys(target.columnMapping)[0];
    const itemValue = item[column];
    
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
      default:
        return true;
    }
  });
}

function applyNumberFilter(item: any, value: number, config: any): boolean {
  if (value === null || value === undefined) return true;

  const operator = config.operator || 'equal-to';

  return config.targets.some((target: any) => {
    const column = Object.keys(target.columnMapping)[0];
    const itemValue = Number(item[column]);
    
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

function applyBooleanFilter(item: any, value: boolean, config: any): boolean {
  return config.targets.some((target: any) => {
    const column = Object.keys(target.columnMapping)[0];
    const itemValue = Boolean(item[column]);
    return itemValue === value;
  });
}

// Custom hook to use the control context
export function useControlContext() {
  const context = useContext(ControlContext);
  if (context === undefined) {
    throw new Error('useControlContext must be used within a ControlProvider');
  }
  return context;
}

export default ControlContext;
