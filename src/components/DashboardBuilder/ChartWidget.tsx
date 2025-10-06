'use client';

import { useState, useEffect, useRef } from 'react';
import { WidgetConfig } from './types';
import { Grip, Trash2, MoreVertical, Copy, MessageSquare, Download, Share2, Settings } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import BarChartWidget from './BarChartWidget';
import { getDataForChart, getDatasetById } from './sampleData';

interface ChartWidgetProps {
  widget: WidgetConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onClone?: (widget: WidgetConfig) => void;
  onUpdateWidget?: (updates: Partial<WidgetConfig>) => void;
  onCommentOnWidget?: (widgetId: string, widgetTitle: string) => void;
}

// Mock data for demonstration
const mockData = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ChartWidget({ widget, isSelected, onSelect, onDelete, onClone, onUpdateWidget, onCommentOnWidget }: ChartWidgetProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Check if widget is configured with data sources
  const isConfigured = widget.config?.xAxis || widget.config?.yAxis || widget.config?.metric;

  const renderBlankState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">Configure Chart</p>
      <p className="text-xs text-gray-400 text-center px-4">
        Click to select and configure data sources in the properties panel
      </p>
    </div>
  );

  const renderChart = () => {
    // Show blank state if not configured
    if (!isConfigured && widget.type !== 'kpi') {
      return renderBlankState();
    }

    switch (widget.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="value2" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        // Get data from configured dataset or use default
        const datasetId = widget.config?.datasetId || 'sales-performance';
        const chartData = getDataForChart(datasetId);
        const dataset = getDatasetById(datasetId);
        
        return (
          <BarChartWidget
            config={{
              orientation: widget.config?.orientation || 'vertical',
              stacking: widget.config?.stacking || 'none',
              colorMode: widget.config?.colorMode || 'single',
              singleColor: widget.config?.singleColor || '#06b6d4',
              categoryColors: widget.config?.categoryColors || ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
              scaleColors: widget.config?.scaleColors || { min: '#dbeafe', max: '#1d4ed8' },
              showGrid: widget.config?.showGrid ?? true,
              showLegend: widget.config?.showLegend ?? true,
              showTooltip: widget.config?.showTooltip ?? true,
              tooltipAsPercent: widget.config?.tooltipAsPercent || false,
              gapWidth: widget.config?.gapWidth || 'auto',
              xAxisColumn: widget.config?.xAxis || 'quarter',
              yAxisColumns: widget.config?.yAxisFields || ['revenue', 'pipeline'],
              conditionalRules: widget.config?.conditionalRules || [],
              referenceLines: widget.config?.referenceLines || [],
              showTrendLine: widget.config?.showTrendLine || false,
              // Data labels
              showDataLabels: widget.config?.showDataLabels || false,
              dataLabelPosition: widget.config?.dataLabelPosition || 'auto',
              dataLabelFormat: widget.config?.dataLabelFormat || 'value',
              dataLabelColor: widget.config?.dataLabelColor || '#374151',
              dataLabelFontSize: widget.config?.dataLabelFontSize || 'small',
              // Axis configuration
              showAxisLabels: Boolean(widget.config?.showAxisLabels ?? true),
              showXAxisTitle: widget.config?.showXAxisTitle || false,
              showYAxisTitle: widget.config?.showYAxisTitle || false,
              xAxisTitle: widget.config?.xAxisTitle || '',
              yAxisTitle: widget.config?.yAxisTitle || '',
              legendPosition: widget.config?.legendPosition || 'right',
              legendAlignment: widget.config?.legendAlignment || 'center',
              // Axis formatting
              xAxisTruncate: widget.config?.xAxisTruncate,
              xAxisTransform: widget.config?.xAxisTransform,
              xAxisFormat: widget.config?.xAxisFormat,
              yAxisAggregations: widget.config?.yAxisAggregations,
              yAxisTransforms: widget.config?.yAxisTransforms,
              yAxisFormats: widget.config?.yAxisFormats
            }}
            data={chartData}
            onConfigChange={() => {}}
            isConfiguring={false}
            availableColumns={dataset?.fields || [
              { name: 'quarter', type: 'string' },
              { name: 'revenue', type: 'number' },
              { name: 'pipeline', type: 'number' }
            ]}
            title={widget.title}
            onTitleChange={(newTitle) => onUpdateWidget?.({ title: newTitle })}
            showHeader={false}
            chartTitle={widget.chartTitle}
            chartDescription={widget.chartDescription}
            showChartTitle={widget.showChartTitle}
            showChartDescription={widget.showChartDescription}
          />
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="value2" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="value" tick={{ fontSize: 12 }} />
              <YAxis dataKey="value2" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Scatter name="Data" data={mockData} fill="#06b6d4" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'kpi':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-4xl font-bold text-gray-900">$24.5K</div>
            <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
            <div className="flex items-center mt-2 text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm font-medium">12.5%</span>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'pivot-table':
        return (
          <div className="overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Q1</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Q2</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">Sales</td>
                  <td className="px-4 py-2 text-sm text-gray-900">$125K</td>
                  <td className="px-4 py-2 text-sm text-gray-900">$145K</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">$270K</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">Marketing</td>
                  <td className="px-4 py-2 text-sm text-gray-900">$45K</td>
                  <td className="px-4 py-2 text-sm text-gray-900">$52K</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">$97K</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-bold text-gray-900">Total</td>
                  <td className="px-4 py-2 text-sm font-bold text-gray-900">$170K</td>
                  <td className="px-4 py-2 text-sm font-bold text-gray-900">$197K</td>
                  <td className="px-4 py-2 text-sm font-bold text-gray-900">$367K</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'combo':
      case 'box':
      case 'donut':
      case 'sankey':
      case 'funnel':
      case 'gauge':
      case 'waterfall':
      case 'region-map':
      case 'point-map':
      case 'geography-map':
        return renderBlankState();

      default:
        return <div className="p-4 text-gray-500">Chart type not yet implemented</div>;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 h-full transition-all ${
        isSelected 
          ? 'border-cyan-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="widget-drag-handle cursor-move">
            <Grip className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(!showActionMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {/* Action Menu */}
            {showActionMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onClone) {
                        const clonedWidget = {
                          ...widget,
                          id: `widget-${Date.now()}`,
                          title: `${widget.title} (Copy)`,
                          x: widget.x + 1,
                          y: widget.y + 1
                        };
                        onClone(clonedWidget);
                      }
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Clone</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCommentOnWidget) {
                        onCommentOnWidget(widget.id, widget.title);
                      }
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Comment</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Export functionality
                      // TODO: Implement export widget functionality
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Share functionality
                      // TODO: Implement share widget functionality
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Configure functionality
                      onSelect();
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className="h-[calc(100%-48px)]">
        {renderChart()}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delete Widget</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete &quot;{widget.title}&quot;? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

