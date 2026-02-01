'use client';

import { 
  LayoutDashboard, 
  MapPin, 
  Layers, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type ViewType = 'dashboard' | 'destinations' | 'categories' | 'bookings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { signOut, profile } = useAuth();

  const navItems = [
    { name: 'Dashboard', view: 'dashboard' as ViewType, icon: LayoutDashboard },
    { name: 'Destination', view: 'destinations' as ViewType, icon: MapPin },
    { name: 'Categories', view: 'categories' as ViewType, icon: Layers },
    { name: 'Bookings', view: 'bookings' as ViewType, icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo Area */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-[20px] flex items-center justify-center shadow-lg shadow-black/10">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Kinxplore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const active = currentView === item.view;
          return (
            <button
              key={item.name}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[20px] transition-all duration-200 group ${
                active 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-900'}`} />
                <span className="font-medium">{item.name}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4 text-white/60" />}
            </button>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-10 h-10 rounded-[20px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-gray-900 font-bold overflow-hidden border border-gray-100 shadow-sm">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-full h-full object-cover" />
            ) : (
              profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {profile?.full_name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email || 'admin@kinxplore.com'}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[20px] text-gray-900 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-900" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[20px] text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
