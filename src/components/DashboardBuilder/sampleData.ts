// Comprehensive sample data for bar chart demonstrations

export const salesData = [
  { 
    quarter: 'Q1 2023', 
    revenue: 178000000, 
    pipeline: 135000000, 
    closedWon: 110000000, 
    region: 'East',
    salesRep: 'John Smith',
    productCategory: 'Enterprise',
    date: '2023-03-31'
  },
  { 
    quarter: 'Q2 2023', 
    revenue: 158000000, 
    pipeline: 110000000, 
    closedWon: 95000000, 
    region: 'West',
    salesRep: 'Sarah Johnson',
    productCategory: 'Professional',
    date: '2023-06-30'
  },
  { 
    quarter: 'Q3 2023', 
    revenue: 201000000, 
    pipeline: 146000000, 
    closedWon: 125000000, 
    region: 'North',
    salesRep: 'Mike Davis',
    productCategory: 'Enterprise',
    date: '2023-09-30'
  },
  { 
    quarter: 'Q4 2023', 
    revenue: 146000000, 
    pipeline: 125000000, 
    closedWon: 98000000, 
    region: 'South',
    salesRep: 'Lisa Chen',
    productCategory: 'Starter',
    date: '2023-12-31'
  },
];

export const productPerformanceData = [
  {
    product: 'Analytics Pro',
    revenue: 45000000,
    units: 12500,
    profit: 8500000,
    category: 'Software',
    region: 'North America',
    quarter: 'Q4 2023'
  },
  {
    product: 'Dashboard Suite',
    revenue: 32000000,
    units: 28000,
    profit: 6200000,
    category: 'Software',
    region: 'Europe',
    quarter: 'Q4 2023'
  },
  {
    product: 'Data Connector',
    revenue: 28000000,
    units: 15600,
    profit: 5800000,
    category: 'Integration',
    region: 'Asia Pacific',
    quarter: 'Q4 2023'
  },
  {
    product: 'Mobile App',
    revenue: 19000000,
    units: 8900,
    profit: 3800000,
    category: 'Mobile',
    region: 'Latin America',
    quarter: 'Q4 2023'
  },
  {
    product: 'API Gateway',
    revenue: 12000000,
    units: 45000,
    profit: 2100000,
    category: 'Infrastructure',
    region: 'Middle East',
    quarter: 'Q4 2023'
  },
];

export const monthlyFinancialData = [
  {
    month: 'January',
    revenue: 15000000,
    expenses: 8000000,
    profit: 7000000,
    operatingCosts: 5000000,
    marketingSpend: 2000000,
    year: 2024
  },
  {
    month: 'February',
    revenue: 18000000,
    expenses: 9500000,
    profit: 8500000,
    operatingCosts: 5500000,
    marketingSpend: 2200000,
    year: 2024
  },
  {
    month: 'March',
    revenue: 22000000,
    expenses: 11000000,
    profit: 11000000,
    operatingCosts: 6000000,
    marketingSpend: 2500000,
    year: 2024
  },
  {
    month: 'April',
    revenue: 19000000,
    expenses: 10200000,
    profit: 8800000,
    operatingCosts: 5800000,
    marketingSpend: 2100000,
    year: 2024
  },
  {
    month: 'May',
    revenue: 25000000,
    expenses: 12500000,
    profit: 12500000,
    operatingCosts: 6500000,
    marketingSpend: 2800000,
    year: 2024
  },
  {
    month: 'June',
    revenue: 28000000,
    expenses: 13800000,
    profit: 14200000,
    operatingCosts: 7000000,
    marketingSpend: 3000000,
    year: 2024
  },
];

export const campaignPerformanceData = [
  {
    campaign: 'Summer Sale 2024',
    impressions: 2500000,
    clicks: 125000,
    conversions: 8500,
    spend: 45000,
    revenue: 340000,
    ctr: 5.0,
    conversionRate: 6.8,
    roas: 7.56
  },
  {
    campaign: 'Product Launch Q2',
    impressions: 1800000,
    clicks: 90000,
    conversions: 6200,
    spend: 38000,
    revenue: 285000,
    ctr: 5.0,
    conversionRate: 6.9,
    roas: 7.50
  },
  {
    campaign: 'Brand Awareness',
    impressions: 3200000,
    clicks: 160000,
    conversions: 9800,
    spend: 52000,
    revenue: 420000,
    ctr: 5.0,
    conversionRate: 6.1,
    roas: 8.08
  },
  {
    campaign: 'Retargeting Campaign',
    impressions: 950000,
    clicks: 85500,
    conversions: 12800,
    spend: 28000,
    revenue: 512000,
    ctr: 9.0,
    conversionRate: 15.0,
    roas: 18.29
  },
];

export const regionPerformanceData = [
  {
    region: 'North America',
    revenue: 125000000,
    customers: 15000,
    avgOrderValue: 8333,
    growth: 12.5,
    marketShare: 35.2,
    satisfaction: 4.2
  },
  {
    region: 'Europe',
    revenue: 98000000,
    customers: 12800,
    avgOrderValue: 7656,
    growth: 8.7,
    marketShare: 28.1,
    satisfaction: 4.1
  },
  {
    region: 'Asia Pacific',
    revenue: 87000000,
    customers: 18500,
    avgOrderValue: 4703,
    growth: 22.3,
    marketShare: 24.8,
    satisfaction: 4.0
  },
  {
    region: 'Latin America',
    revenue: 32000000,
    customers: 8200,
    avgOrderValue: 3902,
    growth: 15.8,
    marketShare: 9.1,
    satisfaction: 3.9
  },
  {
    region: 'Middle East & Africa',
    revenue: 18000000,
    customers: 4500,
    avgOrderValue: 4000,
    growth: 28.4,
    marketShare: 2.8,
    satisfaction: 3.8
  },
];

// Dataset definitions with comprehensive field information
export const availableDatasets = [
  {
    id: 'sales-performance',
    name: 'Sales Performance',
    description: 'Quarterly sales data with revenue, pipeline, and regional breakdown',
    lastUpdated: '2 hours ago',
    recordCount: salesData.length,
    data: salesData,
    fields: [
      { id: 'quarter', name: 'Quarter', type: 'string' as const, icon: 'Calendar' },
      { id: 'revenue', name: 'Revenue', type: 'number' as const, icon: 'Hash' },
      { id: 'pipeline', name: 'Pipeline', type: 'number' as const, icon: 'Hash' },
      { id: 'closedWon', name: 'Closed Won', type: 'number' as const, icon: 'Hash' },
      { id: 'region', name: 'Region', type: 'string' as const, icon: 'Type' },
      { id: 'salesRep', name: 'Sales Rep', type: 'string' as const, icon: 'Type' },
      { id: 'productCategory', name: 'Product Category', type: 'string' as const, icon: 'Type' },
      { id: 'date', name: 'Date', type: 'date' as const, icon: 'Calendar' },
    ]
  },
  {
    id: 'product-performance',
    name: 'Product Performance',
    description: 'Product sales data with revenue, units sold, and profitability metrics',
    lastUpdated: '4 hours ago',
    recordCount: productPerformanceData.length,
    data: productPerformanceData,
    fields: [
      { id: 'product', name: 'Product', type: 'string' as const, icon: 'Type' },
      { id: 'revenue', name: 'Revenue', type: 'number' as const, icon: 'Hash' },
      { id: 'units', name: 'Units Sold', type: 'number' as const, icon: 'Hash' },
      { id: 'profit', name: 'Profit', type: 'number' as const, icon: 'Hash' },
      { id: 'category', name: 'Category', type: 'string' as const, icon: 'Type' },
      { id: 'region', name: 'Region', type: 'string' as const, icon: 'Type' },
      { id: 'quarter', name: 'Quarter', type: 'string' as const, icon: 'Calendar' },
    ]
  },
  {
    id: 'monthly-financials',
    name: 'Monthly Financials',
    description: 'Monthly financial performance including revenue, expenses, and profit',
    lastUpdated: '1 day ago',
    recordCount: monthlyFinancialData.length,
    data: monthlyFinancialData,
    fields: [
      { id: 'month', name: 'Month', type: 'string' as const, icon: 'Calendar' },
      { id: 'revenue', name: 'Revenue', type: 'number' as const, icon: 'Hash' },
      { id: 'expenses', name: 'Expenses', type: 'number' as const, icon: 'Hash' },
      { id: 'profit', name: 'Profit', type: 'number' as const, icon: 'Hash' },
      { id: 'operatingCosts', name: 'Operating Costs', type: 'number' as const, icon: 'Hash' },
      { id: 'marketingSpend', name: 'Marketing Spend', type: 'number' as const, icon: 'Hash' },
      { id: 'year', name: 'Year', type: 'number' as const, icon: 'Hash' },
    ]
  },
  {
    id: 'campaign-performance',
    name: 'Campaign Performance',
    description: 'Marketing campaign metrics including impressions, clicks, and conversions',
    lastUpdated: '6 hours ago',
    recordCount: campaignPerformanceData.length,
    data: campaignPerformanceData,
    fields: [
      { id: 'campaign', name: 'Campaign', type: 'string' as const, icon: 'Type' },
      { id: 'impressions', name: 'Impressions', type: 'number' as const, icon: 'Hash' },
      { id: 'clicks', name: 'Clicks', type: 'number' as const, icon: 'Hash' },
      { id: 'conversions', name: 'Conversions', type: 'number' as const, icon: 'Hash' },
      { id: 'spend', name: 'Spend', type: 'number' as const, icon: 'Hash' },
      { id: 'revenue', name: 'Revenue', type: 'number' as const, icon: 'Hash' },
      { id: 'ctr', name: 'CTR (%)', type: 'number' as const, icon: 'Hash' },
      { id: 'conversionRate', name: 'Conversion Rate (%)', type: 'number' as const, icon: 'Hash' },
      { id: 'roas', name: 'ROAS', type: 'number' as const, icon: 'Hash' },
    ]
  },
  {
    id: 'region-performance',
    name: 'Regional Performance',
    description: 'Performance metrics by geographical region',
    lastUpdated: '3 hours ago',
    recordCount: regionPerformanceData.length,
    data: regionPerformanceData,
    fields: [
      { id: 'region', name: 'Region', type: 'string' as const, icon: 'Type' },
      { id: 'revenue', name: 'Revenue', type: 'number' as const, icon: 'Hash' },
      { id: 'customers', name: 'Customers', type: 'number' as const, icon: 'Hash' },
      { id: 'avgOrderValue', name: 'Avg Order Value', type: 'number' as const, icon: 'Hash' },
      { id: 'growth', name: 'Growth (%)', type: 'number' as const, icon: 'Hash' },
      { id: 'marketShare', name: 'Market Share (%)', type: 'number' as const, icon: 'Hash' },
      { id: 'satisfaction', name: 'Satisfaction Score', type: 'number' as const, icon: 'Hash' },
    ]
  },
];

export const getDatasetById = (id: string) => {
  return availableDatasets.find(dataset => dataset.id === id);
};

export const getDataForChart = (datasetId: string) => {
  const dataset = getDatasetById(datasetId);
  return dataset ? dataset.data : [];
};
