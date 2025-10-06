export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'table' 
  | 'kpi' 
  | 'pivot-table'
  | 'combo'
  | 'box'
  | 'donut'
  | 'sankey'
  | 'funnel'
  | 'gauge'
  | 'waterfall'
  | 'region-map'
  | 'point-map'
  | 'geography-map';

// Control Types
export type ControlType =
  | 'list-values'
  | 'text-input'
  | 'text-area'
  | 'segmented'
  | 'number-input'
  | 'number-range'
  | 'slider'
  | 'range-slider'
  | 'date'
  | 'date-range'
  | 'switch'
  | 'checkbox'
  | 'drill-down'
  | 'top-n-filter'
  | 'legend';

// Filter Types
export type FilterType =
  | 'list'
  | 'top-n'
  | 'number-range'
  | 'date-range'
  | 'text-match';

// Widget Types - combining charts and controls
export type WidgetType = ChartType | ControlType;

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  chartTitle?: string;
  chartDescription?: string;
  showChartTitle?: boolean;
  showChartDescription?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: Record<string, unknown>;
  // Control configuration for control widgets
  controlConfig?: ControlConfig;
  config?: {
    // Data configuration
    datasetId?: string;
    xAxis?: string;
    xAxisName?: string;
    xAxisType?: string;
    yAxis?: string;
    yAxisFields?: string[];
    yAxisNames?: string[];
    metric?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    
    // Bar chart specific configuration
    orientation?: 'vertical' | 'horizontal';
    stacking?: 'none' | 'stacked' | 'stacked100';
    colorMode?: 'single' | 'category' | 'scale';
    singleColor?: string;
    categoryColors?: string[];
    scaleColors?: { min: string; max: string };
    gapWidth?: 'small' | 'medium' | 'large' | 'auto';
    tooltipAsPercent?: boolean;
    conditionalRules?: ConditionalRule[];
    referenceLines?: ReferenceLine[];
    showTrendLine?: boolean;
    
    // Data Labels
    showDataLabels?: boolean;
    dataLabelPosition?: 'auto' | 'top' | 'center' | 'bottom' | 'outside';
    dataLabelFormat?: 'value' | 'percent' | 'value_percent' | 'label' | 'label_value';
    dataLabelColor?: string;
    dataLabelFontSize?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
    
    // Legend configuration
    legendPosition?: 'top' | 'bottom' | 'left' | 'right';
    legendAlignment?: 'start' | 'center' | 'end';
    
    // Axis titles
    showXAxisTitle?: boolean;
    xAxisTitle?: string;
    showYAxisTitle?: boolean;
    yAxisTitle?: string;
    
    // Axis configuration enhancements
    xAxisTruncate?: 'year' | 'quarter' | 'month' | 'week' | 'day';
    xAxisTransform?: 'none' | 'uppercase' | 'lowercase' | 'title_case';
    xAxisFormat?: 'auto' | 'plain_text' | 'number' | 'percent' | 'currency' | 'scientific';
    yAxisAggregations?: string[];
    yAxisTransforms?: string[];
    yAxisFormats?: string[];
    
    // General display options
    color?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    [key: string]: unknown;
  };
}

export interface DataField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  icon?: string;
}

export interface Dataset {
  id: string;
  name: string;
  fields: DataField[];
  lastUpdated?: string;
}

export interface ConditionalRule {
  id: string;
  column: string;
  condition: 'greater' | 'less' | 'equal' | 'between';
  value: number;
  value2?: number; // For 'between' condition
  color: string;
  enabled: boolean;
  label?: string;
}

export interface ReferenceLine {
  id: string;
  value: number;
  label: string;
  color: string;
  strokeDasharray?: string;
  enabled: boolean;
  axis?: 'x' | 'y';
}

export interface WidgetTemplate {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  icon: string;
  defaultConfig?: Partial<WidgetConfig>;
}

// Control-specific interfaces
export interface ControlTarget {
  elementId: string;
  elementType: WidgetType;
  columnMapping: { [controlField: string]: string };
}

export interface ControlConfig {
  // Basic settings
  controlId: string;
  label: string;
  description?: string;
  required?: boolean;
  
  // Value source configuration
  valueSource: 'manual' | 'column' | 'preset';
  sourceColumn?: string;
  sourceDataset?: string;
  
  // Manual list values
  manualValues?: ControlValue[];
  valueType?: 'text' | 'number' | 'date' | 'logical';
  valueFormat?: string;
  setDisplayValues?: boolean;
  
  // Control-specific settings
  multiSelect?: boolean;
  operator?: TextOperator | NumberOperator;
  caseSensitive?: boolean;
  showClearOption?: boolean;
  minValue?: number;
  maxValue?: number;
  step?: number;
  dateFormat?: string;
  relativeDate?: boolean;
  
  // Targeting and filtering
  targets: ControlTarget[];
  
  // UI settings
  alignment?: 'left' | 'right' | 'center' | 'stretch';
  showLabel?: boolean;
  showTitle?: boolean;
  labelPosition?: 'top' | 'left';
  
  // Search and filtering
  enableSearch?: boolean;
  filterWithApply?: boolean;
  showCheckboxes?: boolean;
  
  // Placeholder settings
  showPlaceholder?: boolean;
  placeholderText?: string;
  
  // Syncing
  syncedControlIds?: string[];
  
  // Advanced Filter Configuration
  sortBy?: 'value-asc' | 'value-desc' | 'frequency-asc' | 'frequency-desc';
  maxValues?: number;
  enablePagination?: boolean;
  dynamicRefresh?: boolean;
  
  // Accessibility Settings
  ariaLabel?: string;
  ariaDescription?: string;
  highContrast?: boolean;
  keyboardNavigation?: boolean;
  screenReaderOptimized?: boolean;
  
  // Formula Configuration
  formula?: string;
  autoCalculate?: boolean;
  resultFormat?: 'text' | 'number' | 'currency' | 'percent' | 'date';
  
  // Mobile Optimization
  touchOptimized?: boolean;
  hapticFeedback?: boolean;
  swipeGestures?: boolean;
  touchTargetSize?: 'small' | 'medium' | 'large';
  mobileLayout?: 'stack' | 'inline' | 'hide' | 'collapse';
  autoHideLabels?: boolean;
  
  // Export Configuration
  includeInExport?: boolean;
  exportCurrentValue?: boolean;
  exportLabel?: string;
  includeInScheduledReports?: boolean;
  parameterizeReports?: boolean;
}

export interface ControlValue {
  value: any;
  displayValue?: string;
  color?: string;
}

export interface ControlState {
  id: string;
  type: ControlType;
  value: any;
  isActive: boolean;
  lastUpdated: Date;
}

// Text operators for text-input controls
export type TextOperator = 
  | 'equal-to'
  | 'not-equal-to'
  | 'contains'
  | 'does-not-contain'
  | 'starts-with'
  | 'does-not-start-with'
  | 'ends-with'
  | 'does-not-end-with'
  | 'like'
  | 'not-like'
  | 'matches-regexp'
  | 'does-not-match-regexp';

// Number operators for number-input controls
export type NumberOperator =
  | 'equal-to'
  | 'less-than-or-equal'
  | 'greater-than-or-equal';

// Top N ranking options
export type TopNRanking =
  | 'top-n'
  | 'bottom-n'
  | 'top-percentile'
  | 'bottom-percentile';

export type RankingFunction =
  | 'rank'
  | 'rank-dense'
  | 'row-number';

// Filter configuration for element-level filtering
export interface FilterConfig {
  id: string;
  type: FilterType;
  column: string;
  operator?: string;
  values?: any[];
  enabled: boolean;
}

// Control template for selection modal
export interface ControlTemplate {
  id: string;
  type: ControlType;
  title: string;
  description: string;
  icon: string;
  category: 'input' | 'selection' | 'range' | 'boolean' | 'navigation' | 'advanced';
  color: string;
  bgColor: string;
  defaultConfig?: Partial<ControlConfig>;
}

