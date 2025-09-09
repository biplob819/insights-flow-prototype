'use client';

import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Settings,
  Database,
  MoreVertical,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onToggleDataPanel: () => void;
  isDataPanelOpen: boolean;
}

export default function DashboardHeader({ 
  title, 
  onTitleChange, 
  onToggleDataPanel,
  isDataPanelOpen 
}: DashboardHeaderProps) {
  const router = useRouter();

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
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-1"
            placeholder="Enter dashboard title..."
          />

          {/* Data Panel Toggle */}
          <button
            onClick={onToggleDataPanel}
            className={`p-2 rounded-lg transition-colors ${
              isDataPanelOpen 
                ? 'bg-cyan-50 text-cyan-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Database className="w-5 h-5" />
          </button>
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

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

