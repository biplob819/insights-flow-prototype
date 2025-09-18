'use client';

import { useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { WidgetConfig, ControlType } from './types';
import ChartWidget from './ChartWidget';
import ControlWidget from './ControlWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardCanvasProps {
  widgets: WidgetConfig[];
  selectedWidget: string | null;
  onSelectWidget: (id: string | null) => void;
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  onDeleteWidget: (id: string) => void;
  onCloneWidget?: (widget: WidgetConfig) => void;
  onCommentOnWidget?: (widgetId: string, widgetTitle: string) => void;
}

export default function DashboardCanvas({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onDeleteWidget,
  onCloneWidget,
  onCommentOnWidget,
}: DashboardCanvasProps) {

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    layout.forEach((item) => {
      onUpdateWidget(item.i, {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      });
    });
  }, [onUpdateWidget]);

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
      className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto relative"
      onClick={handleCanvasClick}
    >
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {widgets.length === 0 ? (
        // Enhanced Empty State
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Start Building Your Dashboard
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Click the <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-sm font-medium">+ Add</span> button in the header to add charts and create your first visualization.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Click to Add</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Auto-Resize</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Grid Layout</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Enhanced Grid Layout
        <div className="p-8 min-h-full relative">
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
            margin={[16, 16]}
            containerPadding={[0, 0]}
          >
            {widgets.map((widget) => {
              const isControlWidget = widget.controlConfig !== undefined;
              
              return (
                <div key={widget.id} className="relative">
                  {isControlWidget ? (
                    <ControlWidget
                      widget={widget}
                      isSelected={selectedWidget === widget.id}
                      onSelect={() => onSelectWidget(widget.id)}
                      onDelete={() => onDeleteWidget(widget.id)}
                      onClone={() => {
                        if (onCloneWidget) {
                          const clonedWidget: WidgetConfig = {
                            ...widget,
                            id: `control-${Date.now()}`,
                            x: widget.x + 1,
                            y: widget.y + 1,
                            controlConfig: widget.controlConfig ? {
                              ...widget.controlConfig,
                              controlId: `control-${Date.now()}`
                            } : undefined
                          };
                          onCloneWidget(clonedWidget);
                        }
                      }}
                      onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
                    />
                  ) : (
                    <ChartWidget
                      widget={widget}
                      isSelected={selectedWidget === widget.id}
                      onSelect={() => onSelectWidget(widget.id)}
                      onDelete={() => onDeleteWidget(widget.id)}
                      onClone={onCloneWidget}
                      onUpdateWidget={(updates) => onUpdateWidget(widget.id, updates)}
                      onCommentOnWidget={onCommentOnWidget}
                    />
                  )}
                </div>
              );
            })}
          </GridLayout>
        </div>
      )}
    </div>
  );
}

