/**
 * useParameterizedSQL Hook
 * Provides real-time SQL parameter substitution and query execution
 * Implements Phase 2 requirement: Custom SQL Statement Integration
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useControlContext } from '../contexts/ControlContext';
import { useSQLParameters } from '../../../services/SQLParameterEngine';
import type { ParameterReference, SQLValidationResult } from '../../../services/SQLParameterEngine';

export interface SQLQueryResult {
  data: any[] | null;
  error: string | null;
  isLoading: boolean;
  isExecuting: boolean;
  lastExecuted: Date | null;
  rowCount: number;
  executionTime: number; // in milliseconds
}

export interface UseParameterizedSQLOptions {
  sql: string;
  autoExecute?: boolean; // Whether to automatically execute when dependencies change
  debounceMs?: number; // Debounce delay for auto-execution
  onExecute?: (sql: string) => Promise<any[]>; // Custom execution function
  onError?: (error: string) => void; // Error callback
  onSuccess?: (data: any[]) => void; // Success callback
}

export interface UseParameterizedSQLResult {
  // Query state
  result: SQLQueryResult;
  
  // Generated SQL
  generatedSQL: string;
  originalSQL: string;
  
  // Parameters
  parameters: ParameterReference[];
  parameterValues: Record<string, any>;
  
  // Validation
  validation: SQLValidationResult;
  
  // Actions
  execute: () => Promise<void>;
  reset: () => void;
  
  // Utilities
  canExecute: boolean;
  hasParameters: boolean;
  missingParameters: string[];
}

export function useParameterizedSQL(options: UseParameterizedSQLOptions): UseParameterizedSQLResult {
  const {
    sql,
    autoExecute = false,
    debounceMs = 500,
    onExecute,
    onError,
    onSuccess
  } = options;

  const { state } = useControlContext();
  const { parseParameters, substituteParameters, validateSQL } = useSQLParameters();

  const [result, setResult] = useState<SQLQueryResult>({
    data: null,
    error: null,
    isLoading: false,
    isExecuting: false,
    lastExecuted: null,
    rowCount: 0,
    executionTime: 0
  });

  // Parse parameters from SQL
  const parameters = useMemo(() => {
    try {
      return parseParameters(sql);
    } catch (error) {
      return [];
    }
  }, [sql, parseParameters]);

  // Get current parameter values
  const parameterValues = useMemo(() => {
    const values: Record<string, any> = {};
    parameters.forEach(param => {
      const controlValue = state.controls[param.controlId]?.value;
      if (param.path) {
        // Handle path-based access (e.g., controlId.min)
        if (Array.isArray(controlValue)) {
          switch (param.path) {
            case 'min':
            case 'start':
              values[param.parameterName] = controlValue[0];
              break;
            case 'max':
            case 'end':
              values[param.parameterName] = controlValue[1];
              break;
            case 'length':
              values[param.parameterName] = controlValue.length;
              break;
            default:
              values[param.parameterName] = undefined;
          }
        } else if (typeof controlValue === 'object' && controlValue !== null) {
          values[param.parameterName] = controlValue[param.path];
        } else {
          values[param.parameterName] = undefined;
        }
      } else {
        values[param.parameterName] = controlValue;
      }
    });
    return values;
  }, [parameters, state.controls]);

  // Generate SQL with substituted parameters
  const generatedSQL = useMemo(() => {
    if (!sql.trim()) return '';
    
    try {
      const controlValues: Record<string, any> = {};
      Object.entries(state.controls).forEach(([id, control]) => {
        controlValues[id] = control.value;
      });
      
      return substituteParameters(sql, controlValues, state.controlTypes);
    } catch (error) {
      return `-- Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, [sql, state.controls, state.controlTypes, substituteParameters]);

  // Validate SQL
  const validation = useMemo(() => {
    return validateSQL(sql);
  }, [sql, validateSQL]);

  // Check for missing parameters
  const missingParameters = useMemo(() => {
    return parameters
      .filter(param => {
        const value = parameterValues[param.parameterName];
        return value === undefined || value === null;
      })
      .map(param => param.controlId);
  }, [parameters, parameterValues]);

  // Determine if query can be executed
  const canExecute = useMemo(() => {
    return validation.valid && 
           missingParameters.length === 0 && 
           sql.trim().length > 0 &&
           !result.isExecuting;
  }, [validation.valid, missingParameters.length, sql, result.isExecuting]);

  // Execute SQL query
  const execute = useCallback(async () => {
    if (!canExecute || !onExecute) return;

    const startTime = Date.now();
    
    setResult(prev => ({
      ...prev,
      isExecuting: true,
      isLoading: true,
      error: null
    }));

    try {
      const data = await onExecute(generatedSQL);
      const executionTime = Date.now() - startTime;
      
      setResult({
        data,
        error: null,
        isLoading: false,
        isExecuting: false,
        lastExecuted: new Date(),
        rowCount: data?.length || 0,
        executionTime
      });

      onSuccess?.(data);
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Query execution failed';
      
      setResult({
        data: null,
        error: errorMessage,
        isLoading: false,
        isExecuting: false,
        lastExecuted: new Date(),
        rowCount: 0,
        executionTime
      });

      onError?.(errorMessage);
    }
  }, [canExecute, onExecute, generatedSQL, onSuccess, onError]);

  // Reset query state
  const reset = useCallback(() => {
    setResult({
      data: null,
      error: null,
      isLoading: false,
      isExecuting: false,
      lastExecuted: null,
      rowCount: 0,
      executionTime: 0
    });
  }, []);

  // Auto-execute when dependencies change
  useEffect(() => {
    if (!autoExecute || !canExecute) return;

    const timeoutId = setTimeout(() => {
      execute();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [autoExecute, canExecute, execute, debounceMs]);

  return {
    result,
    generatedSQL,
    originalSQL: sql,
    parameters,
    parameterValues,
    validation,
    execute,
    reset,
    canExecute,
    hasParameters: parameters.length > 0,
    missingParameters
  };
}

// Hook for SQL query caching
export function useSQLQueryCache() {
  const [cache, setCache] = useState<Map<string, { data: any[]; timestamp: number }>>(new Map());
  const cacheTimeout = 5 * 60 * 1000; // 5 minutes

  const getCachedResult = useCallback((sql: string): any[] | null => {
    const cached = cache.get(sql);
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > cacheTimeout) {
      cache.delete(sql);
      setCache(new Map(cache));
      return null;
    }
    
    return cached.data;
  }, [cache, cacheTimeout]);

  const setCachedResult = useCallback((sql: string, data: any[]) => {
    const newCache = new Map(cache);
    newCache.set(sql, { data, timestamp: Date.now() });
    setCache(newCache);
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const getCacheStats = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(cache.entries());
    const validEntries = entries.filter(([, value]) => now - value.timestamp <= cacheTimeout);
    
    return {
      totalEntries: cache.size,
      validEntries: validEntries.length,
      expiredEntries: cache.size - validEntries.length,
      cacheSize: JSON.stringify(Array.from(cache.entries())).length
    };
  }, [cache, cacheTimeout]);

  return {
    getCachedResult,
    setCachedResult,
    clearCache,
    getCacheStats
  };
}

// Hook for SQL execution with caching
export function useCachedSQLExecution(executeFunction?: (sql: string) => Promise<any[]>) {
  const { getCachedResult, setCachedResult } = useSQLQueryCache();

  const executeWithCache = useCallback(async (sql: string): Promise<any[]> => {
    // Check cache first
    const cached = getCachedResult(sql);
    if (cached) {
      return cached;
    }

    // Execute query
    if (!executeFunction) {
      throw new Error('No execution function provided');
    }

    const result = await executeFunction(sql);
    
    // Cache result
    setCachedResult(sql, result);
    
    return result;
  }, [getCachedResult, setCachedResult, executeFunction]);

  return executeWithCache;
}

// Hook for SQL query history
export function useSQLQueryHistory() {
  const [history, setHistory] = useState<Array<{
    id: string;
    sql: string;
    generatedSQL: string;
    timestamp: Date;
    success: boolean;
    error?: string;
    rowCount?: number;
    executionTime?: number;
  }>>([]);

  const addToHistory = useCallback((entry: {
    sql: string;
    generatedSQL: string;
    success: boolean;
    error?: string;
    rowCount?: number;
    executionTime?: number;
  }) => {
    const historyEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      ...entry
    };

    setHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistoryStats = useCallback(() => {
    const totalQueries = history.length;
    const successfulQueries = history.filter(h => h.success).length;
    const failedQueries = totalQueries - successfulQueries;
    const avgExecutionTime = history
      .filter(h => h.executionTime)
      .reduce((sum, h) => sum + (h.executionTime || 0), 0) / totalQueries || 0;

    return {
      totalQueries,
      successfulQueries,
      failedQueries,
      successRate: totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0,
      avgExecutionTime
    };
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory,
    getHistoryStats
  };
}

// Utility function to format SQL for display
export function formatSQL(sql: string): string {
  return sql
    .replace(/\bSELECT\b/gi, 'SELECT')
    .replace(/\bFROM\b/gi, '\nFROM')
    .replace(/\bWHERE\b/gi, '\nWHERE')
    .replace(/\bJOIN\b/gi, '\nJOIN')
    .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
    .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
    .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
    .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
    .replace(/\bORDER BY\b/gi, '\nORDER BY')
    .replace(/\bHAVING\b/gi, '\nHAVING')
    .replace(/\bLIMIT\b/gi, '\nLIMIT')
    .trim();
}
