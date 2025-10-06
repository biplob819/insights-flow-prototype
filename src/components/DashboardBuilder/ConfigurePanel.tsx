'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Database, 
  Hash, 
  Type, 
  Calendar,
  Palette,
  Settings,
  Play,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Palette as PaletteIcon,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Target,
  Layers
} from 'lucide-react';
import { WidgetConfig, ConditionalRule } from './types';
import { availableDatasets } from './sampleData';

interface ConfigurePanelProps {
  isOpen: boolean;
  onClose: () => void;
  widget: WidgetConfig | null;
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

function CollapsibleSection({ title, children, defaultExpanded = true, icon: Icon }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className="text-sm font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

function DataTab({ widget, onUpdateWidget }: { widget: WidgetConfig; onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void }) {
  const [selectedDataset, setSelectedDataset] = useState(widget.config?.datasetId || 'sales-performance');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedViews, setExpandedViews] = useState<string[]>([selectedDataset]);
  const [draggedField, setDraggedField] = useState<any>(null);
  
  const currentDataset = useMemo(() => {
    return availableDatasets.find(d => d.id === selectedDataset);
  }, [selectedDataset]);

  const stringFields = useMemo(() => {
    return currentDataset?.fields.filter(f => f.type === 'string') || [];
  }, [currentDataset]);

  const numberFields = useMemo(() => {
    return currentDataset?.fields.filter(f => f.type === 'number') || [];
  }, [currentDataset]);

  // Filter datasets and their columns based on search query
  const filteredDatasets = useMemo(() => {
    if (!searchQuery.trim()) return availableDatasets;
    
    return availableDatasets.map(dataset => {
      const matchesDataset = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const filteredFields = dataset.fields.filter(field =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchesDataset || filteredFields.length > 0) {
        return {
          ...dataset,
          fields: matchesDataset ? dataset.fields : filteredFields
        };
      }
      return null;
    }).filter(Boolean) as typeof availableDatasets;
  }, [searchQuery]);

  const toggleViewExpansion = (datasetId: string) => {
    setExpandedViews(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  // Drag and drop handlers
  const handleDragStart = (field: { name: string; type: string }) => {
    setDraggedField(field);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetAxis: 'x' | 'y') => {
    e.preventDefault();
    if (!draggedField) return;

    if (targetAxis === 'x' && draggedField.type === 'string') {
      handleXAxisChange(draggedField.id);
    } else if (targetAxis === 'y' && draggedField.type === 'number') {
      handleYAxisAdd(draggedField.id);
    }
    
    setDraggedField(null);
  };

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId);
    // Auto-expand the newly selected dataset
    if (!expandedViews.includes(datasetId)) {
      setExpandedViews(prev => [...prev, datasetId]);
    }
    onUpdateWidget(widget.id, {
      config: {
        ...widget.config,
        datasetId,
        xAxis: undefined,
        xAxisName: undefined,
        yAxisFields: [],
        yAxisNames: []
      }
    });
  };

  const handleXAxisChange = (fieldId: string) => {
    const field = stringFields.find(f => f.id === fieldId);
    if (field) {
      onUpdateWidget(widget.id, {
        config: {
          ...widget.config,
          xAxis: field.id,
          xAxisName: field.name,
          xAxisType: field.type
        }
      });
    }
  };

  const handleYAxisAdd = (fieldId: string) => {
    const field = numberFields.find(f => f.id === fieldId);
    if (!field) return;

    const currentYFields = widget.config?.yAxisFields || [];
    const currentYNames = widget.config?.yAxisNames || [];
    
    if (!currentYFields.includes(field.id)) {
      onUpdateWidget(widget.id, {
        config: {
          ...widget.config,
          yAxisFields: [...currentYFields, field.id],
          yAxisNames: [...currentYNames, field.name]
        }
      });
    }
  };

  const handleYAxisRemove = (fieldId: string) => {
    const currentYFields = widget.config?.yAxisFields || [];
    const currentYNames = widget.config?.yAxisNames || [];
    const index = currentYFields.indexOf(fieldId);
    
    if (index > -1) {
      const newYFields = currentYFields.filter(id => id !== fieldId);
      const newYNames = currentYNames.filter((_, i) => i !== index);
      
      onUpdateWidget(widget.id, {
        config: {
          ...widget.config,
          yAxisFields: newYFields,
          yAxisNames: newYNames
        }
      });
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'string': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      default: return Database;
    }
  };

  return (
    <div className="space-y-4">
      {/* X-Axis Configuration */}
      <CollapsibleSection title="X-Axis" icon={BarChart3}>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">Selected Dimension</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'x')}
            className={`min-h-[60px] p-3 border-2 border-dashed rounded-lg transition-all ${
              draggedField?.type === 'string' 
                ? 'border-cyan-400 bg-cyan-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {widget.config?.xAxisName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-cyan-100 border border-cyan-300 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-900">{widget.config.xAxisName}</span>
                  </div>
                  <button
                    onClick={() => onUpdateWidget(widget.id, {
                      config: { ...widget.config, xAxis: undefined, xAxisName: undefined }
                    })}
                    className="p-1 text-cyan-700 hover:text-cyan-900 hover:bg-cyan-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* X-Axis Configuration Options */}
                <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                  {/* Truncate Date (only for date fields) */}
                  {widget.config?.xAxisType === 'date' && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Truncate Date</label>
                      <select 
                        value={widget.config?.xAxisTruncate || 'day'}
                        onChange={(e) => onUpdateWidget(widget.id, {
                          config: { ...widget.config, xAxisTruncate: e.target.value as 'year' | 'quarter' | 'month' | 'week' | 'day' }
                        })}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="year">Year</option>
                        <option value="quarter">Quarter</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Transform */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Transform</label>
                    <select 
                      value={widget.config?.xAxisTransform || 'none'}
                      onChange={(e) => onUpdateWidget(widget.id, {
                        config: { ...widget.config, xAxisTransform: e.target.value as 'none' | 'uppercase' | 'lowercase' | 'title_case' }
                      })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="title_case">Title Case</option>
                    </select>
                  </div>
                  
                  {/* Format */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Format</label>
                    <select 
                      value={widget.config?.xAxisFormat || 'auto'}
                      onChange={(e) => onUpdateWidget(widget.id, {
                        config: { ...widget.config, xAxisFormat: e.target.value as 'number' | 'currency' | 'auto' | 'percent' | 'plain_text' | 'scientific' }
                      })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="auto">Automatic</option>
                      <option value="plain_text">Plain text</option>
                      <option value="number">Number</option>
                      <option value="percent">Percent</option>
                      <option value="currency">Currency</option>
                      <option value="scientific">Scientific</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Type className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  Drag a dimension here or select from views below
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  (String fields only)
                </p>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Y-Axis Configuration */}
      <CollapsibleSection title="Y-Axis" icon={Hash}>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">Selected Measures</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'y')}
            className={`min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-all ${
              draggedField?.type === 'number' 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {widget.config?.yAxisFields && widget.config.yAxisFields.length > 0 ? (
              <div className="space-y-2">
                {widget.config.yAxisFields.map((fieldId, index) => {
                  const fieldName = widget.config?.yAxisNames?.[index] || fieldId;
                  return (
                    <div key={fieldId} className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-green-100 border border-green-300 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">{fieldName}</span>
                        </div>
                        <button
                          onClick={() => handleYAxisRemove(fieldId)}
                          className="p-1 text-green-700 hover:text-green-900 hover:bg-green-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Y-Axis Field Configuration Options */}
                      <div className="space-y-3 p-3 bg-gray-50 rounded-md ml-4">
                        {/* Set Aggregate */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700">Set Aggregate</label>
                          <select 
                            value={widget.config?.yAxisAggregations?.[index] || 'sum'}
                            onChange={(e) => {
                              const aggregations = [...(widget.config?.yAxisAggregations || [])];
                              aggregations[index] = e.target.value;
                              onUpdateWidget(widget.id, {
                                config: { ...widget.config, yAxisAggregations: aggregations }
                              });
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="sum">Sum</option>
                            <option value="avg">Average</option>
                            <option value="count">Count</option>
                            <option value="min">Minimum</option>
                            <option value="max">Maximum</option>
                            <option value="median">Median</option>
                          </select>
                        </div>
                        
                        {/* Transform */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700">Transform</label>
                          <select 
                            value={widget.config?.yAxisTransforms?.[index] || 'none'}
                            onChange={(e) => {
                              const transforms = [...(widget.config?.yAxisTransforms || [])];
                              transforms[index] = e.target.value;
                              onUpdateWidget(widget.id, {
                                config: { ...widget.config, yAxisTransforms: transforms }
                              });
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="none">None</option>
                            <option value="log">Log</option>
                            <option value="sqrt">Square Root</option>
                            <option value="abs">Absolute</option>
                          </select>
                        </div>
                        
                        {/* Format */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-700">Format</label>
                          <select 
                            value={widget.config?.yAxisFormats?.[index] || 'auto'}
                            onChange={(e) => {
                              const formats = [...(widget.config?.yAxisFormats || [])];
                              formats[index] = e.target.value;
                              onUpdateWidget(widget.id, {
                                config: { ...widget.config, yAxisFormats: formats }
                              });
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="auto">Automatic</option>
                            <option value="number">Number (1,234.56)</option>
                            <option value="percent">Percent (12.34%)</option>
                            <option value="currency">Currency ($1,234.56)</option>
                            <option value="scientific">Scientific (1.23e4)</option>
                            <option value="si_units">SI units (1.2k)</option>
                            <option value="financial">Financial (1,234.56)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Hash className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  Drag measures here or select from views below
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  (Number fields only)
                </p>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Search Views */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search views, columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 pl-9"
          />
          <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Views */}
      <div className="space-y-2">
        <div className="space-y-3">
          {filteredDatasets.map(dataset => (
            <div key={dataset.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Dataset Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Database className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{dataset.name}</h4>
                      <p className="text-xs text-gray-500">{dataset.recordCount} records</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <button
                      onClick={() => handleDatasetChange(dataset.id)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        selectedDataset === dataset.id ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </button>
                    <button
                      onClick={() => toggleViewExpansion(dataset.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {expandedViews.includes(dataset.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dataset Columns */}
              {expandedViews.includes(dataset.id) && (
                <div className="p-3 bg-white">
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {dataset.fields.map(field => {
                      const Icon = getFieldIcon(field.type);
                      const isXAxisField = widget.config?.xAxis === field.id;
                      const isYAxisField = widget.config?.yAxisFields?.includes(field.id);
                      const isAssigned = isXAxisField || isYAxisField;
                      
                      return (
                        <div
                          key={field.id}
                          draggable
                          onDragStart={() => handleDragStart(field)}
                          className={`group flex items-center justify-between p-2.5 rounded-md border transition-all cursor-move ${
                            isAssigned
                              ? 'bg-blue-50 border-blue-200 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className={`p-1 rounded-sm flex-shrink-0 ${
                              field.type === 'string' ? 'bg-cyan-100' : 
                              field.type === 'number' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-3.5 h-3.5 ${
                                field.type === 'string' ? 'text-cyan-600' : 
                                field.type === 'number' ? 'text-green-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900 truncate">{field.name}</span>
                                {isAssigned && (
                                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                                    {isXAxisField ? 'X-Axis' : 'Y-Axis'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {field.type === 'string' && !isXAxisField && (
                              <button
                                onClick={() => handleXAxisChange(field.id)}
                                className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors shadow-sm"
                              >
                                Add to X
                              </button>
                            )}
                            {field.type === 'number' && !isYAxisField && (
                              <button
                                onClick={() => handleYAxisAdd(field.id)}
                                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                              >
                                Add to Y
                              </button>
                            )}
                            {isAssigned && (
                              <button
                                onClick={() => isXAxisField ? onUpdateWidget(widget.id, { config: { ...widget.config, xAxis: undefined, xAxisName: undefined } }) : handleYAxisRemove(field.id)}
                                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OperationsTab({ widget, onUpdateWidget }: { widget: WidgetConfig; onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void }) {
  const handleConfigChange = (updates: Record<string, any>) => {
    onUpdateWidget(widget.id, {
      config: {
        ...widget.config,
        ...updates
      }
    });
  };

  const addConditionalRule = () => {
    const newRule: ConditionalRule = {
      id: Date.now().toString(),
      column: '',
      condition: 'greater',
      value: 0,
      color: '#ef4444',
      enabled: true
    };
    const existingRules = widget.config?.conditionalRules || [];
    handleConfigChange({ conditionalRules: [...existingRules, newRule] });
  };

  const removeConditionalRule = (ruleId: string) => {
    const existingRules = widget.config?.conditionalRules || [];
    handleConfigChange({ conditionalRules: existingRules.filter((rule: ConditionalRule) => rule.id !== ruleId) });
  };

  const updateConditionalRule = (ruleId: string, updates: Partial<ConditionalRule>) => {
    const existingRules = widget.config?.conditionalRules || [];
    const updatedRules = existingRules.map((rule: ConditionalRule) => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    handleConfigChange({ conditionalRules: updatedRules });
  };

  return (
    <div className="space-y-4">
      {/* Chart Type & Basic Configuration */}
      <CollapsibleSection title="Chart Configuration" icon={BarChart3}>
        <div className="space-y-4">
          {/* Orientation */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Orientation</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleConfigChange({ orientation: 'vertical' })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-xs rounded-md border transition-colors ${
                  (widget.config?.orientation || 'vertical') === 'vertical'
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Vertical</span>
              </button>
              <button
                onClick={() => handleConfigChange({ orientation: 'horizontal' })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-xs rounded-md border transition-colors ${
                  widget.config?.orientation === 'horizontal'
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Horizontal</span>
              </button>
            </div>
          </div>

          {/* Stacking */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Stacking</label>
            <select
              value={widget.config?.stacking || 'none'}
              onChange={(e) => handleConfigChange({ stacking: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="none">No stacking</option>
              <option value="stacked">Stacked</option>
              <option value="stacked100">Stacked 100%</option>
            </select>
            <p className="text-xs text-gray-500">
              {widget.config?.stacking === 'none' && 'Plot multiple data series as separate bars within categories'}
              {widget.config?.stacking === 'stacked' && 'Plot multiple data series as cumulative bar segments'}
              {widget.config?.stacking === 'stacked100' && 'Plot multiple data series as stacked bars totaling 100%'}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Data Labels */}
      <CollapsibleSection title="Data Labels" icon={Type}>
        <div className="space-y-4">
          {/* Show Data Labels Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Data Labels</label>
            <button
              onClick={() => handleConfigChange({ showDataLabels: !widget.config?.showDataLabels })}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                widget.config?.showDataLabels ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                widget.config?.showDataLabels ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {widget.config?.showDataLabels && (
            <div className="space-y-3">
              {/* Label Position */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Label Position</label>
                <select
                  value={widget.config?.dataLabelPosition || 'auto'}
                  onChange={(e) => handleConfigChange({ dataLabelPosition: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="auto">Auto</option>
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                  <option value="outside">Outside</option>
                </select>
              </div>

              {/* Label Format */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Label Format</label>
                <select
                  value={widget.config?.dataLabelFormat || 'value'}
                  onChange={(e) => handleConfigChange({ dataLabelFormat: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="value">Value</option>
                  <option value="percent">Percent</option>
                  <option value="value_percent">Value + Percent</option>
                  <option value="label">Label</option>
                  <option value="label_value">Label + Value</option>
                </select>
              </div>

              {/* Label Color */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Label Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={widget.config?.dataLabelColor || '#374151'}
                    onChange={(e) => handleConfigChange({ dataLabelColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={widget.config?.dataLabelColor || '#374151'}
                    onChange={(e) => handleConfigChange({ dataLabelColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Font Size</label>
                <select
                  value={widget.config?.dataLabelFontSize || 'small'}
                  onChange={(e) => handleConfigChange({ dataLabelFontSize: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="x-small">Extra Small</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="x-large">Extra Large</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Legends */}
      <CollapsibleSection title="Legends" icon={Layers}>
        <div className="space-y-4">
          {/* Show Legend Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Legend</label>
            <button
              onClick={() => handleConfigChange({ showLegend: !widget.config?.showLegend })}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                (widget.config?.showLegend !== false) ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                (widget.config?.showLegend !== false) ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {(widget.config?.showLegend !== false) && (
            <div className="space-y-3">
              {/* Legend Position */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Legend Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' }
                  ].map((position) => (
                    <button
                      key={position.value}
                      onClick={() => handleConfigChange({ legendPosition: position.value })}
                      className={`py-2 px-3 text-xs rounded-md border transition-colors ${
                        (widget.config?.legendPosition || 'right') === position.value
                          ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {position.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend Alignment */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Legend Alignment</label>
                <select
                  value={widget.config?.legendAlignment || 'center'}
                  onChange={(e) => handleConfigChange({ legendAlignment: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Axis Titles */}
      <CollapsibleSection title="Axis Titles" icon={Type}>
        <div className="space-y-4">
          {/* X-Axis Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">X-Axis Title</label>
              <button
                onClick={() => handleConfigChange({ showXAxisTitle: !widget.config?.showXAxisTitle })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showXAxisTitle ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showXAxisTitle ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {widget.config?.showXAxisTitle && (
              <input
                type="text"
                placeholder="Enter X-axis title..."
                value={widget.config?.xAxisTitle || ''}
                onChange={(e) => handleConfigChange({ xAxisTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>

          {/* Y-Axis Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Y-Axis Title</label>
              <button
                onClick={() => handleConfigChange({ showYAxisTitle: !widget.config?.showYAxisTitle })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showYAxisTitle ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showYAxisTitle ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {widget.config?.showYAxisTitle && (
              <input
                type="text"
                placeholder="Enter Y-axis title..."
                value={widget.config?.yAxisTitle || ''}
                onChange={(e) => handleConfigChange({ yAxisTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Mark Colors */}
      <CollapsibleSection title="Mark Colors" icon={PaletteIcon}>
        <div className="space-y-4">
          {/* Color Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Color Mode</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="colorMode"
                  value="single"
                  checked={(widget.config?.colorMode || 'single') === 'single'}
                  onChange={() => handleConfigChange({ colorMode: 'single' })}
                  className="text-cyan-600"
                />
                <span className="text-xs text-gray-700">Single color</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="colorMode"
                  value="category"
                  checked={widget.config?.colorMode === 'category'}
                  onChange={() => handleConfigChange({ colorMode: 'category' })}
                  className="text-cyan-600"
                />
                <span className="text-xs text-gray-700">By category</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="colorMode"
                  value="scale"
                  checked={widget.config?.colorMode === 'scale'}
                  onChange={() => handleConfigChange({ colorMode: 'scale' })}
                  className="text-cyan-600"
                />
                <span className="text-xs text-gray-700">By scale</span>
              </label>
            </div>
          </div>

          {/* Single Color Picker */}
          {(widget.config?.colorMode || 'single') === 'single' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={widget.config?.singleColor || '#3b82f6'}
                  onChange={(e) => handleConfigChange({ singleColor: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={widget.config?.singleColor || '#3b82f6'}
                  onChange={(e) => handleConfigChange({ singleColor: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Category Colors */}
          {widget.config?.colorMode === 'category' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Category Colors</label>
              <div className="grid grid-cols-6 gap-2">
                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'].map((color, index) => (
                  <button
                    key={color}
                    onClick={() => {
                      const colors = widget.config?.categoryColors || [];
                      colors[index] = color;
                      handleConfigChange({ categoryColors: colors });
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scale Colors */}
          {widget.config?.colorMode === 'scale' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Scale Colors</label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Min</span>
                  <input
                    type="color"
                    value={widget.config?.scaleColors?.min || '#dbeafe'}
                    onChange={(e) => handleConfigChange({ 
                      scaleColors: { ...widget.config?.scaleColors, min: e.target.value }
                    })}
                    className="w-6 h-6 rounded border"
                  />
                </div>
                <div className="flex-1 h-4 bg-gradient-to-r from-blue-100 to-blue-600 rounded"></div>
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={widget.config?.scaleColors?.max || '#1d4ed8'}
                    onChange={(e) => handleConfigChange({ 
                      scaleColors: { ...widget.config?.scaleColors, max: e.target.value }
                    })}
                    className="w-6 h-6 rounded border"
                  />
                  <span className="text-xs text-gray-500">Max</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Conditional Formatting */}
      <CollapsibleSection title="Conditional Formatting" icon={Filter}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Add rules to highlight values based on conditions</p>
            <button
              onClick={addConditionalRule}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add rule</span>
            </button>
          </div>

          {widget.config?.conditionalRules && widget.config.conditionalRules.length > 0 ? (
            <div className="space-y-3">
              {widget.config.conditionalRules.map((rule: ConditionalRule, index: number) => (
                <div key={rule.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Rule {index + 1}</span>
                    <button
                      onClick={() => removeConditionalRule(rule.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={rule.condition}
                      onChange={(e) => updateConditionalRule(rule.id, { condition: e.target.value as 'greater' | 'less' | 'equal' | 'between' })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="greater">Greater than</option>
                      <option value="less">Less than</option>
                      <option value="equal">Equal to</option>
                      <option value="between">Between</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Value"
                      value={rule.value}
                      onChange={(e) => updateConditionalRule(rule.id, { value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={rule.color}
                        onChange={(e) => updateConditionalRule(rule.id, { color: e.target.value })}
                        className="w-6 h-6 rounded border"
                      />
                      <span className="text-xs text-gray-500">Color</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No conditional formatting rules</p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Tooltip Configuration */}
      <CollapsibleSection title="Tooltip Configuration" icon={MousePointer}>
        <div className="space-y-4">
          {/* Show Tooltip Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Show Tooltip</label>
            <button
              onClick={() => handleConfigChange({ showTooltip: !widget.config?.showTooltip })}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                (widget.config?.showTooltip !== false) ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                (widget.config?.showTooltip !== false) ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Tooltip as Percentage */}
          {widget.config?.stacking !== 'none' && (
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Display value as percent</label>
              <button
                onClick={() => handleConfigChange({ tooltipAsPercent: !widget.config?.tooltipAsPercent })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.tooltipAsPercent ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.tooltipAsPercent ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          )}

          {/* Tooltip Preview */}
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs font-medium text-gray-700 mb-2">Preview</div>
            <div className="bg-gray-800 text-white p-2 rounded text-xs max-w-fit">
              <div className="font-medium">Category Name</div>
              <div className="text-gray-300">
                Value: {widget.config?.tooltipAsPercent ? '16.96%' : '$287M'}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Gap Width Configuration */}
      <CollapsibleSection title="Gap Width" icon={Layers}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Gap width</label>
            <select
              value={widget.config?.gapWidth || 'auto'}
              onChange={(e) => handleConfigChange({ gapWidth: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="auto">Auto</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Visual Examples */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Small</div>
              <div className="flex justify-center space-x-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-8 bg-blue-400 rounded-sm"></div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Medium</div>
              <div className="flex justify-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-8 bg-blue-400 rounded-sm"></div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Large</div>
              <div className="flex justify-center space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-8 bg-blue-400 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Reference Lines & Trend Lines */}
      <CollapsibleSection title="Reference Lines & Trend Lines" icon={Target}>
        <div className="space-y-4">
          {/* Reference Lines */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Reference Lines</label>
              <button className="flex items-center space-x-1 px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                <Plus className="w-3 h-3" />
                <span>Add line</span>
              </button>
            </div>
            <div className="text-center py-4">
              <Minus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No reference lines added</p>
            </div>
          </div>

          {/* Trend Lines */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Show Trend Line</label>
              <button
                onClick={() => handleConfigChange({ showTrendLine: !widget.config?.showTrendLine })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showTrendLine ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showTrendLine ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {widget.config?.showTrendLine && (
              <div className="space-y-2">
                <select className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="linear">Linear</option>
                  <option value="exponential">Exponential</option>
                  <option value="polynomial">Polynomial</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function DesignTab({ widget, onUpdateWidget }: { widget: WidgetConfig; onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void }) {
  const handleConfigChange = (updates: Record<string, any>) => {
    onUpdateWidget(widget.id, {
      config: {
        ...widget.config,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* General Settings */}
      <CollapsibleSection title="General" icon={Settings}>
        <div className="space-y-4">
          {/* Title Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Title</label>
              <button
                onClick={() => handleConfigChange({ showChartTitle: !widget.config?.showChartTitle })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showChartTitle ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showChartTitle ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {Boolean(widget.config?.showChartTitle) && (
              <input
                type="text"
                placeholder="Enter chart title..."
                value={widget.chartTitle || ''}
                onChange={(e) => handleConfigChange({ chartTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}
          </div>

          {/* Description Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Description</label>
              <button
                onClick={() => handleConfigChange({ showChartDescription: !widget.config?.showChartDescription })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showChartDescription ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showChartDescription ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {Boolean(widget.config?.showChartDescription) && (
              <textarea
                placeholder="Enter chart description..."
                value={widget.chartDescription || ''}
                onChange={(e) => handleConfigChange({ chartDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            )}
          </div>

          {/* Show value in bar */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Show value in bar</label>
            <select
              value={widget.config?.showDataLabels ? 'absolute' : 'none'}
              onChange={(e) => handleConfigChange({ 
                showDataLabels: e.target.value !== 'none',
                dataLabelsFormat: e.target.value === 'percentage' ? 'percentage' : 
                                 e.target.value === 'both' ? 'both' : 'value'
              })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="none">none</option>
              <option value="absolute">absolute</option>
              <option value="percentage">% of maximum bar value</option>
              <option value="both">% of total</option>
            </select>
          </div>

          {/* Bar color by X axis */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Bar color by X axis</label>
            <button
              onClick={() => handleConfigChange({ 
                colorMode: widget.config?.colorMode === 'category' ? 'single' : 'category'
              })}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                widget.config?.colorMode === 'category' ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                widget.config?.colorMode === 'category' ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Rounded corners */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Rounded corners</label>
              <button className="text-xs text-cyan-600 hover:text-cyan-700">reset</button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="20"
                value={(widget.config?.roundedCorners as number) ?? 0}
                onChange={(e) => handleConfigChange({ roundedCorners: parseInt(e.target.value) })}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Bar color */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Bar color</label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: widget.config?.singleColor || '#06b6d4' }}
                onClick={() => {
                  // Color picker would be implemented here
                }}
              />
              <input
                type="color"
                value={widget.config?.singleColor || '#06b6d4'}
                onChange={(e) => handleConfigChange({ singleColor: e.target.value })}
                className="w-8 h-8 rounded border-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Order & Limit */}
      <CollapsibleSection title="Order & Limit" icon={BarChart3}>
        <div className="space-y-4">
          {/* Limit */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="limit-enabled"
                checked={Boolean(widget.config?.limitEnabled) || false}
                onChange={(e) => handleConfigChange({ limitEnabled: e.target.checked })}
                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="limit-enabled" className="text-xs font-medium text-gray-700">Limit</label>
              <select
                disabled={!widget.config?.limitEnabled}
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-gray-100"
              >
                <option>Top</option>
                <option>Bottom</option>
              </select>
              <input
                type="number"
                value={(widget.config?.limitValue as number) ?? 10}
                onChange={(e) => handleConfigChange({ limitValue: parseInt(e.target.value) })}
                disabled={!widget.config?.limitEnabled}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Order</label>
            <div className="flex space-x-2">
              <select
                value={(widget.config?.orderBy as string) ?? 'x-axis'}
                onChange={(e) => handleConfigChange({ orderBy: e.target.value })}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="x-axis">By X axis</option>
                <option value="y-axis">By Y axis</option>
              </select>
              <select
                value={(widget.config?.orderDirection as string) ?? 'ascending'}
                onChange={(e) => handleConfigChange({ orderDirection: e.target.value })}
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="ascending">ascending</option>
                <option value="descending">descending</option>
              </select>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Axes */}
      <CollapsibleSection title="Axes" icon={BarChart3}>
        <div className="space-y-4">
          {/* Y axis type */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Y axis type</label>
            <select
              value={(widget.config?.measureAxisType as string) ?? 'Linear'}
              onChange={(e) => handleConfigChange({ measureAxisType: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Linear">Linear</option>
              <option value="Logarithmic (base 2)">Logarithmic (base 2)</option>
              <option value="Logarithmic (base 10)">Logarithmic (base 10)</option>
            </select>
          </div>

          {/* Manual axis range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Manual axis range</label>
              <button
                onClick={() => handleConfigChange({ 
                  manualAxisRange: !widget.config?.manualAxisRange 
                })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.manualAxisRange ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.manualAxisRange ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            {Boolean(widget.config?.manualAxisRange) && (
              <div className="space-y-2 ml-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minimum:</label>
                  <input
                    type="number"
                    value={(widget.config?.axisMin as number) ?? 0}
                    onChange={(e) => handleConfigChange({ axisMin: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Maximum:</label>
                  <input
                    type="number"
                    value={(widget.config?.axisMax as number) ?? 95}
                    onChange={(e) => handleConfigChange({ axisMax: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Y axis color */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Y axis color</label>
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer bg-black"
              onClick={() => {
                // Color picker would be implemented here
              }}
            />
          </div>

          {/* Y axis label */}
          <CollapsibleSection title="Y axis label" defaultExpanded={false}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Enabled</label>
                <button
                  onClick={() => handleConfigChange({ 
                    showAxisTitles: !widget.config?.showAxisTitles 
                  })}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                    widget.config?.showAxisTitles ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    widget.config?.showAxisTitles ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Position</label>
                <select
                  disabled={!widget.config?.showAxisTitles}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-gray-100"
                >
                  <option>Center</option>
                  <option>Left</option>
                  <option>Right</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* Y axis ticks */}
          <CollapsibleSection title="Y axis ticks" defaultExpanded={false}>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Density</label>
                <select
                  value={(widget.config?.tickDensity as string) ?? 'Normal'}
                  onChange={(e) => handleConfigChange({ tickDensity: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Compact</option>
                  <option>Normal</option>
                  <option>Sparse</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Display mode</label>
                <select
                  value={(widget.config?.tickDisplayMode as string) ?? 'Show ticks'}
                  onChange={(e) => handleConfigChange({ tickDisplayMode: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Show ticks</option>
                  <option>Hide ticks</option>
                  <option>Gridlines</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* X axis color */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">X axis color</label>
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer bg-black"
              onClick={() => {
                // Color picker would be implemented here
              }}
            />
          </div>

          {/* X axis label */}
          <CollapsibleSection title="X axis label" defaultExpanded={false}>
            <div className="text-xs text-gray-500">X axis label configuration...</div>
          </CollapsibleSection>

          {/* X axis ticks */}
          <CollapsibleSection title="X axis ticks" defaultExpanded={false}>
            <div className="text-xs text-gray-500">X axis ticks configuration...</div>
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Styling */}
      <CollapsibleSection title="Styling" icon={Palette} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Style Options */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Style</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleConfigChange({ borderStyle: 'none' })}
                className={`flex-1 p-2 border rounded text-xs transition-colors ${
                  widget.config?.borderStyle === 'none' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-full h-1 bg-current opacity-0"></div>
              </button>
              <button
                onClick={() => handleConfigChange({ borderStyle: 'solid' })}
                className={`flex-1 p-2 border rounded text-xs transition-colors ${
                  widget.config?.borderStyle === 'solid' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-full h-1 bg-current"></div>
              </button>
              <button
                onClick={() => handleConfigChange({ borderStyle: 'dashed' })}
                className={`flex-1 p-2 border rounded text-xs transition-colors ${
                  widget.config?.borderStyle === 'dashed' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-full h-1 border-t border-dashed border-current"></div>
              </button>
              <button
                onClick={() => handleConfigChange({ borderStyle: 'dotted' })}
                className={`flex-1 p-2 border rounded text-xs transition-colors ${
                  widget.config?.borderStyle === 'dotted' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-full h-1 border-t border-dotted border-current"></div>
              </button>
            </div>
          </div>

          {/* Width Options */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Width</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleConfigChange({ borderWidth: 'thin' })}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  widget.config?.borderWidth === 'thin' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                thin
              </button>
              <button
                onClick={() => handleConfigChange({ borderWidth: 'medium' })}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  widget.config?.borderWidth === 'medium' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                medium
              </button>
              <button
                onClick={() => handleConfigChange({ borderWidth: 'thick' })}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  widget.config?.borderWidth === 'thick' 
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                thick
              </button>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Annotate */}
      <CollapsibleSection title="Annotate" icon={BarChart3} defaultExpanded={false}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Info tooltip</label>
              <button
                onClick={() => handleConfigChange({ 
                  showInfoTooltip: !widget.config?.showInfoTooltip 
                })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.showInfoTooltip ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.showInfoTooltip ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {Boolean(widget.config?.showInfoTooltip) && (
              <textarea
                placeholder="Enter tooltip text..."
                value={(widget.config?.infoTooltipText as string) ?? ''}
                onChange={(e) => handleConfigChange({ infoTooltipText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Interactivity */}
      <CollapsibleSection title="Interactivity" icon={BarChart3} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Go to URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Go to URL</label>
              <button 
                onClick={() => handleConfigChange({ 
                  enableGoToUrl: !widget.config?.enableGoToUrl 
                })}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  widget.config?.enableGoToUrl ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  widget.config?.enableGoToUrl ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            {Boolean(widget.config?.enableGoToUrl) && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Go to URL..."
                    value={(widget.config?.goToUrl as string) ?? ''}
                    onChange={(e) => handleConfigChange({ goToUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Values</label>
                    <div className="flex items-center space-x-2">
                      <select className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500">
                        <option>Value</option>
                        <option>X axis</option>
                        <option>Y axis</option>
                        <option>Title</option>
                      </select>
                      <button className="flex items-center justify-center w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded border transition-colors">
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Events */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Custom events</label>
              <div className="flex items-center space-x-2">
                <button className="text-xs text-cyan-600 hover:text-cyan-700">edit</button>
                <button 
                  onClick={() => handleConfigChange({ 
                    enableCustomEvents: !widget.config?.enableCustomEvents 
                  })}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                    widget.config?.enableCustomEvents ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    widget.config?.enableCustomEvents ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
            
            {Boolean(widget.config?.enableCustomEvents) && (
              <div className="mt-3 border border-gray-200 rounded-lg bg-white">
                <div className="p-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Custom events can be used when integrating this dashboard in your application or platform. When active, clicking on data in the chart will trigger an event to which you can listen to.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">EVENT MENU</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Menu item label</label>
                            <input
                              type="text"
                              placeholder="Label"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Event name</label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Event name"
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                              />
                              <button className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium underline decoration-2 underline-offset-2">
                          Add an event option
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                        Cancel
                      </button>
                      <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Export</label>
            <button className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors bg-cyan-600`}>
              <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-4" />
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Theme */}
      <CollapsibleSection title="Theme" icon={Palette} defaultExpanded={false}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Theme</label>
            <select
              value={(widget.config?.theme as string) ?? 'Custom'}
              onChange={(e) => handleConfigChange({ theme: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Default (light)">Default (light)</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Custom theme options */}
          {widget.config?.theme === 'Custom' && (
            <div className="space-y-4 pl-3 border-l-2 border-gray-200">
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Background</label>
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer bg-white" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Font family</label>
                <select 
                  value={(widget.config?.fontFamily as string) ?? 'Lato'}
                  onChange={(e) => handleConfigChange({ fontFamily: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Lato</option>
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                  <option>Georgia</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Base font size</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={(widget.config?.baseFontSize as number) ?? 15}
                    onChange={(e) => handleConfigChange({ baseFontSize: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>

              {/* Item title */}
              <CollapsibleSection title="Item title" defaultExpanded={false}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Font size</label>
                    <div className="flex items-center space-x-2">
                      <select className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500">
                        <option>auto</option>
                        <option>small</option>
                        <option>medium</option>
                        <option>large</option>
                      </select>
                      <input
                        type="number"
                        value={15}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-gray-500">px</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Line height</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={40}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-gray-500">px</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Alignment</label>
                    <div className="flex space-x-1">
                      <button className="flex-1 p-2 border border-gray-300 rounded bg-purple-100 text-purple-700 text-xs">
                        ≡
                      </button>
                      <button className="flex-1 p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs">
                        ≡
                      </button>
                      <button className="flex-1 p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs">
                        ≡
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Style</label>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs font-bold">
                        B
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs italic">
                        I
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs underline">
                        U
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Border</label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Enabled</span>
                      <button className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors bg-gray-300`}>
                        <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Item borders */}
              <CollapsibleSection title="Item borders" defaultExpanded={false}>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="grid grid-cols-3 gap-1 items-center">
                      {/* Top */}
                      <div></div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs bg-gray-50">
                          🔒
                        </div>
                      </div>
                      <div></div>
                      
                      {/* Middle row */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs bg-gray-50">
                          🔒
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-2 border-blue-400 rounded-md flex items-center justify-center bg-blue-50">
                          <input
                            type="number"
                            value={0}
                            className="w-8 text-center text-sm font-medium border-0 bg-transparent focus:outline-none"
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">px</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs bg-gray-50">
                          🔒
                        </div>
                      </div>
                      
                      {/* Bottom */}
                      <div></div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs bg-gray-50">
                          🔒
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-600">Style</label>
                    <div className="flex space-x-2">
                      <button className="flex-1 p-3 border-2 border-purple-300 rounded-md bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition-colors">
                        —
                      </button>
                      <button className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors">
                        - -
                      </button>
                      <button className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors">
                        • •
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-600">Color</label>
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer bg-gray-400 shadow-sm hover:shadow-md transition-shadow" />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-600">Roundness</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={12}
                        className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <span className="text-sm text-gray-500 font-medium">px</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Item shadow */}
              <CollapsibleSection title="Item shadow" defaultExpanded={false}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Size</label>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border border-gray-300 rounded bg-purple-100 text-purple-700 text-xs">
                        S
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs">
                        M
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-xs">
                        L
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Color</label>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer bg-black" />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Axis */}
              <CollapsibleSection title="Axis" defaultExpanded={false}>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-600">Font size</label>
                  <div className="flex items-center space-x-2">
                    <select className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500">
                      <option>auto</option>
                      <option>small</option>
                      <option>medium</option>
                      <option>large</option>
                    </select>
                    <input
                      type="number"
                      value={12}
                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Tooltip */}
              <CollapsibleSection title="Tooltip" defaultExpanded={false}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Background color</label>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer bg-black" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">Font size</label>
                    <div className="flex items-center space-x-2">
                      <select className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500">
                        <option>auto</option>
                        <option>small</option>
                        <option>medium</option>
                        <option>large</option>
                      </select>
                      <input
                        type="number"
                        value={15}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-gray-500">px</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Advanced */}
      <CollapsibleSection title="Advanced" icon={Settings} defaultExpanded={false}>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">Show number of bars</label>
          <input
            type="number"
            value={(widget.config?.maxBars as number) ?? 500}
            onChange={(e) => handleConfigChange({ maxBars: parseInt(e.target.value) })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function ConfigurePanel({ isOpen, onClose, widget, onUpdateWidget }: ConfigurePanelProps) {
  const [activeTab, setActiveTab] = useState<'data' | 'operations' | 'design'>('data');

  if (!isOpen || !widget) return null;

  const tabs = [
    { id: 'data' as const, label: 'Data', icon: Database },
    { id: 'operations' as const, label: 'Operations', icon: Settings },
    { id: 'design' as const, label: 'Design', icon: Palette }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-semibold text-gray-900">Configure</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {activeTab === 'data' && (
          <DataTab widget={widget} onUpdateWidget={onUpdateWidget} />
        )}
        {activeTab === 'operations' && (
          <OperationsTab widget={widget} onUpdateWidget={onUpdateWidget} />
        )}
        {activeTab === 'design' && (
          <DesignTab widget={widget} onUpdateWidget={onUpdateWidget} />
        )}
      </div>

      {/* Chart ID Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="text-xs text-gray-500">
          <span className="font-medium">CHART ID:</span><br />
          <span className="font-mono">{widget.id}</span>
        </div>
      </div>
    </div>
  );
}
