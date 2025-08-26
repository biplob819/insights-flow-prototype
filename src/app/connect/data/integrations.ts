export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  iconBg: string;
}

export interface Category {
  name: string;
  count: number;
}

export const integrations: Integration[] = [
  // Project Management
  {
    id: 'accelo',
    name: 'Accelo',
    description: 'Accelo is a service operations automation tool for businesses. Our data connector streamlines the extraction of Accelo data, giving users visibility into sales, tickets, time tracking, and billing.',
    category: 'Project Management',
    icon: '⚡',
    iconBg: 'bg-orange-500',
  },

  // CRM & ERP
  {
    id: 'act-crm',
    name: 'Act CRM',
    description: 'Act CRM is a customer relationship management tool for tracking and managing customer interactions. Our connector facilitates easy Act CRM integration, boosting data visibility for improved customer service.',
    category: 'CRM & ERP',
    icon: '🔴',
    iconBg: 'bg-red-500',
  },
  {
    id: 'acumatica',
    name: 'Acumatica',
    description: 'Acumatica is a cloud-based ERP solution for business management. Peaka\'s dedicated connector simplifies Acumatica integration, leading to efficient data analysis and deeper business insights.',
    category: 'CRM & ERP',
    icon: '🔵',
    iconBg: 'bg-blue-500',
  },
  {
    id: 'agilecrm',
    name: 'AgileCRM',
    description: 'AgileCRM is a versatile platform for customer relationship management. This dedicated connector provides easy integration with AgileCRM and streamlined data access for better customer engagement.',
    category: 'CRM & ERP',
    icon: '☁️',
    iconBg: 'bg-sky-500',
  },

  // Marketing
  {
    id: 'act-on',
    name: 'Act-On',
    description: 'Act-On is a marketing automation platform that optimizes customer engagement. Peaka\'s new connector simplifies data integration with Act-On, enhancing campaign analysis and marketing effectiveness.',
    category: 'Marketing',
    icon: '🟡',
    iconBg: 'bg-yellow-500',
  },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Active Campaign is a comprehensive marketing and CRM platform. Our data connector facilitates easy integration with Active Campaign, improving your data analysis capability and customer engagement.',
    category: 'Marketing',
    icon: '▶️',
    iconBg: 'bg-blue-600',
  },
  {
    id: 'adroll',
    name: 'AdRoll',
    description: 'AdRoll is a marketing platform specializing in retargeting strategies. Peaka\'s new connector simplifies AdRoll integration, enhancing ad performance tracking and optimizing marketing engagement.',
    category: 'Marketing',
    icon: '🔵',
    iconBg: 'bg-cyan-500',
  },
  {
    id: 'adobe-analytics',
    name: 'Adobe Analytics',
    description: 'Adobe Analytics offers comprehensive data analysis and reporting. With our connector, users can seamlessly integrate with Adobe Analytics, enriching the customer stories at hand for actionable insights.',
    category: 'Marketing',
    icon: '⭕',
    iconBg: 'bg-slate-700',
  },

  // Collaboration
  {
    id: 'active-directory',
    name: 'Active Directory',
    description: 'Active Directory is a Microsoft service for managing network resources and user access. Our new connector will help streamline your Active Directory integration, ensuring secure and efficient user management.',
    category: 'Collaboration',
    icon: '💎',
    iconBg: 'bg-blue-600',
  },

  // E-Commerce
  {
    id: 'adobe-commerce',
    name: 'Adobe Commerce',
    description: 'Adobe Commerce is a platform that supports online sales and operations. Our data connector enables easy Adobe Commerce integration, fostering better sales data analysis and operations management.',
    category: 'E-Commerce',
    icon: '🔺',
    iconBg: 'bg-red-600',
  },

  // Finance
  {
    id: 'adp',
    name: 'ADP',
    description: 'ADP is a leader in human resources management software. With our new data connector, you can effortlessly retrieve your ADP data, fostering improved workforce insights and strategic HR decisions.',
    category: 'Finance',
    icon: '🔴',
    iconBg: 'bg-red-500',
  },

  // Specialized Services
  {
    id: 'aftership',
    name: 'AfterShip',
    description: 'AfterShip is a shipment tracking platform that enhances customer experience. Our connector allows for easy AfterShip integration, improving the management of shipment data and boosting customer satisfaction.',
    category: 'Specialized Services',
    icon: '📦',
    iconBg: 'bg-orange-500',
  },

  // Additional Database Integrations
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'PostgreSQL is a powerful, open source object-relational database system. Our connector provides seamless integration for advanced data analytics and reporting.',
    category: 'Database',
    icon: '🐘',
    iconBg: 'bg-blue-700',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'MySQL is one of the most popular relational database management systems. Connect easily to unlock powerful data insights and analytics.',
    category: 'Database',
    icon: '🐬',
    iconBg: 'bg-orange-600',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'MongoDB is a document database with the scalability and flexibility for modern applications. Integrate seamlessly for comprehensive data analysis.',
    category: 'Database',
    icon: '🍃',
    iconBg: 'bg-green-600',
  },

  // Additional Marketing Tools
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'HubSpot is an inbound marketing, sales, and service software that helps companies attract visitors, convert leads, and close customers.',
    category: 'Marketing',
    icon: '🧡',
    iconBg: 'bg-orange-500',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Mailchimp is an all-in-one marketing platform for small businesses to grow their audience, engage customers, and build their brand.',
    category: 'Marketing',
    icon: '🐵',
    iconBg: 'bg-yellow-500',
  },

  // Collaboration Tools
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack is where work flows. It\'s where the people you need, the information you share, and the tools you use come together to get things done.',
    category: 'Collaboration',
    icon: '💬',
    iconBg: 'bg-purple-600',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Microsoft Teams is a unified communication and collaboration platform that combines workplace chat, meetings, calling, and files.',
    category: 'Collaboration',
    icon: '👥',
    iconBg: 'bg-blue-600',
  },

  // E-Commerce Platforms
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Shopify is a commerce platform that allows anyone to set up an online store and sell their products. Connect for comprehensive sales analytics.',
    category: 'E-Commerce',
    icon: '🛍️',
    iconBg: 'bg-green-500',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'WooCommerce is an open-source e-commerce plugin for WordPress. Integrate easily to track sales, inventory, and customer data.',
    category: 'E-Commerce',
    icon: '🏪',
    iconBg: 'bg-purple-500',
  },
];

export const categories: Category[] = [
  { name: 'All Integrations', count: 324 },
  { name: 'Most Popular', count: 71 },
  { name: 'Recently Added', count: 71 },
  { name: 'Early Access', count: 253 },
  { name: 'CRM & ERP', count: 60 },
  { name: 'Database', count: 57 },
  { name: 'Marketing', count: 49 },
  { name: 'Finance', count: 38 },
  { name: 'Collaboration', count: 32 },
  { name: 'Specialized Services', count: 32 },
  { name: 'Project Management', count: 22 },
  { name: 'E-Commerce', count: 18 },
  { name: 'HR & Legal', count: 10 },
  { name: 'Customer Services', count: 6 },
];
