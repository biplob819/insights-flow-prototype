'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
  LabelList
} from 'recharts';
// import { 
//   Settings, 
//   Palette, 
//   BarChart3, 
//   Layers, 
//   Filter,
//   Eye,
//   EyeOff,
//   Plus,
//   Minus,
//   RotateCcw,
//   TrendingUp,
//   Info,
//   ChevronDown,
//   ChevronRight,
//   X
// } from 'lucide-react';
import { getDataForChart } from './sampleData';

// Types for bar chart configuration
interface BarChartConfig {
  orientation: 'vertical' | 'horizontal';
  stacking: 'none' | 'stacked' | 'stacked100';
  colorMode: 'single' | 'category' | 'scale';
  singleColor: string;
  categoryColors: string[];
  scaleColors: { min: string; max: string };
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  tooltipAsPercent: boolean;
  gapWidth: 'small' | 'medium' | 'large' | 'auto';
  xAxisColumn?: string;
  yAxisColumns: string[];
  colorByColumn?: string;
  conditionalRules: ConditionalRule[];
  referenceLines: ReferenceLineConfig[];
  showTrendLine: boolean;
  datasetId?: string;
  // Data labels
  showDataLabels?: boolean;
  dataLabelPosition?: 'auto' | 'top' | 'center' | 'bottom' | 'outside';
  dataLabelFormat?: 'value' | 'percent' | 'value_percent' | 'label' | 'label_value';
  dataLabelColor?: string;
  dataLabelFontSize?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  // Axis configuration
  showAxisLabels?: boolean;
  showXAxisTitle?: boolean;
  showYAxisTitle?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  legendAlignment?: 'start' | 'center' | 'end';
  // Axis formatting
  xAxisTruncate?: 'year' | 'quarter' | 'month' | 'week' | 'day';
  xAxisTransform?: 'none' | 'uppercase' | 'lowercase' | 'title_case';
  xAxisFormat?: 'auto' | 'plain_text' | 'number' | 'percent' | 'currency' | 'scientific';
  yAxisAggregations?: string[];
  yAxisTransforms?: string[];
  yAxisFormats?: string[];
}

interface ConditionalRule {
  id: string;
  column: string;
  condition: 'greater' | 'less' | 'equal' | 'between';
  value: number;
  value2?: number;
  color: string;
  enabled: boolean;
}

interface ReferenceLineConfig {
  id: string;
  value: number;
  label: string;
  color: string;
  strokeDasharray?: string;
  enabled: boolean;
  axis?: 'x' | 'y';
}

interface BarChartWidgetProps {
  config: BarChartConfig;
  data: Record<string, any>[];
  onConfigChange: (config: BarChartConfig) => void;
  isConfiguring?: boolean;
  availableColumns: Array<{ name: string; type: string; }>;
}

// Default configuration
const defaultConfig: BarChartConfig = {
  orientation: 'vertical',
  stacking: 'none',
  colorMode: 'single',
  singleColor: '#06b6d4',
  categoryColors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
  scaleColors: { min: '#dbeafe', max: '#1d4ed8' },
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  tooltipAsPercent: false,
  gapWidth: 'auto',
  yAxisColumns: [],
  conditionalRules: [],
  referenceLines: [],
  showTrendLine: false,
  // Data labels
  showDataLabels: false,
  dataLabelPosition: 'top',
  dataLabelFormat: 'value',
  // Axis configuration
  showAxisLabels: true,
  showXAxisTitle: false,
  showYAxisTitle: false,
  xAxisTitle: '',
  yAxisTitle: '',
  legendPosition: 'bottom'
};

// Sample data for demonstration
const sampleData = [
  { category: 'Q1 2023', revenue: 178000000, pipeline: 135000000, region: 'East' },
  { category: 'Q2 2023', revenue: 158000000, pipeline: 110000000, region: 'West' },
  { category: 'Q3 2023', revenue: 201000000, pipeline: 146000000, region: 'North' },
  { category: 'Q4 2023', revenue: 146000000, pipeline: 125000000, region: 'South' },
];

export default function BarChartWidget({ 
  config = defaultConfig, 
  data = sampleData, 
  onConfigChange, 
  isConfiguring: _isConfiguring = false,
  availableColumns: _availableColumns = [
    { name: 'category', type: 'string' },
    { name: 'revenue', type: 'number' },
    { name: 'pipeline', type: 'number' },
    { name: 'region', type: 'string' }
  ],
  title: _title = 'Bar Chart',
  onTitleChange: _onTitleChange,
  showHeader: _showHeader = true,
  chartTitle,
  chartDescription,
  showChartTitle = false,
  showChartDescription = false
}: BarChartWidgetProps & { 
  title?: string; 
  onTitleChange?: (title: string) => void; 
  showHeader?: boolean;
  chartTitle?: string;
  chartDescription?: string;
  showChartTitle?: boolean;
  showChartDescription?: boolean;
}) {
  const [_isEditingTitle, _setIsEditingTitle] = useState(false);
  
  // Use config directly instead of local state to ensure real-time updates
  const localConfig = { ...defaultConfig, ...config };
  
  // Data point limit check
  const dataPointCount = data.length;
  const isDataLimitExceeded = dataPointCount > 25000;
  const displayData = isDataLimitExceeded ? data.slice(0, 25000) : data;

  const _handleConfigChange = (newConfig: Partial<BarChartConfig>) => {
    const updatedConfig = { ...localConfig, ...newConfig };
    onConfigChange(updatedConfig);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: Record<string, any>, index: number) => {
          const value = localConfig.tooltipAsPercent && localConfig.stacking !== 'none' 
            ? `${((entry.value / payload.reduce((sum: number, p: Record<string, any>) => sum + p.value, 0)) * 100).toFixed(1)}%`
            : entry.value.toLocaleString();
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Get bar color based on configuration
  const getBarColor = (dataKey: string, index: number, _value?: number) => {
    switch (localConfig.colorMode) {
      case 'category':
        return localConfig.categoryColors[index % localConfig.categoryColors.length];
      case 'scale':
        // Simple scale implementation - would need more sophisticated logic for real use
        return localConfig.scaleColors.min;
      default:
        return localConfig.singleColor;
    }
  };

  // Apply conditional formatting
  const _applyConditionalFormatting = (value: number, dataKey: string) => {
    const applicableRules = localConfig.conditionalRules.filter(rule => 
      rule.enabled && rule.column === dataKey
    );
    
    for (const rule of applicableRules) {
      switch (rule.condition) {
        case 'greater':
          if (value > rule.value) return rule.color;
          break;
        case 'less':
          if (value < rule.value) return rule.color;
          break;
        case 'equal':
          if (value === rule.value) return rule.color;
          break;
        case 'between':
          if (rule.value2 && value >= rule.value && value <= rule.value2) return rule.color;
          break;
      }
    }
    return null;
  };

  // Get chart data based on configuration
  const getChartData = () => {
    // If a dataset is configured, use it
    if (localConfig.datasetId) {
      const configuredData = getDataForChart(localConfig.datasetId);
      if (configuredData.length > 0) {
        return configuredData;
      }
    }
    
    // Fall back to provided data or sample data
    return displayData.length > 0 ? displayData : sampleData;
  };

  // Render the chart
  const renderChart = () => {
    const chartData = getChartData();
    const isHorizontal = localConfig.orientation === 'horizontal';
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout={isHorizontal ? 'horizontal' : 'vertical'}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={
            localConfig.gapWidth === 'small' ? '10%' :
            localConfig.gapWidth === 'medium' ? '20%' :
            localConfig.gapWidth === 'large' ? '30%' : '20%'
          }
        >
          {localConfig.showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          )}
          
          <XAxis 
            dataKey={isHorizontal ? undefined : (localConfig.xAxisColumn || 'category')}
            type={isHorizontal ? 'number' : 'category'}
            tick={localConfig.showAxisLabels !== false ? { fontSize: 12 } : false}
            label={localConfig.showXAxisTitle && localConfig.xAxisTitle ? { value: localConfig.xAxisTitle, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis 
            dataKey={isHorizontal ? (localConfig.xAxisColumn || 'category') : undefined}
            type={isHorizontal ? 'category' : 'number'}
            tick={localConfig.showAxisLabels !== false ? { fontSize: 12 } : false}
            label={localConfig.showYAxisTitle && localConfig.yAxisTitle ? { value: localConfig.yAxisTitle, angle: -90, position: 'insideLeft' } : undefined}
          />
          
          {localConfig.showTooltip && <Tooltip content={<CustomTooltip />} />}
          {localConfig.showLegend && (
            <Legend 
              verticalAlign={
                localConfig.legendPosition === 'top' ? 'top' :
                localConfig.legendPosition === 'bottom' ? 'bottom' : 'middle'
              }
              align={
                localConfig.legendAlignment === 'start' ? 'left' :
                localConfig.legendAlignment === 'end' ? 'right' : 'center'
              }
              layout={
                localConfig.legendPosition === 'left' || localConfig.legendPosition === 'right' ? 'vertical' : 'horizontal'
              }
              wrapperStyle={{
                paddingTop: localConfig.legendPosition === 'top' ? '0' : '10px'
              }}
            />
          )}
          
          {/* Bars with Data Labels */}
          {localConfig.yAxisColumns.length > 0 ? (
            localConfig.yAxisColumns.map((column, index) => (
              <Bar
                key={column}
                dataKey={column}
                fill={getBarColor(column, index)}
                stackId={localConfig.stacking !== 'none' ? 'stack' : undefined}
                name={column}
              >
                {localConfig.showDataLabels && (
                  <LabelList 
                    dataKey={column}
                    position={
                      localConfig.dataLabelPosition === 'auto' ? 'top' :
                      localConfig.dataLabelPosition === 'center' ? 'center' :
                      localConfig.dataLabelPosition === 'outside' ? 'top' :
                      localConfig.dataLabelPosition
                    }
                    fill={localConfig.dataLabelColor || '#374151'}
                    fontSize={
                      localConfig.dataLabelFontSize === 'x-small' ? 10 :
                      localConfig.dataLabelFontSize === 'small' ? 12 :
                      localConfig.dataLabelFontSize === 'medium' ? 14 :
                      localConfig.dataLabelFontSize === 'large' ? 16 :
                      localConfig.dataLabelFontSize === 'x-large' ? 18 : 12
                    }
                    formatter={(value: any) => {
                      if (localConfig.dataLabelFormat === 'percent') {
                        return `${((value / getTotalValue()) * 100).toFixed(1)}%`;
                      } else if (localConfig.dataLabelFormat === 'value_percent') {
                        return `${value} (${((value / getTotalValue()) * 100).toFixed(1)}%)`;
                      }
                      return value;
                    }}
                  />
                )}
              </Bar>
            ))
          ) : (
            // Default bars when no columns are configured
            <>
              <Bar dataKey="revenue" fill={getBarColor('revenue', 0)} name="Revenue" stackId={localConfig.stacking !== 'none' ? 'stack' : undefined}>
                {localConfig.conditionalRules.map((rule, index) => (
                  <Cell key={`cell-${index}`} fill={getConditionalColor(rule, index)} />
                ))}
              </Bar>
              <Bar dataKey="pipeline" fill={getBarColor('pipeline', 1)} name="Pipeline" stackId={localConfig.stacking !== 'none' ? 'stack' : undefined} />
            </>
          )}
          
          {/* Reference Lines */}
          {localConfig.referenceLines.map((line, index) => (
            line.enabled && (
              <ReferenceLine
                key={index}
                {...(line.axis === 'x' ? { x: line.value } : { y: line.value })}
                stroke={line.color}
                strokeDasharray={line.strokeDasharray || '5 5'}
                label={line.label}
              />
            )
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Helper function to get total value for percentage calculations
  const getTotalValue = () => {
    const chartData = getChartData();
    return chartData.reduce((total, item) => {
      return total + localConfig.yAxisColumns.reduce((sum, col) => sum + ((item as Record<string, any>)[col] || 0), 0);
    }, 0);
  };


  // Helper function to get conditional color
  const getConditionalColor = (rule: ConditionalRule, index: number) => {
    // Implementation for conditional coloring based on rules
    return rule.color || getBarColor('revenue', index);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Title */}
      {showChartTitle && chartTitle && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-lg font-semibold text-gray-900">{chartTitle}</h3>
          {showChartDescription && chartDescription && (
            <p className="text-sm text-gray-600 mt-1">{chartDescription}</p>
          )}
        </div>
      )}
      
      {/* Chart Container */}
      <div className="flex-1 p-4">
        {renderChart()}
      </div>
    </div>
  );
}
