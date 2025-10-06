# Configure Panel for Bar Chart Widget

## Overview
The Configure Panel is a comprehensive left-side panel that opens when a Bar Chart widget is clicked. It provides three main tabs for configuring the bar chart:

## Features

### 1. Data Tab
- **Views (Dataset Selection)**: Choose from available datasets with green dot indicators for active selection
- **Columns**: Browse available dimensions and measures with drag-and-drop functionality
- **X-Axis Configuration**: Set up the category axis with Format, Transform, and Truncate Date options
- **Y-Axis Configuration**: Add multiple measures with Set Aggregate, Transform, and Format options for each field

#### Available Datasets:
- Sales Performance (quarterly data)
- Product Performance (product sales metrics)
- Monthly Financials (revenue, expenses, profit)
- Campaign Performance (marketing metrics)
- Regional Performance (geographical data)

### 2. Operations Tab
- **Chart Configuration**: Orientation (vertical/horizontal) and stacking options (none/stacked/stacked 100%)
- **Data Labels**: Show/hide data labels with position, format, color, and font size controls
- **Legends**: Legend visibility, position (top/bottom/left/right), and alignment (start/center/end)
- **Axis Titles**: Custom X-axis and Y-axis titles with toggle controls
- **Mark Colors**: Single color, by category, or by scale color modes with color pickers
- **Conditional Formatting**: Rule-based color formatting with multiple condition types
- **Tooltip Configuration**: Show/hide tooltips and percentage display for stacked charts
- **Gap Width**: Visual spacing control with preview examples (small/medium/large/auto)
- **Reference Lines & Trend Lines**: Advanced chart annotations and trend analysis

### 3. Design Tab
- **General Settings**: Title, data labels, colors
- **Order & Limit**: Sort and limit data display
- **Axes Configuration**: Axis types, ranges, labels
- **Theme Options**: Color schemes and styling
- **Advanced Settings**: Performance and display options

## Usage

1. **Add a Bar Chart**: Click the floating + button and select "Bar Chart"
2. **Configure Panel Opens**: Automatically opens when a bar chart is selected
3. **Configure Data**: 
   - Select a dataset from the Views section
   - Choose dimensions (string fields) for X-axis
   - Select measures (number fields) for Y-axis
4. **Customize Design**: Switch to the Design tab to modify appearance
5. **Apply Changes**: Changes are applied in real-time to the chart

## Key Components

### DataTab
- Handles dataset selection and field mapping
- Provides drag-and-drop style interface for X/Y axis configuration
- Shows field types with appropriate icons

### DesignTab
- Mirrors the design shown in the provided screenshots
- Collapsible sections for organized settings
- Toggle switches for boolean options
- Color pickers and range sliders

### CollapsibleSection
- Reusable component for organizing settings
- Expandable/collapsible with smooth animations
- Icon support for better visual hierarchy

## Technical Implementation

### State Management
- Uses React hooks for local state
- Integrates with parent dashboard builder
- Real-time updates to chart configuration

### Data Flow
1. User selects dataset → Updates widget config
2. User maps fields to axes → Updates axis configuration
3. Changes propagate to BarChartWidget → Chart re-renders

### Styling
- Tailwind CSS for responsive design
- Custom scrollbar styling
- Smooth transitions and animations
- Modern toggle switches and form controls

## Future Enhancements

### Operations Tab
- Interactive reference line creation and editing
- Advanced filtering capabilities with multiple conditions
- Custom calculated fields and formulas
- Data transformations and aggregation functions
- Drill-down and drill-through functionality

### Advanced Features
- Conditional formatting rules
- Reference lines and annotations
- Export/sharing options
- Collaboration features
