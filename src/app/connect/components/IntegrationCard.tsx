'use client';

import { Integration } from '../data/integrations';

interface IntegrationCardProps {
  integration: Integration;
  viewMode?: 'grid' | 'list';
}

const categoryColors: Record<string, string> = {
  'Project Management': 'bg-slate-100 text-slate-600',
  'CRM & ERP': 'bg-slate-100 text-slate-600',
  'Marketing': 'bg-slate-100 text-slate-600',
  'Collaboration': 'bg-slate-100 text-slate-600',
  'E-Commerce': 'bg-slate-100 text-slate-600',
  'Finance': 'bg-slate-100 text-slate-600',
  'Specialized Services': 'bg-slate-100 text-slate-600',
  'Database': 'bg-slate-100 text-slate-600',
  'HR & Legal': 'bg-slate-100 text-slate-600',
  'Customer Services': 'bg-slate-100 text-slate-600',
};

export default function IntegrationCard({ integration, viewMode = 'grid' }: IntegrationCardProps) {
  const categoryColor = categoryColors[integration.category] || 'bg-slate-100 text-slate-700';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-6">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 ${integration.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-semibold text-lg">
              {integration.icon}
            </span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-lg">{integration.name}</h3>
              <div className={`${categoryColor} text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-3`}>
                {integration.category}
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
              {integration.description}
            </p>
          </div>
          
          {/* Connect Button */}
          <div className="flex-shrink-0 ml-4">
            <button className="relative px-6 py-2 bg-gradient-to-br from-cyan-100/80 via-cyan-200/90 to-cyan-300/80 hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800 border border-cyan-200/60 hover:border-cyan-700/80 text-cyan-800 hover:text-white rounded-lg transition-all duration-500 font-medium backdrop-blur-md hover:backdrop-blur-lg hover:scale-[1.02] overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-6 group">
      {/* Header with Icon and Category */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <div className={`w-12 h-12 ${integration.iconBg} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
            <span className="text-white font-semibold text-lg">
              {integration.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-lg truncate">{integration.name}</h3>
          </div>
        </div>
        <div className={`${categoryColor} text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-2`}>
          {integration.category}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
        {integration.description}
      </p>

      {/* Connect Button */}
      <button className="relative w-full py-2.5 px-4 bg-gradient-to-br from-cyan-100/80 via-cyan-200/90 to-cyan-300/80 hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800 border border-cyan-200/60 hover:border-cyan-700/80 text-cyan-800 hover:text-white rounded-lg transition-all duration-500 font-medium backdrop-blur-md hover:backdrop-blur-lg hover:scale-[1.02] overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
        Connect
      </button>
    </div>
  );
}
