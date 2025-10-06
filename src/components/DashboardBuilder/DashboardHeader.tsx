'use client';

import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Settings,
  MoreVertical,
  Eye,
  Plus,
  MessageCircle,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChartSelectionModal from './ChartSelectionModal';
import { WidgetConfig } from './types';

interface DashboardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onAddWidget: (widget: WidgetConfig) => void;
  onOpenSettings?: () => void;
  showSubtitle?: boolean;
  subtitle?: string;
  onSubtitleChange?: (subtitle: string) => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export default function DashboardHeader({ 
  title, 
  onTitleChange, 
  onAddWidget,
  onOpenSettings,
  showSubtitle = false,
  subtitle = '',
  onSubtitleChange,
  onToggleChat,
  isChatOpen = false
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddChart = (widget: WidgetConfig) => {
    onAddWidget(widget);
    setIsModalOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dashboard Title */}
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-1"
              placeholder="Enter dashboard title..."
            />
            {showSubtitle && (
              <input
                type="text"
                value={subtitle}
                onChange={(e) => onSubtitleChange?.(e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-0.5 mt-1"
                placeholder="Enter subtitle..."
              />
            )}
          </div>

          {/* Add Element Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors shadow-sm"
            title="Add Element"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>

          {/* Settings Button */}
          <button 
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Dashboard Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Chat Toggle Button */}
          {onToggleChat && (
            <button 
              onClick={onToggleChat}
              className={`relative p-2 rounded-lg transition-colors ${
                isChatOpen 
                  ? 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Toggle Chat Panel"
            >
              <MessageSquare className="w-5 h-5" />
              {/* Notification badge for unread comments */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">3</span>
              </div>
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Preview Button */}
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Preview</span>
          </button>

          {/* Save Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save</span>
          </button>

          {/* Share Button */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chart Selection Modal */}
      <ChartSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectChart={handleAddChart}
      />
    </header>
  );
}

