'use client';

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
  Globe
} from 'lucide-react';
import { WidgetConfig, WidgetTemplate } from './types';

const widgetTemplates: WidgetTemplate[] = [
  {
    id: 'line-chart',
    type: 'line',
    title: 'Line Chart',
    description: 'Track trends over time',
    icon: 'LineChart',
  },
  {
    id: 'bar-chart',
    type: 'bar',
    title: 'Bar Chart',
    description: 'Compare values across categories',
    icon: 'BarChart3',
  },
  {
    id: 'pie-chart',
    type: 'pie',
    title: 'Pie Chart',
    description: 'Show proportions of a whole',
    icon: 'PieChart',
  },
  {
    id: 'area-chart',
    type: 'area',
    title: 'Area Chart',
    description: 'Visualize cumulative totals',
    icon: 'TrendingUp',
  },
  {
    id: 'scatter-chart',
    type: 'scatter',
    title: 'Scatter Plot',
    description: 'Show relationships between variables',
    icon: 'ScatterChart',
  },
  {
    id: 'table',
    type: 'table',
    title: 'Table',
    description: 'Display data in rows and columns',
    icon: 'Table',
  },
  {
    id: 'kpi',
    type: 'kpi',
    title: 'KPI Card',
    description: 'Show single metric with trend',
    icon: 'Hash',
  },
  {
    id: 'pivot-table',
    type: 'pivot-table',
    title: 'Pivot Table',
    description: 'Interactive data summarization',
    icon: 'Grid3X3',
  },
  {
    id: 'combo-chart',
    type: 'combo',
    title: 'Combo Chart',
    description: 'Combine multiple chart types',
    icon: 'BarChart4',
  },
  {
    id: 'box-chart',
    type: 'box',
    title: 'Box Chart',
    description: 'Show value distribution',
    icon: 'Box',
  },
  {
    id: 'donut-chart',
    type: 'donut',
    title: 'Donut Chart',
    description: 'Pie chart with center space',
    icon: 'PieChart',
  },
  {
    id: 'sankey-diagram',
    type: 'sankey',
    title: 'Sankey Diagram',
    description: 'Show data flow',
    icon: 'Zap',
  },
  {
    id: 'funnel-chart',
    type: 'funnel',
    title: 'Funnel Chart',
    description: 'Track process stages',
    icon: 'Filter',
  },
  {
    id: 'gauge-chart',
    type: 'gauge',
    title: 'Gauge Chart',
    description: 'Measure against scale',
    icon: 'Gauge',
  },
  {
    id: 'waterfall-chart',
    type: 'waterfall',
    title: 'Waterfall Chart',
    description: 'Show changes over time',
    icon: 'TrendingDown',
  },
  {
    id: 'region-map',
    type: 'region-map',
    title: 'Region Map',
    description: 'Data by geographical regions',
    icon: 'Map',
  },
  {
    id: 'point-map',
    type: 'point-map',
    title: 'Point Map',
    description: 'Precise coordinate positioning',
    icon: 'MapPin',
  },
  {
    id: 'geography-map',
    type: 'geography-map',
    title: 'Geography Map',
    description: 'Custom geospatial objects',
    icon: 'Globe',
  },
];

const iconComponents = {
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
};

interface WidgetSidebarProps {
  onAddWidget: (widget: WidgetConfig) => void;
}

interface WidgetCardProps {
  template: WidgetTemplate;
  onAddWidget: (widget: WidgetConfig) => void;
}

function WidgetCard({ template, onAddWidget }: WidgetCardProps) {
  const Icon = iconComponents[template.icon as keyof typeof iconComponents];

  const handleClick = () => {
    // Create a new widget when clicked
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: template.type,
      title: template.title,
      x: 0,
      y: 0,
      width: 4,
      height: 3,
    };
    onAddWidget(newWidget);
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-600" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">{template.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
      </div>
    </div>
  );
}

export default function WidgetSidebar({ onAddWidget }: WidgetSidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Widgets
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Click to add to canvas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {widgetTemplates.map((template) => (
          <WidgetCard
            key={template.id}
            template={template}
            onAddWidget={onAddWidget}
          />
        ))}
      </div>
    </aside>
  );
}

