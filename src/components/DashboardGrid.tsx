'use client';

import { 
  Plus, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Target, 
  PieChart,
  ChevronDown,
  Filter,
  SortAsc,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DashboardCard from './DashboardCard';

const dashboardTemplates = [
  {
    id: 'create',
    title: 'Create a Dashboard',
    description: 'Start from scratch and build your custom dashboard',
    icon: Plus,
    iconColor: 'text-cyan-600',
    iconBgColor: 'bg-cyan-100',
    isTemplate: false,
    isCreateCard: true
  },
  {
    id: 'sales-pipeline',
    title: 'Sales Pipeline',
    description: 'Track your sales performance, conversion rates, and revenue metrics',
    icon: TrendingUp,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-100',
    isTemplate: true
  },
  {
    id: 'payroll',
    title: 'Payroll Dashboard',
    description: 'Monitor employee costs, benefits, and payroll analytics',
    icon: Users,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100',
    isTemplate: true
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Analytics',
    description: 'Track orders, customer behavior, and product performance',
    icon: ShoppingCart,
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-100',
    isTemplate: true
  },
  {
    id: 'marketing',
    title: 'Marketing KPIs',
    description: 'Monitor campaign performance, ROI, and lead generation',
    icon: Target,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-100',
    isTemplate: true
  },
  {
    id: 'executive',
    title: 'Executive Overview',
    description: 'High-level business metrics and key performance indicators',
    icon: PieChart,
    iconColor: 'text-red-600',
    iconBgColor: 'bg-red-100',
    isTemplate: true
  }
];

const existingDashboards = [
  {
    id: 'dash-1',
    title: 'Sales Performance Q4',
    description: 'Quarterly sales metrics and performance indicators',
    owner: 'John Doe',
    createdBy: 'John Doe',
    lastModified: '2 hours ago',
    lastCreated: '1 week ago',
    isPublic: false,
    isShared: true
  },
  {
    id: 'dash-2', 
    title: 'Marketing Analytics',
    description: 'Campaign performance and lead generation metrics',
    owner: 'Sarah Wilson',
    createdBy: 'Sarah Wilson', 
    lastModified: '1 day ago',
    lastCreated: '3 days ago',
    isPublic: true,
    isShared: true
  },
  {
    id: 'dash-3',
    title: 'Financial Overview',
    description: 'Revenue, expenses, and profit analysis',
    owner: 'Admin',
    createdBy: 'Admin',
    lastModified: '3 hours ago', 
    lastCreated: '5 days ago',
    isPublic: false,
    isShared: false
  }
];

interface DashboardGridProps {
  onCommentOnWidget?: (widgetId: string, widgetTitle: string) => void;
}

export default function DashboardGrid({ onCommentOnWidget }: DashboardGridProps) {
  const router = useRouter();
  const [ownershipFilter, setOwnershipFilter] = useState('owned-by-anyone');
  const [sortBy, setSortBy] = useState('last-modified');
  const currentUser = 'Admin'; // In a real app, this would come from auth context
  
  const handleCardClick = (templateId: string) => {
    if (templateId === 'create') {
      router.push('/dashboard/create');
    } else {
      // Handle other template clicks here
      // TODO: Implement template selection logic
    }
  };

  // Filter dashboards based on ownership
  const filteredDashboards = existingDashboards.filter(dashboard => {
    switch (ownershipFilter) {
      case 'owned-by-me':
        return dashboard.createdBy === currentUser;
      case 'public':
        return dashboard.isPublic;
      case 'owned-by-anyone':
      default:
        return true;
    }
  });

  // Helper function to convert relative time strings to comparable numbers
  const getTimeValue = (timeString: string): number => {
    const now = Date.now();
    const match = timeString.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/);
    
    if (!match) return now; // If can't parse, treat as most recent
    
    const [, amount, unit] = match;
    const num = parseInt(amount);
    
    const multipliers = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };
    
    return now - (num * (multipliers[unit as keyof typeof multipliers] || 0));
  };

  // Sort dashboards
  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetically':
        return a.title.localeCompare(b.title);
      case 'last-created':
        return getTimeValue(a.lastCreated) - getTimeValue(b.lastCreated);
      case 'last-modified':
      default:
        return getTimeValue(a.lastModified) - getTimeValue(b.lastModified);
      case 'popular':
        // For now, just return as-is since we don't have popularity data
        return 0;
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Existing Dashboards Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Dashboards</h2>
          
          <div className="flex items-center space-x-4">
            {/* Ownership Filter */}
            <div className="relative">
              <select
                value={ownershipFilter}
                onChange={(e) => setOwnershipFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="owned-by-anyone">Owned by anyone</option>
                <option value="owned-by-me">Owned by me</option>
                <option value="public">Public</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="last-modified">Last modified</option>
                <option value="alphabetically">Alphabetically</option>
                <option value="last-created">Last created</option>
                <option value="popular">Popular</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedDashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer p-6"
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <PieChart className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dashboard.title}</h3>
                    <p className="text-sm text-gray-600">by {dashboard.owner}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {dashboard.isPublic && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Public
                    </span>
                  )}
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{dashboard.description}</p>
              
              <div className="text-xs text-gray-500">
                Last modified: {dashboard.lastModified}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Start with a Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dashboardTemplates.map((template) => (
            <DashboardCard
              key={template.id}
              title={template.title}
              description={template.description}
              icon={template.icon}
              iconColor={template.iconColor}
              iconBgColor={template.iconBgColor}
              isTemplate={template.isTemplate}
              isCreateCard={template.isCreateCard}
              onClick={() => handleCardClick(template.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
