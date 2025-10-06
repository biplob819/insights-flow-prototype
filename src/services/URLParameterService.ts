/**
 * URL Parameter Service
 * Handles URL parameter parsing, encoding, and control state synchronization
 * Implements Phase 1 requirement: URL Parameters & Query String Support
 */

import { ControlType, ControlState } from '../components/DashboardBuilder/types';

export interface ControlStateMap {
  [controlId: string]: any;
}

export interface URLParameterService {
  parseControlValues(urlParams: URLSearchParams): ControlStateMap;
  updateURL(controlId: string, value: any, controlType: ControlType): void;
  encodeControlValue(value: any, controlType: ControlType): string;
  decodeControlValue(encoded: string, controlType: ControlType): any;
  generateShareableURL(controlStates: ControlStateMap, controlTypes: Record<string, ControlType>): string;
  validateURLParameters(urlParams: URLSearchParams): { valid: boolean; errors: string[] };
}

class URLParameterServiceImpl implements URLParameterService {
  private readonly SPECIAL_VALUES = {
    NULL: ':null',
    EMPTY: ':empty'
  };

  /**
   * Parse URL parameters and convert them to control values
   */
  parseControlValues(urlParams: URLSearchParams): ControlStateMap {
    const controlValues: ControlStateMap = {};
    
    for (const [key, value] of urlParams.entries()) {
      try {
        // Skip non-control parameters (e.g., page, tab, etc.)
        if (this.isSystemParameter(key)) {
          continue;
        }

        // Decode the control value
        const decodedValue = this.decodeGenericValue(value);
        controlValues[key] = decodedValue;
      } catch (error) {
        console.warn(`Failed to parse URL parameter ${key}=${value}:`, error);
      }
    }

    return controlValues;
  }

  /**
   * Update URL with new control value
   */
  updateURL(controlId: string, value: any, controlType: ControlType): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    
    if (value === null || value === undefined || value === '') {
      // Remove parameter if value is empty
      url.searchParams.delete(controlId);
    } else {
      // Encode and set parameter
      const encodedValue = this.encodeControlValue(value, controlType);
      url.searchParams.set(controlId, encodedValue);
    }

    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Encode control value for URL parameter
   */
  encodeControlValue(value: any, controlType: ControlType): string {
    if (value === null) return this.SPECIAL_VALUES.NULL;
    if (value === '') return this.SPECIAL_VALUES.EMPTY;

    switch (controlType) {
      case 'number-range':
      case 'range-slider':
        if (Array.isArray(value) && value.length === 2) {
          return `min:${value[0]},max:${value[1]}`;
        }
        break;

      case 'date-range':
        if (Array.isArray(value) && value.length === 2) {
          const startDate = value[0] instanceof Date ? value[0].toISOString().split('T')[0] : value[0];
          const endDate = value[1] instanceof Date ? value[1].toISOString().split('T')[0] : value[1];
          return `min:${startDate},max:${endDate}`;
        }
        break;

      case 'list-values':
      case 'segmented':
        if (Array.isArray(value)) {
          return value.map(v => encodeURIComponent(String(v))).join(',');
        }
        break;

      case 'date':
        if (value instanceof Date) {
          return value.toISOString().split('T')[0];
        }
        break;

      case 'switch':
      case 'checkbox':
        return String(Boolean(value));

      default:
        return encodeURIComponent(String(value));
    }

    return encodeURIComponent(String(value));
  }

  /**
   * Decode control value from URL parameter
   */
  decodeControlValue(encoded: string, controlType: ControlType): any {
    if (encoded === this.SPECIAL_VALUES.NULL) return null;
    if (encoded === this.SPECIAL_VALUES.EMPTY) return '';

    try {
      switch (controlType) {
        case 'number-range':
        case 'range-slider':
          return this.parseRangeValue(encoded, 'number');

        case 'date-range':
          return this.parseRangeValue(encoded, 'date');

        case 'list-values':
        case 'segmented':
          return this.parseArrayValue(encoded);

        case 'date':
          return new Date(encoded);

        case 'number-input':
        case 'slider':
          const numValue = Number(decodeURIComponent(encoded));
          return isNaN(numValue) ? null : numValue;

        case 'switch':
        case 'checkbox':
          return encoded.toLowerCase() === 'true';

        default:
          return decodeURIComponent(encoded);
      }
    } catch (error) {
      console.warn(`Failed to decode value "${encoded}" for control type "${controlType}":`, error);
      return null;
    }
  }

  /**
   * Generate shareable URL with current control state
   */
  generateShareableURL(controlStates: ControlStateMap, controlTypes: Record<string, ControlType>): string {
    const url = new URL(window.location.href);
    
    // Clear existing control parameters
    for (const [key] of url.searchParams.entries()) {
      if (!this.isSystemParameter(key)) {
        url.searchParams.delete(key);
      }
    }

    // Add current control states
    Object.entries(controlStates).forEach(([controlId, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        const controlType = controlTypes[controlId];
        if (controlType) {
          const encodedValue = this.encodeControlValue(value, controlType);
          url.searchParams.set(controlId, encodedValue);
        }
      }
    });

    return url.toString();
  }

  /**
   * Validate URL parameters for security and correctness
   */
  validateURLParameters(urlParams: URLSearchParams): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxParamLength = 2000; // Reasonable limit for URL parameter length
    const maxParams = 50; // Maximum number of control parameters

    let paramCount = 0;

    for (const [key, value] of urlParams.entries()) {
      if (this.isSystemParameter(key)) continue;

      paramCount++;

      // Check parameter count limit
      if (paramCount > maxParams) {
        errors.push(`Too many control parameters (max: ${maxParams})`);
        break;
      }

      // Check parameter length
      if (value.length > maxParamLength) {
        errors.push(`Parameter ${key} is too long (max: ${maxParamLength} characters)`);
      }

      // Check for potential XSS patterns
      if (this.containsSuspiciousContent(value)) {
        errors.push(`Parameter ${key} contains suspicious content`);
      }

      // Validate parameter format
      if (!this.isValidParameterFormat(value)) {
        errors.push(`Parameter ${key} has invalid format`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generic value decoder for unknown control types
   */
  private decodeGenericValue(encoded: string): any {
    if (encoded === this.SPECIAL_VALUES.NULL) return null;
    if (encoded === this.SPECIAL_VALUES.EMPTY) return '';

    // Try to detect value type and parse accordingly
    
    // Range format: min:value,max:value
    if (encoded.includes('min:') && encoded.includes('max:')) {
      return this.parseRangeValue(encoded, 'auto');
    }

    // Array format: value1,value2,value3
    if (encoded.includes(',') && !encoded.includes(':')) {
      return this.parseArrayValue(encoded);
    }

    // Boolean
    if (encoded.toLowerCase() === 'true' || encoded.toLowerCase() === 'false') {
      return encoded.toLowerCase() === 'true';
    }

    // Number
    const numValue = Number(encoded);
    if (!isNaN(numValue) && encoded === String(numValue)) {
      return numValue;
    }

    // Date (YYYY-MM-DD format)
    if (/^\d{4}-\d{2}-\d{2}$/.test(encoded)) {
      const date = new Date(encoded);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Default to string
    return decodeURIComponent(encoded);
  }

  /**
   * Parse range value (min:value,max:value)
   */
  private parseRangeValue(encoded: string, type: 'number' | 'date' | 'auto'): [any, any] | null {
    const match = encoded.match(/min:([^,]+),max:(.+)/);
    if (!match) return null;

    const [, minStr, maxStr] = match;

    if (type === 'number' || (type === 'auto' && !isNaN(Number(minStr)))) {
      const min = Number(minStr);
      const max = Number(maxStr);
      return isNaN(min) || isNaN(max) ? null : [min, max];
    }

    if (type === 'date' || (type === 'auto' && /^\d{4}-\d{2}-\d{2}$/.test(minStr))) {
      const minDate = new Date(minStr);
      const maxDate = new Date(maxStr);
      return isNaN(minDate.getTime()) || isNaN(maxDate.getTime()) ? null : [minDate, maxDate];
    }

    // Default to string range
    return [decodeURIComponent(minStr), decodeURIComponent(maxStr)];
  }

  /**
   * Parse array value (value1,value2,value3)
   */
  private parseArrayValue(encoded: string): any[] {
    return encoded.split(',').map(item => decodeURIComponent(item.trim()));
  }

  /**
   * Check if parameter is a system parameter (not a control)
   */
  private isSystemParameter(key: string): boolean {
    const systemParams = ['page', 'tab', 'view', 'mode', 'debug', 'theme'];
    return systemParams.includes(key.toLowerCase());
  }

  /**
   * Check for suspicious content that might indicate XSS attempts
   */
  private containsSuspiciousContent(value: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /data:text\/html/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Validate parameter format
   */
  private isValidParameterFormat(value: string): boolean {
    // Basic format validation - no control characters except common ones
    const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
    return !invalidChars.test(value);
  }
}

// Export singleton instance
export const urlParameterService = new URLParameterServiceImpl();

// Export hook for React components
export function useURLParameters() {
  const parseFromURL = (): ControlStateMap => {
    if (typeof window === 'undefined') return {};
    const urlParams = new URLSearchParams(window.location.search);
    return urlParameterService.parseControlValues(urlParams);
  };

  const updateURL = (controlId: string, value: any, controlType: ControlType) => {
    urlParameterService.updateURL(controlId, value, controlType);
  };

  const generateShareableURL = (controlStates: ControlStateMap, controlTypes: Record<string, ControlType>) => {
    return urlParameterService.generateShareableURL(controlStates, controlTypes);
  };

  return {
    parseFromURL,
    updateURL,
    generateShareableURL,
    validateURL: urlParameterService.validateURLParameters
  };
}
