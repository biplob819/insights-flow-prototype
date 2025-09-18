'use client';

import { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

interface CustomEvent {
  id: string;
  menuLabel: string;
  eventName: string;
}

interface CustomEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: CustomEvent[]) => void;
  initialEvents?: CustomEvent[];
}

export default function CustomEventsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialEvents = [] 
}: CustomEventsModalProps) {
  const [events, setEvents] = useState<CustomEvent[]>(initialEvents.length > 0 ? initialEvents : [
    { id: '1', menuLabel: 'ABC', eventName: 'ABC' }
  ]);

  const addEvent = () => {
    const newEvent: CustomEvent = {
      id: Date.now().toString(),
      menuLabel: '',
      eventName: ''
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, field: 'menuLabel' | 'eventName', value: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleSave = () => {
    onSave(events);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit custom events</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Custom events can be used when integrating this dashboard in your application or platform. When
            active, clicking on data in the chart will trigger an event to which you can listen to.
          </p>

          {/* Event Menu */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">EVENT MENU</h3>
            
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Menu item label</label>
                    <input
                      type="text"
                      value={event.menuLabel}
                      onChange={(e) => updateEvent(event.id, 'menuLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ABC"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Event name</label>
                    <input
                      type="text"
                      value={event.eventName}
                      onChange={(e) => updateEvent(event.id, 'eventName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ABC"
                    />
                  </div>
                  
                  <div className="pt-5">
                    <button
                      onClick={() => removeEvent(event.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Event Option */}
            <button
              onClick={addEvent}
              className="mt-4 flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add an event option</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
