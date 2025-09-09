'use client';

import { 
  Plus, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Target, 
  PieChart 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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

export default function DashboardGrid() {
  const router = useRouter();
  
  const handleCardClick = (templateId: string) => {
    if (templateId === 'create') {
      router.push('/dashboard/create');
    } else {
      console.log(`Clicked on template: ${templateId}`);
      // Handle other template clicks here
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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
  );
}
