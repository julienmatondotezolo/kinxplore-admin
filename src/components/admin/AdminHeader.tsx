'use client';

import { useAuth } from '@/hooks/useAuth';
import { Search, Bell, Settings, Search as SearchIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function AdminHeader() {
  const { profile } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 py-4">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
            <button className="relative p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {profile?.full_name || 'Sarah Johnson'}
                </p>
                <p className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-wider">
                  {profile?.role || 'Store Manager'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold">
                    {profile?.full_name?.[0] || 'S'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
