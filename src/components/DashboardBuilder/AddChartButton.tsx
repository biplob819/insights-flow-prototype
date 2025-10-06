'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ChartSelectionModal from './ChartSelectionModal';
import { WidgetConfig } from './types';

interface AddChartButtonProps {
  onAddWidget: (widget: WidgetConfig) => void;
}

export default function AddChartButton({ onAddWidget }: AddChartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddChart = (widget: WidgetConfig) => {
    onAddWidget(widget);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-[60] group"
        title="Add Element"
      >
        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chart Selection Modal */}
      <ChartSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectChart={handleAddChart}
      />
    </>
  );
}
