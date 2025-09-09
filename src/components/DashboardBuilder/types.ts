export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'table' 
  | 'kpi' 
  | 'text';

export interface WidgetConfig {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: Record<string, unknown>;
  config?: {
    xAxis?: string;
    yAxis?: string;
    metric?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    color?: string;
    showLegend?: boolean;
    showGrid?: boolean;
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

export interface WidgetTemplate {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  icon: string;
  defaultConfig?: Partial<WidgetConfig>;
}

