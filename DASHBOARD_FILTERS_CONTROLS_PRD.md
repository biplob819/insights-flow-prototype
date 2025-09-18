# Dashboard Filters & Controls - Product Requirements Document

## Overview
Based on the Sigma Computing documentation and interface examples provided, this PRD outlines the implementation of comprehensive Filters and Controls functionality for the dashboard creation system at `http://localhost:3000/dashboard/create`.

## 1. Core Concept

### 1.1 Filters vs Controls
- **Filters**: Applied directly to individual data elements (charts, tables) to limit displayed data
- **Controls**: Interactive elements that can target multiple dashboard elements simultaneously, providing dynamic filtering and parameter input capabilities

### 1.2 Integration Point
- Add Filters & Controls as widget options in the "+ Add" menu alongside existing chart types
- Controls act as dashboard-level elements that can target and modify multiple charts/visualizations

## 2. Filter Types Implementation

### 2.1 List Filter
**Purpose**: Include/exclude selected values from a predefined list

**Configuration Options**:
- Data source selection (manual list, column-based, preset values)
- Multi-select vs single-select mode
- Include vs exclude logic
- Sort options (ascending/descending by count or alphanumeric)
- Display up to 200 values maximum

**UI Components**:
- Dropdown/multi-select interface
- Search functionality within list
- Clear all/select all options

### 2.2 Top N Filter
**Purpose**: Rank and limit data based on specified criteria

**Configuration Options**:
- Ranking direction (Top N, Bottom N, Top Percentile, Bottom Percentile)
- Numeric input for N value
- Ranking function (Rank, RankDense, RowNumber)
- Aggregation requirement (must have aggregated column)

**UI Components**:
- Dropdown for ranking type selection
- Number input field
- Ranking function selector

### 2.3 Number Range Filter
**Purpose**: Filter numeric data within specified bounds

**Configuration Options**:
- Minimum and maximum value inputs
- Inclusive/exclusive boundary options
- Null value handling
- Data type validation (numbers only)

**UI Components**:
- Two number input fields (min/max)
- Boundary inclusion checkboxes
- Null handling options

### 2.4 Date Range Filter
**Purpose**: Filter date data within specified time periods

**Configuration Options**:
- Fixed date selection (calendar picker)
- Relative date options (last N days/weeks/months/quarters/years)
- Include current period toggle
- Null value handling
- Time zone considerations

**UI Components**:
- Calendar date picker (dual for range)
- Relative date dropdown presets
- Time inclusion options

### 2.5 Text Match Filter
**Purpose**: Filter text data based on pattern matching

**Configuration Options**:
- Operators: Equal to, Contains, Starts with, Ends with, RegExp
- Case sensitivity toggle
- Null value handling
- Regular expression validation

**UI Components**:
- Text input field
- Operator dropdown
- Case sensitivity checkbox
- RegExp helper/validation

## 3. Control Types Implementation

### 3.1 List Values Control
**Purpose**: Provide selectable list for filtering multiple elements

**Configuration**:
- Value source (manual, column-based, preset)
- Multi-select capability
- Display vs data value mapping
- Auto-sorting options

**Target Configuration**:
- Multiple element targeting
- Column mapping per target
- Data type compatibility validation

### 3.2 Text Input Control
**Purpose**: Search/filter functionality across targeted elements

**Configuration**:
- Operator selection (contains, equals, starts with, etc.)
- Case sensitivity
- Real-time vs on-submit filtering

**Use Cases**:
- Search functionality
- Parameter input for formulas
- Dynamic text replacement

### 3.3 Text Area Control
**Purpose**: Multi-line text input for complex queries or notes

**Configuration**:
- Character limits
- Placeholder text
- Formatting options

**Use Cases**:
- AI query prompts
- Notes and descriptions
- Multi-line parameter input

### 3.4 Segmented Control
**Purpose**: Single-select option set with visual segments

**Configuration**:
- 1-7 segments maximum
- Value source options
- Display label customization
- Clear option availability

**UI Design**:
- Horizontal segment layout
- Visual selection indicators
- Responsive design for mobile

### 3.5 Number Input Control
**Purpose**: Numeric parameter input

**Configuration**:
- Data validation (min/max bounds)
- Decimal precision
- Step increments
- Operator selection (<=, =, >=)

### 3.6 Number Range Control
**Purpose**: Dual numeric input for range selection

**Configuration**:
- Independent min/max controls
- Range validation
- Inclusive boundaries
- Visual range indicators

### 3.7 Slider Controls
**Purpose**: Visual numeric selection interface

**Types**:
- Single value slider
- Range slider (dual handles)

**Configuration**:
- Min/max bounds
- Step intervals
- Visual styling
- Value display options

### 3.8 Date Controls
**Purpose**: Date/time selection and filtering

**Types**:
- Single date picker
- Date range picker

**Configuration**:
- Calendar interface
- Relative date presets
- Time zone handling
- Format customization

### 3.9 Switch Control
**Purpose**: Boolean toggle functionality

**Configuration**:
- True/false labels
- Default state
- Visual styling options

### 3.10 Checkbox Control
**Purpose**: Binary selection interface

**Configuration**:
- Label text
- Default checked state
- Styling options

### 3.11 Drill Down Control
**Purpose**: Hierarchical data navigation

**Configuration**:
- Drill path definition
- Multiple drill categories
- Target element mapping
- One-click drill behavior

## 4. User Interface Flows

### 4.1 Adding Filters/Controls to Dashboard

**Flow 1: Add Control Widget**
1. User clicks "+ Add" button in dashboard creation interface
2. System displays widget menu with categories:
   - Charts (existing)
   - **Filters & Controls** (new category)
3. User selects "Filters & Controls" category
4. System shows control type submenu:
   - List Values
   - Text Input
   - Text Area
   - Segmented
   - Number Input
   - Number Range
   - Slider
   - Range Slider
   - Date
   - Date Range
   - Switch
   - Checkbox
   - Drill Down
   - Top N Filter
5. User selects desired control type
6. System adds control widget to dashboard canvas
7. Control configuration panel opens automatically

### 4.2 Control Configuration Flow

**Step 1: Basic Settings**
- Control ID (auto-generated, editable)
- Control Label (display name)
- Description (optional tooltip)
- Required field toggle

**Step 2: Value Source Configuration**
- Manual list creation
- Column-based source selection
- Preset value options
- Display value mapping

**Step 3: Target Configuration**
- Add target elements (charts/tables)
- Configure column mappings
- Validate data type compatibility
- Set up parameter references

**Step 4: Styling and Formatting**
- Alignment options
- Color schemes
- Font settings
- Layout preferences

### 4.3 Filter Application Flow

**Element-Level Filtering**:
1. User clicks filter icon on chart/table
2. Filter configuration panel opens
3. User selects filter type
4. User configures filter parameters
5. Filter applies immediately
6. Option to convert to dashboard control

**Control-Level Filtering**:
1. User interacts with control widget
2. System validates input
3. System applies filter to all targeted elements
4. Dashboard updates dynamically
5. URL parameters update (for sharing/embedding)

## 5. Technical Implementation Requirements

### 5.1 Data Architecture

**Control State Management**:
```typescript
interface ControlState {
  id: string;
  type: ControlType;
  label: string;
  value: any;
  targets: TargetElement[];
  configuration: ControlConfig;
  required: boolean;
}
```

**Filter Application**:
- Real-time filtering capability
- Batch updates for performance
- State persistence
- Undo/redo functionality

### 5.2 Target Management

**Element Targeting**:
- Dynamic target discovery
- Column mapping validation
- Data type compatibility checks
- Dependency tracking

**Parameter References**:
- Control ID referencing in formulas
- URL parameter generation
- State synchronization

### 5.3 Advanced Features

**Synced Controls**:
- Multiple control instances with shared state
- Cross-page synchronization
- Independent unsyncing capability

**Control Interactions**:
- Control-to-control dependencies
- Conditional visibility
- Dynamic option updates

**Export/Import**:
- Control configuration export
- Template sharing
- Bulk configuration updates

## 6. User Experience Considerations

### 6.1 Performance

**Optimization Strategies**:
- Debounced input handling
- Lazy loading for large datasets
- Efficient DOM updates
- Caching strategies

### 6.2 Accessibility

**Requirements**:
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- ARIA label implementation

### 6.3 Mobile Responsiveness

**Design Considerations**:
- Touch-friendly interface elements
- Responsive layout adaptation
- Gesture support for sliders
- Optimized dropdown interfaces

## 7. Integration Points

### 7.1 Existing Dashboard System
- Seamless integration with current chart widgets
- Consistent styling and theming
- Shared data source connections
- Compatible with existing export functionality

### 7.2 Data Sources
- Dynamic column discovery
- Data type inference
- Real-time data updates
- Error handling for data issues

### 7.3 Sharing and Collaboration
- URL parameter encoding
- Embedded dashboard support
- Permission-based control access
- Collaborative editing capabilities

## 8. Implementation Phases

### Phase 1: Core Infrastructure
- Basic control types (Text Input, Number Input, Switch, Checkbox)
- Control state management
- Target configuration system
- Basic filtering functionality

### Phase 2: Advanced Controls
- List Values control
- Date controls
- Slider controls
- Segmented control

### Phase 3: Complex Features
- Top N Filter
- Drill Down control
- Synced controls
- Advanced targeting

### Phase 4: Enhancements
- Performance optimizations
- Advanced styling options
- Export/import functionality
- Mobile optimizations

## 9. Success Metrics

### 9.1 Functionality Metrics
- All control types implemented and functional
- Real-time filtering performance < 200ms
- Support for 100+ simultaneous controls per dashboard
- 99.9% uptime for control interactions

### 9.2 User Experience Metrics
- Intuitive control configuration (< 3 clicks for basic setup)
- Responsive design across all devices
- Accessibility compliance (WCAG 2.1 AA)
- User satisfaction score > 4.5/5

### 9.3 Performance Metrics
- Page load time < 2 seconds with 50+ controls
- Memory usage optimization
- Efficient data querying and caching
- Smooth animations and transitions

This comprehensive PRD provides the foundation for implementing a robust Filters & Controls system that mirrors Sigma Computing's functionality while integrating seamlessly with your existing dashboard creation interface.
