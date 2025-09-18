'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Target, 
  Link, 
  Type, 
  Hash, 
  ToggleLeft,
  CheckSquare,
  Calendar,
  Sliders,
  List,
  Filter,
  Layers,
  Plus,
  Trash2,
  Palette,
  Layout,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';
import { WidgetConfig, ControlConfig, ControlTarget, DataField, Dataset } from './types';
import { availableDatasets } from './sampleData';

interface ControlConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  widget: WidgetConfig | null;
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  allWidgets: WidgetConfig[];
}

const controlTypeIcons = {
  'text-input': Type,
  'text-area': Type,
  'number-input': Hash,
  'number-range': Hash,
  'switch': ToggleLeft,
  'checkbox': CheckSquare,
  'date': Calendar,
  'date-range': Calendar,
  'slider': Sliders,
  'range-slider': Sliders,
  'list-values': List,
  'segmented': Layers,
  'top-n-filter': Filter,
  'drill-down': Filter,
  'legend': Layers
};


export default function ControlConfigPanel({
  isOpen,
  onClose,
  widget,
  onUpdateWidget,
  allWidgets
}: ControlConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'targets' | 'synced' | 'design'>('settings');

  // Always call hooks before any conditional returns
  const controlConfig = widget?.controlConfig;
  const IconComponent = controlTypeIcons[widget?.type as keyof typeof controlTypeIcons] || Settings;

  const handleConfigUpdate = useCallback((updates: Partial<ControlConfig>) => {
    if (!widget || !controlConfig) return;
    const updatedConfig = { ...controlConfig, ...updates };
    
    // If label is being updated, also update the widget title
    const widgetUpdates: Partial<WidgetConfig> = { controlConfig: updatedConfig };
    if (updates.label) {
      widgetUpdates.title = updates.label;
    }
    
    onUpdateWidget(widget.id, widgetUpdates);
  }, [controlConfig, widget, onUpdateWidget]);

  const addTarget = useCallback(() => {
    if (!controlConfig) return;
    const newTarget: ControlTarget = {
      elementId: '',
      elementType: 'bar',
      columnMapping: {}
    };
    
    handleConfigUpdate({
      targets: [...controlConfig.targets, newTarget]
    });
  }, [controlConfig, handleConfigUpdate]);

  const updateTarget = useCallback((index: number, updates: Partial<ControlTarget>) => {
    if (!controlConfig) return;
    const updatedTargets = [...controlConfig.targets];
    updatedTargets[index] = { ...updatedTargets[index], ...updates };
    handleConfigUpdate({ targets: updatedTargets });
  }, [controlConfig, handleConfigUpdate]);

  const removeTarget = useCallback((index: number) => {
    if (!controlConfig) return;
    const updatedTargets = controlConfig.targets.filter((_, i) => i !== index);
    handleConfigUpdate({ targets: updatedTargets });
  }, [controlConfig, handleConfigUpdate]);

  // Get available chart widgets for targeting
  const availableTargets = allWidgets.filter(w => 
    w && widget && w.id !== widget.id && !w.type.includes('input') && !w.type.includes('switch') && !w.type.includes('checkbox')
  );

  // Conditional return after all hooks have been called
  if (!isOpen || !widget || !controlConfig) {
    return null;
  }

  return (
    <>
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Control Settings</h2>
              <p className="text-sm text-gray-500">{widget.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { key: 'settings', label: 'Settings', icon: Settings },
            { key: 'targets', label: 'Targets', icon: Target },
            { key: 'synced', label: 'Synced', icon: Link },
            { key: 'design', label: 'Design', icon: Palette }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === key
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
          {activeTab === 'settings' && (
            <SettingsTab 
              controlConfig={controlConfig} 
              onUpdate={handleConfigUpdate}
              controlType={widget.type}
            />
          )}
          
          {activeTab === 'targets' && (
            <TargetsTab
              controlConfig={controlConfig}
              availableTargets={availableTargets}
              onAddTarget={addTarget}
              onUpdateTarget={updateTarget}
              onRemoveTarget={removeTarget}
            />
          )}
          
          {activeTab === 'synced' && (
            <SyncedTab
              controlConfig={controlConfig}
              allControls={allWidgets.filter(w => w.controlConfig)}
              onUpdate={handleConfigUpdate}
            />
          )}
          
          {activeTab === 'design' && (
            <DesignTab
              controlConfig={controlConfig}
              onUpdate={handleConfigUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
}

// Settings Tab Component
function SettingsTab({ 
  controlConfig, 
  onUpdate, 
  controlType 
}: { 
  controlConfig: ControlConfig; 
  onUpdate: (updates: Partial<ControlConfig>) => void;
  controlType: string;
}) {
  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Control ID
            </label>
            <input
              type="text"
              value={controlConfig.controlId}
              onChange={(e) => onUpdate({ controlId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={controlConfig.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={controlConfig.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={controlConfig.required || false}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              Required
            </label>
            
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={controlConfig.showLabel !== false}
                onChange={(e) => onUpdate({ showLabel: e.target.checked })}
                className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              Show Label
            </label>
          </div>
        </div>
      </div>

      {/* Value Source */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Value Source</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <select
              value={controlConfig.valueSource}
              onChange={(e) => onUpdate({ valueSource: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="manual">Manual List</option>
              <option value="column">Column Values</option>
              <option value="preset">Preset Values</option>
            </select>
          </div>
          
          {controlConfig.valueSource === 'column' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dataset
                </label>
                <select
                  value={controlConfig.sourceDataset || ''}
                  onChange={(e) => onUpdate({ sourceDataset: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select dataset...</option>
                  {availableDatasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {controlConfig.sourceDataset && (
                <ColumnSearchDropdown
                  label="Column"
                    value={controlConfig.sourceColumn || ''}
                  onChange={(value) => onUpdate({ sourceColumn: value })}
                  options={availableDatasets
                      .find(d => d.id === controlConfig.sourceDataset)
                    ?.fields.map((field) => ({
                      value: field.id,
                      label: field.name,
                      type: field.type
                    })) || []}
                  placeholder="Select column..."
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Control-Specific Settings */}
      <ControlSpecificSettings 
        controlType={controlType}
        controlConfig={controlConfig}
        onUpdate={onUpdate}
      />
    </div>
  );
}

// Targets Tab Component
function TargetsTab({
  controlConfig,
  availableTargets,
  onAddTarget,
  onUpdateTarget,
  onRemoveTarget
}: {
  controlConfig: ControlConfig;
  availableTargets: WidgetConfig[];
  onAddTarget: () => void;
  onUpdateTarget: (index: number, updates: Partial<ControlTarget>) => void;
  onRemoveTarget: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Target Elements</h3>
        <button
          onClick={onAddTarget}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target</span>
        </button>
      </div>
      
      {controlConfig.targets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No targets configured</p>
          <p className="text-sm">Add targets to filter dashboard elements</p>
        </div>
      ) : (
        <div className="space-y-4">
          {controlConfig.targets.map((target, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Target {index + 1}</h4>
                <button
                  onClick={() => onRemoveTarget(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Element
                  </label>
                  <TargetElementSearchDropdown
                    value={target.elementId}
                    onChange={(value) => onUpdateTarget(index, { elementId: value })}
                    options={availableTargets.map((widget) => ({
                      value: widget.id,
                      label: `${widget.title} (${widget.type})`,
                      type: widget.type
                    }))}
                    placeholder="Select element..."
                  />
                </div>
                
                {target.elementId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Column
                    </label>
                    <select
                      value={Object.keys(target.columnMapping)[0] || ''}
                      onChange={(e) => onUpdateTarget(index, { 
                        columnMapping: { [e.target.value]: e.target.value } 
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select column...</option>
                      {availableDatasets
                        .flatMap(d => d.fields)
                        .map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Synced Tab Component
function SyncedTab({
  controlConfig,
  allControls,
  onUpdate
}: {
  controlConfig: ControlConfig;
  allControls: WidgetConfig[];
  onUpdate: (updates: Partial<ControlConfig>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Synced Controls</h3>
        <p className="text-sm text-gray-500 mb-4">
          Synced controls share the same value and update together
        </p>
      </div>
      
      {controlConfig.syncedControlIds && controlConfig.syncedControlIds.length > 0 ? (
        <div className="space-y-3">
          {controlConfig.syncedControlIds.map((controlId) => {
            const control = allControls.find(c => c.id === controlId);
            return control ? (
              <div key={controlId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{control.title}</p>
                  <p className="text-xs text-gray-500">{control.type}</p>
                </div>
                <button
                  onClick={() => {
                    const updatedIds = controlConfig.syncedControlIds?.filter(id => id !== controlId);
                    onUpdate({ syncedControlIds: updatedIds });
                  }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Link className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No synced controls</p>
          <p className="text-sm">Controls with the same values will stay synchronized</p>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Available Controls</h4>
        <div className="space-y-2">
          {allControls
            .filter(c => c.id !== controlConfig.controlId && !controlConfig.syncedControlIds?.includes(c.id))
            .map((control) => (
              <button
                key={control.id}
                onClick={() => {
                  const updatedIds = [...(controlConfig.syncedControlIds || []), control.id];
                  onUpdate({ syncedControlIds: updatedIds });
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{control.title}</p>
                <p className="text-xs text-gray-500">{control.type}</p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// Control-Specific Settings Component
function ControlSpecificSettings({ 
  controlType, 
  controlConfig, 
  onUpdate 
}: { 
  controlType: string; 
  controlConfig: ControlConfig; 
  onUpdate: (updates: Partial<ControlConfig>) => void;
}) {
  // Text Input and Text Area Settings
  if (controlType === 'text-input' || controlType === 'text-area') {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Text Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={controlConfig.operator || 'contains'}
              onChange={(e) => onUpdate({ operator: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="equal-to">Equal to</option>
              <option value="not-equal-to">Not equal to</option>
              <option value="contains">Contains</option>
              <option value="does-not-contain">Does not contain</option>
              <option value="starts-with">Starts with</option>
              <option value="does-not-start-with">Does not start with</option>
              <option value="ends-with">Ends with</option>
              <option value="does-not-end-with">Does not end with</option>
              <option value="matches-regexp">Matches RegExp</option>
              <option value="does-not-match-regexp">Does not match RegExp</option>
            </select>
          </div>
          
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={controlConfig.caseSensitive || false}
              onChange={(e) => onUpdate({ caseSensitive: e.target.checked })}
              className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            Case Sensitive
          </label>
        </div>
      </div>
    );
  }

  // Number Input Settings
  if (controlType === 'number-input') {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Number Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={controlConfig.operator || 'equal-to'}
              onChange={(e) => onUpdate({ operator: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="equal-to">Equal to</option>
              <option value="less-than-or-equal">Less than or equal</option>
              <option value="greater-than-or-equal">Greater than or equal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step
            </label>
            <input
              type="number"
              value={controlConfig.step || 1}
              onChange={(e) => onUpdate({ step: Number(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // List Values and Segmented Settings
  if (controlType === 'list-values' || controlType === 'segmented') {
    return (
      <div>
        {/* Value Type and Format Settings */}
        {controlConfig.valueSource === 'manual' && (
        <div className="space-y-4">
            {/* Value Type and Format Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value type
            </label>
                <select
                  value={controlConfig.valueType || 'text'}
                  onChange={(e) => onUpdate({ valueType: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="logical">Logical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  value={controlConfig.valueFormat || 'automatic'}
                  onChange={(e) => onUpdate({ valueFormat: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="automatic">Automatic</option>
                  <option value="si">SI</option>
                  <option value="scientific">Scientific</option>
                  <option value="currency">Currency</option>
                  <option value="percent">Percent</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            {/* Values Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Values
                </label>
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
                    checked={controlConfig.setDisplayValues !== false}
                    onChange={(e) => onUpdate({ setDisplayValues: e.target.checked })}
              className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
                  Set display values
          </label>
              </div>
              
              {/* Values Input Area */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Values List - Compact Row Layout */}
                <div className="space-y-0">
              {(controlConfig.manualValues || []).map((item, index) => (
                    <div key={index} className="flex items-center border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.value || ''}
                    onChange={(e) => {
                      const newValues = [...(controlConfig.manualValues || [])];
                      newValues[index] = { ...newValues[index], value: e.target.value };
                      onUpdate({ manualValues: newValues });
                    }}
                          placeholder="Add number value..."
                          className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
                        />
                      </div>
                      
                      {controlConfig.setDisplayValues !== false && (
                        <>
                          <div className="w-px bg-gray-200 h-8"></div>
                          <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.displayValue || ''}
                    onChange={(e) => {
                      const newValues = [...(controlConfig.manualValues || [])];
                      newValues[index] = { ...newValues[index], displayValue: e.target.value };
                      onUpdate({ manualValues: newValues });
                    }}
                              placeholder="Display as..."
                              className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
                  />
                          </div>
                        </>
                      )}
                      
                      <div className="flex-shrink-0 px-2">
                  <button
                    onClick={() => {
                      const newValues = (controlConfig.manualValues || []).filter((_, i) => i !== index);
                      onUpdate({ manualValues: newValues });
                    }}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                          <X className="w-3 h-3" />
                  </button>
                      </div>
                </div>
              ))}
                  
                  {/* Empty state */}
                  {(!controlConfig.manualValues || controlConfig.manualValues.length === 0) && (
                    <div className="p-4 text-center text-gray-500 bg-gray-50">
                      <div className="text-sm">No values added yet</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add Value Button */}
              <button
                onClick={() => {
                  const newValues = [...(controlConfig.manualValues || []), { value: '', displayValue: '' }];
                  onUpdate({ manualValues: newValues });
                }}
                className="mt-2 flex items-center space-x-1 px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Value</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Slider and Range Settings
  if (controlType === 'slider' || controlType === 'range-slider' || controlType === 'number-range') {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Range Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Value
              </label>
              <input
                type="number"
                value={controlConfig.minValue || ''}
                onChange={(e) => onUpdate({ minValue: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Value
              </label>
              <input
                type="number"
                value={controlConfig.maxValue || ''}
                onChange={(e) => onUpdate({ maxValue: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          {(controlType === 'slider' || controlType === 'range-slider') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Step
              </label>
              <input
                type="number"
                value={controlConfig.step || 1}
                onChange={(e) => onUpdate({ step: Number(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Date Settings
  if (controlType === 'date' || controlType === 'date-range') {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Date Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              value={controlConfig.dateFormat || 'yyyy-MM-dd'}
              onChange={(e) => onUpdate({ dateFormat: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="yyyy-MM-dd HH:mm">YYYY-MM-DD HH:MM</option>
            </select>
          </div>
          
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={controlConfig.relativeDate || false}
              onChange={(e) => onUpdate({ relativeDate: e.target.checked })}
              className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            Enable Relative Dates
          </label>
        </div>
      </div>
    );
  }

  // No specific settings for other control types
  return null;
}

// Design Tab Component
function DesignTab({
  controlConfig,
  onUpdate
}: {
  controlConfig: ControlConfig;
  onUpdate: (updates: Partial<ControlConfig>) => void;
}) {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    placeholder: false,
    padding: false,
    annotate: false,
    theme: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4">
      {/* General Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('general')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">GENERAL</span>
          </div>
          {expandedSections.general ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.general && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Multiselect</label>
              <div className="flex items-center">
                <div 
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                    controlConfig.multiSelect !== false ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  onClick={() => onUpdate({ multiSelect: !(controlConfig.multiSelect !== false) })}
                >
                  <div 
                    className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                      controlConfig.multiSelect !== false ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Show Search only when Multiselect is OFF */}
            {controlConfig.multiSelect === false && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                      controlConfig.enableSearch !== false ? 'bg-cyan-500' : 'bg-gray-300'
                    }`}
                    onClick={() => onUpdate({ enableSearch: !(controlConfig.enableSearch !== false) })}
                  >
                    <div 
                      className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                        controlConfig.enableSearch !== false ? 'right-0.5' : 'left-0.5'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Show clear selection</label>
              <div className="flex items-center">
                <div 
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                    controlConfig.showClearOption !== false ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  onClick={() => onUpdate({ showClearOption: !(controlConfig.showClearOption !== false) })}
                >
                  <div 
                    className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                      controlConfig.showClearOption !== false ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Show Filter with Apply button only when Multiselect is ON */}
            {controlConfig.multiSelect !== false && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Filter with Apply button</label>
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                      controlConfig.filterWithApply ? 'bg-cyan-500' : 'bg-gray-300'
                    }`}
                    onClick={() => onUpdate({ filterWithApply: !controlConfig.filterWithApply })}
                  >
                    <div 
                      className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                        controlConfig.filterWithApply ? 'right-0.5' : 'left-0.5'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Show checkboxes</label>
              <div className="flex items-center">
                <div 
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                    controlConfig.showCheckboxes !== false ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  onClick={() => onUpdate({ showCheckboxes: !(controlConfig.showCheckboxes !== false) })}
                >
                  <div 
                    className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                      controlConfig.showCheckboxes !== false ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('placeholder')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">PLACEHOLDER</span>
          </div>
          {expandedSections.placeholder ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.placeholder && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Display</label>
              <div className="flex items-center">
                <div 
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                    controlConfig.showPlaceholder !== false ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  onClick={() => onUpdate({ showPlaceholder: !(controlConfig.showPlaceholder !== false) })}
                >
                  <div 
                    className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                      controlConfig.showPlaceholder !== false ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <input
                type="text"
                value={controlConfig.placeholderText || ''}
                onChange={(e) => onUpdate({ placeholderText: e.target.value })}
                placeholder="Select..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Padding Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('padding')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">PADDING</span>
          </div>
          {expandedSections.padding ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.padding && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding left</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue={16}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding right</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue={16}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Annotate Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('annotate')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">ANNOTATE</span>
          </div>
          {expandedSections.annotate ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.annotate && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Info tooltip *</label>
              <div className="flex items-center">
                <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('theme')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">THEME</span>
          </div>
          {expandedSections.theme ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.theme && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="inherit">Inherit</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">ADVANCED</span>
          </div>
          {expandedSections.advanced ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.advanced && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Case sensitive search</label>
              <div className="flex items-center">
                <div 
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                    controlConfig.caseSensitive ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  onClick={() => onUpdate({ caseSensitive: !controlConfig.caseSensitive })}
                >
                  <div 
                    className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                      controlConfig.caseSensitive ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show number of obs...
              </label>
              <input
                type="number"
                value={controlConfig.maxValues || 10000}
                onChange={(e) => onUpdate({ maxValues: parseInt(e.target.value) || 10000 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                min="1"
                max="100000"
              />
            </div>
          </div>
        )}
      </div>

      {/* Chart ID Section */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-600">CHART ID:</label>
          <div className="font-mono text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {controlConfig.controlId || 'b3e7f545-dfee-4a55-94c6-'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Column Search Dropdown Component
function ColumnSearchDropdown({
  label,
  value,
  onChange,
  options,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; type?: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 flex items-center justify-between text-sm"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No columns found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{option.label}</span>
                    {option.type && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                        {option.type}
                      </span>
                    )}
                  </div>
                  {value === option.value && <Check className="h-4 w-4 text-cyan-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Target Element Search Dropdown Component
function TargetElementSearchDropdown({
  value,
  onChange,
  options,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; type?: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 flex items-center justify-between text-sm"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search elements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No elements found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{option.label}</span>
                  </div>
                  {value === option.value && <Check className="h-4 w-4 text-cyan-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

