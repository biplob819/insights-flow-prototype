/**
 * Data Model Integration Component
 * Provides interface for connecting controls to data models and managing parameters
 * Implements Phase 3 requirement: Data Model Integration
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Database, 
  Link, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import { useDataModelParameters } from '../../../services/DataModelParameterService';
import { useControlContext } from '../contexts/ControlContext';
import type { 
  DataModel, 
  ControlParameterMapping, 
  DataModelParameter,
  ParameterUpdateResult 
} from '../../../services/DataModelParameterService';

interface DataModelIntegrationProps {
  className?: string;
}

export default function DataModelIntegration({ className = "" }: DataModelIntegrationProps) {
  const [dataModels, setDataModels] = useState<DataModel[]>([]);
  const [parameterMappings, setParameterMappings] = useState<ControlParameterMapping[]>([]);
  const [selectedDataModel, setSelectedDataModel] = useState<DataModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMappingModal, setShowMappingModal] = useState(false);

  const { state } = useControlContext();
  const { getDataModels, getParameterMappings } = useDataModelParameters();

  // Load data models and mappings
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [models, mappings] = await Promise.all([
        getDataModels(),
        getParameterMappings()
      ]);
      setDataModels(models);
      setParameterMappings(mappings);
    } catch (error) {
      console.error('Failed to load data models:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getDataModels, getParameterMappings]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Model Integration</h3>
            <p className="text-sm text-gray-500">Connect controls to data model parameters</p>
          </div>
        </div>

        <button
          onClick={() => setShowMappingModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mapping</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-sm text-gray-500">Loading data models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Models */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Data Models</h4>
              {dataModels.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No data models available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dataModels.map((model) => (
                    <DataModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedDataModel?.id === model.id}
                      onSelect={setSelectedDataModel}
                      parameterMappings={parameterMappings.filter(m => m.dataModelId === model.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Parameter Mappings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Control Mappings</h4>
              {parameterMappings.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <Link className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No parameter mappings configured</p>
                  <button
                    onClick={() => setShowMappingModal(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Create your first mapping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {parameterMappings.map((mapping, index) => (
                    <ParameterMappingCard
                      key={index}
                      mapping={mapping}
                      dataModel={dataModels.find(m => m.id === mapping.dataModelId)}
                      onRefresh={loadData}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mapping Modal */}
      {showMappingModal && (
        <ParameterMappingModal
          isOpen={true}
          onClose={() => setShowMappingModal(false)}
          dataModels={dataModels}
          onSave={loadData}
        />
      )}
    </div>
  );
}

// Data Model Card Component
interface DataModelCardProps {
  model: DataModel;
  isSelected: boolean;
  onSelect: (model: DataModel) => void;
  parameterMappings: ControlParameterMapping[];
}

function DataModelCard({ model, isSelected, onSelect, parameterMappings }: DataModelCardProps) {
  return (
    <div
      className={`
        border rounded-lg p-4 cursor-pointer transition-colors
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={() => onSelect(model)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h5 className="font-medium text-gray-900">{model.name}</h5>
          {model.description && (
            <p className="text-sm text-gray-500">{model.description}</p>
          )}
        </div>
        <span className={`
          px-2 py-1 text-xs font-medium rounded
          ${model.type === 'sql' ? 'bg-blue-100 text-blue-800' : ''}
          ${model.type === 'api' ? 'bg-green-100 text-green-800' : ''}
          ${model.type === 'file' ? 'bg-purple-100 text-purple-800' : ''}
          ${model.type === 'custom' ? 'bg-gray-100 text-gray-800' : ''}
        `}>
          {model.type.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{model.parameters.length} parameters</span>
        <span>{parameterMappings.length} mapped</span>
      </div>

      {parameterMappings.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {parameterMappings.slice(0, 3).map((mapping, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {mapping.controlId}
            </span>
          ))}
          {parameterMappings.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{parameterMappings.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Parameter Mapping Card Component
interface ParameterMappingCardProps {
  mapping: ControlParameterMapping;
  dataModel?: DataModel;
  onRefresh: () => void;
}

function ParameterMappingCard({ mapping, dataModel, onRefresh }: ParameterMappingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResult, setLastResult] = useState<ParameterUpdateResult | null>(null);
  
  const { state } = useControlContext();
  const { passControlValue } = useDataModelParameters();

  // Get current control value
  const controlValue = state.controls[mapping.controlId]?.value;
  const parameter = dataModel?.parameters.find(p => p.id === mapping.parameterId);

  // Update parameter with current control value
  const updateParameter = useCallback(async () => {
    if (!controlValue || !dataModel) return;

    setIsUpdating(true);
    try {
      const result = await passControlValue(
        mapping.controlId,
        controlValue,
        mapping.controlType,
        mapping.dataModelId,
        mapping.parameterId
      );
      setLastResult(result);
    } catch (error) {
      console.error('Failed to update parameter:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [controlValue, dataModel, mapping, passControlValue]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {mapping.controlId}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {parameter?.name || mapping.parameterId}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={updateParameter}
            disabled={isUpdating || !controlValue}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50"
            title="Update parameter"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>

          <button
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Delete mapping"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Data Model:</span>
          <span className="font-medium">{dataModel?.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Control Type:</span>
          <span className="font-medium">{mapping.controlType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Current Value:</span>
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {JSON.stringify(controlValue)}
          </span>
        </div>

        {parameter && (
          <div className="flex justify-between">
            <span className="text-gray-600">Parameter Type:</span>
            <span className="font-medium">{parameter.dataType}</span>
          </div>
        )}
      </div>

      {/* Last update result */}
      {lastResult && (
        <div className={`
          mt-3 p-2 rounded text-sm
          ${lastResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
          }
        `}>
          <div className="flex items-center space-x-2">
            {lastResult.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className={lastResult.success ? 'text-green-800' : 'text-red-800'}>
              {lastResult.success 
                ? `Updated ${lastResult.updatedDatasets.length} dataset(s)`
                : 'Update failed'
              }
            </span>
          </div>
          
          {lastResult.errors.length > 0 && (
            <div className="mt-1 text-red-700">
              {lastResult.errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Parameter Mapping Modal Component
interface ParameterMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataModels: DataModel[];
  onSave: () => void;
}

function ParameterMappingModal({ isOpen, onClose, dataModels, onSave }: ParameterMappingModalProps) {
  const [selectedControlId, setSelectedControlId] = useState('');
  const [selectedDataModelId, setSelectedDataModelId] = useState('');
  const [selectedParameterId, setSelectedParameterId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { state } = useControlContext();
  const { createParameterMapping } = useDataModelParameters();

  // Get selected data model
  const selectedDataModel = dataModels.find(m => m.id === selectedDataModelId);
  
  // Get available parameters for selected data model
  const availableParameters = selectedDataModel?.parameters || [];

  // Save mapping
  const handleSave = useCallback(async () => {
    if (!selectedControlId || !selectedDataModelId || !selectedParameterId) return;

    const control = state.controls[selectedControlId];
    if (!control) return;

    setIsSaving(true);
    try {
      await createParameterMapping({
        controlId: selectedControlId,
        controlType: control.type,
        dataModelId: selectedDataModelId,
        parameterId: selectedParameterId
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to create parameter mapping:', error);
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedControlId,
    selectedDataModelId,
    selectedParameterId,
    state.controls,
    createParameterMapping,
    onSave,
    onClose
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Parameter Mapping</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Control Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Control
            </label>
            <select
              value={selectedControlId}
              onChange={(e) => setSelectedControlId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a control...</option>
              {Object.entries(state.controls).map(([controlId, control]) => (
                <option key={controlId} value={controlId}>
                  {controlId} ({control.type})
                </option>
              ))}
            </select>
          </div>

          {/* Data Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Data Model
            </label>
            <select
              value={selectedDataModelId}
              onChange={(e) => {
                setSelectedDataModelId(e.target.value);
                setSelectedParameterId(''); // Reset parameter selection
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a data model...</option>
              {dataModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.parameters.length} parameters)
                </option>
              ))}
            </select>
          </div>

          {/* Parameter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Parameter
            </label>
            <select
              value={selectedParameterId}
              onChange={(e) => setSelectedParameterId(e.target.value)}
              disabled={!selectedDataModelId}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">Choose a parameter...</option>
              {availableParameters.map((parameter) => (
                <option key={parameter.id} value={parameter.id}>
                  {parameter.name} ({parameter.dataType})
                  {parameter.required && ' *'}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          {selectedControlId && selectedDataModelId && selectedParameterId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Mapping Preview</h4>
              <div className="text-sm text-blue-800">
                <div>Control: <strong>{selectedControlId}</strong></div>
                <div>Data Model: <strong>{selectedDataModel?.name}</strong></div>
                <div>Parameter: <strong>{availableParameters.find(p => p.id === selectedParameterId)?.name}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedControlId || !selectedDataModelId || !selectedParameterId}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Create Mapping</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
