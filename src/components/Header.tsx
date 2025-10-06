'use client';

import { Search, Bell, Menu, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export default function Header({ onToggleChat, isChatOpen }: HeaderProps = {}) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu & Welcome Message */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 mr-3">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Welcome Biplob</h1>
            <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Create and manage your dashboards</p>
          </div>
        </div>

        {/* Right Side - Search and Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Dashboards..."
              className="pl-10 pr-4 py-2 w-48 sm:w-60 lg:w-80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Chat Toggle */}
          {onToggleChat && (
            <button 
              onClick={onToggleChat}
              className={`relative p-2 rounded-lg transition-colors ${
                isChatOpen 
                  ? 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {/* Notification badge for unread comments */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">3</span>
              </div>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <span className="text-slate-700 font-medium hidden sm:block">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
