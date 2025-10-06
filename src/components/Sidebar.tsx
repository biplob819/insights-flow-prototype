'use client';

import { 
  Plug, 
  Database, 
  BarChart3, 
  Workflow, 
  FileText, 
  HelpCircle,
  ChevronDown,
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Building,
  User,
  ChevronUp,
  Eye
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const navigationItems = [
  { name: 'Create', icon: Plus, href: '/' },
  { 
    name: 'Modeling', 
    icon: Plug, 
    href: '/connect',
    hasSubmenu: true,
    submenu: [
      { name: 'Data Catalog', icon: Plug, href: '/connect' },
      { name: 'Data Modeling', icon: Database, href: '/connect/data-modeling' },
    ]
  },
  { name: 'Views', icon: Eye, href: '/connect/datasets' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Workflows', icon: Workflow, href: '/workflows' },
  { 
    name: 'Settings', 
    icon: Settings, 
    href: '#',
    hasSubmenu: true,
    submenu: [
      { name: 'Organization Settings', icon: Building, href: '/settings/organization' },
      { name: 'User Settings', icon: User, href: '/settings/user' },
    ]
  },
  { name: 'Docs', icon: FileText, href: '/docs' },
  { name: 'Support', icon: HelpCircle, href: '/support' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64 lg:w-64 md:w-56'} bg-slate-900 h-screen flex flex-col hidden md:flex transition-all duration-300 relative`}>
      {/* Logo/Brand */}
      <div className={`flex items-center border-b border-slate-800 relative ${isCollapsed ? 'px-4 py-4 justify-center' : 'px-6 py-4'}`}>
        <Activity className={`w-6 h-6 text-cyan-400 ${isCollapsed ? '' : 'mr-3'}`} />
        {!isCollapsed && (
          <>
            <span className="text-white text-lg font-semibold">Insights Flow</span>
            <button 
              onClick={() => setIsCollapsed(true)}
              className="ml-auto hover:bg-slate-800 rounded p-1 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </>
        )}
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 rounded-full p-1.5 transition-colors shadow-lg z-10"
            title="Expand sidebar"
          >
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const hasSubmenu = 'hasSubmenu' in item && item.hasSubmenu;
            const isExpanded = expandedMenus[item.name] || false;
            
            // For items with submenu, check if any submenu item is active
            const hasActiveSubmenu = hasSubmenu && item.submenu && item.submenu.some(subItem => pathname === subItem.href);
            
            // Keep submenu expanded if any submenu item is active or manually expanded
            const shouldShowSubmenu = isExpanded || hasActiveSubmenu;
            
            return (
              <li key={item.name}>
                {hasSubmenu ? (
                  <div>
                    {/* Main menu item with submenu */}
                    <button
                      onClick={() => !isCollapsed && toggleSubmenu(item.name)}
                      className={`flex items-center w-full rounded-lg text-sm font-medium transition-colors relative group ${
                        isCollapsed ? 'px-4 py-4 justify-center' : 'px-4 py-3 justify-between'
                      } ${
                        hasActiveSubmenu
                          ? 'bg-cyan-400 text-slate-900'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <div className="flex items-center">
                        <Icon className={`w-5 h-5 ${isCollapsed ? 'flex-shrink-0' : 'mr-3'}`} />
                        {!isCollapsed && item.name}
                      </div>
                      {!isCollapsed && (
                        <div className="ml-auto">
                          {shouldShowSubmenu ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      )}
                      
                      {/* Custom Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                          {item.name}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
                        </div>
                      )}
                    </button>
                    
                    {/* Submenu items */}
                    {!isCollapsed && shouldShowSubmenu && item.submenu && (
                      <ul className="mt-2 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;
                          return (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className={`flex items-center px-4 py-2 ml-6 rounded-lg text-sm font-medium transition-colors ${
                                  isSubActive
                                    ? 'bg-cyan-400 text-slate-900'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                <SubIcon className="w-4 h-4 mr-3" />
                                {subItem.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  /* Regular menu item */
                  <a
                    href={item.href}
                    className={`flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                      isCollapsed ? 'px-4 py-4 justify-center' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-cyan-400 text-slate-900'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 ${isCollapsed ? 'flex-shrink-0' : 'mr-3'}`} />
                    {!isCollapsed && item.name}
                    
                    {/* Custom Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
                      </div>
                    )}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Organization Selector */}
      <div className="px-4 py-4 border-t border-slate-800 relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowOrgDropdown(!showOrgDropdown)}
          className={`flex items-center w-full rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors relative group ${
            isCollapsed ? 'px-4 py-4 justify-center' : 'px-4 py-3 justify-between'
          }`}
          title={isCollapsed ? 'Biplob Corp - Select Organization' : undefined}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-300 text-sm font-medium ${isCollapsed ? 'flex-shrink-0' : 'mr-3'}`}>
              B
            </div>
            {!isCollapsed && (
              <div className="text-left">
                <div className="text-white text-sm font-medium">Biplob Corp</div>
                <div className="text-slate-400 text-xs">Select Organization</div>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronDown className="w-4 h-4 text-slate-400" />}
          
          {/* Custom Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              Biplob Corp
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
            </div>
          )}
        </button>

        {/* Organization Dropdown */}
        {showOrgDropdown && !isCollapsed && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">
            {/* Current Organization */}
            <div className="px-4 py-2 text-slate-300 border-b border-slate-700 mb-1">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-slate-300 text-xs font-medium mr-2">
                  B
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Biplob Corp</div>
                  <div className="text-slate-400 text-xs">Current</div>
                </div>
              </div>
            </div>
            
            {/* Other Organizations */}
            <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-slate-300 text-xs font-medium mr-2">
                  A
                </div>
                <div>
                  <div className="text-white text-sm">Acme Corp</div>
                </div>
              </div>
            </button>
            
            {/* Create Organization */}
            <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors border-t border-slate-700 mt-1 pt-3">
              <div className="flex items-center">
                <Plus className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-cyan-400 text-sm font-medium">Create Organization</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
