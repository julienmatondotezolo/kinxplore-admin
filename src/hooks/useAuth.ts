'use client';

import { useState, useEffect } from 'react';
import { supabase, UserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      const profileData = data as UserProfile;
      setProfile(profileData);

      // Redirect non-admin users
      if (profileData.role !== 'admin') {
        router.push('/unauthorized');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/unauthorized');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if user is admin via backend
    if (data.user) {
      try {
        const { data: adminCheck } = await api.get('/auth/check-admin');
        if (!adminCheck?.isAdmin) {
          await supabase.auth.signOut();
          throw new Error('Admin access required');
        }
      } catch (err: any) {
        if (err.message === 'Admin access required') throw err;
        await supabase.auth.signOut();
        throw new Error('Admin access required');
      }
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  };

  const isAdmin = profile?.role === 'admin';

  return {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
  };
}
