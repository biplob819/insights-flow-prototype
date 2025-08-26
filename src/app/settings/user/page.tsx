'use client';

import Sidebar from '@/components/Sidebar';
import { 
  Menu, 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Shield,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const tabs = [
    { id: 'account', name: 'Account Settings', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
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
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">User Settings</h1>
                <p className="text-slate-600 text-sm sm:text-base hidden sm:block">Manage your personal account settings and preferences</p>
              </div>
            </div>


          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-full">
            <div className="flex gap-8 h-full">
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
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-slate-200">
                  {activeTab === 'account' && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">Account Settings</h2>
                      <p className="text-slate-600 text-sm mb-8">Manage your account settings here.</p>

                      <div className="space-y-8">
                        {/* Avatar */}
                        <div>
                          <h3 className="text-base font-medium text-slate-900 mb-4">Avatar</h3>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center relative">
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                                <Upload className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Name */}
                        <div>
                          <h3 className="text-base font-medium text-slate-900 mb-4">Name</h3>
                          <div className="space-y-4">
                            <input
                              type="text"
                              defaultValue="Biplob Chakraborty"
                              className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            <div className="flex justify-end max-w-md">
                              <button className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer">
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">Security Settings</h2>
                      <p className="text-slate-600 text-sm mb-8">Manage your login credentials here.</p>

                      <div className="space-y-8">
                        {/* Email */}
                        <div>
                          <h3 className="text-base font-medium text-slate-900 mb-4">Email</h3>
                          <div className="space-y-4">
                            <input
                              type="email"
                              defaultValue="sonuc201@gmail.com"
                              className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            <div className="flex justify-end max-w-md">
                              <button className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer">
                                Update Email
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <h3 className="text-base font-medium text-slate-900 mb-4">Password</h3>
                          <div className="space-y-4">
                            <input
                              type="password"
                              className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            <div className="flex justify-end max-w-md">
                              <button className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer">
                                Update Password
                              </button>
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
    </div>
  );
}
