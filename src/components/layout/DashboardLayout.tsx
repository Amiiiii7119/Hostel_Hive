import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useStore } from '@/store';
import { AdminDashboard } from '@/dashboards/AdminDashboard';
import { WardenDashboard } from '@/dashboards/WardenDashboard';
import { StaffDashboard } from '@/dashboards/StaffDashboard';
import { StudentDashboard } from '@/dashboards/StudentDashboard';

export function DashboardLayout() {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} />;
      case 'warden':
        return <WardenDashboard activeTab={activeTab} />;
      case 'staff':
        return <StaffDashboard activeTab={activeTab} />;
      case 'student':
        return <StudentDashboard activeTab={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 min-h-screen p-8 relative">
        {renderDashboard()}
      </main>
    </div>
  );
}
