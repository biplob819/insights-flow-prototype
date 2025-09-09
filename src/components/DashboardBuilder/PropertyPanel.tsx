'use client';

import { X, Palette, Database, Settings, Layout } from 'lucide-react';
import { WidgetConfig } from './types';

interface PropertyPanelProps {
  widget: WidgetConfig | undefined;
  onUpdateWidget: (updates: Partial<WidgetConfig>) => void;
  onClose: () => void;
}

export default function PropertyPanel({ widget, onUpdateWidget, onClose }: PropertyPanelProps) {
  if (!widget) return null;

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Widget Properties</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Property Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* General Properties */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">General</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={widget.title}
                onChange={(e) => onUpdateWidget({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={widget.description || ''}
                onChange={(e) => onUpdateWidget({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Add a description..."
              />
            </div>
          </div>
        </div>

        {/* Data Configuration */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Data</h3>
          </div>
          
          <div className="space-y-4">
            {widget.type !== 'text' && widget.type !== 'kpi' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X-Axis
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="">Select field...</option>
                    <option value="date">Date</option>
                    <option value="category">Category</option>
                    <option value="product">Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y-Axis
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="">Select field...</option>
                    <option value="revenue">Revenue</option>
                    <option value="quantity">Quantity</option>
                    <option value="count">Count</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aggregation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="sum">Sum</option>
                    <option value="avg">Average</option>
                    <option value="count">Count</option>
                    <option value="min">Min</option>
                    <option value="max">Max</option>
                  </select>
                </div>
              </>
            )}

            {widget.type === 'kpi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metric
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="">Select metric...</option>
                  <option value="revenue">Total Revenue</option>
                  <option value="users">Active Users</option>
                  <option value="conversion">Conversion Rate</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Scheme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'].map((color) => (
                  <button
                    key={color}
                    className="w-full h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateWidget({ config: { ...widget.config, color } })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  checked={widget.config?.showLegend ?? true}
                  onChange={(e) => onUpdateWidget({ 
                    config: { ...widget.config, showLegend: e.target.checked } 
                  })}
                />
                <span className="text-sm text-gray-700">Show Legend</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  checked={widget.config?.showGrid ?? true}
                  onChange={(e) => onUpdateWidget({ 
                    config: { ...widget.config, showGrid: e.target.checked } 
                  })}
                />
                <span className="text-sm text-gray-700">Show Grid Lines</span>
              </label>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Layout className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Layout</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                value={widget.width}
                onChange={(e) => onUpdateWidget({ width: parseInt(e.target.value) || 1 })}
                min="1"
                max="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                value={widget.height}
                onChange={(e) => onUpdateWidget({ height: parseInt(e.target.value) || 1 })}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

