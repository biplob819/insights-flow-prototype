'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import DashboardHeader from './DashboardHeader';
import WidgetSidebar from './WidgetSidebar';
import DashboardCanvas from './DashboardCanvas';
import DataPanel from './DataPanel';
import PropertyPanel from './PropertyPanel';
import { WidgetConfig } from './types';

export default function DashboardBuilder() {
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [dashboardTitle, setDashboardTitle] = useState('Untitled Dashboard');
  const [, setActiveId] = useState<string | null>(null);

  const handleAddWidget = (widget: WidgetConfig) => {
    setWidgets([...widgets, widget]);
  };

  const handleUpdateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  };

  const handleSelectWidget = (id: string | null) => {
    setSelectedWidget(id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'dashboard-canvas') {
      // Check if dragging from widget sidebar
      if (active.data.current && active.data.current.type) {
        const newWidget: WidgetConfig = {
          id: `widget-${Date.now()}`,
          type: active.data.current.type,
          title: active.data.current.title,
          x: 0,
          y: 0,
          width: 4,
          height: 3,
        };
        handleAddWidget(newWidget);
      }
      // Check if dragging from data panel
      else if (active.data.current && active.data.current.field) {
        const field = active.data.current.field;
        const newWidget: WidgetConfig = {
          id: `widget-${Date.now()}`,
          type: field.type === 'number' ? 'bar' : 'table',
          title: `${field.name} Analysis`,
          x: 0,
          y: 0,
          width: 4,
          height: 3,
          config: {
            metric: field.id,
          }
        };
        handleAddWidget(newWidget);
      }
    }
    
    setActiveId(null);
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Widget Library */}
      <WidgetSidebar onAddWidget={handleAddWidget} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          title={dashboardTitle}
          onTitleChange={setDashboardTitle}
          onToggleDataPanel={() => setIsDataPanelOpen(!isDataPanelOpen)}
          isDataPanelOpen={isDataPanelOpen}
        />

        {/* Canvas and Data Panel Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Data Panel */}
          {isDataPanelOpen && (
            <DataPanel />
          )}

          {/* Dashboard Canvas */}
          <DashboardCanvas
            widgets={widgets}
            selectedWidget={selectedWidget}
            onSelectWidget={handleSelectWidget}
            onUpdateWidget={handleUpdateWidget}
            onDeleteWidget={handleDeleteWidget}
          />

          {/* Property Panel */}
          {selectedWidget && (
            <PropertyPanel
              widget={widgets.find(w => w.id === selectedWidget)}
              onUpdateWidget={(updates) => handleUpdateWidget(selectedWidget, updates)}
              onClose={() => setSelectedWidget(null)}
            />
          )}
        </div>
      </div>
    </div>
    </DndContext>
  );
}
