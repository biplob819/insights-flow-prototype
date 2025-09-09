'use client';

import { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Database,
  RefreshCw
} from 'lucide-react';
import { Dataset, DataField } from './types';
import { useDraggable } from '@dnd-kit/core';

// Mock datasets for demonstration
const mockDatasets: Dataset[] = [
  {
    id: 'sales-data',
    name: 'Sales Data',
    lastUpdated: '2 hours ago',
    fields: [
      { id: 'date', name: 'Date', type: 'date', icon: 'Calendar' },
      { id: 'revenue', name: 'Revenue', type: 'number', icon: 'Hash' },
      { id: 'quantity', name: 'Quantity', type: 'number', icon: 'Hash' },
      { id: 'product', name: 'Product', type: 'string', icon: 'Type' },
      { id: 'category', name: 'Category', type: 'string', icon: 'Type' },
      { id: 'region', name: 'Region', type: 'string', icon: 'Type' },
    ],
  },
  {
    id: 'customer-data',
    name: 'Customer Data',
    lastUpdated: '1 day ago',
    fields: [
      { id: 'customer_id', name: 'Customer ID', type: 'string', icon: 'Type' },
      { id: 'age', name: 'Age', type: 'number', icon: 'Hash' },
      { id: 'lifetime_value', name: 'Lifetime Value', type: 'number', icon: 'Hash' },
      { id: 'join_date', name: 'Join Date', type: 'date', icon: 'Calendar' },
      { id: 'is_active', name: 'Is Active', type: 'boolean', icon: 'ToggleLeft' },
    ],
  },
];

const fieldIcons = {
  Calendar,
  Hash,
  Type,
  ToggleLeft,
};

interface DraggableFieldProps {
  field: DataField;
  datasetId: string;
}

function DraggableField({ field, datasetId }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${datasetId}-${field.id}`,
    data: { field, datasetId },
  });

  const Icon = fieldIcons[field.icon as keyof typeof fieldIcons] || Type;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-700">{field.name}</span>
    </div>
  );
}

export default function DataPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDatasets, setExpandedDatasets] = useState<string[]>(['sales-data']);

  const toggleDataset = (datasetId: string) => {
    setExpandedDatasets(prev =>
      prev.includes(datasetId)
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const filteredDatasets = mockDatasets.map(dataset => ({
    ...dataset,
    fields: dataset.fields.filter(field =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Data
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Datasets */}
      <div className="flex-1 overflow-y-auto">
        {filteredDatasets.map((dataset) => (
          <div key={dataset.id} className="border-b border-gray-200">
            {/* Dataset Header */}
            <button
              onClick={() => toggleDataset(dataset.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {dataset.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{dataset.lastUpdated}</span>
                {expandedDatasets.includes(dataset.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Dataset Fields */}
            {expandedDatasets.includes(dataset.id) && (
              <div className="px-2 pb-2">
                {dataset.fields.length > 0 ? (
                  dataset.fields.map((field) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      datasetId={dataset.id}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-2">
                    No fields match your search
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>
    </aside>
  );
}

