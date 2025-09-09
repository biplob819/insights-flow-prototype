export interface SampleTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primaryKey?: boolean;
    foreignKey?: boolean;
    description?: string;
  }>;
  sampleData: Record<string, unknown>[];
}

export const sampleTables: SampleTable[] = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Unique customer identifier' },
      { name: 'first_name', type: 'VARCHAR(50)', nullable: false, description: 'Customer first name' },
      { name: 'last_name', type: 'VARCHAR(50)', nullable: false, description: 'Customer last name' },
      { name: 'email', type: 'VARCHAR(100)', nullable: false, description: 'Customer email address' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Customer phone number' },
      { name: 'date_of_birth', type: 'DATE', nullable: true, description: 'Customer date of birth' },
      { name: 'address', type: 'TEXT', nullable: true, description: 'Customer address' },
      { name: 'city', type: 'VARCHAR(50)', nullable: true, description: 'Customer city' },
      { name: 'state', type: 'VARCHAR(50)', nullable: true, description: 'Customer state' },
      { name: 'zip_code', type: 'VARCHAR(10)', nullable: true, description: 'Customer zip code' },
      { name: 'country', type: 'VARCHAR(50)', nullable: false, description: 'Customer country' },
      { name: 'customer_tier', type: 'VARCHAR(20)', nullable: false, description: 'Customer tier (Bronze, Silver, Gold, Platinum)' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Account creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Last update timestamp' },
    ],
    sampleData: [
      { id: 1001, first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com', phone: '+1-555-0123', date_of_birth: '1985-03-15', address: '123 Main St', city: 'New York', state: 'NY', zip_code: '10001', country: 'USA', customer_tier: 'Gold', created_at: '2023-01-15 10:30:00', updated_at: '2024-01-10 14:22:00' },
      { id: 1002, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com', phone: '+1-555-0124', date_of_birth: '1990-07-22', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip_code: '90210', country: 'USA', customer_tier: 'Platinum', created_at: '2023-02-20 09:15:00', updated_at: '2024-01-08 11:45:00' },
      { id: 1003, first_name: 'Mike', last_name: 'Johnson', email: 'mike.j@email.com', phone: '+1-555-0125', date_of_birth: '1982-11-08', address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip_code: '60601', country: 'USA', customer_tier: 'Silver', created_at: '2023-03-10 16:45:00', updated_at: '2024-01-05 09:30:00' },
      { id: 1004, first_name: 'Sarah', last_name: 'Wilson', email: 'sarah.w@email.com', phone: '+1-555-0126', date_of_birth: '1995-05-12', address: '321 Elm St', city: 'Houston', state: 'TX', zip_code: '77001', country: 'USA', customer_tier: 'Bronze', created_at: '2023-04-05 12:20:00', updated_at: '2024-01-12 15:10:00' },
      { id: 1005, first_name: 'David', last_name: 'Brown', email: 'david.brown@email.com', phone: '+1-555-0127', date_of_birth: '1978-09-30', address: '654 Maple Dr', city: 'Phoenix', state: 'AZ', zip_code: '85001', country: 'USA', customer_tier: 'Platinum', created_at: '2023-05-18 08:00:00', updated_at: '2024-01-09 13:55:00' },
    ]
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Unique order identifier' },
      { name: 'customer_id', type: 'INTEGER', nullable: false, foreignKey: true, description: 'Reference to customer' },
      { name: 'order_number', type: 'VARCHAR(20)', nullable: false, description: 'Human-readable order number' },
      { name: 'order_date', type: 'DATE', nullable: false, description: 'Date when order was placed' },
      { name: 'ship_date', type: 'DATE', nullable: true, description: 'Date when order was shipped' },
      { name: 'delivery_date', type: 'DATE', nullable: true, description: 'Date when order was delivered' },
      { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false, description: 'Order subtotal before tax and shipping' },
      { name: 'tax_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Tax amount' },
      { name: 'shipping_cost', type: 'DECIMAL(10,2)', nullable: false, description: 'Shipping cost' },
      { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Total order amount' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Order status (pending, processing, shipped, delivered, cancelled)' },
      { name: 'payment_method', type: 'VARCHAR(20)', nullable: false, description: 'Payment method used' },
      { name: 'shipping_address', type: 'TEXT', nullable: false, description: 'Shipping address' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Order notes' },
    ],
    sampleData: [
      { id: 2001, customer_id: 1001, order_number: 'ORD-2024-001', order_date: '2024-01-15', ship_date: '2024-01-16', delivery_date: '2024-01-18', subtotal: 245.50, tax_amount: 19.64, shipping_cost: 9.99, total_amount: 275.13, status: 'delivered', payment_method: 'credit_card', shipping_address: '123 Main St, New York, NY 10001', notes: null },
      { id: 2002, customer_id: 1002, order_number: 'ORD-2024-002', order_date: '2024-01-16', ship_date: '2024-01-17', delivery_date: null, subtotal: 156.25, tax_amount: 12.50, shipping_cost: 7.99, total_amount: 176.74, status: 'shipped', payment_method: 'paypal', shipping_address: '456 Oak Ave, Los Angeles, CA 90210', notes: 'Leave at door' },
      { id: 2003, customer_id: 1003, order_number: 'ORD-2024-003', order_date: '2024-01-17', ship_date: null, delivery_date: null, subtotal: 89.99, tax_amount: 7.20, shipping_cost: 5.99, total_amount: 103.18, status: 'processing', payment_method: 'credit_card', shipping_address: '789 Pine Rd, Chicago, IL 60601', notes: 'Rush delivery' },
      { id: 2004, customer_id: 1004, order_number: 'ORD-2024-004', order_date: '2024-01-18', ship_date: null, delivery_date: null, subtotal: 320.00, tax_amount: 25.60, shipping_cost: 12.99, total_amount: 358.59, status: 'pending', payment_method: 'bank_transfer', shipping_address: '321 Elm St, Houston, TX 77001', notes: null },
      { id: 2005, customer_id: 1005, order_number: 'ORD-2024-005', order_date: '2024-01-19', ship_date: '2024-01-20', delivery_date: '2024-01-22', subtotal: 450.75, tax_amount: 36.06, shipping_cost: 15.99, total_amount: 502.80, status: 'delivered', payment_method: 'credit_card', shipping_address: '654 Maple Dr, Phoenix, AZ 85001', notes: 'Signature required' },
    ]
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Unique product identifier' },
      { name: 'sku', type: 'VARCHAR(20)', nullable: false, description: 'Stock keeping unit' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Product name' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Product description' },
      { name: 'category_id', type: 'INTEGER', nullable: false, foreignKey: true, description: 'Reference to product category' },
      { name: 'brand', type: 'VARCHAR(50)', nullable: false, description: 'Product brand' },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false, description: 'Product price' },
      { name: 'cost', type: 'DECIMAL(10,2)', nullable: false, description: 'Product cost' },
      { name: 'weight', type: 'DECIMAL(8,2)', nullable: true, description: 'Product weight in pounds' },
      { name: 'dimensions', type: 'VARCHAR(50)', nullable: true, description: 'Product dimensions (LxWxH)' },
      { name: 'stock_quantity', type: 'INTEGER', nullable: false, description: 'Current stock quantity' },
      { name: 'reorder_level', type: 'INTEGER', nullable: false, description: 'Reorder level threshold' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Whether product is active' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Product creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Last update timestamp' },
    ],
    sampleData: [
      { id: 3001, sku: 'ELEC-001', name: 'Wireless Bluetooth Headphones', description: 'High-quality wireless headphones with noise cancellation', category_id: 1, brand: 'TechSound', price: 129.99, cost: 65.00, weight: 0.75, dimensions: '7x6x3', stock_quantity: 150, reorder_level: 25, is_active: true, created_at: '2023-06-01 10:00:00', updated_at: '2024-01-10 14:30:00' },
      { id: 3002, sku: 'ELEC-002', name: 'Smartphone Case', description: 'Protective case for latest smartphone models', category_id: 1, brand: 'GuardTech', price: 24.99, cost: 8.50, weight: 0.25, dimensions: '6x3x0.5', stock_quantity: 300, reorder_level: 50, is_active: true, created_at: '2023-06-15 11:30:00', updated_at: '2024-01-08 09:15:00' },
      { id: 3003, sku: 'HOME-001', name: 'Coffee Maker', description: 'Programmable 12-cup coffee maker with thermal carafe', category_id: 2, brand: 'BrewMaster', price: 89.99, cost: 45.00, weight: 8.5, dimensions: '12x8x14', stock_quantity: 75, reorder_level: 15, is_active: true, created_at: '2023-07-01 09:00:00', updated_at: '2024-01-12 16:45:00' },
      { id: 3004, sku: 'CLOTH-001', name: 'Cotton T-Shirt', description: '100% cotton comfortable t-shirt in various colors', category_id: 3, brand: 'ComfortWear', price: 19.99, cost: 7.50, weight: 0.5, dimensions: '12x8x1', stock_quantity: 500, reorder_level: 100, is_active: true, created_at: '2023-07-15 14:20:00', updated_at: '2024-01-05 11:20:00' },
      { id: 3005, sku: 'BOOK-001', name: 'Data Science Handbook', description: 'Comprehensive guide to data science and analytics', category_id: 4, brand: 'TechBooks', price: 49.99, cost: 20.00, weight: 2.0, dimensions: '9x7x1.5', stock_quantity: 120, reorder_level: 20, is_active: true, created_at: '2023-08-01 08:45:00', updated_at: '2024-01-09 13:10:00' },
    ]
  },
  {
    name: 'order_items',
    columns: [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Unique order item identifier' },
      { name: 'order_id', type: 'INTEGER', nullable: false, foreignKey: true, description: 'Reference to order' },
      { name: 'product_id', type: 'INTEGER', nullable: false, foreignKey: true, description: 'Reference to product' },
      { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Quantity ordered' },
      { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false, description: 'Price per unit at time of order' },
      { name: 'discount_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Discount applied to this item' },
      { name: 'line_total', type: 'DECIMAL(10,2)', nullable: false, description: 'Total for this line item' },
    ],
    sampleData: [
      { id: 4001, order_id: 2001, product_id: 3001, quantity: 1, unit_price: 129.99, discount_amount: 0.00, line_total: 129.99 },
      { id: 4002, order_id: 2001, product_id: 3002, quantity: 2, unit_price: 24.99, discount_amount: 5.00, line_total: 44.98 },
      { id: 4003, order_id: 2002, product_id: 3003, quantity: 1, unit_price: 89.99, discount_amount: 10.00, line_total: 79.99 },
      { id: 4004, order_id: 2003, product_id: 3004, quantity: 3, unit_price: 19.99, discount_amount: 0.00, line_total: 59.97 },
      { id: 4005, order_id: 2004, product_id: 3005, quantity: 2, unit_price: 49.99, discount_amount: 0.00, line_total: 99.98 },
      { id: 4006, order_id: 2005, product_id: 3001, quantity: 2, unit_price: 129.99, discount_amount: 20.00, line_total: 239.98 },
    ]
  },
  {
    name: 'categories',
    columns: [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Unique category identifier' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false, description: 'Category name' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Category description' },
      { name: 'parent_id', type: 'INTEGER', nullable: true, foreignKey: true, description: 'Parent category (for hierarchical categories)' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Whether category is active' },
    ],
    sampleData: [
      { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', parent_id: null, is_active: true },
      { id: 2, name: 'Home & Kitchen', description: 'Home appliances and kitchen items', parent_id: null, is_active: true },
      { id: 3, name: 'Clothing', description: 'Apparel and fashion items', parent_id: null, is_active: true },
      { id: 4, name: 'Books', description: 'Books and educational materials', parent_id: null, is_active: true },
      { id: 5, name: 'Sports', description: 'Sports and outdoor equipment', parent_id: null, is_active: true },
    ]
  }
];

export const sigmaComputingFunctions = [
  {
    category: 'Aggregation',
    functions: [
      { name: 'SUM', syntax: 'SUM([Column])', description: 'Returns the sum of all values in a column', example: 'SUM([Sales Amount])' },
      { name: 'AVG', syntax: 'AVG([Column])', description: 'Returns the average of all values in a column', example: 'AVG([Order Value])' },
      { name: 'COUNT', syntax: 'COUNT([Column])', description: 'Returns the count of non-null values', example: 'COUNT([Customer ID])' },
      { name: 'COUNT DISTINCT', syntax: 'COUNT(DISTINCT [Column])', description: 'Returns the count of unique values', example: 'COUNT(DISTINCT [Customer ID])' },
      { name: 'MAX', syntax: 'MAX([Column])', description: 'Returns the maximum value in a column', example: 'MAX([Order Date])' },
      { name: 'MIN', syntax: 'MIN([Column])', description: 'Returns the minimum value in a column', example: 'MIN([Order Date])' },
      { name: 'MEDIAN', syntax: 'MEDIAN([Column])', description: 'Returns the median value', example: 'MEDIAN([Sales Amount])' },
      { name: 'PERCENTILE', syntax: 'PERCENTILE([Column], percentile)', description: 'Returns the specified percentile', example: 'PERCENTILE([Sales Amount], 0.95)' },
      { name: 'STDDEV', syntax: 'STDDEV([Column])', description: 'Returns the standard deviation', example: 'STDDEV([Sales Amount])' },
      { name: 'VARIANCE', syntax: 'VARIANCE([Column])', description: 'Returns the variance', example: 'VARIANCE([Sales Amount])' },
    ]
  },
  {
    category: 'Mathematical',
    functions: [
      { name: 'ABS', syntax: 'ABS(number)', description: 'Returns the absolute value', example: 'ABS([Profit Margin])' },
      { name: 'ROUND', syntax: 'ROUND(number, decimals)', description: 'Rounds to specified decimal places', example: 'ROUND([Price], 2)' },
      { name: 'CEIL', syntax: 'CEIL(number)', description: 'Rounds up to nearest integer', example: 'CEIL([Quantity])' },
      { name: 'FLOOR', syntax: 'FLOOR(number)', description: 'Rounds down to nearest integer', example: 'FLOOR([Discount Rate])' },
      { name: 'POWER', syntax: 'POWER(base, exponent)', description: 'Returns base raised to exponent', example: 'POWER([Growth Rate], 2)' },
      { name: 'SQRT', syntax: 'SQRT(number)', description: 'Returns the square root', example: 'SQRT([Area])' },
      { name: 'LOG', syntax: 'LOG(number)', description: 'Returns the natural logarithm', example: 'LOG([Revenue])' },
      { name: 'EXP', syntax: 'EXP(number)', description: 'Returns e raised to the power', example: 'EXP([Growth Rate])' },
    ]
  },
  {
    category: 'Text',
    functions: [
      { name: 'CONCAT', syntax: 'CONCAT(text1, text2, ...)', description: 'Concatenates text strings', example: 'CONCAT([First Name], " ", [Last Name])' },
      { name: 'UPPER', syntax: 'UPPER(text)', description: 'Converts to uppercase', example: 'UPPER([Product Name])' },
      { name: 'LOWER', syntax: 'LOWER(text)', description: 'Converts to lowercase', example: 'LOWER([Email])' },
      { name: 'LENGTH', syntax: 'LENGTH(text)', description: 'Returns the length of text', example: 'LENGTH([Description])' },
      { name: 'LEFT', syntax: 'LEFT(text, num_chars)', description: 'Returns leftmost characters', example: 'LEFT([Product Code], 3)' },
      { name: 'RIGHT', syntax: 'RIGHT(text, num_chars)', description: 'Returns rightmost characters', example: 'RIGHT([Phone], 4)' },
      { name: 'SUBSTRING', syntax: 'SUBSTRING(text, start, length)', description: 'Returns substring', example: 'SUBSTRING([SKU], 1, 4)' },
      { name: 'TRIM', syntax: 'TRIM(text)', description: 'Removes leading/trailing spaces', example: 'TRIM([Customer Name])' },
      { name: 'REPLACE', syntax: 'REPLACE(text, old, new)', description: 'Replaces text', example: 'REPLACE([Phone], "-", "")' },
    ]
  },
  {
    category: 'Date & Time',
    functions: [
      { name: 'NOW', syntax: 'NOW()', description: 'Returns current date and time', example: 'NOW()' },
      { name: 'TODAY', syntax: 'TODAY()', description: 'Returns current date', example: 'TODAY()' },
      { name: 'YEAR', syntax: 'YEAR(date)', description: 'Extracts year from date', example: 'YEAR([Order Date])' },
      { name: 'MONTH', syntax: 'MONTH(date)', description: 'Extracts month from date', example: 'MONTH([Order Date])' },
      { name: 'DAY', syntax: 'DAY(date)', description: 'Extracts day from date', example: 'DAY([Order Date])' },
      { name: 'WEEKDAY', syntax: 'WEEKDAY(date)', description: 'Returns day of week (1-7)', example: 'WEEKDAY([Order Date])' },
      { name: 'QUARTER', syntax: 'QUARTER(date)', description: 'Returns quarter (1-4)', example: 'QUARTER([Order Date])' },
      { name: 'DATE_ADD', syntax: 'DATE_ADD(date, interval, unit)', description: 'Adds time interval to date', example: 'DATE_ADD([Order Date], 30, "day")' },
      { name: 'DATE_DIFF', syntax: 'DATE_DIFF(date1, date2, unit)', description: 'Returns difference between dates', example: 'DATE_DIFF([Ship Date], [Order Date], "day")' },
      { name: 'DATE_TRUNC', syntax: 'DATE_TRUNC(date, unit)', description: 'Truncates date to specified unit', example: 'DATE_TRUNC([Order Date], "month")' },
    ]
  },
  {
    category: 'Logical',
    functions: [
      { name: 'IF', syntax: 'IF(condition, true_value, false_value)', description: 'Conditional logic', example: 'IF([Sales] > 1000, "High", "Low")' },
      { name: 'CASE', syntax: 'CASE WHEN condition THEN value ... END', description: 'Multiple conditions', example: 'CASE WHEN [Sales] > 1000 THEN "High" WHEN [Sales] > 500 THEN "Medium" ELSE "Low" END' },
      { name: 'COALESCE', syntax: 'COALESCE(value1, value2, ...)', description: 'Returns first non-null value', example: 'COALESCE([Phone], [Mobile], "No Phone")' },
      { name: 'NULLIF', syntax: 'NULLIF(value1, value2)', description: 'Returns null if values are equal', example: 'NULLIF([Discount], 0)' },
      { name: 'ISNULL', syntax: 'ISNULL(value)', description: 'Checks if value is null', example: 'ISNULL([Ship Date])' },
    ]
  },
  {
    category: 'Window Functions',
    functions: [
      { name: 'ROW_NUMBER', syntax: 'ROW_NUMBER() OVER (ORDER BY column)', description: 'Assigns row numbers', example: 'ROW_NUMBER() OVER (ORDER BY [Sales] DESC)' },
      { name: 'RANK', syntax: 'RANK() OVER (ORDER BY column)', description: 'Assigns ranks with gaps', example: 'RANK() OVER (ORDER BY [Sales] DESC)' },
      { name: 'DENSE_RANK', syntax: 'DENSE_RANK() OVER (ORDER BY column)', description: 'Assigns ranks without gaps', example: 'DENSE_RANK() OVER (ORDER BY [Sales] DESC)' },
      { name: 'LAG', syntax: 'LAG(column, offset) OVER (ORDER BY column)', description: 'Returns previous row value', example: 'LAG([Sales], 1) OVER (ORDER BY [Date])' },
      { name: 'LEAD', syntax: 'LEAD(column, offset) OVER (ORDER BY column)', description: 'Returns next row value', example: 'LEAD([Sales], 1) OVER (ORDER BY [Date])' },
      { name: 'RUNNING_SUM', syntax: 'SUM(column) OVER (ORDER BY column)', description: 'Running sum', example: 'SUM([Sales]) OVER (ORDER BY [Date])' },
    ]
  }
];

export const businessMetricTemplates = [
  {
    category: 'Revenue Metrics',
    metrics: [
      { name: 'Total Revenue', formula: 'SUM([orders.total_amount])', format: 'currency' },
      { name: 'Monthly Recurring Revenue', formula: 'SUM([subscriptions.monthly_amount])', format: 'currency' },
      { name: 'Average Order Value', formula: 'AVG([orders.total_amount])', format: 'currency' },
      { name: 'Revenue Growth Rate', formula: '(SUM([orders.total_amount]) - LAG(SUM([orders.total_amount]), 1)) / LAG(SUM([orders.total_amount]), 1) * 100', format: 'percentage' },
      { name: 'Revenue per Customer', formula: 'SUM([orders.total_amount]) / COUNT(DISTINCT [customers.id])', format: 'currency' },
    ]
  },
  {
    category: 'Customer Metrics',
    metrics: [
      { name: 'Total Customers', formula: 'COUNT(DISTINCT [customers.id])', format: 'number' },
      { name: 'New Customers', formula: 'COUNT(DISTINCT [customers.id]) WHERE [customers.created_at] >= DATE_SUB(NOW(), INTERVAL 1 MONTH)', format: 'number' },
      { name: 'Customer Retention Rate', formula: '(COUNT(DISTINCT [repeat_customers.id]) / COUNT(DISTINCT [customers.id])) * 100', format: 'percentage' },
      { name: 'Customer Lifetime Value', formula: 'AVG([orders.total_amount]) * AVG([customer_order_count]) * AVG([customer_lifespan_months])', format: 'currency' },
      { name: 'Churn Rate', formula: '(COUNT([churned_customers]) / COUNT([total_customers])) * 100', format: 'percentage' },
    ]
  },
  {
    category: 'Product Metrics',
    metrics: [
      { name: 'Total Products Sold', formula: 'SUM([order_items.quantity])', format: 'number' },
      { name: 'Top Selling Product', formula: 'MAX([products.name]) WHERE [order_items.quantity] = MAX([order_items.quantity])', format: 'text' },
      { name: 'Average Items per Order', formula: 'AVG([order_items.quantity])', format: 'number' },
      { name: 'Product Return Rate', formula: '(COUNT([returns.id]) / COUNT([order_items.id])) * 100', format: 'percentage' },
      { name: 'Inventory Turnover', formula: 'SUM([order_items.quantity]) / AVG([products.stock_quantity])', format: 'ratio' },
    ]
  },
  {
    category: 'Operational Metrics',
    metrics: [
      { name: 'Order Fulfillment Time', formula: 'AVG(DATE_DIFF([orders.ship_date], [orders.order_date], "day"))', format: 'number' },
      { name: 'Order Accuracy Rate', formula: '(COUNT([orders.id]) - COUNT([order_errors.id])) / COUNT([orders.id]) * 100', format: 'percentage' },
      { name: 'Customer Support Response Time', formula: 'AVG(DATE_DIFF([support_tickets.first_response], [support_tickets.created_at], "hour"))', format: 'number' },
      { name: 'Website Conversion Rate', formula: '(COUNT([orders.id]) / COUNT([website_sessions.id])) * 100', format: 'percentage' },
      { name: 'Cart Abandonment Rate', formula: '(COUNT([abandoned_carts.id]) / COUNT([cart_sessions.id])) * 100', format: 'percentage' },
    ]
  }
];
