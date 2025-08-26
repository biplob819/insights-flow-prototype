'use client';

import Sidebar from '@/components/Sidebar';
import { 
  Menu, 
  Building, 
  Users, 
  Shield, 
  CreditCard, 
  Globe, 
  Bell,
  Save,
  Upload,
  Plus,
  X,
  Toggle,
  Edit3,
  Check,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export default function OrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');
  const [newOrgName, setNewOrgName] = useState('');
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, orgId: null, orgName: '' });
  
  const [organizations, setOrganizations] = useState([
    { id: 1, name: 'Neworg', role: 'Owner', isDefault: true, isCurrentOrg: true },
    { id: 2, name: 'TechStartup Inc', role: 'Owner', isDefault: false, isCurrentOrg: false },
    { id: 3, name: 'Marketing Agency', role: 'Designer', isDefault: false, isCurrentOrg: false }
  ]);

  const handleSetDefault = (orgId) => {
    setOrganizations(orgs => 
      orgs.map(org => ({ 
        ...org, 
        isDefault: org.id === orgId 
      }))
    );
  };

  const handleEditOrg = (orgId, currentName) => {
    setEditingOrgId(orgId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (orgId) => {
    if (editingName.trim()) {
      setOrganizations(orgs => 
        orgs.map(org => 
          org.id === orgId ? { ...org, name: editingName.trim() } : org
        )
      );
    }
    setEditingOrgId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingOrgId(null);
    setEditingName('');
  };

  const handleCreateOrg = () => {
    if (newOrgName.trim()) {
      const newOrg = {
        id: Date.now(),
        name: newOrgName.trim(),
        role: 'Owner',
        isDefault: false,
        isCurrentOrg: false
      };
      setOrganizations(orgs => [...orgs, newOrg]);
      setNewOrgName('');
      setIsCreateOrgModalOpen(false);
    }
  };

  const handleDeleteOrg = (orgId) => {
    if (organizations.length <= 1) {
      setDeleteConfirmation({ 
        isOpen: true, 
        orgId: null, 
        orgName: '',
        error: 'You must have at least one organization.' 
      });
      return;
    }
    
    const orgToDelete = organizations.find(org => org.id === orgId);
    if (orgToDelete?.isCurrentOrg) {
      setDeleteConfirmation({ 
        isOpen: true, 
        orgId: null, 
        orgName: '',
        error: 'You cannot delete the current organization.' 
      });
      return;
    }

    // Show confirmation dialog
    setDeleteConfirmation({ 
      isOpen: true, 
      orgId: orgId, 
      orgName: orgToDelete?.name || '',
      error: null
    });
  };

  const handleConfirmDelete = () => {
    const orgToDelete = organizations.find(org => org.id === deleteConfirmation.orgId);
    
    setOrganizations(orgs => {
      const remaining = orgs.filter(org => org.id !== deleteConfirmation.orgId);
      // If we're deleting the default org, make the first remaining org default
      if (orgToDelete?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
    
    setDeleteConfirmation({ isOpen: false, orgId: null, orgName: '' });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, orgId: null, orgName: '' });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'members', name: 'Organization Members', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard },
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
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Organization Settings</h1>
                <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Manage your organization preferences and configuration</p>
              </div>
            </div>


          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-full">
            <div className="flex gap-6 lg:gap-8 h-full">
              {/* Settings Navigation Sidebar */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            activeTab === tab.id
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
              
              {/* Settings Content */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="bg-white rounded-lg border border-slate-200 h-full overflow-hidden">
                  {activeTab === 'general' && (
                    <div className="p-6 h-full overflow-y-auto">
                      <div className="space-y-8">
                        {/* Organizations */}
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-6">Organizations</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Organization Cards */}
                            {organizations.map((org) => (
                              <div key={org.id} className={`group border rounded-xl p-6 transition-all flex flex-col min-h-[160px] ${
                                editingOrgId === org.id 
                                  ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-400 shadow-lg ring-1 ring-cyan-300 ring-opacity-50' 
                                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-cyan-300 hover:shadow-lg cursor-pointer'
                              }`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1 min-w-0">
                                    {editingOrgId === org.id ? (
                                      <div className="flex-1">
                                        <div className="space-y-3">
                                          <div className="relative">
                                            <input
                                              type="text"
                                              value={editingName}
                                              onChange={(e) => setEditingName(e.target.value)}
                                              className="w-full font-semibold text-slate-900 bg-white border-2 border-cyan-400 rounded-lg px-4 py-3 text-lg leading-tight focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm pr-20"
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(org.id);
                                                if (e.key === 'Escape') handleCancelEdit();
                                              }}
                                              placeholder="Organization name"
                                              autoFocus
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                              <button
                                                onClick={() => handleSaveEdit(org.id)}
                                                disabled={!editingName.trim()}
                                                className="p-1.5 text-white bg-cyan-600 rounded-full hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                                title="Save changes"
                                              >
                                                <Check className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={handleCancelEdit}
                                                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                                                title="Cancel editing"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-slate-500 font-medium">
                                                {org.isCurrentOrg ? 'Current Organization' : 'Organization'}
                                              </span>
                                              <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                                                • {org.role}
                                              </span>
                                            </div>
                                            {org.isDefault && (
                                              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                                                Default
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="text-xs text-slate-400 italic flex items-center gap-2">
                                            <span>Press Enter to save • Escape to cancel</span>
                                            <div className="flex items-center gap-1">
                                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                                              <span className="text-cyan-600 font-medium">Editing</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex-1">
                                        <div className="mb-3">
                                          <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2 break-words">
                                            {org.name}
                                          </h3>
                                          <p className="text-sm text-slate-500 font-medium">
                                            {org.isCurrentOrg ? 'Current Organization' : 'Organization'}
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                                            {org.role}
                                          </span>
                                          {org.isDefault && (
                                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                                              Default
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Action buttons - show on hover (hidden during edit) */}
                                  {editingOrgId !== org.id && (
                                    <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditOrg(org.id, org.name);
                                        }}
                                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition-colors"
                                        title="Edit organization name"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      {!org.isCurrentOrg && organizations.length > 1 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOrg(org.id);
                                          }}
                                          className="text-slate-400 hover:text-red-600 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors"
                                          title="Delete organization"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Default toggle button - spacious (hidden during edit) */}
                                {editingOrgId !== org.id && (
                                  <div className="mt-auto pt-3">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetDefault(org.id);
                                      }}
                                      className={`w-full text-sm font-medium px-4 py-3 rounded-lg transition-colors ${
                                        org.isDefault 
                                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' 
                                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                      }`}
                                    >
                                      {org.isDefault ? '✓ Default Organization' : 'Make Default'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Create Organization Card */}
                            <div 
                              onClick={() => setIsCreateOrgModalOpen(true)}
                              className="border-2 border-dashed border-slate-300 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[140px]"
                            >
                              <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="w-14 h-14 bg-cyan-100 group-hover:bg-cyan-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                  <Plus className="w-7 h-7 text-cyan-600 group-hover:text-cyan-700" />
                                </div>
                                <h3 className="font-semibold text-slate-900 text-lg mb-2">Create Organization</h3>
                                <p className="text-sm text-slate-500 mb-4 leading-relaxed">Start a new organization for your team</p>
                              </div>
                              <button className="w-full py-3 bg-cyan-100 hover:bg-cyan-200 rounded-lg text-sm font-medium text-cyan-700 transition-colors border border-cyan-200">
                                + Create New
                            </button>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  )}

                  {activeTab === 'members' && (
                    <div className="p-6 h-full overflow-y-auto">
                      <div className="space-y-8">
                        {/* Team Members */}
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
                            <button 
                              onClick={() => setIsInviteModalOpen(true)}
                              className="flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Invite user
                            </button>
                          </div>

                          {/* Members Table */}
                          <div className="bg-slate-50 rounded-lg">
                            <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-slate-200 text-sm font-medium text-slate-600">
                              <div>#</div>
                              <div>Name</div>
                              <div>Role</div>
                              <div>Joined On</div>
                            </div>
                            <div className="px-4 py-4">
                              <div className="grid grid-cols-4 gap-4 items-center">
                                <div className="text-sm text-slate-900">1</div>
                                <div className="text-sm text-slate-900">Biplob Chakraborty</div>
                                <div className="text-sm text-slate-900">Owner</div>
                                <div className="text-sm text-slate-900">23 Aug 2025</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Invitations */}
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-4">Invitations</h2>
                          <p className="text-slate-600 text-sm">No pending invitations</p>
                        </div>
                      </div>
                    </div>
                  )}



                  {activeTab === 'billing' && (
                    <div className="p-4 lg:p-6 h-full overflow-y-auto">
                      <div className="max-w-full">
                        {/* Subscription */}
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-2">Subscription</h2>
                          <p className="text-slate-600 text-sm mb-6 lg:mb-8">This organization doesn't have any plan at the moment</p>

                          {/* Pricing Plans */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 max-w-full">
                            {/* Growth Plan */}
                            <div className="bg-slate-50 rounded-lg p-4 lg:p-6 border border-slate-200 min-h-0 flex flex-col">
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth</h3>
                              <div className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">$1000+ /month</div>
                              
                              <ul className="space-y-3">
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Embedded dashboard templates - 10
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  50 tenants
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Dashboard custom styling
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  CSV Downloads
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  PDF Downloads
                                </li>
                                <li className="flex items-start text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Embedded business intelligence (End-user personal workspace)
                                </li>
                              </ul>
                            </div>

                            {/* Professional Plan */}
                            <div className="bg-slate-50 rounded-lg p-4 lg:p-6 border border-slate-200 min-h-0 flex flex-col">
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">Professional</h3>
                              <div className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">$2000+ /month</div>
                              
                              <ul className="space-y-3">
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Unlimited embedded dashboard templates
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  50+ tenants
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Dashboard custom styling
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  CSV Downloads
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  PDF Downloads
                                </li>
                                <li className="flex items-start text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Embedded business intelligence (End-user personal workspace)
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Scheduled email reporting (coming soon)
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  AI for end-user facing analytics
                                </li>
                              </ul>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-slate-50 rounded-lg p-4 lg:p-6 border border-slate-200 min-h-0 flex flex-col">
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
                              <div className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">Let's chat!</div>
                              
                              <ul className="space-y-3">
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Unlimited embedded dashboard templates
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  50+ tenants
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Dashboard custom styling
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  CSV Downloads
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  PDF Downloads
                                </li>
                                <li className="flex items-start text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Embedded business intelligence (End-user personal workspace)
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  Scheduled email reporting (coming soon)
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  AI for end-user facing analytics
                                </li>
                                <li className="flex items-center text-sm text-slate-600">
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs">✓</span>
                                  </span>
                                  SAML SSO
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Invite Team Member</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer text-sm"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Designer">Designer</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle invite logic here
                  setIsInviteModalOpen(false);
                  setInviteEmail('');
                  setInviteRole('Viewer');
                }}
                className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer font-medium"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {isCreateOrgModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Create New Organization</h3>
              <button 
                onClick={() => {
                  setIsCreateOrgModalOpen(false);
                  setNewOrgName('');
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  placeholder="Enter organization name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateOrg()}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => {
                  setIsCreateOrgModalOpen(false);
                  setNewOrgName('');
                }}
                className="px-5 py-2.5 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrg}
                disabled={!newOrgName.trim()}
                className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed font-medium"
              >
                Create Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {deleteConfirmation.error ? 'Cannot Delete Organization' : 'Delete Organization'}
              </h3>
            </div>
            
            <div className="mb-6">
              {deleteConfirmation.error ? (
                <p className="text-sm text-slate-600">
                  {deleteConfirmation.error}
                </p>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-3">
                    Are you sure you want to delete <span className="font-semibold text-slate-900">"{deleteConfirmation.orgName}"</span>?
                  </p>
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <strong>Warning:</strong> This action cannot be undone. All data associated with this organization will be permanently removed.
                  </p>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleCancelDelete}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {deleteConfirmation.error ? 'Close' : 'Cancel'}
              </button>
              {!deleteConfirmation.error && (
                <button 
                  onClick={handleConfirmDelete}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Organization
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
