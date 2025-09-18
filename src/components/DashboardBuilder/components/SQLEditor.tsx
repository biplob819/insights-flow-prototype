/**
 * SQL Editor Component
 * Provides a rich SQL editing experience with parameter support and validation
 * Implements Phase 2 requirement: Custom SQL Statement Integration
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Database, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  EyeOff,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import { useSQLParameters } from '../../../services/SQLParameterEngine';
import { useControlContext } from '../contexts/ControlContext';
import type { ParameterReference, SQLValidationResult } from '../../../services/SQLParameterEngine';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute?: (sql: string) => Promise<any[]>;
  placeholder?: string;
  disabled?: boolean;
  showValidation?: boolean;
  showPreview?: boolean;
  className?: string;
}

export default function SQLEditor({
  value,
  onChange,
  onExecute,
  placeholder = "SELECT * FROM table WHERE column = ${controlId}",
  disabled = false,
  showValidation = true,
  showPreview = true,
  className = ""
}: SQLEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showParameters, setShowParameters] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any[] | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { state } = useControlContext();
  const { parseParameters, substituteParameters, validateSQL } = useSQLParameters();

  // Parse parameters from SQL
  const parameters = parseParameters(value);
  
  // Validate SQL
  const validation = validateSQL(value);
  
  // Generate preview SQL with current control values
  const previewSQL = React.useMemo(() => {
    if (!value.trim()) return '';
    
    try {
      const controlValues: Record<string, any> = {};
      Object.entries(state.controls).forEach(([id, control]) => {
        controlValues[id] = control.value;
      });
      
      return substituteParameters(value, controlValues, state.controlTypes);
    } catch (error) {
      return `-- Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, [value, state.controls, state.controlTypes, substituteParameters]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCursorPosition(e.target.selectionStart || 0);
  }, [onChange]);

  // Handle cursor position change
  const handleSelectionChange = useCallback(() => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
  }, []);

  // Execute SQL query
  const handleExecute = useCallback(async () => {
    if (!onExecute || !value.trim()) return;

    setIsExecuting(true);
    setExecutionError(null);
    
    try {
      const result = await onExecute(previewSQL);
      setExecutionResult(result);
    } catch (error) {
      setExecutionError(error instanceof Error ? error.message : 'Execution failed');
      setExecutionResult(null);
    } finally {
      setIsExecuting(false);
    }
  }, [onExecute, value, previewSQL]);

  // Copy SQL to clipboard
  const copyToClipboard = useCallback(async (sql: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  // Download SQL as file
  const downloadSQL = useCallback(() => {
    const blob = new Blob([previewSQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query-${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [previewSQL]);

  // Insert parameter at cursor
  const insertParameter = useCallback((controlId: string, path?: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    
    const parameterText = path ? `\${${controlId}.${path}}` : `\${${controlId}}`;
    const newValue = value.substring(0, start) + parameterText + value.substring(end);
    
    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + parameterText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setCursorPosition(newCursorPos);
    }, 0);
  }, [value, onChange]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">SQL Editor</h3>
            <p className="text-sm text-gray-500">
              Use ${'{controlId}'} to reference control values
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Parameters toggle */}
          <button
            onClick={() => setShowParameters(!showParameters)}
            className={`p-2 rounded-lg transition-colors ${
              showParameters 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle parameters panel"
          >
            {showParameters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Copy button */}
          <button
            onClick={() => copyToClipboard(previewSQL)}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Copy generated SQL"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Download button */}
          <button
            onClick={downloadSQL}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Download SQL file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Execute button */}
          {onExecute && (
            <button
              onClick={handleExecute}
              disabled={isExecuting || !validation.valid || disabled}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExecuting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isExecuting ? 'Executing...' : 'Execute'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Main editor */}
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onSelect={handleSelectionChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full p-4 font-mono text-sm resize-none border-0 focus:outline-none
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                ${validation.valid ? '' : 'bg-red-50'}
              `}
              rows={12}
              spellCheck={false}
            />
          </div>

          {/* Validation messages */}
          {showValidation && (
            <div className="border-t border-gray-200 p-4">
              {!validation.valid && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">SQL Errors:</span>
                  </div>
                  {validation.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 ml-6">
                      • {error}
                    </div>
                  ))}
                  
                  {validation.suggestedFixes.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-red-800 mb-1">Suggested fixes:</div>
                      {validation.suggestedFixes.map((fix, index) => (
                        <div key={index} className="text-sm text-red-600 ml-6">
                          • {fix}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {validation.warnings.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Warnings:</span>
                  </div>
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-yellow-700 ml-6">
                      • {warning}
                    </div>
                  ))}
                </div>
              )}

              {validation.valid && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    SQL is valid ({validation.parameterCount} parameters found)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Preview SQL */}
          {showPreview && previewSQL && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Generated SQL:</span>
                <button
                  onClick={() => copyToClipboard(previewSQL)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
              </div>
              <pre className="text-sm font-mono text-gray-800 bg-white p-3 rounded border overflow-x-auto">
                {previewSQL}
              </pre>
            </div>
          )}

          {/* Execution results */}
          {executionResult && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-900">
                  Query executed successfully ({executionResult.length} rows)
                </span>
              </div>
              
              {executionResult.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(executionResult[0]).map((column) => (
                          <th key={column} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {executionResult.slice(0, 10).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="px-3 py-2 border-b border-gray-200">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {executionResult.length > 10 && (
                    <div className="text-xs text-gray-500 mt-2">
                      Showing first 10 of {executionResult.length} rows
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Execution error */}
          {executionError && (
            <div className="border-t border-gray-200 p-4 bg-red-50">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Execution Error:</span>
              </div>
              <pre className="text-sm text-red-700 bg-white p-3 rounded border">
                {executionError}
              </pre>
            </div>
          )}
        </div>

        {/* Parameters panel */}
        {showParameters && (
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Available Controls</h4>
              
              <div className="space-y-2 mb-4">
                {Object.entries(state.controls).map(([controlId, control]) => (
                  <div key={controlId} className="bg-white border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{controlId}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {control.type}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      Current: {JSON.stringify(control.value)}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => insertParameter(controlId)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        ${'{' + controlId + '}'}
                      </button>
                      
                      {/* Show path options for complex controls */}
                      {(control.type === 'number-range' || control.type === 'range-slider') && (
                        <>
                          <button
                            onClick={() => insertParameter(controlId, 'min')}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                          >
                            .min
                          </button>
                          <button
                            onClick={() => insertParameter(controlId, 'max')}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                          >
                            .max
                          </button>
                        </>
                      )}
                      
                      {control.type === 'date-range' && (
                        <>
                          <button
                            onClick={() => insertParameter(controlId, 'start')}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                          >
                            .start
                          </button>
                          <button
                            onClick={() => insertParameter(controlId, 'end')}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                          >
                            .end
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current parameters */}
              {parameters.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Used Parameters</h4>
                  <div className="space-y-1">
                    {parameters.map((param, index) => (
                      <div key={index} className="text-sm font-mono bg-white border border-gray-200 rounded p-2">
                        <div className="text-blue-600">{param.fullMatch}</div>
                        <div className="text-xs text-gray-500">
                          Control: {param.controlId}
                          {param.path && ` (${param.path})`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-medium text-blue-900 mb-2">Parameter Syntax</h5>
                <div className="text-xs text-blue-800 space-y-1">
                  <div><code>${'{controlId}'}</code> - Basic value</div>
                  <div><code>${'{controlId.min}'}</code> - Range minimum</div>
                  <div><code>${'{controlId.max}'}</code> - Range maximum</div>
                  <div><code>${'{controlId.start}'}</code> - Date range start</div>
                  <div><code>${'{controlId.end}'}</code> - Date range end</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
