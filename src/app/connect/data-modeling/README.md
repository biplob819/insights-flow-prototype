# Data Modeling Module

A comprehensive data modeling interface inspired by Sigma Computing and GoodData, providing intuitive tools for non-technical users to perform advanced data modeling operations.

## Features

### 🔌 Data Sources Tab
- **CSV Upload**: Drag-and-drop interface for uploading CSV files
- **Database Connections**: Connect to PostgreSQL, MySQL, SQL Server, Oracle, MongoDB
- **Data Preview**: Real-time preview of data structure and sample records
- **Connection Management**: Monitor connection status and manage multiple data sources

### 🏗️ Logical Data Model Tab
- **Drag-and-Drop Interface**: Visual table designer with moveable table nodes
- **Relationship Management**: Create and manage table relationships with various join types
- **Join Types Supported**:
  - Inner Join
  - Left Join
  - Right Join
  - Full Outer Join
  - Cross Join
- **Interactive Canvas**: Grid-based canvas with zoom and pan capabilities
- **Table Expansion**: Collapsible table views showing columns and data types
- **Visual Relationships**: Animated relationship lines with directional indicators

### 👁️ View Tab (Excel-like Interface)
- **Spreadsheet Interface**: Familiar Excel-like grid for data manipulation
- **Formula Builder**: Advanced formula editor with Sigma Computing functions
- **Column Operations**:
  - Add/Remove columns
  - Sort and filter data
  - Column type management (text, number, date, formula)
- **Formula Functions**:
  - Mathematical: SUM, AVG, COUNT, MAX, MIN, ROUND, ABS
  - Text: CONCAT, UPPER, LOWER, TRIM, SUBSTRING
  - Date: NOW, TODAY, YEAR, MONTH, DAY, DATE_ADD
  - Logical: IF, CASE, COALESCE, NULLIF
  - Window: ROW_NUMBER, RANK, LAG, LEAD

### 📊 Metrics Tab
- **Business Metrics Dashboard**: Pre-built metric templates
- **Custom Metric Builder**: Create metrics with formula-based calculations
- **Metric Categories**:
  - Revenue Metrics (Total Revenue, AOV, Growth Rate)
  - Customer Metrics (Acquisition, Retention, LTV)
  - Product Metrics (Sales, Performance, Returns)
  - Operational Metrics (Fulfillment, Accuracy, Response Time)
- **SQL Generation**: Automatic SQL query generation from formulas
- **Real-time Calculations**: Live metric updates with trend indicators

### 🔧 SQL Query Builder
- **Visual Query Builder**: Point-and-click interface for SQL construction
- **Advanced SQL Editor**: Syntax-highlighted SQL editor
- **Query Execution**: Run queries against connected data sources
- **Results Visualization**: Tabular display of query results
- **Export Capabilities**: Copy, save, and export query results

## Technical Implementation

### Architecture
```
data-modeling/
├── page.tsx                 # Main data modeling page
├── components/
│   ├── DataSourcePanel.tsx  # Data source management
│   ├── LogicalDataModel.tsx # Visual data modeling
│   ├── ViewTab.tsx         # Excel-like interface
│   ├── MetricsTab.tsx      # Business metrics
│   └── SQLQueryBuilder.tsx # Query builder
├── data/
│   └── sampleData.ts       # Sample data and functions
└── README.md               # This file
```

### Key Technologies
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Drag & Drop** functionality for visual modeling
- **Formula Parser** for Excel-like calculations
- **SQL Generation** engine

### Sample Data Structure
The module includes comprehensive sample data:
- **Customers**: Demographics, contact info, customer tiers
- **Orders**: Order lifecycle, payments, shipping
- **Products**: Catalog, pricing, inventory
- **Order Items**: Line items with quantities and pricing
- **Categories**: Product categorization

## Usage Examples

### Creating a Basic Join
1. Navigate to "Logical Model" tab
2. Select tables by clicking on them
3. Click "Create Join" button
4. Choose join type and specify conditions
5. Visual relationship appears on canvas

### Building a Formula Column
1. Go to "View" tab
2. Click "Formula Builder"
3. Select functions from the panel
4. Build formula: `IF([Total Spent] > 1000, "Premium", "Standard")`
5. Apply to create new calculated column

### Creating Business Metrics
1. Switch to "Metrics" tab
2. Click "Create Metric"
3. Choose category and format
4. Build formula: `SUM([orders.total_amount]) / COUNT(DISTINCT [customers.id])`
5. Save metric for dashboard display

### SQL Query Building
1. Click "SQL Builder" in header
2. Use visual builder or write SQL directly
3. Execute query to see results
4. Export or save query for reuse

## Best Practices

### Data Modeling
- Start with understanding your data sources
- Create logical relationships before building views
- Use descriptive names for calculated columns
- Test formulas with sample data

### Performance
- Limit result sets with appropriate filters
- Use indexes on join columns
- Consider data types when creating formulas
- Monitor query execution times

### User Experience
- Provide clear column descriptions
- Use consistent naming conventions
- Group related metrics by category
- Include data validation and error handling

## Sigma Computing Inspiration

This module draws inspiration from Sigma Computing's approach to:
- **Self-Service Analytics**: Empowering business users
- **Spreadsheet Paradigm**: Familiar Excel-like interface
- **Live Data Connections**: Real-time data access
- **Collaborative Modeling**: Shareable data models
- **Visual Query Building**: Drag-and-drop simplicity

## Future Enhancements

### Planned Features
- **Data Lineage**: Track data transformations
- **Version Control**: Model versioning and rollback
- **Collaboration**: Multi-user editing and comments
- **Advanced Visualizations**: Charts and graphs
- **Automated Insights**: AI-powered data discovery
- **Performance Optimization**: Query caching and optimization
- **Data Governance**: Access controls and audit trails

### Integration Opportunities
- **BI Tools**: Connect to Tableau, Power BI
- **Data Warehouses**: Snowflake, BigQuery integration
- **APIs**: REST/GraphQL endpoint generation
- **Scheduling**: Automated data refreshes
- **Alerting**: Threshold-based notifications

## Support

For questions or issues with the data modeling module:
1. Check the sample data and examples
2. Review function documentation
3. Test with smaller datasets first
4. Validate SQL syntax in the query builder

The module is designed to be intuitive for business users while providing the power and flexibility needed for complex data modeling scenarios.
