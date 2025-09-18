'use client';

import { useState, useCallback } from 'react';
import { Database, BarChart3, LineChart, PieChart, DollarSign, Percent, Hash, Calendar, Type } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DashboardHeader from './DashboardHeader';
import DashboardCanvas from './DashboardCanvas';
import ConfigurePanel from './ConfigurePanel';
import ControlConfigPanel from './ControlConfigPanel';
import DashboardSettingsPanel from './DashboardSettingsPanel';
import ChatPanel from '../ChatPanel/ChatPanel';
import { WidgetConfig } from './types';
import { availableDatasets } from './sampleData';
import { ControlProvider } from './contexts/ControlContext';

// Helper function to generate formula text for the formula bar
const getFormulaText = (selectedWidgetId: string, widgets: WidgetConfig[]): string => {
  const widget = widgets.find(w => w.id === selectedWidgetId);
  if (!widget) return '';
  
  const config = widget.config;
  if (widget.type === 'bar') {
    const xAxis = config?.xAxisName || config?.xAxis || '';
    const yFields = config?.yAxisNames || config?.yAxisFields || [];
    
    if (xAxis && yFields.length > 0) {
      return `Sum([${yFields.join('], [')}]) by [${xAxis}]`;
    }
  }
  
  return `Configure ${widget.type} chart`;
};

export default function DashboardBuilder() {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [dashboardTitle, setDashboardTitle] = useState('Untitled Dashboard');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [dashboardSubtitle, setDashboardSubtitle] = useState('');
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] = useState(false);
  const [isControlConfigPanelOpen, setIsControlConfigPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedWidgetForComment, setSelectedWidgetForComment] = useState<{id: string, title: string} | null>(null);

  const handleAddWidget = useCallback((widget: WidgetConfig) => {
    setWidgets(widgets => [...widgets, widget]);
    setSelectedWidget(widget.id);
    // Close settings panel when adding widget
    setIsSettingsPanelOpen(false);
    // Open appropriate configure panel
    if (widget.controlConfig) {
      // Control widget
      setIsControlConfigPanelOpen(true);
    } else if (widget.type === 'bar') {
      // Chart widget
      setIsConfigurePanelOpen(true);
    }
  }, []);

  const handleUpdateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(widgets => widgets.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  }, []);

  const handleDeleteWidget = useCallback((id: string) => {
    setWidgets(widgets => widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  }, []);

  const handleCloneWidget = useCallback((widget: WidgetConfig) => {
    setWidgets(widgets => [...widgets, widget]);
    setSelectedWidget(widget.id);
  }, []);

  const handleSelectWidget = useCallback((id: string | null) => {
    setSelectedWidget(id);
    // Close settings panel when selecting widget
    setIsSettingsPanelOpen(false);
    // Open appropriate configure panel
    if (id) {
      const widget = widgets.find(w => w.id === id);
      if (widget) {
        if (widget.controlConfig) {
          setIsControlConfigPanelOpen(true);
        } else if (widget.type === 'bar') {
          setIsConfigurePanelOpen(true);
        }
      }
    }
  }, [widgets]);

  const handleFormatAction = useCallback((widgetId: string, formatType: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    // Apply format to the first Y-axis field
    const firstYField = widget.config?.yAxisFields?.[0];
    if (firstYField) {
      handleUpdateWidget(widgetId, {
        config: {
          ...widget.config,
          [`${firstYField}_format`]: formatType
        }
      });
    }
  }, [widgets, handleUpdateWidget]);

  const handleOpenSettings = useCallback(() => {
    // Close other panels when opening settings
    setIsConfigurePanelOpen(false);
    setIsControlConfigPanelOpen(false);
    setIsSettingsPanelOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsPanelOpen(false);
  }, []);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCommentOnWidget = (widgetId: string, widgetTitle: string) => {
    setSelectedWidgetForComment({ id: widgetId, title: widgetTitle });
    setIsChatOpen(true);
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !selectedWidget) return;
    
    const draggedFieldData = active.data.current;
    if (!draggedFieldData?.field) return;
    
    const field = draggedFieldData.field;
    const widget = widgets.find(w => w.id === selectedWidget);
    if (!widget) return;
    
    if (over.id === 'x-axis-drop' && field.type === 'string') {
      handleUpdateWidget(selectedWidget, {
        config: {
          ...widget.config,
          xAxis: field.id,
          xAxisName: field.name,
          xAxisType: field.type
        }
      });
    } else if (over.id === 'y-axis-drop' && field.type === 'number') {
      const currentYFields = widget.config?.yAxisFields || [];
      const newYFields = currentYFields.includes(field.id) 
        ? currentYFields 
        : [...currentYFields, field.id];
      
      const newYNames = newYFields.map(fieldId => {
        const fieldInfo = availableDatasets
          .flatMap(d => d.fields)
          .find(f => f.id === fieldId);
        return fieldInfo?.name || fieldId;
      });
      
      handleUpdateWidget(selectedWidget, {
        config: {
          ...widget.config,
          yAxisFields: newYFields,
          yAxisNames: newYNames
        }
      });
    }
  }, [selectedWidget, widgets, handleUpdateWidget]);

  const selectedWidgetData = selectedWidget ? widgets.find(w => w.id === selectedWidget) : null;

  return (
    <ControlProvider>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex h-screen bg-gray-50">
      {/* Configure Panel */}
      <ConfigurePanel
        isOpen={isConfigurePanelOpen}
        onClose={() => setIsConfigurePanelOpen(false)}
        widget={selectedWidgetData || null}
        onUpdateWidget={handleUpdateWidget}
      />
      
      {/* Control Configuration Panel */}
      <ControlConfigPanel
        isOpen={isControlConfigPanelOpen}
        onClose={() => setIsControlConfigPanelOpen(false)}
        widget={selectedWidgetData || null}
        onUpdateWidget={handleUpdateWidget}
        allWidgets={widgets}
      />

      {/* Dashboard Settings Panel */}
      <DashboardSettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={handleCloseSettings}
        dashboardTitle={dashboardTitle}
        onDashboardTitleChange={setDashboardTitle}
        showSubtitle={showSubtitle}
        onSubtitleToggle={setShowSubtitle}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${(isConfigurePanelOpen || isSettingsPanelOpen) ? 'ml-80' : ''} ${isControlConfigPanelOpen ? 'mr-96' : ''} ${isChatOpen ? 'mr-96' : ''} transition-all duration-300`}>
        {/* Header */}
        <DashboardHeader 
          title={dashboardTitle}
          onTitleChange={setDashboardTitle}
          onAddWidget={handleAddWidget}
          onOpenSettings={handleOpenSettings}
          showSubtitle={showSubtitle}
          subtitle={dashboardSubtitle}
          onSubtitleChange={setDashboardSubtitle}
          onToggleChat={handleToggleChat}
          isChatOpen={isChatOpen}
        />

        {/* Canvas and Data Panel Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Formula Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4">
              {/* Modern Formatting Toolbar */}
              <div className="flex items-center">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 space-x-1">
                  <button
                    onClick={() => selectedWidget && handleFormatAction(selectedWidget, 'currency')}
                    disabled={!selectedWidget}
                    className={`p-2 rounded-md transition-all duration-200 group relative ${
                      selectedWidget 
                        ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-cyan-600' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title="Format as Currency"
                  >
                    <DollarSign className="w-4 h-4" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Currency
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectedWidget && handleFormatAction(selectedWidget, 'percentage')}
                    disabled={!selectedWidget}
                    className={`p-2 rounded-md transition-all duration-200 group relative ${
                      selectedWidget 
                        ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-cyan-600' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title="Format as Percentage"
                  >
                    <Percent className="w-4 h-4" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Percentage
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectedWidget && handleFormatAction(selectedWidget, 'number')}
                    disabled={!selectedWidget}
                    className={`p-2 rounded-md transition-all duration-200 group relative ${
                      selectedWidget 
                        ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-cyan-600' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title="Format as Number"
                  >
                    <Hash className="w-4 h-4" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Number
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectedWidget && handleFormatAction(selectedWidget, 'date')}
                    disabled={!selectedWidget}
                    className={`p-2 rounded-md transition-all duration-200 group relative ${
                      selectedWidget 
                        ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-cyan-600' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title="Format as Date"
                  >
                    <Calendar className="w-4 h-4" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Date
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectedWidget && handleFormatAction(selectedWidget, 'text')}
                    disabled={!selectedWidget}
                    className={`p-2 rounded-md transition-all duration-200 group relative ${
                      selectedWidget 
                        ? 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-cyan-600' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title="Format as Text"
                  >
                    <Type className="w-4 h-4" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Text
                    </div>
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300"></div>
              
              {/* Widget Info & Formula Input */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  {selectedWidget ? (
                    <>
                      {selectedWidget && widgets.find(w => w.id === selectedWidget)?.type === 'bar' && (
                        <div className="p-1.5 bg-cyan-50 rounded-md">
                          <BarChart3 className="w-4 h-4 text-cyan-600" />
                        </div>
                      )}
                      {selectedWidget && widgets.find(w => w.id === selectedWidget)?.type === 'line' && (
                        <div className="p-1.5 bg-green-50 rounded-md">
                          <LineChart className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {selectedWidget && widgets.find(w => w.id === selectedWidget)?.type === 'pie' && (
                        <div className="p-1.5 bg-orange-50 rounded-md">
                          <PieChart className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                      {!['bar', 'line', 'pie'].includes(widgets.find(w => w.id === selectedWidget)?.type || '') && (
                        <div className="p-1.5 bg-gray-50 rounded-md">
                          <Database className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {widgets.find(w => w.id === selectedWidget)?.title || 'Untitled Widget'}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {widgets.find(w => w.id === selectedWidget)?.type || 'widget'} chart
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-1.5 bg-gray-50 rounded-md">
                        <Database className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Formula Bar</span>
                        <span className="text-xs text-gray-400">Select a widget to configure</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Formula Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={selectedWidget ? "Configure selected widget..." : "Select a widget to edit formulas"}
                    className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-colors"
                    disabled={!selectedWidget}
                    value={selectedWidget ? getFormulaText(selectedWidget, widgets) : ''}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Dashboard Canvas */}
            <DashboardCanvas
              widgets={widgets}
              selectedWidget={selectedWidget}
              onSelectWidget={handleSelectWidget}
              onUpdateWidget={handleUpdateWidget}
              onDeleteWidget={handleDeleteWidget}
              onCloneWidget={handleCloneWidget}
              onCommentOnWidget={handleCommentOnWidget}
            />
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedWidgetId={selectedWidgetForComment?.id}
        selectedWidgetTitle={selectedWidgetForComment?.title}
        onCommentOnWidget={(widgetId, comment) => {
          console.log('Comment on widget:', widgetId, comment);
        }}
      />

        </div>
      </DndContext>
    </ControlProvider>
  );
}
