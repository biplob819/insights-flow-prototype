'use client';

import { useState } from 'react';
import { Plus, Calculator, TrendingUp, BarChart3, PieChart, Target, Code, Play, Edit, Trash2, Copy, LineChart, AlertCircle, Activity } from 'lucide-react';
import { formatNumber, formatCurrency, formatPercentage } from '@/utils/formatters';
import { getDataTypeIcon } from '../utils/dataTypeIcons';

interface Metric {
  id: string;
  name: string;
  description: string;
  formula: string;
  category: 'revenue' | 'customer' | 'product' | 'operational';
  format: 'currency' | 'percentage' | 'number' | 'ratio';
  value?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  lastCalculated?: string;
  timelineEnabled?: boolean;
  timelineData?: TimelinePoint[];
  target?: number;
  dataType?: 'Text' | 'Number' | 'Date' | 'Logical' | 'Variant' | 'Geography';
}

interface TimelinePoint {
  date: string;
  value: number;
  label?: string;
}

export default function MetricsTab() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: '1',
      name: 'Total Revenue',
      description: 'Sum of all order amounts',
      formula: 'SUM([orders.total_amount])',
      category: 'revenue',
      format: 'currency',
      value: 125000,
      trend: 'up',
      trendValue: 12.5,
      lastCalculated: '2 minutes ago',
      timelineEnabled: true,
      target: 150000,
      dataType: 'Number',
      timelineData: [
        { date: '2024-01', value: 98000, label: 'Jan' },
        { date: '2024-02', value: 105000, label: 'Feb' },
        { date: '2024-03', value: 112000, label: 'Mar' },
        { date: '2024-04', value: 125000, label: 'Apr' },
      ]
    },
    {
      id: '2',
      name: 'Average Order Value',
      description: 'Average value per order',
      formula: 'AVERAGE([orders.total_amount])',
      category: 'revenue',
      format: 'currency',
      value: 156.25,
      trend: 'up',
      trendValue: 8.3,
      lastCalculated: '2 minutes ago',
      timelineEnabled: true,
      target: 180,
      dataType: 'Number',
      timelineData: [
        { date: '2024-01', value: 142, label: 'Jan' },
        { date: '2024-02', value: 148, label: 'Feb' },
        { date: '2024-03', value: 152, label: 'Mar' },
        { date: '2024-04', value: 156.25, label: 'Apr' },
      ]
    },
    {
      id: '3',
      name: 'Customer Acquisition Rate',
      description: 'New customers per month',
      formula: 'COUNT(DISTINCT [customers.id]) WHERE [customers.created_at] >= DATE_SUB(NOW(), INTERVAL 1 MONTH)',
      category: 'customer',
      format: 'number',
      value: 245,
      trend: 'up',
      trendValue: 15.2,
      lastCalculated: '5 minutes ago',
      timelineEnabled: true,
      target: 300,
      dataType: 'Number',
      timelineData: [
        { date: '2024-01', value: 198, label: 'Jan' },
        { date: '2024-02', value: 220, label: 'Feb' },
        { date: '2024-03', value: 235, label: 'Mar' },
        { date: '2024-04', value: 245, label: 'Apr' },
      ]
    },
    {
      id: '4',
      name: 'Customer Retention Rate',
      description: 'Percentage of customers who made repeat purchases',
      formula: '(COUNT(DISTINCT [repeat_customers.id]) / COUNT(DISTINCT [customers.id])) * 100',
      category: 'customer',
      format: 'percentage',
      value: 68.5,
      trend: 'down',
      trendValue: -2.1,
      lastCalculated: '10 minutes ago',
      timelineEnabled: true,
      target: 75,
      dataType: 'Number',
      timelineData: [
        { date: '2024-01', value: 72.1, label: 'Jan' },
        { date: '2024-02', value: 70.8, label: 'Feb' },
        { date: '2024-03', value: 69.2, label: 'Mar' },
        { date: '2024-04', value: 68.5, label: 'Apr' },
      ]
    },
    {
      id: '5',
      name: 'Top Product Performance',
      description: 'Revenue from top 10 products',
      formula: 'SUM([order_items.quantity] * [order_items.unit_price]) WHERE [products.id] IN (SELECT TOP 10 [id] FROM [products] ORDER BY revenue DESC)',
      category: 'product',
      format: 'currency',
      value: 45600,
      trend: 'stable',
      trendValue: 0.8,
      lastCalculated: '15 minutes ago',
      timelineEnabled: false,
      dataType: 'Number'
    }
  ]);

  const [showMetricBuilder, setShowMetricBuilder] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [selectedTimeRange, setSelectedTimeRange] = useState('3M');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [newMetric, setNewMetric] = useState<{
    name: string;
    description: string;
    formula: string;
    category: 'revenue' | 'customer' | 'product' | 'operational';
    format: 'currency' | 'percentage' | 'number' | 'ratio';
  }>({
    name: '',
    description: '',
    formula: '',
    category: 'revenue',
    format: 'number'
  });

  const categories = [
    { value: 'revenue', label: 'Revenue', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
    { value: 'customer', label: 'Customer', icon: Target, color: 'text-blue-600 bg-blue-100' },
    { value: 'product', label: 'Product', icon: BarChart3, color: 'text-purple-600 bg-purple-100' },
    { value: 'operational', label: 'Operational', icon: PieChart, color: 'text-orange-600 bg-orange-100' },
  ];


  const renderMiniChart = (timelineData?: TimelinePoint[]) => {
    if (!timelineData || timelineData.length === 0) return null;

    const maxValue = Math.max(...timelineData.map(d => d.value));
    const minValue = Math.min(...timelineData.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="flex items-end space-x-1 h-8">
        {timelineData.map((point, index) => {
          const height = ((point.value - minValue) / range) * 24 + 4;
          return (
            <div
              key={index}
              className="bg-cyan-500 rounded-sm flex-1 min-w-[3px]"
              style={{ height: `${height}px` }}
              title={`${point.label}: ${point.value}`}
            />
          );
        })}
      </div>
    );
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'ratio':
        return `${value.toFixed(2)}:1`;
      default:
        return formatNumber(value);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-slate-400 rounded-full" />;
    }
  };

  const generateSQL = (metric: Metric) => {
    // Simple SQL generation based on formula
    let sql = '';
    
    if (metric.formula.includes('SUM')) {
      sql = `SELECT SUM(total_amount) as ${metric.name.replace(/\s+/g, '_').toLowerCase()}
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH);`;
    } else if (metric.formula.includes('AVERAGE')) {
      sql = `SELECT AVG(total_amount) as ${metric.name.replace(/\s+/g, '_').toLowerCase()}
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH);`;
    } else if (metric.formula.includes('COUNT')) {
      sql = `SELECT COUNT(DISTINCT customer_id) as ${metric.name.replace(/\s+/g, '_').toLowerCase()}
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH);`;
    } else {
      sql = `-- Custom formula: ${metric.formula}
SELECT ${metric.formula} as ${metric.name.replace(/\s+/g, '_').toLowerCase()}
FROM your_table;`;
    }
    
    return sql;
  };

  const handleCreateMetric = () => {
    const metric: Metric = {
      id: Date.now().toString(),
      ...newMetric,
      lastCalculated: 'Just now'
    };
    
    setMetrics(prev => [...prev, metric]);
    setNewMetric({ name: '', description: '', formula: '', category: 'revenue', format: 'number' });
    setShowMetricBuilder(false);
  };

  const handleViewQuery = (metric: Metric) => {
    setSelectedMetric(metric);
    setGeneratedQuery(generateSQL(metric));
    setShowQueryModal(true);
  };

  const metricFunctions = [
    { name: 'SUM', description: 'Sum of values', syntax: 'SUM([column])' },
    { name: 'AVG', description: 'Average of values', syntax: 'AVG([column])' },
    { name: 'COUNT', description: 'Count of records', syntax: 'COUNT([column])' },
    { name: 'COUNT DISTINCT', description: 'Count unique values', syntax: 'COUNT(DISTINCT [column])' },
    { name: 'MAX', description: 'Maximum value', syntax: 'MAX([column])' },
    { name: 'MIN', description: 'Minimum value', syntax: 'MIN([column])' },
    { name: 'MEDIAN', description: 'Median value', syntax: 'MEDIAN([column])' },
    { name: 'PERCENTILE', description: 'Percentile calculation', syntax: 'PERCENTILE([column], 0.95)' },
    { name: 'STDDEV', description: 'Standard deviation', syntax: 'STDDEV([column])' },
    { name: 'VARIANCE', description: 'Variance calculation', syntax: 'VARIANCE([column])' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Metrics Dashboard</h2>
            <p className="text-slate-600 text-sm">Create and manage business metrics with formula-based calculations</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                  viewMode === 'timeline'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LineChart className="w-4 h-4 mr-2" />
                Timeline
              </button>
            </div>

            {/* Time Range Selector */}
            {viewMode === 'timeline' && (
              <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowMetricBuilder(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Metric
            </button>
            
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Refresh All
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-700">Categories:</span>
          {categories.map((category) => {
            const Icon = category.icon;
            const count = metrics.filter(m => m.category === category.value).length;
            return (
              <button
                key={category.value}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${category.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
                <span className="bg-white bg-opacity-70 px-1.5 py-0.5 rounded text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {viewMode === 'cards' ? (
          /* Card View */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => {
                const category = categories.find(c => c.value === metric.category);
                const Icon = category?.icon || Calculator;
                
                return (
                  <div key={metric.id} className="bg-white rounded-lg border border-slate-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${category?.color || 'text-slate-600 bg-slate-100'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-slate-900">{metric.name}</h3>
                              {metric.dataType && getDataTypeIcon(metric.dataType)}
                              {metric.timelineEnabled && (
                                <div title="Timeline enabled">
                                  <Activity className="w-3 h-3 text-cyan-500" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{metric.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewQuery(metric)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            title="View Query"
                          >
                            <Code className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(metric.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Value and Trend */}
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-3xl font-bold text-slate-900">
                            {metric.value ? formatValue(metric.value, metric.format) : '—'}
                          </div>
                          {metric.trend && metric.trendValue && (
                            <div className="flex items-center space-x-1 mt-2">
                              {getTrendIcon(metric.trend)}
                              <span className={`text-sm font-medium ${
                                metric.trend === 'up' ? 'text-green-600' : 
                                metric.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                              }`}>
                                {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}%
                              </span>
                              <span className="text-xs text-slate-500">vs last period</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Mini Chart */}
                        {metric.timelineData && (
                          <div className="w-24">
                            {renderMiniChart(metric.timelineData)}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Last updated: {metric.lastCalculated}</span>
                        <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors">
                          <Play className="w-3 h-3" />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Timeline View */
          <div className="p-6">
            <div className="space-y-6">
              {metrics.filter(m => m.timelineEnabled && m.timelineData).map((metric) => {
                const category = categories.find(c => c.value === metric.category);
                const Icon = category?.icon || Calculator;
                
                return (
                  <div key={metric.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category?.color || 'text-slate-600 bg-slate-100'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-slate-900">{metric.name}</h3>
                            {metric.dataType && getDataTypeIcon(metric.dataType)}
                          </div>
                          <p className="text-sm text-slate-600">{metric.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {metric.value ? formatValue(metric.value, metric.format) : '—'}
                        </div>
                        {metric.trend && metric.trendValue && (
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            {getTrendIcon(metric.trend)}
                            <span className={`text-sm font-medium ${
                              metric.trend === 'up' ? 'text-green-600' : 
                              metric.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                            }`}>
                              {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Timeline Chart */}
                    <div className="h-32 bg-slate-50 rounded-lg p-4 flex items-end space-x-2">
                      {metric.timelineData?.map((point, index) => {
                        const maxValue = Math.max(...(metric.timelineData?.map(d => d.value) || []));
                        const height = (point.value / maxValue) * 80;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                              className="bg-cyan-500 rounded-t-sm w-full transition-all duration-300 hover:bg-cyan-600"
                              style={{ height: `${height}px` }}
                              title={`${point.label}: ${formatValue(point.value, metric.format)}`}
                            />
                            <span className="text-xs text-slate-500 mt-2">{point.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Metric Builder Modal */}
      {showMetricBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Create New Metric</h3>
            </div>

            <div className="flex-1 flex">
              {/* Functions Panel */}
              <div className="w-1/3 border-r border-slate-200 p-4">
                <h4 className="font-medium text-slate-900 mb-3">Metric Functions</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {metricFunctions.map((func) => (
                    <div
                      key={func.name}
                      className="p-3 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer"
                      onClick={() => setNewMetric(prev => ({ ...prev, formula: prev.formula + func.syntax }))}
                    >
                      <div className="font-medium text-sm text-slate-900">{func.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{func.description}</div>
                      <div className="text-xs text-cyan-600 mt-1 font-mono">{func.syntax}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Metric Name</label>
                      <input
                        type="text"
                        value={newMetric.name}
                        onChange={(e) => setNewMetric(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Monthly Revenue"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <select
                        value={newMetric.category}
                        onChange={(e) => setNewMetric(prev => ({ ...prev, category: e.target.value as 'revenue' | 'customer' | 'product' | 'operational' }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={newMetric.description}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what this metric measures"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                    <select
                      value={newMetric.format}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, format: e.target.value as 'currency' | 'percentage' | 'number' | 'ratio' }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="number">Number</option>
                      <option value="currency">Currency</option>
                      <option value="percentage">Percentage</option>
                      <option value="ratio">Ratio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Formula</label>
                    <textarea
                      value={newMetric.formula}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, formula: e.target.value }))}
                      placeholder="Enter your metric formula..."
                      className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Generated SQL Preview</h5>
                    <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
                      {newMetric.formula ? generateSQL({ ...newMetric, id: 'preview' } as Metric) : 'Enter a formula to see SQL preview'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowMetricBuilder(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMetric}
                disabled={!newMetric.name || !newMetric.formula}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
              >
                Create Metric
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Metric</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this metric? This will permanently remove it from your dashboard.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMetrics(prev => prev.filter(m => m.id !== showDeleteConfirm));
                    setShowDeleteConfirm(null);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Modal */}
      {showQueryModal && selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Generated SQL Query</h3>
                <button
                  onClick={() => setShowQueryModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              <p className="text-slate-600 text-sm mt-1">Query for: {selectedMetric.name}</p>
            </div>

            <div className="p-6">
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {generatedQuery}
                </pre>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  This query will be executed against your connected data sources
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
