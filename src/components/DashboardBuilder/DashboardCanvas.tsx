'use client';

import { useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { useDroppable } from '@dnd-kit/core';
import { WidgetConfig } from './types';
import ChartWidget from './ChartWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardCanvasProps {
  widgets: WidgetConfig[];
  selectedWidget: string | null;
  onSelectWidget: (id: string | null) => void;
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  onDeleteWidget: (id: string) => void;
}

export default function DashboardCanvas({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onDeleteWidget,
}: DashboardCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'dashboard-canvas',
  });

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    layout.forEach((item) => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        onUpdateWidget(item.i, {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
        });
      }
    });
  }, [widgets, onUpdateWidget]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectWidget(null);
    }
  };

  // Convert widgets to GridLayout format
  const layout: Layout[] = widgets.map(widget => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.width,
    h: widget.height,
  }));

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 bg-gray-50 overflow-auto relative"
      onClick={handleCanvasClick}
    >
      {widgets.length === 0 ? (
        // Empty State
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drag & drop widgets to get started
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Choose from the widget library on the left or drag data fields to automatically create visualizations
            </p>
          </div>
        </div>
      ) : (
        // Grid Layout
        <div className="p-6 min-h-full">
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={80}
            width={1200}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".widget-drag-handle"
            compactType={null}
            preventCollision={false}
            autoSize={false}
          >
            {widgets.map((widget) => (
              <div key={widget.id}>
                <ChartWidget
                  widget={widget}
                  isSelected={selectedWidget === widget.id}
                  onSelect={() => onSelectWidget(widget.id)}
                  onDelete={() => onDeleteWidget(widget.id)}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      )}
    </div>
  );
}

