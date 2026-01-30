import { useStore } from '@/store';
import { cn } from '@/utils/cn';
import { 
  LayoutDashboard, 
  Building2, 
  DoorOpen,
  MessageSquareWarning,
  BarChart3,
  LogOut,
  User,
  Wrench,
  GraduationCap,
  Shield,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { currentUser, logout } = useStore();

  const getMenuItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'hostels', icon: Building2, label: 'Hostels' },
          { id: 'rooms', icon: DoorOpen, label: 'Rooms' },
          { id: 'students', icon: GraduationCap, label: 'Students' },
          { id: 'staff', icon: Wrench, label: 'Staff' },
          { id: 'wardens', icon: Shield, label: 'Wardens' },
          { id: 'complaints', icon: MessageSquareWarning, label: 'Complaints' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'warden':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'rooms', icon: DoorOpen, label: 'Rooms' },
          { id: 'students', icon: GraduationCap, label: 'Students' },
          { id: 'staff', icon: Wrench, label: 'Staff' },
          { id: 'complaints', icon: MessageSquareWarning, label: 'Complaints' },
        ];
      case 'staff':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'tasks', icon: MessageSquareWarning, label: 'My Tasks' },
        ];
      case 'student':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'room', icon: Home, label: 'My Room' },
          { id: 'complaints', icon: MessageSquareWarning, label: 'My Complaints' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin': return <Shield className="w-5 h-5" />;
      case 'warden': return <Shield className="w-5 h-5" />;
      case 'staff': return <Wrench className="w-5 h-5" />;
      case 'student': return <GraduationCap className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'admin': return 'from-red-500 to-orange-500';
      case 'warden': return 'from-violet-500 to-purple-500';
      case 'staff': return 'from-emerald-500 to-teal-500';
      case 'student': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hostel-Hive</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className={cn(
            'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center',
            getRoleColor()
          )}>
            {getRoleIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.fullName}</p>
            <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
              activeTab === item.id
                ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white border border-violet-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
