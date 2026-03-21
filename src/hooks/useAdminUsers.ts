'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { api } from '@/lib/api';

export function useAdminUsers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/admin/users');
      setUsers(data as UserProfile[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      const { data } = await api.put(`/auth/admin/users/${userId}/role`, { role });

      // Reload users
      await loadUsers();

      return data as UserProfile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
      regularUsers: users.filter((u) => u.role === 'user').length,
    };
  };

  return {
    users,
    loading,
    error,
    updateUserRole,
    getUserStats,
    refreshUsers: loadUsers,
  };
}
