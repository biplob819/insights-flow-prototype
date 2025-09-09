'use client';

import { 
  Home, 
  Plug, 
  Database, 
  BarChart3, 
  Workflow, 
  FileText, 
  HelpCircle,
  ChevronDown,
  Activity,
  Plus,
  Eye
} from 'lucide-react';

const navigationItems = [
  { name: 'Create', icon: Plus, href: '/', active: true },
  { name: 'Modeling', icon: Plug, href: '/connect', active: false },
  { name: 'Views', icon: Eye, href: '/connect/datasets', active: false },
  { name: 'Analytics', icon: BarChart3, href: '/analytics', active: false },
  { name: 'Workflows', icon: Workflow, href: '/workflows', active: false },
  { name: 'Docs', icon: FileText, href: '/docs', active: false },
  { name: 'Support', icon: HelpCircle, href: '/support', active: false },
];

export default function Sidebar() {
  return (
    <div className="w-64 lg:w-64 md:w-56 bg-slate-900 h-screen flex flex-col hidden md:flex">
      {/* Logo/Brand */}
      <div className="flex items-center px-6 py-4 border-b border-slate-800">
        <Activity className="w-6 h-6 text-cyan-400 mr-3" />
        <span className="text-white text-lg font-semibold">Insights Flow</span>
        <button className="ml-auto">
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-cyan-400 text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Organization Selector */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-300 text-sm font-medium mr-3">
              A
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-medium">Acme Corp</div>
              <div className="text-slate-400 text-xs">Select Organization</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
