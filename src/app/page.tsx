import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardGrid from '@/components/DashboardGrid';

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header />
        
        {/* Main Dashboard Area */}
        <main className="flex-1 overflow-y-auto">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
}
