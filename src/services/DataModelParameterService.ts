/**
 * Data Model Parameter Service
 * Handles control-to-data-model parameter passing and dataset targeting
 * Implements Phase 3 requirement: Data Model Integration
 */

import { ControlType, ControlState } from '../components/DashboardBuilder/types';

export interface DataModelParameter {
  id: string;
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
  description?: string;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  allowedValues?: any[];
}

export interface DataModel {
  id: string;
  name: string;
  description?: string;
  type: 'sql' | 'api' | 'file' | 'custom';
  parameters: DataModelParameter[];
  datasets: Dataset[];
  lastUpdated: Date;
  version: string;
}

export interface Dataset {
  id: string;
  name: string;
  dataModelId: string;
  parameters: DataModelParameter[];
  columns: DataColumn[];
  rowCount?: number;
  lastRefresh?: Date;
}

export interface DataColumn {
  id: string;
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
  description?: string;
}

export interface ControlParameterMapping {
  controlId: string;
  controlType: ControlType;
  dataModelId: string;
  parameterId: string;
  transformFunction?: string; // JavaScript function to transform control value
  validation?: ParameterValidation;
}

export interface CrossWorkbookReference {
  id: string;
  sourceWorkbookId: string;
  sourceControlId: string;
  targetWorkbookId: string;
  targetParameterId: string;
  enabled: boolean;
}

export interface DataModelFilterInheritance {
  dataModelId: string;
  parentDataModelId: string;
  inheritedParameters: string[];
  filterMappings: Record<string, string>;
}

export interface ParameterUpdateResult {
  success: boolean;
  updatedDatasets: string[];
  errors: string[];
  warnings: string[];
}

export interface DataModelParameterService {
  // Data model management
  getDataModels(): Promise<DataModel[]>;
  getDataModel(id: string): Promise<DataModel>;
  createDataModel(model: Omit<DataModel, 'id' | 'lastUpdated' | 'version'>): Promise<string>;
  updateDataModel(id: string, updates: Partial<DataModel>): Promise<void>;
  deleteDataModel(id: string): Promise<void>;

  // Parameter mapping
  createParameterMapping(mapping: Omit<ControlParameterMapping, 'id'>): Promise<string>;
  updateParameterMapping(id: string, updates: Partial<ControlParameterMapping>): Promise<void>;
  deleteParameterMapping(id: string): Promise<void>;
  getParameterMappings(controlId?: string, dataModelId?: string): Promise<ControlParameterMapping[]>;

  // Control value passing
  passControlValueToDataModel(
    controlId: string, 
    controlValue: any, 
    controlType: ControlType,
    dataModelId: string, 
    parameterId: string
  ): Promise<ParameterUpdateResult>;

  // Cross-workbook references
  createCrossWorkbookReference(reference: Omit<CrossWorkbookReference, 'id'>): Promise<string>;
  updateCrossWorkbookReference(id: string, updates: Partial<CrossWorkbookReference>): Promise<void>;
  deleteCrossWorkbookReference(id: string): Promise<void>;
  getCrossWorkbookReferences(workbookId?: string): Promise<CrossWorkbookReference[]>;

  // Filter inheritance
  setupFilterInheritance(inheritance: DataModelFilterInheritance): Promise<void>;
  getFilterInheritance(dataModelId: string): Promise<DataModelFilterInheritance[]>;
  removeFilterInheritance(dataModelId: string, parentDataModelId: string): Promise<void>;

  // Dataset operations
  refreshDataset(datasetId: string, parameters?: Record<string, any>): Promise<void>;
  getDatasetPreview(datasetId: string, parameters?: Record<string, any>): Promise<any[]>;
  validateParameters(dataModelId: string, parameters: Record<string, any>): Promise<{ valid: boolean; errors: string[] }>;
}

class DataModelParameterServiceImpl implements DataModelParameterService {
  private readonly API_BASE = '/api/data-models';

  /**
   * Get all data models
   */
  async getDataModels(): Promise<DataModel[]> {
    const response = await fetch(`${this.API_BASE}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data models: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get specific data model
   */
  async getDataModel(id: string): Promise<DataModel> {
    const response = await fetch(`${this.API_BASE}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data model: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create new data model
   */
  async createDataModel(model: Omit<DataModel, 'id' | 'lastUpdated' | 'version'>): Promise<string> {
    const response = await fetch(`${this.API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    });

    if (!response.ok) {
      throw new Error(`Failed to create data model: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  /**
   * Update data model
   */
  async updateDataModel(id: string, updates: Partial<DataModel>): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update data model: ${response.statusText}`);
    }
  }

  /**
   * Delete data model
   */
  async deleteDataModel(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete data model: ${response.statusText}`);
    }
  }

  /**
   * Create parameter mapping
   */
  async createParameterMapping(mapping: Omit<ControlParameterMapping, 'id'>): Promise<string> {
    const response = await fetch(`${this.API_BASE}/parameter-mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapping)
    });

    if (!response.ok) {
      throw new Error(`Failed to create parameter mapping: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  /**
   * Update parameter mapping
   */
  async updateParameterMapping(id: string, updates: Partial<ControlParameterMapping>): Promise<void> {
    const response = await fetch(`${this.API_BASE}/parameter-mappings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update parameter mapping: ${response.statusText}`);
    }
  }

  /**
   * Delete parameter mapping
   */
  async deleteParameterMapping(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/parameter-mappings/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete parameter mapping: ${response.statusText}`);
    }
  }

  /**
   * Get parameter mappings
   */
  async getParameterMappings(controlId?: string, dataModelId?: string): Promise<ControlParameterMapping[]> {
    const params = new URLSearchParams();
    if (controlId) params.append('controlId', controlId);
    if (dataModelId) params.append('dataModelId', dataModelId);

    const response = await fetch(`${this.API_BASE}/parameter-mappings?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch parameter mappings: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Pass control value to data model parameter
   */
  async passControlValueToDataModel(
    controlId: string,
    controlValue: any,
    controlType: ControlType,
    dataModelId: string,
    parameterId: string
  ): Promise<ParameterUpdateResult> {
    // Transform control value based on type
    const transformedValue = this.transformControlValue(controlValue, controlType);

    // Validate the transformed value
    const dataModel = await this.getDataModel(dataModelId);
    const parameter = dataModel.parameters.find(p => p.id === parameterId);
    
    if (!parameter) {
      return {
        success: false,
        updatedDatasets: [],
        errors: [`Parameter ${parameterId} not found in data model ${dataModelId}`],
        warnings: []
      };
    }

    const validationResult = this.validateParameterValue(transformedValue, parameter);
    if (!validationResult.valid) {
      return {
        success: false,
        updatedDatasets: [],
        errors: validationResult.errors,
        warnings: []
      };
    }

    // Send parameter update to backend
    const response = await fetch(`${this.API_BASE}/${dataModelId}/parameters/${parameterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        controlId,
        value: transformedValue,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update parameter: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create cross-workbook reference
   */
  async createCrossWorkbookReference(reference: Omit<CrossWorkbookReference, 'id'>): Promise<string> {
    const response = await fetch(`${this.API_BASE}/cross-workbook-references`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reference)
    });

    if (!response.ok) {
      throw new Error(`Failed to create cross-workbook reference: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  /**
   * Update cross-workbook reference
   */
  async updateCrossWorkbookReference(id: string, updates: Partial<CrossWorkbookReference>): Promise<void> {
    const response = await fetch(`${this.API_BASE}/cross-workbook-references/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update cross-workbook reference: ${response.statusText}`);
    }
  }

  /**
   * Delete cross-workbook reference
   */
  async deleteCrossWorkbookReference(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/cross-workbook-references/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete cross-workbook reference: ${response.statusText}`);
    }
  }

  /**
   * Get cross-workbook references
   */
  async getCrossWorkbookReferences(workbookId?: string): Promise<CrossWorkbookReference[]> {
    const params = workbookId ? `?workbookId=${workbookId}` : '';
    const response = await fetch(`${this.API_BASE}/cross-workbook-references${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cross-workbook references: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Setup filter inheritance
   */
  async setupFilterInheritance(inheritance: DataModelFilterInheritance): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${inheritance.dataModelId}/filter-inheritance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inheritance)
    });

    if (!response.ok) {
      throw new Error(`Failed to setup filter inheritance: ${response.statusText}`);
    }
  }

  /**
   * Get filter inheritance
   */
  async getFilterInheritance(dataModelId: string): Promise<DataModelFilterInheritance[]> {
    const response = await fetch(`${this.API_BASE}/${dataModelId}/filter-inheritance`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch filter inheritance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Remove filter inheritance
   */
  async removeFilterInheritance(dataModelId: string, parentDataModelId: string): Promise<void> {
    const response = await fetch(
      `${this.API_BASE}/${dataModelId}/filter-inheritance/${parentDataModelId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove filter inheritance: ${response.statusText}`);
    }
  }

  /**
   * Refresh dataset with parameters
   */
  async refreshDataset(datasetId: string, parameters?: Record<string, any>): Promise<void> {
    const response = await fetch(`${this.API_BASE}/datasets/${datasetId}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh dataset: ${response.statusText}`);
    }
  }

  /**
   * Get dataset preview with parameters
   */
  async getDatasetPreview(datasetId: string, parameters?: Record<string, any>): Promise<any[]> {
    const body = parameters ? JSON.stringify({ parameters }) : undefined;
    const response = await fetch(`${this.API_BASE}/datasets/${datasetId}/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    if (!response.ok) {
      throw new Error(`Failed to get dataset preview: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Validate parameters against data model
   */
  async validateParameters(dataModelId: string, parameters: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const response = await fetch(`${this.API_BASE}/${dataModelId}/validate-parameters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters })
    });

    if (!response.ok) {
      throw new Error(`Failed to validate parameters: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Transform control value based on control type
   */
  private transformControlValue(value: any, controlType: ControlType): any {
    switch (controlType) {
      case 'number-range':
      case 'range-slider':
        if (Array.isArray(value) && value.length === 2) {
          return { min: value[0], max: value[1] };
        }
        break;

      case 'date-range':
        if (Array.isArray(value) && value.length === 2) {
          return { 
            start: value[0] instanceof Date ? value[0].toISOString() : value[0],
            end: value[1] instanceof Date ? value[1].toISOString() : value[1]
          };
        }
        break;

      case 'date':
        if (value instanceof Date) {
          return value.toISOString();
        }
        break;

      case 'list-values':
        if (Array.isArray(value)) {
          return value;
        }
        break;

      case 'switch':
      case 'checkbox':
        return Boolean(value);

      default:
        return value;
    }

    return value;
  }

  /**
   * Validate parameter value against parameter definition
   */
  private validateParameterValue(value: any, parameter: DataModelParameter): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required
    if (parameter.required && (value === null || value === undefined || value === '')) {
      errors.push(`Parameter ${parameter.name} is required`);
      return { valid: false, errors };
    }

    // Skip validation if value is empty and not required
    if (!parameter.required && (value === null || value === undefined || value === '')) {
      return { valid: true, errors: [] };
    }

    // Type validation
    if (!this.isValidType(value, parameter.dataType)) {
      errors.push(`Parameter ${parameter.name} must be of type ${parameter.dataType}`);
    }

    // Additional validation rules
    if (parameter.validation) {
      const validation = parameter.validation;

      // Numeric validations
      if (typeof value === 'number') {
        if (validation.minValue !== undefined && value < validation.minValue) {
          errors.push(`Parameter ${parameter.name} must be >= ${validation.minValue}`);
        }
        if (validation.maxValue !== undefined && value > validation.maxValue) {
          errors.push(`Parameter ${parameter.name} must be <= ${validation.maxValue}`);
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (validation.minLength !== undefined && value.length < validation.minLength) {
          errors.push(`Parameter ${parameter.name} must be at least ${validation.minLength} characters`);
        }
        if (validation.maxLength !== undefined && value.length > validation.maxLength) {
          errors.push(`Parameter ${parameter.name} must be at most ${validation.maxLength} characters`);
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          errors.push(`Parameter ${parameter.name} does not match required pattern`);
        }
      }

      // Allowed values
      if (validation.allowedValues && !validation.allowedValues.includes(value)) {
        errors.push(`Parameter ${parameter.name} must be one of: ${validation.allowedValues.join(', ')}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Check if value matches expected data type
   */
  private isValidType(value: any, dataType: string): boolean {
    switch (dataType) {
      case 'string':
        return typeof value === 'string';
      
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      
      case 'boolean':
        return typeof value === 'boolean';
      
      case 'date':
        return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
      
      case 'array':
        return Array.isArray(value);
      
      default:
        return true;
    }
  }
}

// Export singleton instance
export const dataModelParameterService = new DataModelParameterServiceImpl();

// Export React hook for data model parameter functionality
export function useDataModelParameters() {
  const passControlValue = async (
    controlId: string,
    controlValue: any,
    controlType: ControlType,
    dataModelId: string,
    parameterId: string
  ) => {
    return dataModelParameterService.passControlValueToDataModel(
      controlId,
      controlValue,
      controlType,
      dataModelId,
      parameterId
    );
  };

  const createParameterMapping = async (mapping: Omit<ControlParameterMapping, 'id'>) => {
    return dataModelParameterService.createParameterMapping(mapping);
  };

  const refreshDataset = async (datasetId: string, parameters?: Record<string, any>) => {
    return dataModelParameterService.refreshDataset(datasetId, parameters);
  };

  return {
    passControlValue,
    createParameterMapping,
    refreshDataset,
    getDataModels: dataModelParameterService.getDataModels,
    getParameterMappings: dataModelParameterService.getParameterMappings,
    validateParameters: dataModelParameterService.validateParameters,
    getDatasetPreview: dataModelParameterService.getDatasetPreview
  };
}

// Utility functions for parameter type inference
export function inferParameterTypeFromControl(controlType: ControlType): string {
  switch (controlType) {
    case 'number-input':
    case 'slider':
      return 'number';
    
    case 'number-range':
    case 'range-slider':
      return 'object'; // { min: number, max: number }
    
    case 'date':
      return 'date';
    
    case 'date-range':
      return 'object'; // { start: date, end: date }
    
    case 'switch':
    case 'checkbox':
      return 'boolean';
    
    case 'list-values':
      return 'array';
    
    default:
      return 'string';
  }
}

export function generateParameterFromControl(
  controlId: string,
  controlType: ControlType,
  label?: string
): DataModelParameter {
  return {
    id: controlId,
    name: label || controlId,
    dataType: inferParameterTypeFromControl(controlType) as any,
    required: false,
    description: `Parameter generated from ${controlType} control`
  };
}
