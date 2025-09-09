'use client';

import { 
  LineChart, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  ScatterChart,
  Table,
  Hash,
  Type,
  Grip
} from 'lucide-react';
import { WidgetConfig, WidgetTemplate } from './types';
import { useDraggable } from '@dnd-kit/core';

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
    id: 'text',
    type: 'text',
    title: 'Text',
    description: 'Add titles or descriptions',
    icon: 'Type',
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
  Type,
};

interface WidgetSidebarProps {
  onAddWidget: (widget: WidgetConfig) => void;
}

interface DraggableWidgetProps {
  template: WidgetTemplate;
  onAddWidget: (widget: WidgetConfig) => void;
}

function DraggableWidget({ template, onAddWidget }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: template.id,
    data: template,
  });

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

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-cyan-500 hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Grip className="w-4 h-4 text-gray-400" />
      </div>
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
          Drag or click to add
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {widgetTemplates.map((template) => (
          <DraggableWidget
            key={template.id}
            template={template}
            onAddWidget={onAddWidget}
          />
        ))}
      </div>
    </aside>
  );
}

