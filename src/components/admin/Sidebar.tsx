'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  ChevronDown,
  Route
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type ViewType = 'dashboard' | 'destinations' | 'categories' | 'bookings' | 'subcategories' | 'facilities' | 'trips';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { signOut, profile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const navItems = [
    { name: 'Dashboard', view: 'dashboard' as ViewType, icon: LayoutDashboard },
    { name: 'Destination', view: 'destinations' as ViewType, icon: MapPin },
    { 
      name: 'Categories', 
      view: 'categories' as ViewType, 
      icon: Layers,
      hasSubmenu: true,
      submenu: [
        { name: 'Subcategories', view: 'subcategories' as ViewType },
        { name: 'Facilities', view: 'facilities' as ViewType }
      ]
    },
    { name: 'Trips', view: 'trips' as ViewType, icon: Route },
    { name: 'Bookings', view: 'bookings' as ViewType, icon: Calendar },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm transition-all duration-300`}>
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 bg-black rounded-[20px] flex items-center justify-center shadow-lg shadow-black/10">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-gray-900">Kinxplore</span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="px-4 mb-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full p-2 rounded-[20px] hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center"
            title="Expand sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const active = currentView === item.view;
          const hasSubmenu = item.hasSubmenu;
          const isExpanded = hasSubmenu && categoriesExpanded;
          
          return (
            <div key={item.name}>
              <button
                onClick={() => {
                  if (hasSubmenu && !isCollapsed) {
                    setCategoriesExpanded(!categoriesExpanded);
                  }
                  onViewChange(item.view);
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-[20px] transition-all duration-200 group ${
                  active 
                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-900'}`} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </div>
                {!isCollapsed && hasSubmenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${active ? 'text-white/60' : 'text-gray-900/60'}`} />
                )}
                {!isCollapsed && !hasSubmenu && active && <ChevronRight className="w-4 h-4 text-white/60" />}
              </button>
              
              {/* Submenu */}
              {hasSubmenu && isExpanded && !isCollapsed && item.submenu && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => {
                    const subActive = currentView === subItem.view;
                    return (
                      <button
                        key={subItem.name}
                        onClick={() => onViewChange(subItem.view)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[20px] transition-all duration-200 text-sm ${
                          subActive
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{subItem.name}</span>
                        {subActive && <ChevronRight className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed ? (
          <>
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
          </>
        ) : (
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-[20px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-gray-900 font-bold overflow-hidden border border-gray-100 shadow-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-full h-full object-cover" />
              ) : (
                profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A'
              )}
            </div>
            <button 
              className="p-2.5 rounded-[20px] text-gray-900 hover:bg-gray-50 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-900" />
            </button>
            <button 
              onClick={signOut}
              className="p-2.5 rounded-[20px] text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
