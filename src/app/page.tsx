'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardGrid from '@/components/DashboardGrid';
import ChatPanel from '@/components/ChatPanel/ChatPanel';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | undefined>();
  const [selectedWidgetTitle, setSelectedWidgetTitle] = useState<string | undefined>();

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCommentOnWidget = (widgetId: string, widgetTitle: string) => {
    setSelectedWidgetId(widgetId);
    setSelectedWidgetTitle(widgetTitle);
    setIsChatOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
        {/* Header */}
        <Header onToggleChat={handleToggleChat} isChatOpen={isChatOpen} />
        
        {/* Main Dashboard Area */}
        <main className="flex-1 overflow-y-auto">
          <DashboardGrid onCommentOnWidget={handleCommentOnWidget} />
        </main>
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedWidgetId={selectedWidgetId}
        selectedWidgetTitle={selectedWidgetTitle}
        onCommentOnWidget={(widgetId, comment) => {
          console.log('Comment on widget:', widgetId, comment);
        }}
      />
    </div>
  );
}
