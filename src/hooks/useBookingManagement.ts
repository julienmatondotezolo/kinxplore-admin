'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface BookingTask {
  id: string;
  user_id: string;
  destination_id: string;
  booking_date: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  special_requests?: string;
  contact_email: string;
  contact_phone?: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_country: string;
  guest_address: string;
  guest_city: string;
  guest_zip_code: string;
  assigned_to?: string;
  admin_notes?: string;
  last_status_change_at?: string;
  last_status_change_by?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  destination?: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
  user?: {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
  };
  assigned_admin?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface BookingStatistics {
  total: number;
  byStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
  totalRevenue: number;
}

export function useBookingManagement() {
  const { isAdmin, user } = useAuth();
  const [bookings, setBookings] = useState<BookingTask[]>([]);
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBookingCount, setNewBookingCount] = useState(0);

  const loadBookings = useCallback(async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          destination:destinations(id, name, image, location),
          user:profiles!bookings_user_id_fkey(id, email, full_name, phone),
          assigned_admin:profiles!bookings_assigned_to_fkey(id, email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data as BookingTask[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadStatistics = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, priority, created_at, total_price');

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: BookingStatistics = {
        total: data.length,
        byStatus: {
          pending: data.filter(b => b.status === 'pending').length,
          confirmed: data.filter(b => b.status === 'confirmed').length,
          cancelled: data.filter(b => b.status === 'cancelled').length,
          completed: data.filter(b => b.status === 'completed').length,
        },
        byPriority: {
          low: data.filter(b => b.priority === 'low').length,
          medium: data.filter(b => b.priority === 'medium').length,
          high: data.filter(b => b.priority === 'high').length,
          urgent: data.filter(b => b.priority === 'urgent').length,
        },
        newToday: data.filter(b => new Date(b.created_at) >= today).length,
        newThisWeek: data.filter(b => new Date(b.created_at) >= thisWeek).length,
        newThisMonth: data.filter(b => new Date(b.created_at) >= thisMonth).length,
        totalRevenue: data
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, b) => sum + Number(b.total_price), 0),
      };

      setStatistics(stats);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
      loadStatistics();
    }
  }, [isAdmin, loadBookings, loadStatistics]);

  // Real-time subscription for new bookings
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('New booking received:', payload);
          setNewBookingCount(prev => prev + 1);
          loadBookings();
          loadStatistics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          loadBookings();
          loadStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, loadBookings, loadStatistics]);

  const updateBooking = async (
    bookingId: string,
    updates: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assigned_to?: string;
      admin_notes?: string;
    }
  ) => {
    try {
      const updateData: any = { ...updates };
      
      if (updates.status) {
        updateData.last_status_change_by = user?.id;
        updateData.last_status_change_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select(`
          *,
          destination:destinations(id, name, image, location),
          user:profiles!bookings_user_id_fkey(id, email, full_name, phone),
          assigned_admin:profiles!bookings_assigned_to_fkey(id, email, full_name)
        `)
        .single();

      if (error) throw error;

      // Update local state
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? data as BookingTask : b))
      );

      await loadStatistics();

      return data as BookingTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.filter(b => b.id !== bookingId));
      await loadStatistics();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const clearNewBookingNotification = () => {
    setNewBookingCount(0);
  };

  const getBookingsByStatus = (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    return bookings.filter(b => b.status === status);
  };

  return {
    bookings,
    statistics,
    loading,
    error,
    newBookingCount,
    updateBooking,
    deleteBooking,
    refreshBookings: loadBookings,
    clearNewBookingNotification,
    getBookingsByStatus,
  };
}
