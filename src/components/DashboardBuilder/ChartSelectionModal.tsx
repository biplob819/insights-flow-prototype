'use client';

import { useState } from 'react';
import { 
  LineChart, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  ScatterChart,
  Table,
  Hash,
  Grid3X3,
  BarChart4,
  Box,
  Zap,
  Filter,
  Gauge,
  TrendingDown,
  Map,
  MapPin,
  Globe,
  X
} from 'lucide-react';
import { WidgetConfig, ChartType, ControlType, WidgetType } from './types';
import { controlOptions, controlCategoryLabels, iconComponents } from './ControlSelectionData';
import { getDefaultControlConfig } from './Controls';

interface ChartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (widget: WidgetConfig) => void;
}

interface WidgetOption {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  category: string;
  color: string;
  bgColor: string;
}

interface ChartOption {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  category: 'basic' | 'advanced' | 'maps' | 'specialized';
  color: string;
  bgColor: string;
}

const chartOptions: ChartOption[] = [
  // Basic Charts
  {
    id: 'bar-chart',
    type: 'bar',
    title: 'Bar Chart',
    description: 'Compare values across categories',
    icon: BarChart3,
    category: 'basic',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'line-chart',
    type: 'line',
    title: 'Line Chart',
    description: 'Show trends over time',
    icon: LineChart,
    category: 'basic',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'area-chart',
    type: 'area',
    title: 'Area Chart',
    description: 'Illustrate cumulative values over time',
    icon: TrendingUp,
    category: 'basic',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'pie-chart',
    type: 'pie',
    title: 'Pie Chart',
    description: 'Show proportions of a whole',
    icon: PieChart,
    category: 'basic',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'scatter-chart',
    type: 'scatter',
    title: 'Scatter Plot',
    description: 'Show relationships between variables',
    icon: ScatterChart,
    category: 'basic',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'kpi',
    type: 'kpi',
    title: 'KPI Chart',
    description: 'Highlight single metric performance',
    icon: Hash,
    category: 'basic',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },

  // Advanced Charts
  {
    id: 'combo-chart',
    type: 'combo',
    title: 'Combo Chart',
    description: 'Combine multiple chart types',
    icon: BarChart4,
    category: 'advanced',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'box-chart',
    type: 'box',
    title: 'Box Chart',
    description: 'Show value distribution and outliers',
    icon: Box,
    category: 'advanced',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    id: 'donut-chart',
    type: 'donut',
    title: 'Donut Chart',
    description: 'Pie chart with center space',
    icon: PieChart,
    category: 'advanced',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'waterfall-chart',
    type: 'waterfall',
    title: 'Waterfall Chart',
    description: 'Show changes over time periods',
    icon: TrendingDown,
    category: 'advanced',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50'
  },

  // Specialized Charts
  {
    id: 'sankey-diagram',
    type: 'sankey',
    title: 'Sankey Diagram',
    description: 'Show data flow through processes',
    icon: Zap,
    category: 'specialized',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'funnel-chart',
    type: 'funnel',
    title: 'Funnel Chart',
    description: 'Track sequential process stages',
    icon: Filter,
    category: 'specialized',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'gauge-chart',
    type: 'gauge',
    title: 'Gauge Chart',
    description: 'Measure against radial scale',
    icon: Gauge,
    category: 'specialized',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50'
  },

  // Maps
  {
    id: 'region-map',
    type: 'region-map',
    title: 'Region Map',
    description: 'Show data by geographical regions',
    icon: Map,
    category: 'maps',
    color: 'text-green-700',
    bgColor: 'bg-green-50'
  },
  {
    id: 'point-map',
    type: 'point-map',
    title: 'Point Map',
    description: 'Precise positioning with coordinates',
    icon: MapPin,
    category: 'maps',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'geography-map',
    type: 'geography-map',
    title: 'Geography Map',
    description: 'Custom geospatial objects',
    icon: Globe,
    category: 'maps',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50'
  },

  // Utility
  {
    id: 'table',
    type: 'table',
    title: 'Table',
    description: 'Display data in rows and columns',
    icon: Table,
    category: 'basic',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'pivot-table',
    type: 'pivot-table',
    title: 'Pivot Table',
    description: 'Interactive data summarization and analysis',
    icon: Grid3X3,
    category: 'advanced',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

const chartCategoryLabels = {
  basic: 'Basic Charts',
  advanced: 'Advanced Charts',
  specialized: 'Specialized',
  maps: 'Maps & Geography'
};

const allCategoryLabels = {
  ...chartCategoryLabels,
  ...controlCategoryLabels
};

export default function ChartSelectionModal({ isOpen, onClose, onSelectChart }: ChartSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [selectedType, setSelectedType] = useState<'charts' | 'controls'>('charts');

  if (!isOpen) return null;

  const handleWidgetSelect = (option: WidgetOption) => {
    let newWidget: WidgetConfig;

    if (selectedType === 'charts') {
      newWidget = {
        id: `widget-${Date.now()}`,
        type: option.type,
        title: option.title,
        x: 0,
        y: 0,
        width: 4,
        height: 3,
        config: {
          showLegend: true,
          showGrid: true,
          color: option.color.replace('text-', '#')
        }
      };
    } else {
      // Control widget
      const controlTemplate = controlOptions.find(c => c.type === option.type);
      newWidget = {
        id: `control-${Date.now()}`,
        type: option.type,
        title: option.title,
        x: 0,
        y: 0,
        width: 3,
        height: 2,
        controlConfig: {
          ...getDefaultControlConfig(option.type as ControlType),
          label: option.title,
          ...(controlTemplate?.defaultConfig || {})
        }
      };
    }

    onSelectChart(newWidget);
    onClose();
  };

  const chartCategories = ['basic', 'advanced', 'specialized', 'maps'];
  const controlCategories = ['input', 'selection', 'range', 'boolean', 'navigation', 'advanced'];
  
  const categories = selectedType === 'charts' ? chartCategories : controlCategories;
  
  const filteredOptions = selectedType === 'charts' 
    ? chartOptions.filter(chart => chart.category === selectedCategory)
    : controlOptions
        .filter(control => control.category === selectedCategory)
        .map(control => ({
          ...control,
          icon: iconComponents[control.icon as keyof typeof iconComponents] || iconComponents.Type
        }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 h-[85vh] max-h-[600px] min-h-[500px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Element</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a chart or control to add to your dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>

        {/* Type Selection */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => {
              setSelectedType('charts');
              setSelectedCategory('basic');
            }}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
              selectedType === 'charts'
                ? 'text-cyan-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <span className="relative z-10">Charts</span>
            {selectedType === 'charts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"></div>
            )}
          </button>
          <button
            onClick={() => {
              setSelectedType('controls');
              setSelectedCategory('input');
            }}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
              selectedType === 'controls'
                ? 'text-cyan-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <span className="relative z-10">Filters & Controls</span>
            {selectedType === 'controls' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"></div>
            )}
          </button>
        </div>

        {/* Category Tabs - Responsive Grid Layout */}
        <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-3 text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 hover:bg-white/50 relative group ${
                  selectedCategory === category
                    ? 'text-cyan-600 border-cyan-600 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                <span className="block truncate">
                  {allCategoryLabels[category as keyof typeof allCategoryLabels]}
                </span>
                {selectedCategory !== category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Widget Grid - Dynamic Height without Scrollbar */}
        <div className="flex-1 p-6 min-h-0">
          <div className="h-full">
            {filteredOptions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max">
                {filteredOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleWidgetSelect(option)}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100/50 transition-all duration-200 text-left bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 transform hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 ${option.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-200 shadow-sm`}>
                        <Icon className={`w-6 h-6 ${option.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-cyan-700 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-500">Try selecting a different category</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {selectedType === 'charts' 
                ? 'Charts will be blank until you configure data sources and axes in the properties panel.'
                : 'Controls will be inactive until you configure targets and data sources in the configuration panel.'
              }
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{filteredOptions.length} items</span>
              <span>•</span>
              <span className="capitalize">{selectedType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
