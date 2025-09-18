'use client';

import { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Monitor, 
  Settings, 
  Globe, 
  Palette, 
  Sliders, 
  Code, 
  Download, 
  Mail, 
  Eye, 
  MessageSquare, 
  Paintbrush, 
  Check,
  Upload,
  Type,
  Square,
  Circle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Smartphone,
  Tablet,
  Laptop,
  MonitorSpeaker
} from 'lucide-react';

interface DashboardSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardTitle?: string;
  onDashboardTitleChange?: (title: string) => void;
  showSubtitle?: boolean;
  onSubtitleToggle?: (show: boolean) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface ColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

interface SearchableDropdownProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 ${
          checked ? 'bg-cyan-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function SearchableDropdown({ options, value, onChange, placeholder, className }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-left flex items-center justify-between"
      >
        <span className="truncate">{selectedOption?.label || placeholder || 'Select...'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search timezones..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500">{option.description}</div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No timezones found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPalette({ colors, selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5 w-full">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onColorSelect(color)}
          className={`aspect-square w-full rounded-lg border-2 transition-all ${
            selectedColor === color 
              ? 'border-cyan-500 scale-105 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

interface ThemeSubSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

function ThemeSubSection({ title, icon, children, isExpanded, onToggle }: ThemeSubSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

interface InjectCSSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (css: string) => void;
}

function InjectCSSModal({ isOpen, onClose, onSave }: InjectCSSModalProps) {
  const [cssContent, setCssContent] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(cssContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inject CSS to dashboard</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="text-orange-500 mt-0.5">⚠️</div>
              <div>
                <p className="text-orange-700 font-medium">Using this feature could mess up the rendering of your dashboard.</p>
                <p className="text-orange-600 text-sm mt-1">
                  When adding custom CSS to your dashboard, be aware that new platform updates may 
                  break your custom CSS at any time. It will be your responsibility to maintain this CSS code.
                </p>
              </div>
            </div>
          </div>
          
          <textarea
            value={cssContent}
            onChange={(e) => setCssContent(e.target.value)}
            placeholder="/* Enter your custom CSS here */&#10;&#10;.my-custom-style {&#10;  color: #blue;&#10;  font-weight: bold;&#10;}"
            className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">1</span>
            Line numbers and syntax highlighting would appear here in a full implementation
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Inject CSS
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenResponsivenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: any) => void;
  screenMode: string;
  dashboardWidth: number;
  selectedScreenSizes: string[];
  keepItemsInSync: boolean;
}

function ScreenResponsivenessModal({ 
  isOpen, 
  onClose, 
  onApply,
  screenMode: initialScreenMode,
  dashboardWidth: initialDashboardWidth,
  selectedScreenSizes: initialSelectedScreenSizes,
  keepItemsInSync: initialKeepItemsInSync
}: ScreenResponsivenessModalProps) {
  const [screenMode, setScreenMode] = useState(initialScreenMode);
  const [dashboardWidth, setDashboardWidth] = useState(initialDashboardWidth);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState(initialSelectedScreenSizes);
  const [keepItemsInSync, setKeepItemsInSync] = useState(initialKeepItemsInSync);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      screenMode,
      dashboardWidth,
      selectedScreenSizes,
      keepItemsInSync
    });
    onClose();
  };

  const screenSizes = [
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="w-8 h-8" />, description: '< 768px' },
    { id: 'tablet', name: 'Tablet', icon: <Tablet className="w-8 h-8" />, description: '≥ 768px' },
    { id: 'desktop', name: 'Desktop', icon: <Laptop className="w-8 h-8" />, description: '≥ 1200px' },
    { id: 'large', name: 'Large screen', icon: <MonitorSpeaker className="w-8 h-8" />, description: '≥ 1600px' }
  ];

  const toggleScreenSize = (sizeId: string) => {
    setSelectedScreenSizes(prev => 
      prev.includes(sizeId) 
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard screenmode options</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setScreenMode('fixed')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  screenMode === 'fixed'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Fixed width
              </button>
              <button
                onClick={() => setScreenMode('responsive')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  screenMode === 'responsive'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Responsive
              </button>
            </div>
          </div>

          {/* Fixed Width Settings */}
          {screenMode === 'fixed' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard width:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={dashboardWidth}
                  onChange={(e) => setDashboardWidth(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-24"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
          )}

          {/* Responsive Settings */}
          {screenMode === 'responsive' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {screenSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => toggleScreenSize(size.id)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      selectedScreenSizes.includes(size.id)
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex justify-center mb-2 ${
                      selectedScreenSizes.includes(size.id) ? 'text-cyan-600' : 'text-gray-600'
                    }`}>
                      {size.icon}
                    </div>
                    <div className={`font-medium text-sm mb-1 ${
                      selectedScreenSizes.includes(size.id) ? 'text-cyan-600' : 'text-gray-700'
                    }`}>
                      {size.name}
                    </div>
                    <div className="text-xs text-gray-500">{size.description}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Keep items and item options in screen modes in sync:
                  </span>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    keepItemsInSync ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}>
                    <button
                      onClick={() => setKeepItemsInSync(!keepItemsInSync)}
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        keepItemsInSync ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSettingsPanel({ 
  isOpen, 
  onClose, 
  dashboardTitle: externalDashboardTitle = '',
  onDashboardTitleChange,
  showSubtitle: externalShowSubtitle = false,
  onSubtitleToggle
}: DashboardSettingsPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState('Organization theme');
  const [selectedMainColor, setSelectedMainColor] = useState('#3B82F6');
  const [selectedPalette, setSelectedPalette] = useState('switch-to');
  const [showInjectCSS, setShowInjectCSS] = useState(false);
  const [themeSearch, setThemeSearch] = useState('');
  const [customThemeName, setCustomThemeName] = useState('');
  const [savedThemes, setSavedThemes] = useState(['Custom Theme 1', 'Custom Theme 2']);
  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  
  // Language selection
  const [enableLanguageSelection, setEnableLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  // Advanced options
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [showScreenResponsiveness, setShowScreenResponsiveness] = useState(false);
  const [screenMode, setScreenMode] = useState('responsive');
  const [dashboardWidth, setDashboardWidth] = useState(800);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState(['desktop']);
  const [keepItemsInSync, setKeepItemsInSync] = useState(true);
  const [activeScreenSize, setActiveScreenSize] = useState('desktop');
  
  // Sub-section collapse states
  const [expandedThemeSections, setExpandedThemeSections] = useState({
    colors: true,
    typography: false,
    itemShadow: false,
    itemBorders: false,
    spacing: false,
    itemTitles: false,
    legend: false,
    axis: false,
    tooltip: false
  });
  
  // Dashboard settings state
  const [dashboardTitle, setDashboardTitle] = useState(externalDashboardTitle);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(externalShowSubtitle);
  const [enableDownload, setEnableDownload] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableTimezoneSelection, setEnableTimezoneSelection] = useState(true);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [commentingMode, setCommentingMode] = useState('In bottom bar');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [itemsBackgroundColor, setItemsBackgroundColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Default (Open Sans)');
  const [baseFontSize, setBaseFontSize] = useState(13);
  const [injectCSSEnabled, setInjectCSSEnabled] = useState(false);
  const [enableSettingAlerts, setEnableSettingAlerts] = useState(true);
  
  // Theme control states
  const [shadowSize, setShadowSize] = useState('L');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState('dashed');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderRoundness, setBorderRoundness] = useState(0);
  const [spaceVertical, setSpaceVertical] = useState(12);
  const [spaceHorizontal, setSpaceHorizontal] = useState(12);

  const defaultColors = [
    '#3B82F6', '#06B6D4', '#EF4444', '#F59E0B', 
    '#EAB308', '#22C55E', '#84CC16', '#A855F7',
    '#9CA3AF', '#374151', '#D1FAE5', '#8B5CF6'
  ];

  const themes = [
    { name: 'Organization theme', type: 'default' },
    { name: 'Vivid', type: 'preset' },
    { name: 'Custom Theme 1', type: 'custom' },
    { name: 'Custom Theme 2', type: 'custom' }
  ];

  const filteredThemes = themes.filter(theme => 
    theme.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  const timezones = [
    { value: 'UTC', label: 'UTC (UTC)', description: 'As defined by browser (UTC+05:30)' },
    { value: 'Etc/GMT+12', label: 'Etc/GMT+12 (UTC-12:00)', description: 'International Date Line West' },
    { value: 'Etc/GMT+11', label: 'Etc/GMT+11 (UTC-11:00)', description: 'Coordinated Universal Time-11' },
    { value: 'Pacific/Midway', label: 'Pacific/Midway (UTC-11:00)', description: 'Midway Island, Samoa' },
    { value: 'Pacific/Niue', label: 'Pacific/Niue (UTC-11:00)', description: 'Niue' },
    { value: 'Pacific/Pago_Pago', label: 'Pacific/Pago_Pago (UTC-11:00)', description: 'American Samoa' },
    { value: 'Pacific/Samoa', label: 'Pacific/Samoa (UTC-11:00)', description: 'Samoa' },
    { value: 'Etc/GMT+10', label: 'Etc/GMT+10 (UTC-10:00)', description: 'Coordinated Universal Time-10' },
    { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (UTC-10:00)', description: 'Hawaii' },
    { value: 'Pacific/Johnston', label: 'Pacific/Johnston (UTC-10:00)', description: 'Johnston Island' },
    { value: 'Pacific/Rarotonga', label: 'Pacific/Rarotonga (UTC-10:00)', description: 'Cook Islands' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-08:00)', description: 'Pacific Time (US & Canada)' },
    { value: 'America/Denver', label: 'America/Denver (UTC-07:00)', description: 'Mountain Time (US & Canada)' },
    { value: 'America/Chicago', label: 'America/Chicago (UTC-06:00)', description: 'Central Time (US & Canada)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-05:00)', description: 'Eastern Time (US & Canada)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+00:00)', description: 'Greenwich Mean Time' },
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+01:00)', description: 'Central European Time' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+09:00)', description: 'Japan Standard Time' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (UTC+05:30)', description: 'India Standard Time' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10:00)', description: 'Australian Eastern Time' }
  ];

  // Handle title changes and sync with external prop
  const handleTitleChange = (title: string) => {
    setDashboardTitle(title);
    onDashboardTitleChange?.(title);
  };

  // Handle subtitle toggle and sync with external prop
  const handleSubtitleToggle = (show: boolean) => {
    setShowSubtitle(show);
    onSubtitleToggle?.(show);
  };

  const handleInjectCSS = (css: string) => {
    console.log('Injecting CSS:', css);
    // In a real implementation, this would inject the CSS into the dashboard
  };

  const handleScreenResponsivenessApply = (settings: any) => {
    setScreenMode(settings.screenMode);
    setDashboardWidth(settings.dashboardWidth);
    setSelectedScreenSizes(settings.selectedScreenSizes);
    setKeepItemsInSync(settings.keepItemsInSync);
    // Set the first selected screen size as active
    if (settings.selectedScreenSizes.length > 0) {
      setActiveScreenSize(settings.selectedScreenSizes[0]);
    }
  };

  const handleScreenSizeClick = (sizeId: string) => {
    setActiveScreenSize(sizeId);
    // Here you would implement the actual dashboard resize logic
    console.log(`Switching to ${sizeId} view`);
  };

  const getScreenSizeIcon = (sizeId: string, isActive: boolean = false) => {
    const iconClass = `w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-gray-600'}`;
    switch (sizeId) {
      case 'mobile':
        return <Smartphone className={iconClass} />;
      case 'tablet':
        return <Tablet className={iconClass} />;
      case 'desktop':
        return <Laptop className={iconClass} />;
      case 'large':
        return <MonitorSpeaker className={iconClass} />;
      default:
        return <Monitor className={iconClass} />;
    }
  };

  const toggleThemeSection = (section: keyof typeof expandedThemeSections) => {
    setExpandedThemeSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Font uploaded:', file.name);
      // In a real implementation, this would handle font upload
    }
  };

  const handleSaveTheme = () => {
    if (customThemeName.trim()) {
      if (editingTheme) {
        // Update existing theme
        setSavedThemes(prev => prev.map(theme => 
          theme === editingTheme ? customThemeName : theme
        ));
        setEditingTheme(null);
      } else {
        // Add new theme
        setSavedThemes(prev => [...prev, customThemeName]);
      }
      setCustomThemeName('');
    }
  };

  const handleEditTheme = (themeName: string) => {
    setCustomThemeName(themeName);
    setEditingTheme(themeName);
  };

  const handleDeleteTheme = (themeName: string) => {
    setSavedThemes(prev => prev.filter(theme => theme !== themeName));
    if (selectedTheme === themeName) {
      setSelectedTheme('Organization theme');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl border-r border-gray-200 z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Dashboard Settings</h2>
              <p className="text-sm text-gray-500">Configure dashboard appearance and behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-0">
          {/* General Section */}
          <CollapsibleSection
            title="GENERAL"
            icon={<Settings className="w-5 h-5 text-gray-600" />}
            defaultOpen={true}
          >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={dashboardTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter dashboard title..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <SearchableDropdown
                  options={timezones}
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                  placeholder="Select timezone..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">As defined by browser (UTC+05:30)</p>
              </div>
          </CollapsibleSection>

          {/* Display Section */}
          <CollapsibleSection
            title="DISPLAY"
            icon={<Monitor className="w-5 h-5 text-gray-600" />}
          >
              <Toggle
                checked={showTitle}
                onChange={setShowTitle}
                label="Title"
              />
              <Toggle
                checked={showSubtitle}
                onChange={handleSubtitleToggle}
                label="Subtitle"
              />
          </CollapsibleSection>

          {/* Embedding Options Section */}
          <CollapsibleSection
            title="EMBEDDING OPTIONS"
            icon={<Globe className="w-5 h-5 text-gray-600" />}
          >
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Download className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">Export Options</h4>
                </div>
                <div className="space-y-3">
                  <Toggle
                    checked={enableDownload}
                    onChange={setEnableDownload}
                    label="Download"
                  />
                  <Toggle
                    checked={enableEmail}
                    onChange={setEnableEmail}
                    label="Send via email"
                  />
                </div>
              </div>

              <Toggle
                checked={enableTimezoneSelection}
                onChange={setEnableTimezoneSelection}
                label="Timezone selection"
              />

              <Toggle
                checked={removeBackground}
                onChange={setRemoveBackground}
                label="Remove background in embed"
              />

              <Toggle
                checked={enableLanguageSelection}
                onChange={setEnableLanguageSelection}
                label="Language selection"
              />

              {enableLanguageSelection && (
                <div className="pl-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default language</label>
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Italian">Italiano</option>
                    <option value="Portuguese">Português</option>
                    <option value="Dutch">Nederlands</option>
                    <option value="Japanese">日本語</option>
                    <option value="Korean">한국어</option>
                    <option value="Chinese">中文</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commenting</label>
                <select 
                  value={commentingMode}
                  onChange={(e) => setCommentingMode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="In bottom bar">In bottom bar</option>
                  <option value="Disabled">Disabled</option>
                  <option value="As pop-up">As pop-up</option>
                </select>
              </div>
          </CollapsibleSection>

          {/* Theme Section */}
          <CollapsibleSection
            title="THEME"
            icon={<Palette className="w-4 h-4 text-gray-500" />}
            defaultOpen={true}
          >
            {/* Theme Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-800">Theme</h3>
                <button
                  onClick={() => setSelectedTheme('Organization theme')}
                  className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset all
                </button>
              </div>
              
              <div className="space-y-3">
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                >
                  <option value="Organization theme">Organization theme</option>
                  <option value="Vivid">Vivid</option>
                  <option value="Custom">Custom</option>
                  {savedThemes.map((theme) => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>

                {/* Saved Theme Management */}
                {savedThemes.includes(selectedTheme) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTheme(selectedTheme)}
                      className="flex-1 px-3 py-2 text-sm text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTheme(selectedTheme)}
                      className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {(selectedTheme === 'Custom' || editingTheme) && (
                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-cyan-700">
                        {editingTheme ? 'Edit theme name' : 'Theme name'}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={customThemeName}
                          onChange={(e) => setCustomThemeName(e.target.value)}
                          placeholder="My Custom Theme"
                          className="w-full px-3 py-2 text-sm border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                        />
                        <div className="flex space-x-2">
                          <button 
                            onClick={handleSaveTheme}
                            disabled={!customThemeName.trim()}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editingTheme ? 'Update theme' : 'Save theme'}
                          </button>
                          {editingTheme && (
                            <button 
                              onClick={() => {
                                setEditingTheme(null);
                                setCustomThemeName('');
                              }}
                              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Theme Controls */}
            {selectedTheme === 'Custom' && (
              <div className="space-y-3">
                {/* Colors */}
                <ThemeSubSection
                  title="Colors"
                  icon={<Circle className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.colors}
                  onToggle={() => toggleThemeSection('colors')}
                >
                  <div className="space-y-4">
                    {/* Background Colors */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Background</label>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-full h-full border-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Items background</label>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                            <input
                              type="color"
                              value={itemsBackgroundColor}
                              onChange={(e) => setItemsBackgroundColor(e.target.value)}
                              className="w-full h-full border-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={itemsBackgroundColor}
                            onChange={(e) => setItemsBackgroundColor(e.target.value)}
                            className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Main Color */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-700">Main color</label>
                        <button 
                          onClick={() => setSelectedPalette(selectedPalette === 'switch-to' ? 'trash' : 'switch-to')}
                          className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Switch to 🗑️
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                          <input
                            type="color"
                            value={selectedMainColor}
                            onChange={(e) => setSelectedMainColor(e.target.value)}
                            className="w-full h-full border-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={selectedMainColor}
                          onChange={(e) => setSelectedMainColor(e.target.value)}
                          className="flex-1 px-2 py-1.5 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                      
                      {/* Color Palette */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Color palette</label>
                        <div className="w-full">
                          <ColorPalette
                            colors={defaultColors}
                            selectedColor={selectedMainColor}
                            onColorSelect={setSelectedMainColor}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Typography */}
                <ThemeSubSection
                  title="Typography"
                  icon={<Type className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.typography}
                  onToggle={() => toggleThemeSection('typography')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Font family</label>
                      <select 
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                      >
                        <option value="Default (Open Sans)">Default (Open Sans)</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Custom Font">Custom Font (Upload)</option>
                      </select>
                    </div>

                    {fontFamily === 'Custom Font' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Upload Font</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                          <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 mb-2">Drop font files here or click to upload</p>
                          <input
                            type="file"
                            accept=".woff,.woff2,.ttf,.otf"
                            onChange={handleFontUpload}
                            className="hidden"
                            id="font-upload"
                          />
                          <label
                            htmlFor="font-upload"
                            className="inline-block px-3 py-1.5 text-xs bg-cyan-600 text-white rounded-lg cursor-pointer hover:bg-cyan-700 transition-colors"
                          >
                            Choose Files
                          </label>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Base font size</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={baseFontSize}
                          onChange={(e) => setBaseFontSize(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex items-center space-x-1 min-w-[50px]">
                          <span className="text-sm font-medium text-gray-700">{baseFontSize}px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Item Shadow */}
                <ThemeSubSection
                  title="Item Shadow"
                  icon={<Square className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.itemShadow}
                  onToggle={() => toggleThemeSection('itemShadow')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Size</label>
                      <div className="flex space-x-2">
                        {['S', 'M', 'L'].map((size) => (
                          <button 
                            key={size}
                            onClick={() => setShadowSize(size)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                              shadowSize === size 
                                ? 'bg-cyan-100 border border-cyan-300 text-cyan-700' 
                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Color</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                          <input
                            type="color"
                            value={shadowColor}
                            onChange={(e) => setShadowColor(e.target.value)}
                            className="w-full h-full border-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={shadowColor}
                          onChange={(e) => setShadowColor(e.target.value)}
                          className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Item Borders */}
                <ThemeSubSection
                  title="Item Borders"
                  icon={<Square className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.itemBorders}
                  onToggle={() => toggleThemeSection('itemBorders')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Width: {borderWidth}px</label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Style</label>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setBorderStyle('solid')}
                            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                              borderStyle === 'solid' ? 'bg-cyan-100 border border-cyan-300 text-cyan-700' : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            ━━
                          </button>
                          <button 
                            onClick={() => setBorderStyle('dashed')}
                            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                              borderStyle === 'dashed' ? 'bg-cyan-100 border border-cyan-300 text-cyan-700' : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            ┅┅
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Color</label>
                        <div className="w-full h-8 border border-gray-300 rounded-lg overflow-hidden">
                          <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="w-full h-full border-0 cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Roundness: {borderRoundness}px</label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={borderRoundness}
                          onChange={(e) => setBorderRoundness(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Item Titles */}
                <ThemeSubSection
                  title="Item Titles"
                  icon={<Type className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.itemTitles}
                  onToggle={() => toggleThemeSection('itemTitles')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Font size</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="range" 
                          min="10" 
                          max="24" 
                          defaultValue="13" 
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[35px]">13px</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Line height</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="range" 
                          min="20" 
                          max="60" 
                          defaultValue="40" 
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[35px]">40px</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Alignment</label>
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <AlignLeft className="w-4 h-4 mx-auto text-gray-600" />
                        </button>
                        <button className="flex-1 py-2 border border-cyan-300 bg-cyan-50 rounded-lg">
                          <AlignCenter className="w-4 h-4 mx-auto text-cyan-600" />
                        </button>
                        <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <AlignRight className="w-4 h-4 mx-auto text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Style</label>
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Bold className="w-4 h-4 mx-auto text-gray-600" />
                        </button>
                        <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Italic className="w-4 h-4 mx-auto text-gray-600" />
                        </button>
                        <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Underline className="w-4 h-4 mx-auto text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Legend */}
                <ThemeSubSection
                  title="Legend"
                  icon={<Circle className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.legend}
                  onToggle={() => toggleThemeSection('legend')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white">
                        <option value="default">Default</option>
                        <option value="compact">Compact</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Font size</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="range" 
                          min="8" 
                          max="16" 
                          defaultValue="11" 
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[35px]">11px</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Line height</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="range" 
                          min="16" 
                          max="32" 
                          defaultValue="20" 
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[35px]">20px</span>
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>

                {/* Tooltip */}
                <ThemeSubSection
                  title="Tooltip"
                  icon={<MessageSquare className="w-4 h-4 text-cyan-500" />}
                  isExpanded={expandedThemeSections.tooltip}
                  onToggle={() => toggleThemeSection('tooltip')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Background color</label>
                      <div className="w-full h-8 border border-gray-300 rounded-lg overflow-hidden">
                        <input
                          type="color"
                          defaultValue="#ffffff"
                          className="w-full h-full border-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Font size</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="range" 
                          min="10" 
                          max="18" 
                          defaultValue="13" 
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[35px]">13px</span>
                      </div>
                    </div>
                  </div>
                </ThemeSubSection>
              </div>
            )}

            {/* Theme Preview for non-custom themes */}
            {selectedTheme !== 'Custom' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="text-sm font-medium text-gray-800">{selectedTheme}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedTheme === 'Organization theme' 
                    ? 'Using your organization\'s default theme'
                    : 'A vibrant, high-contrast theme'
                  }
                </p>
              </div>
            )}
          </CollapsibleSection>

          {/* Advanced Section */}
          <CollapsibleSection
            title="ADVANCED"
            icon={<Sliders className="w-5 h-5 text-gray-600" />}
          >
              <div className="space-y-4">
                <div>
                  <Toggle
                    checked={injectCSSEnabled}
                    onChange={setInjectCSSEnabled}
                    label="Inject CSS Styles"
                  />
                  {injectCSSEnabled && (
                    <div className="pl-4 mt-2">
                      <button
                        onClick={() => setShowInjectCSS(true)}
                        className="px-3 py-2 text-sm text-cyan-600 hover:text-cyan-700 border border-cyan-200 rounded-md hover:bg-cyan-50 transition-colors"
                      >
                        Edit CSS
                      </button>
                    </div>
                  )}
                </div>

                <Toggle
                  checked={enableScheduling}
                  onChange={setEnableScheduling}
                  label="Enable Scheduling"
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Screen responsiveness</span>
                    <button
                      onClick={() => setShowScreenResponsiveness(true)}
                      className="px-3 py-2 text-sm text-cyan-600 hover:text-cyan-700 border border-cyan-200 rounded-md hover:bg-cyan-50 transition-colors"
                    >
                      Configure
                    </button>
                  </div>
                  
                  {screenMode === 'responsive' && selectedScreenSizes.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Active sizes:</span>
                        <div className="flex space-x-1">
                          {selectedScreenSizes.map((sizeId) => (
                            <button
                              key={sizeId}
                              onClick={() => handleScreenSizeClick(sizeId)}
                              className={`p-2 rounded-lg border transition-colors ${
                                activeScreenSize === sizeId
                                  ? 'border-cyan-500 bg-cyan-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              title={`Switch to ${sizeId} view`}
                            >
                              {getScreenSizeIcon(sizeId, activeScreenSize === sizeId)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Current: {screenMode === 'responsive' ? 'Responsive' : `Fixed width (${dashboardWidth}px)`}
                  </p>
                </div>

                <Toggle
                  checked={enableSettingAlerts}
                  onChange={setEnableSettingAlerts}
                  label="Enable setting alerts"
                />
              </div>
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-blue-600 font-medium mb-1">DASHBOARD ID:</div>
          <div className="text-xs text-gray-500 font-mono break-all">
            29be0ca7-ba7b-4377-a339-cfadbfeb3398
          </div>
        </div>
      </div>

      {/* Inject CSS Modal */}
      <InjectCSSModal
        isOpen={showInjectCSS}
        onClose={() => setShowInjectCSS(false)}
        onSave={handleInjectCSS}
      />

      {/* Screen Responsiveness Modal */}
      <ScreenResponsivenessModal
        isOpen={showScreenResponsiveness}
        onClose={() => setShowScreenResponsiveness(false)}
        onApply={handleScreenResponsivenessApply}
        screenMode={screenMode}
        dashboardWidth={dashboardWidth}
        selectedScreenSizes={selectedScreenSizes}
        keepItemsInSync={keepItemsInSync}
      />
    </>
  );
}
