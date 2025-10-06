// Control Components
export { default as TextInputControl } from './TextInputControl';
export { default as TextAreaControl } from './TextAreaControl';
export { default as NumberInputControl } from './NumberInputControl';
export { default as NumberRangeControl } from './NumberRangeControl';
export { default as SwitchControl } from './SwitchControl';
export { default as CheckboxControl } from './CheckboxControl';
export { default as ListValuesControl } from './ListValuesControl';
export { default as SegmentedControl } from './SegmentedControl';
export { default as SliderControl } from './SliderControl';
export { default as RangeSliderControl } from './RangeSliderControl';
export { default as DateControl } from './DateControl';
export { default as DateRangeControl } from './DateRangeControl';
export { default as TopNFilterControl } from './TopNFilterControl';
export { default as DrillDownControl } from './DrillDownControl';
export { default as LegendControl } from './LegendControl';

// Base components
export { BaseControl, ControlContainer } from './BaseControl';
export type { BaseControlProps, ControlContainerProps } from './BaseControl';

// Control Factory
import React from 'react';
import { ControlType } from '../types';
import { BaseControlProps } from './BaseControl';
import TextInputControl from './TextInputControl';
import TextAreaControl from './TextAreaControl';
import NumberInputControl from './NumberInputControl';
import NumberRangeControl from './NumberRangeControl';
import SwitchControl from './SwitchControl';
import CheckboxControl from './CheckboxControl';
import ListValuesControl from './ListValuesControl';
import SegmentedControl from './SegmentedControl';
import SliderControl from './SliderControl';
import RangeSliderControl from './RangeSliderControl';
import DateControl from './DateControl';
import DateRangeControl from './DateRangeControl';
import TopNFilterControl from './TopNFilterControl';
import DrillDownControl from './DrillDownControl';
import LegendControl from './LegendControl';

export function createControl(type: ControlType, props: BaseControlProps): React.ReactElement | null {
  switch (type) {
    case 'text-input':
      return <TextInputControl {...props} />;
    case 'text-area':
      return <TextAreaControl {...props} />;
    case 'number-input':
      return <NumberInputControl {...props} />;
    case 'number-range':
      return <NumberRangeControl {...props} />;
    case 'switch':
      return <SwitchControl {...props} />;
    case 'checkbox':
      return <CheckboxControl {...props} />;
    case 'list-values':
      return <ListValuesControl {...props} />;
    case 'segmented':
      return <SegmentedControl {...props} />;
    case 'slider':
      return <SliderControl {...props} />;
    case 'range-slider':
      return <RangeSliderControl {...props} />;
    case 'date':
      return <DateControl {...props} />;
    case 'date-range':
      return <DateRangeControl {...props} />;
    case 'top-n-filter':
      return <TopNFilterControl {...props} />;
    case 'drill-down':
      return <DrillDownControl {...props} />;
    case 'legend':
      return <LegendControl {...props} />;
    default:
      console.warn(`Control type "${type}" not implemented yet`);
      return null;
  }
}

// Helper function to get default control config
export function getDefaultControlConfig(type: ControlType) {
  const baseConfig = {
    controlId: `control-${Date.now()}`,
    label: 'New Control',
    required: false,
    valueSource: 'manual' as const,
    targets: [],
    showLabel: true,
    labelPosition: 'top' as const,
    alignment: 'left' as const
  };

  switch (type) {
    case 'text-input':
      return {
        ...baseConfig,
        operator: 'contains' as const,
        caseSensitive: false
      };
    case 'text-area':
      return {
        ...baseConfig,
        label: 'Text Area'
      };
    case 'number-input':
      return {
        ...baseConfig,
        operator: 'equal-to' as const,
        step: 1
      };
    case 'number-range':
      return {
        ...baseConfig,
        label: 'Number Range'
      };
    case 'list-values':
      return {
        ...baseConfig,
        label: 'List Values',
        multiSelect: true,
        showClearOption: true,
        manualValues: []
      };
    case 'segmented':
      return {
        ...baseConfig,
        label: 'Segmented Control',
        showClearOption: true,
        manualValues: []
      };
    case 'slider':
      return {
        ...baseConfig,
        label: 'Slider',
        minValue: 0,
        maxValue: 100,
        step: 1
      };
    case 'range-slider':
      return {
        ...baseConfig,
        label: 'Range Slider',
        minValue: 0,
        maxValue: 100,
        step: 1
      };
    case 'date':
      return {
        ...baseConfig,
        label: 'Date',
        dateFormat: 'yyyy-MM-dd'
      };
    case 'date-range':
      return {
        ...baseConfig,
        label: 'Date Range',
        dateFormat: 'yyyy-MM-dd'
      };
    case 'top-n-filter':
      return {
        ...baseConfig,
        label: 'Top N Filter'
      };
    case 'drill-down':
      return {
        ...baseConfig,
        label: 'Drill Down',
        valueSource: 'column' as const
      };
    case 'legend':
      return {
        ...baseConfig,
        label: 'Legend',
        valueSource: 'column' as const
      };
    case 'switch':
    case 'checkbox':
      return baseConfig;
    default:
      return baseConfig;
  }
}
