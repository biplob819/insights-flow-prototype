/**
 * SQL Parameter Engine
 * Handles secure SQL parameter substitution with control values
 * Implements Phase 2 requirement: Custom SQL Statement Integration
 */

import { ControlType } from '../components/DashboardBuilder/types';

export interface ParameterReference {
  parameterName: string;
  controlId: string;
  path?: string; // For complex controls like ranges: .min, .max
  fullMatch: string;
  startIndex: number;
  endIndex: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SQLValidationResult extends ValidationResult {
  parameterCount: number;
  hasUnsafePatterns: boolean;
  suggestedFixes: string[];
}

export interface DataType {
  name: 'string' | 'number' | 'date' | 'boolean' | 'array';
  nullable?: boolean;
}

export interface SQLParameterEngine {
  parseParameters(sql: string): ParameterReference[];
  substituteParameters(sql: string, controlValues: Record<string, any>, controlTypes: Record<string, ControlType>): string;
  validateSQL(sql: string): SQLValidationResult;
  sanitizeParameterValue(value: any, dataType: DataType): string;
  generateParameterizedQuery(sql: string, controlValues: Record<string, any>): { query: string; parameters: Record<string, any> };
}

class SQLParameterEngineImpl implements SQLParameterEngine {
  private readonly PARAMETER_REGEX = /\$\{([^}]+)\}/g;
  private readonly UNSAFE_PATTERNS = [
    /;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER|TRUNCATE)\s+/i,
    /UNION\s+SELECT/i,
    /--/,
    /\/\*/,
    /\*\//,
    /xp_/i,
    /sp_/i
  ];

  private readonly ALLOWED_SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
    'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR',
    'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN',
    'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT'
  ];

  /**
   * Parse parameter references from SQL string
   * Supports: ${controlId}, ${controlId.min}, ${controlId.max}, etc.
   */
  parseParameters(sql: string): ParameterReference[] {
    const parameters: ParameterReference[] = [];
    let match;

    // Reset regex lastIndex
    this.PARAMETER_REGEX.lastIndex = 0;

    while ((match = this.PARAMETER_REGEX.exec(sql)) !== null) {
      const [fullMatch, parameterExpression] = match;
      const [controlId, path] = parameterExpression.split('.');

      parameters.push({
        parameterName: parameterExpression,
        controlId: controlId.trim(),
        path: path?.trim(),
        fullMatch,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length
      });
    }

    return parameters;
  }

  /**
   * Substitute parameters with actual values safely
   */
  substituteParameters(
    sql: string, 
    controlValues: Record<string, any>, 
    controlTypes: Record<string, ControlType>
  ): string {
    const parameters = this.parseParameters(sql);
    let result = sql;
    
    // Process parameters in reverse order to maintain correct indices
    const sortedParameters = parameters.sort((a, b) => b.startIndex - a.startIndex);

    for (const param of sortedParameters) {
      const { controlId, path, fullMatch, startIndex, endIndex } = param;
      
      // Get control value
      const controlValue = this.getControlValue(controlValues[controlId], path);
      const controlType = controlTypes[controlId];
      
      if (controlValue === undefined || controlValue === null) {
        // Replace with NULL for missing values
        result = result.substring(0, startIndex) + 'NULL' + result.substring(endIndex);
        continue;
      }

      // Sanitize and format value based on control type
      const sanitizedValue = this.formatValueForSQL(controlValue, controlType, path);
      
      // Replace parameter with sanitized value
      result = result.substring(0, startIndex) + sanitizedValue + result.substring(endIndex);
    }

    return result;
  }

  /**
   * Validate SQL for security and syntax
   */
  validateSQL(sql: string): SQLValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestedFixes: string[] = [];

    // Check for unsafe patterns
    const hasUnsafePatterns = this.UNSAFE_PATTERNS.some(pattern => pattern.test(sql));
    if (hasUnsafePatterns) {
      errors.push('SQL contains potentially unsafe patterns (DDL/DML operations not allowed)');
      suggestedFixes.push('Use only SELECT statements for data queries');
    }

    // Check for SQL injection patterns
    if (this.containsSQLInjectionPatterns(sql)) {
      errors.push('SQL contains potential injection patterns');
      suggestedFixes.push('Use parameterized queries instead of string concatenation');
    }

    // Validate parameter syntax
    const parameters = this.parseParameters(sql);
    const parameterCount = parameters.length;

    parameters.forEach(param => {
      if (!param.controlId) {
        errors.push(`Invalid parameter syntax: ${param.fullMatch}`);
      }
      
      if (param.path && !this.isValidParameterPath(param.path)) {
        warnings.push(`Unusual parameter path: ${param.parameterName}`);
      }
    });

    // Check for basic SQL syntax
    if (!this.hasValidSQLStructure(sql)) {
      errors.push('Invalid SQL structure - must be a valid SELECT statement');
      suggestedFixes.push('Ensure SQL follows proper SELECT syntax');
    }

    // Performance warnings
    if (sql.toLowerCase().includes('select *')) {
      warnings.push('Using SELECT * may impact performance - specify columns explicitly');
    }

    if (!sql.toLowerCase().includes('limit') && !sql.toLowerCase().includes('top')) {
      warnings.push('Consider adding LIMIT clause to prevent large result sets');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      parameterCount,
      hasUnsafePatterns,
      suggestedFixes
    };
  }

  /**
   * Sanitize parameter value for SQL injection prevention
   */
  sanitizeParameterValue(value: any, dataType: DataType): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }

    switch (dataType.name) {
      case 'string':
        return this.escapeStringValue(String(value));
      
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          throw new Error(`Invalid number value: ${value}`);
        }
        return String(numValue);
      
      case 'date':
        return this.formatDateValue(value);
      
      case 'boolean':
        return Boolean(value) ? '1' : '0';
      
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Expected array but got: ${typeof value}`);
        }
        return this.formatArrayValue(value);
      
      default:
        throw new Error(`Unsupported data type: ${dataType.name}`);
    }
  }

  /**
   * Generate parameterized query for prepared statements
   */
  generateParameterizedQuery(
    sql: string, 
    controlValues: Record<string, any>
  ): { query: string; parameters: Record<string, any> } {
    const parameters = this.parseParameters(sql);
    const parameterMap: Record<string, any> = {};
    let query = sql;
    
    // Replace parameters with placeholder names
    const sortedParameters = parameters.sort((a, b) => b.startIndex - a.startIndex);
    
    for (const param of sortedParameters) {
      const { controlId, path, fullMatch, startIndex, endIndex } = param;
      const paramName = `param_${controlId}${path ? `_${path}` : ''}`;
      
      // Get control value
      const controlValue = this.getControlValue(controlValues[controlId], path);
      parameterMap[paramName] = controlValue;
      
      // Replace with parameter placeholder
      query = query.substring(0, startIndex) + `@${paramName}` + query.substring(endIndex);
    }

    return { query, parameters: parameterMap };
  }

  /**
   * Get control value with path support
   */
  private getControlValue(value: any, path?: string): any {
    if (!path) return value;

    if (Array.isArray(value)) {
      switch (path) {
        case 'min': return value[0];
        case 'max': return value[1];
        case 'start': return value[0];
        case 'end': return value[1];
        case 'length': return value.length;
        default: return undefined;
      }
    }

    if (typeof value === 'object' && value !== null) {
      return value[path];
    }

    return undefined;
  }

  /**
   * Format value for SQL based on control type
   */
  private formatValueForSQL(value: any, controlType: ControlType, path?: string): string {
    switch (controlType) {
      case 'text-input':
      case 'text-area':
        return this.escapeStringValue(String(value));
      
      case 'number-input':
      case 'slider':
        return String(Number(value));
      
      case 'number-range':
      case 'range-slider':
        if (path === 'min' || path === 'max') {
          return String(Number(value));
        }
        if (Array.isArray(value)) {
          return path === 'min' ? String(value[0]) : String(value[1]);
        }
        return 'NULL';
      
      case 'date':
        return this.formatDateValue(value);
      
      case 'date-range':
        if (path === 'start' || path === 'end') {
          return this.formatDateValue(value);
        }
        if (Array.isArray(value)) {
          return this.formatDateValue(path === 'start' ? value[0] : value[1]);
        }
        return 'NULL';
      
      case 'list-values':
        if (Array.isArray(value)) {
          return this.formatArrayValue(value);
        }
        return this.escapeStringValue(String(value));
      
      case 'switch':
      case 'checkbox':
        return Boolean(value) ? '1' : '0';
      
      default:
        return this.escapeStringValue(String(value));
    }
  }

  /**
   * Escape string values to prevent SQL injection
   */
  private escapeStringValue(value: string): string {
    // Replace single quotes with double single quotes
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  /**
   * Format date value for SQL
   */
  private formatDateValue(value: any): string {
    let date: Date;
    
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      throw new Error(`Invalid date value: ${value}`);
    }

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }

    // Format as ISO date string
    return `'${date.toISOString().split('T')[0]}'`;
  }

  /**
   * Format array values for SQL IN clause
   */
  private formatArrayValue(values: any[]): string {
    const escapedValues = values.map(val => {
      if (typeof val === 'string') {
        return this.escapeStringValue(val);
      } else if (typeof val === 'number') {
        return String(val);
      } else {
        return this.escapeStringValue(String(val));
      }
    });

    return `(${escapedValues.join(', ')})`;
  }

  /**
   * Check for SQL injection patterns
   */
  private containsSQLInjectionPatterns(sql: string): boolean {
    const injectionPatterns = [
      /'\s*OR\s*'1'\s*=\s*'1/i,
      /'\s*OR\s*1\s*=\s*1/i,
      /'\s*UNION\s+SELECT/i,
      /'\s*;\s*DROP/i,
      /'\s*;\s*DELETE/i,
      /'\s*;\s*UPDATE/i,
      /'\s*;\s*INSERT/i
    ];

    return injectionPatterns.some(pattern => pattern.test(sql));
  }

  /**
   * Validate parameter path
   */
  private isValidParameterPath(path: string): boolean {
    const validPaths = ['min', 'max', 'start', 'end', 'length', 'first', 'last'];
    return validPaths.includes(path);
  }

  /**
   * Check if SQL has valid structure
   */
  private hasValidSQLStructure(sql: string): boolean {
    const trimmedSQL = sql.trim().toLowerCase();
    
    // Must start with SELECT
    if (!trimmedSQL.startsWith('select')) {
      return false;
    }

    // Must contain FROM clause
    if (!trimmedSQL.includes('from')) {
      return false;
    }

    // Check for balanced parentheses
    let parenCount = 0;
    for (const char of sql) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) return false;
    }
    
    return parenCount === 0;
  }
}

// Export singleton instance
export const sqlParameterEngine = new SQLParameterEngineImpl();

// Export React hook for SQL parameter functionality
export function useSQLParameters() {
  const parseParameters = (sql: string) => {
    return sqlParameterEngine.parseParameters(sql);
  };

  const substituteParameters = (
    sql: string, 
    controlValues: Record<string, any>, 
    controlTypes: Record<string, ControlType>
  ) => {
    return sqlParameterEngine.substituteParameters(sql, controlValues, controlTypes);
  };

  const validateSQL = (sql: string) => {
    return sqlParameterEngine.validateSQL(sql);
  };

  const generateParameterizedQuery = (sql: string, controlValues: Record<string, any>) => {
    return sqlParameterEngine.generateParameterizedQuery(sql, controlValues);
  };

  return {
    parseParameters,
    substituteParameters,
    validateSQL,
    generateParameterizedQuery
  };
}

// Utility function to detect control type from value
export function inferControlTypeFromValue(value: any): ControlType {
  if (typeof value === 'boolean') {
    return 'switch';
  }
  
  if (typeof value === 'number') {
    return 'number-input';
  }
  
  if (value instanceof Date) {
    return 'date';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 2 && value.every(v => typeof v === 'number')) {
      return 'number-range';
    }
    if (value.length === 2 && value.every(v => v instanceof Date)) {
      return 'date-range';
    }
    return 'list-values';
  }
  
  return 'text-input';
}
