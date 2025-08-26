'use client';

import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  isTemplate?: boolean;
  isCreateCard?: boolean;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  isTemplate = false,
  isCreateCard = false,
  onClick
}: DashboardCardProps) {
  return (
    <div 
      className={`
        relative p-6 rounded-lg border transition-all cursor-pointer
        ${isCreateCard 
          ? 'border-2 border-dashed border-slate-300 hover:border-cyan-400 bg-white' 
          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
        }
      `}
      onClick={onClick}
    >
      {/* Template Label */}
      {isTemplate && (
        <div className="absolute top-4 right-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
            Template
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
