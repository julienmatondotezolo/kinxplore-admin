'use client';

import { useAdminUsers } from '@/hooks/useAdminUsers';
import { User, Mail, Shield, MoreVertical } from 'lucide-react';

export function UsersSidebar() {
  const { users, loading } = useAdminUsers();

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Customer Insights</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your user base</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">New Customers</p>
                <p className="text-xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">This week</span>
          </div>
        </div>

        {/* User List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Top Customers</h4>
            <button className="text-xs font-medium text-blue-600 hover:underline">View all</button>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse px-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                    <div className="h-2 bg-gray-100 rounded w-32"></div>
                  </div>
                </div>
              ))
            ) : (
              users.slice(0, 10).map((user) => (
                <div key={user.id} className="flex items-center gap-3 group px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold overflow-hidden border border-gray-200">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {user.full_name || 'Anonymous User'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3 text-purple-500" />
                      ) : (
                        <Mail className="w-3 h-3 text-gray-400" />
                      )}
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Retention Placeholder */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Customer Retention</h4>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">60% retention rate</span>
            <span className="text-xs font-medium text-green-600">+2.4% from last month</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
