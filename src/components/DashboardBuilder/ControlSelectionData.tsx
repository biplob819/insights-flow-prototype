import { 
  Type,
  Hash,
  ToggleLeft,
  CheckSquare,
  Calendar,
  Sliders,
  List,
  Filter,
  Layers,
  AlignLeft,
  BarChart3,
  Navigation,
  TrendingUp
} from 'lucide-react';
import { ControlTemplate } from './types';

export const controlOptions: ControlTemplate[] = [
  // Input Controls
  {
    id: 'text-input-control',
    type: 'text-input',
    title: 'Text Input',
    description: 'Search and filter text data',
    icon: 'Type',
    category: 'input',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    defaultConfig: {
      controlId: `text-input-${Date.now()}`,
      label: 'Text Input',
      valueSource: 'manual',
      targets: [],
      operator: 'contains',
      caseSensitive: false
    }
  },
  {
    id: 'text-area-control',
    type: 'text-area',
    title: 'Text Area',
    description: 'Multi-line text input for complex queries',
    icon: 'AlignLeft',
    category: 'input',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    defaultConfig: {
      controlId: `text-area-${Date.now()}`,
      label: 'Text Area',
      valueSource: 'manual',
      targets: []
    }
  },
  {
    id: 'number-input-control',
    type: 'number-input',
    title: 'Number Input',
    description: 'Numeric input with operators',
    icon: 'Hash',
    category: 'input',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    defaultConfig: {
      controlId: `number-input-${Date.now()}`,
      label: 'Number Input',
      valueSource: 'manual',
      targets: [],
      operator: 'equal-to'
    }
  },

  // Selection Controls
  {
    id: 'list-values-control',
    type: 'list-values',
    title: 'List Values',
    description: 'Multi-select dropdown for filtering',
    icon: 'List',
    category: 'selection',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    defaultConfig: {
      controlId: `list-values-${Date.now()}`,
      label: 'List Values',
      valueSource: 'manual',
      targets: [],
      multiSelect: true,
      showClearOption: true
    }
  },
  {
    id: 'segmented-control',
    type: 'segmented',
    title: 'Segmented Control',
    description: 'Single-select option segments',
    icon: 'Layers',
    category: 'selection',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    defaultConfig: {
      controlId: `segmented-${Date.now()}`,
      label: 'Segmented Control',
      valueSource: 'manual',
      targets: [],
      showClearOption: true
    }
  },

  // Range Controls
  {
    id: 'slider-control',
    type: 'slider',
    title: 'Slider',
    description: 'Single value slider for numeric ranges',
    icon: 'Sliders',
    category: 'range',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    defaultConfig: {
      controlId: `slider-${Date.now()}`,
      label: 'Slider',
      valueSource: 'manual',
      targets: [],
      minValue: 0,
      maxValue: 100,
      step: 1
    }
  },
  {
    id: 'range-slider-control',
    type: 'range-slider',
    title: 'Range Slider',
    description: 'Dual-handle slider for value ranges',
    icon: 'Sliders',
    category: 'range',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    defaultConfig: {
      controlId: `range-slider-${Date.now()}`,
      label: 'Range Slider',
      valueSource: 'manual',
      targets: [],
      minValue: 0,
      maxValue: 100,
      step: 1
    }
  },
  {
    id: 'number-range-control',
    type: 'number-range',
    title: 'Number Range',
    description: 'Min/max number inputs for ranges',
    icon: 'Hash',
    category: 'range',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    defaultConfig: {
      controlId: `number-range-${Date.now()}`,
      label: 'Number Range',
      valueSource: 'manual',
      targets: []
    }
  },
  {
    id: 'date-control',
    type: 'date',
    title: 'Date Picker',
    description: 'Single date selection',
    icon: 'Calendar',
    category: 'range',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    defaultConfig: {
      controlId: `date-${Date.now()}`,
      label: 'Date',
      valueSource: 'manual',
      targets: [],
      dateFormat: 'yyyy-MM-dd'
    }
  },
  {
    id: 'date-range-control',
    type: 'date-range',
    title: 'Date Range',
    description: 'Start and end date selection',
    icon: 'Calendar',
    category: 'range',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    defaultConfig: {
      controlId: `date-range-${Date.now()}`,
      label: 'Date Range',
      valueSource: 'manual',
      targets: [],
      dateFormat: 'yyyy-MM-dd'
    }
  },

  // Boolean Controls
  {
    id: 'switch-control',
    type: 'switch',
    title: 'Switch',
    description: 'Boolean toggle switch',
    icon: 'ToggleLeft',
    category: 'boolean',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    defaultConfig: {
      controlId: `switch-${Date.now()}`,
      label: 'Switch',
      valueSource: 'manual',
      targets: []
    }
  },
  {
    id: 'checkbox-control',
    type: 'checkbox',
    title: 'Checkbox',
    description: 'Binary selection checkbox',
    icon: 'CheckSquare',
    category: 'boolean',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    defaultConfig: {
      controlId: `checkbox-${Date.now()}`,
      label: 'Checkbox',
      valueSource: 'manual',
      targets: []
    }
  },

  // Advanced Controls
  {
    id: 'top-n-filter-control',
    type: 'top-n-filter',
    title: 'Top N Filter',
    description: 'Ranking and limiting filter',
    icon: 'TrendingUp',
    category: 'advanced',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    defaultConfig: {
      controlId: `top-n-${Date.now()}`,
      label: 'Top N Filter',
      valueSource: 'manual',
      targets: []
    }
  },
  {
    id: 'drill-down-control',
    type: 'drill-down',
    title: 'Drill Down',
    description: 'Hierarchical data navigation',
    icon: 'Navigation',
    category: 'navigation',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    defaultConfig: {
      controlId: `drill-down-${Date.now()}`,
      label: 'Drill Down',
      valueSource: 'column',
      targets: []
    }
  },
  {
    id: 'legend-control',
    type: 'legend',
    title: 'Legend Control',
    description: 'Interactive chart legend',
    icon: 'BarChart3',
    category: 'advanced',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    defaultConfig: {
      controlId: `legend-${Date.now()}`,
      label: 'Legend',
      valueSource: 'column',
      targets: []
    }
  }
];

export const controlCategoryLabels = {
  input: 'Input Controls',
  selection: 'Selection Controls',
  range: 'Range Controls',
  boolean: 'Boolean Controls',
  navigation: 'Navigation Controls',
  advanced: 'Advanced Controls'
};

// Icon mapping for dynamic rendering
export const iconComponents = {
  Type,
  Hash,
  ToggleLeft,
  CheckSquare,
  Calendar,
  Sliders,
  List,
  Filter,
  Layers,
  AlignLeft,
  BarChart3,
  Navigation,
  TrendingUp
};
