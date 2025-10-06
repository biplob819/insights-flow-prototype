'use client';

import Sidebar from '@/components/Sidebar';
import { Search, Bell, Menu, Database, Table, Save, Download, Eye, Code, Calculator } from 'lucide-react';
import { useState } from 'react';
import DataSourcePanel from './components/DataSourcePanel';
import LogicalDataModel from './components/LogicalDataModel';
import ViewTab from './components/ViewTab';
import MetricsTab from './components/MetricsTab';
import SQLQueryBuilder from './components/SQLQueryBuilder';

export default function DataModelingPage() {
  const [activeTab, setActiveTab] = useState<'sources' | 'model' | 'view' | 'metrics'>('sources');
  const [showSQLBuilder, setShowSQLBuilder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success notification
    alert('Data model saved successfully!');
  };

  const handleExport = () => {
    // Create a simple export functionality
    const exportData = {
      activeTab,
      timestamp: new Date().toISOString(),
      modelName: 'Data Model Export'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'data-model-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { id: 'sources', name: 'Data Sources', icon: Database },
    { id: 'model', name: 'Logical Model', icon: Table },
    { id: 'view', name: 'View', icon: Eye },
    { id: 'metrics', name: 'Metrics', icon: Calculator },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu & Title */}
            <div className="flex items-center">
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 mr-3">
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Data Modeling</h1>
                <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Build and manage your data models with drag-and-drop interface</p>
              </div>
            </div>

            {/* Right Side - Actions and Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleExport}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button 
                  onClick={() => setShowSQLBuilder(true)}
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
                >
                  <Code className="w-4 h-4 mr-2" />
                  SQL Builder
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-60 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
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

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'sources' | 'model' | 'view' | 'metrics')}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          {activeTab === 'sources' && <DataSourcePanel />}
          {activeTab === 'model' && <LogicalDataModel />}
          {activeTab === 'view' && <ViewTab />}
          {activeTab === 'metrics' && <MetricsTab />}
        </main>

        {/* SQL Query Builder Modal */}
        <SQLQueryBuilder
          isOpen={showSQLBuilder}
          onClose={() => setShowSQLBuilder(false)}
          tables={['customers', 'orders', 'products', 'order_items', 'categories']}
        />
      </div>
    </div>
  );
}
