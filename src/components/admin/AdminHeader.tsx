'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kinxplore Admin
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {profile?.full_name || profile?.email}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {profile?.full_name || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile?.email}
            </p>
          </div>

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Admin'}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          )}

          <button
            onClick={signOut}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
