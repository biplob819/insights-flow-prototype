'use client';

import Sidebar from '@/components/Sidebar';
import { Search, Grid3X3, List, Bell, Menu } from 'lucide-react';
import IntegrationCard from './components/IntegrationCard';
import CategoryFilter from './components/CategoryFilter';
import { integrations, categories } from './data/integrations';
import { useState } from 'react';

export default function ConnectPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Integrations');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Integrations' || 
                           integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header matching Homepage */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu & Title */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 mr-3">
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Data Source Catalog</h1>
                <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Select and connect to all your Data Sources</p>
              </div>
            </div>

            {/* Right Side - Search and Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Connectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 sm:w-60 lg:w-80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                />
              </div>

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
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-full">
            <div className="flex gap-8 h-full">
              {/* Category Filter Sidebar - Made Scrollable */}
              <div className="w-64 flex-shrink-0 h-full overflow-y-auto">
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>
              
              {/* Integrations Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Controls Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {selectedCategory}
                      </h2>
                      <span className="text-slate-600 text-sm font-medium">
                        {filteredIntegrations.length} connectors
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* View Mode Toggle */}
                      <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 transition-colors ${
                            viewMode === 'grid' 
                              ? 'bg-cyan-500 text-white' 
                              : 'bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 transition-colors ${
                            viewMode === 'list' 
                              ? 'bg-cyan-500 text-white' 
                              : 'bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Integrations Grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredIntegrations.map((integration) => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  <div className="flex justify-center mt-12">
                    <button className="px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors shadow-sm font-medium">
                      Load More Connectors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
