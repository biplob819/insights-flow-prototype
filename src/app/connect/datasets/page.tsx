'use client';

import Sidebar from '@/components/Sidebar';
import { Search, Bell, Menu, Database, Calendar, Users, TrendingUp, Grid3X3, List, MoreVertical, Eye, Trash2, Download, Share, AlertTriangle, X, UserCheck, Globe } from 'lucide-react';
import { useState } from 'react';
import { formatNumber } from '@/utils/formatters';

interface View {
  id: string;
  name: string;
  description: string;
  source: string;
  recordCount: number;
  columns: number;
  lastUpdated: string;
  owner: string;
  status: 'draft' | 'published' | 'deprecated';
  tags: string[];
  size: string;
  isShared: boolean;
  createdBy: string;
}

export default function ViewsPage() {
  const [views] = useState<View[]>([
    {
      id: '1',
      name: 'Customer Analytics View',
      description: 'Comprehensive customer data including demographics, purchase history, and behavioral metrics',
      source: 'Sales Database + CRM',
      recordCount: 125000,
      columns: 28,
      lastUpdated: '2 hours ago',
      owner: 'Sarah Wilson',
      status: 'published',
      tags: ['customers', 'analytics', 'sales'],
      size: '45.2 MB',
      isShared: true,
      createdBy: 'Sarah Wilson'
    },
    {
      id: '2',
      name: 'Product Performance Metrics',
      description: 'Product sales data, inventory levels, and performance indicators across all categories',
      source: 'Inventory System',
      recordCount: 8500,
      columns: 15,
      lastUpdated: '1 day ago',
      owner: 'Admin',
      status: 'published',
      tags: ['products', 'inventory', 'performance'],
      size: '12.8 MB',
      isShared: false,
      createdBy: 'Admin'
    },
    {
      id: '3',
      name: 'Marketing Campaign Results',
      description: 'Campaign performance data including impressions, clicks, conversions, and ROI metrics',
      source: 'Marketing Automation',
      recordCount: 45000,
      columns: 22,
      lastUpdated: '3 hours ago',
      owner: 'Admin',
      status: 'draft',
      tags: ['marketing', 'campaigns', 'roi'],
      size: '18.7 MB',
      isShared: false,
      createdBy: 'Admin'
    },
    {
      id: '4',
      name: 'Financial Transactions',
      description: 'Complete transaction history with payment methods, amounts, and reconciliation data',
      source: 'Payment Gateway',
      recordCount: 89000,
      columns: 18,
      lastUpdated: '30 minutes ago',
      owner: 'David Brown',
      status: 'published',
      tags: ['finance', 'transactions', 'payments'],
      size: '67.3 MB',
      isShared: true,
      createdBy: 'David Brown'
    },
    {
      id: '5',
      name: 'Support Ticket Analysis',
      description: 'Customer support tickets with resolution times, satisfaction scores, and categorization',
      source: 'Support System',
      recordCount: 12500,
      columns: 12,
      lastUpdated: '1 hour ago',
      owner: 'Amy Garcia',
      status: 'deprecated',
      tags: ['support', 'tickets', 'customer-service'],
      size: '8.9 MB',
      isShared: true,
      createdBy: 'Amy Garcia'
    },
    {
      id: '6',
      name: 'Website Analytics',
      description: 'Web traffic data including page views, user sessions, bounce rates, and conversion funnels',
      source: 'Google Analytics',
      recordCount: 234000,
      columns: 35,
      lastUpdated: '15 minutes ago',
      owner: 'Admin',
      status: 'published',
      tags: ['web', 'analytics', 'traffic'],
      size: '156.4 MB',
      isShared: false,
      createdBy: 'Admin'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOwnership, setFilterOwnership] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const currentUser = 'Admin'; // In a real app, this would come from auth context

  const filteredViews = views.filter(view => {
    const matchesSearch = view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         view.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         view.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || view.status === filterStatus;
    const matchesOwnership = filterOwnership === 'all' || 
                           (filterOwnership === 'mine' && view.createdBy === currentUser) ||
                           (filterOwnership === 'shared' && view.isShared && view.createdBy !== currentUser);
    return matchesSearch && matchesStatus && matchesOwnership;
  });

  const getOwnershipIcon = (view: View) => {
    if (view.createdBy === currentUser) {
      return <UserCheck className="w-3 h-3 text-blue-600" />;
    } else if (view.isShared) {
      return <Globe className="w-3 h-3 text-green-600" />;
    }
    return null;
  };

  const getOwnershipLabel = (view: View) => {
    if (view.createdBy === currentUser) {
      return 'Created by me';
    } else if (view.isShared) {
      return 'Shared with me';
    }
    return 'Private';
  };

  const getOwnershipBadgeColor = (view: View) => {
    if (view.createdBy === currentUser) {
      return 'bg-blue-100 text-blue-800';
    } else if (view.isShared) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-slate-100 text-slate-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return '●';
      case 'draft':
        return '◐';
      case 'deprecated':
        return '●';
      default:
        return '●';
    }
  };

  const toggleViewSelection = (viewId: string) => {
    setSelectedViews(prev => 
      prev.includes(viewId) 
        ? prev.filter(id => id !== viewId)
        : [...prev, viewId]
    );
  };

  const handleDeleteView = (viewId: string) => {
    setShowDeleteModal(viewId);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      // Here you would typically call an API to delete the view
      // TODO: Implement actual delete functionality
      setShowDeleteModal(null);
    }
  };

  const handlePreviewView = (viewId: string) => {
    setShowPreviewModal(viewId);
  };

  const handleImportFromDbt = () => {
    setShowImportModal(true);
  };

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
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Views</h1>
                <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Manage and explore your data views</p>
              </div>
            </div>

            {/* Right Side - Search and Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search views..."
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

        {/* Controls Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleImportFromDbt}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Import from dBT
              </button>
              
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-500" />
                <select
                  value={filterOwnership}
                  onChange={(e) => setFilterOwnership(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="all">All Views</option>
                  <option value="mine">Created by Me</option>
                  <option value="shared">Shared with Me</option>
                </select>
              </div>

              {selectedViews.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">{selectedViews.length} selected</span>
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm">
                    Bulk Actions
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{filteredViews.length} views</span>
              
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
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredViews.map((view) => (
                <div
                  key={view.id}
                  className={`bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
                    selectedViews.includes(view.id) 
                      ? 'border-cyan-500 shadow-cyan-100' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleViewSelection(view.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <Database className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">{view.name}</h3>
                          <p className="text-sm text-slate-600">{view.source}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(view.status)}`}>
                          {getStatusIcon(view.status)} {view.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{view.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-semibold text-slate-900">{formatNumber(view.recordCount)}</div>
                        <div className="text-xs text-slate-600">Records</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-semibold text-slate-900">{view.columns}</div>
                        <div className="text-xs text-slate-600">Columns</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {view.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getOwnershipBadgeColor(view)}`}>
                        {getOwnershipIcon(view)}
                        {getOwnershipLabel(view)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Updated {view.lastUpdated}</span>
                      <span>{view.size}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-600">{view.owner}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewView(view.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors"
                          title="Preview view"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteView(view.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete view"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors">
                          <Share className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">View</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Records</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Columns</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ownership</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredViews.map((view) => (
                      <tr key={view.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300"
                            checked={selectedViews.includes(view.id)}
                            onChange={() => toggleViewSelection(view.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-cyan-100 rounded-lg mr-3">
                              <Database className="w-4 h-4 text-cyan-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{view.name}</div>
                              <div className="text-sm text-slate-500 truncate max-w-xs">{view.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{view.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatNumber(view.recordCount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{view.columns}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(view.status)}`}>
                            {getStatusIcon(view.status)} {view.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{view.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${getOwnershipBadgeColor(view)}`}>
                            {getOwnershipIcon(view)}
                            {getOwnershipLabel(view)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{view.lastUpdated}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handlePreviewView(view.id)}
                              className="text-cyan-600 hover:text-cyan-900"
                              title="Preview view"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-slate-400 hover:text-slate-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteView(view.id)}
                              className="text-slate-400 hover:text-red-600"
                              title="Delete view"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Delete View</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this view? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden flex">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Customer Analytics View</h3>
                    <p className="text-sm text-slate-600 mt-1">Comprehensive customer data including demographics and metrics</p>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Data Overview */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Total Rows</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">125,000</p>
                    <p className="text-xs text-slate-500">Active records</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Grid3X3 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Columns</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">28</p>
                    <p className="text-xs text-slate-500">Data fields</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Data Size</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">45.2 MB</p>
                    <p className="text-xs text-slate-500">Compressed</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-slate-700">Last Updated</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">2h</p>
                    <p className="text-xs text-slate-500">ago</p>
                  </div>
                </div>
              </div>
              
              {/* Data Preview Table */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">Data Preview (First 5 rows)</h4>
                  <span className="text-sm text-slate-500">Showing 5 of 125,000 records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Store Region</span>
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Text</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Brand</span>
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Text</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Order Number</span>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Number</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Month</span>
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Date</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Quantity</span>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Number</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b">
                          <div className="flex items-center space-x-2">
                            <span>Sales</span>
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">Formula</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[
                        ['Midwest', 'LG', '546150', '2021-02', '2', '$1,156.40'],
                        ['West', 'Samsung', '789123', '2023-03', '1', '$299.99'],
                        ['East', 'Apple', '123456', '2023-04', '1', '$999.99'],
                        ['South', 'Dell', '987654', '2023-02', '2', '$1,599.98'],
                        ['Midwest', 'Sony', '456789', '2023-01', '4', '$799.96']
                      ].map((row, index) => (
                        <tr key={`data-row-${index}`} className="border-b hover:bg-slate-50">
                          {row.map((cell, cellIndex) => (
                            <td key={`data-cell-${cellIndex}`} className="px-4 py-3 text-sm text-slate-900">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar with Metrics and Info */}
            <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-medium text-slate-900">View Details</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Associated Metrics */}
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Associated Metrics</h5>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">Total Revenue</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-lg font-bold text-green-600">$2.4M</p>
                      <p className="text-xs text-slate-500">SUM([Sales])</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">Avg Order Value</span>
                        <MoreVertical className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-blue-600">$156.32</p>
                      <p className="text-xs text-slate-500">AVG([Price] * [Quantity])</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">Total Orders</span>
                        <Database className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-lg font-bold text-purple-600">15,347</p>
                      <p className="text-xs text-slate-500">COUNT([Order Number])</p>
                    </div>
                  </div>
                </div>
                
                {/* Data Quality */}
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Data Quality</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Completeness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">94%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">98%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Freshness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Column Statistics */}
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Column Statistics</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Text columns</span>
                      <span className="font-medium text-slate-900">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Number columns</span>
                      <span className="font-medium text-slate-900">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Date columns</span>
                      <span className="font-medium text-slate-900">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Formula columns</span>
                      <span className="font-medium text-slate-900">4</span>
                    </div>
                  </div>
                </div>
                
                {/* Data Sources */}
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Data Sources</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-900">Sales Database</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-900">CRM System</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-200">
                <button className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium">
                  Open in Data Modeling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import from dBT Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900">Import Views from dBT</h3>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'customer_metrics', description: 'Customer analytics and KPIs', type: 'view' },
                  { name: 'sales_summary', description: 'Daily sales aggregations', type: 'model' },
                  { name: 'product_performance', description: 'Product sales and inventory metrics', type: 'view' },
                  { name: 'monthly_revenue', description: 'Monthly revenue rollups', type: 'model' },
                  { name: 'customer_cohorts', description: 'Customer cohort analysis', type: 'view' },
                  { name: 'inventory_turnover', description: 'Inventory turnover analysis', type: 'view' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-cyan-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.type === 'view' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {item.type === 'view' ? <Eye className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-900">{item.name}</h5>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                          item.type === 'view' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm">
                      Import
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
