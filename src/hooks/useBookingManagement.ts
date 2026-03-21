'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { api } from '@/lib/api';

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
      const { data } = await api.get('/bookings/admin/all');
      setBookings((data.bookings || data) as BookingTask[]);
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
      const { data } = await api.get('/bookings/admin/statistics');
      setStatistics(data as BookingStatistics);
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

  // Real-time subscription for new bookings (keep Supabase realtime — it's client-side only)
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
        () => {
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
      const { data } = await api.put(`/bookings/admin/${bookingId}`, updates);

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
      await api.delete(`/bookings/admin/${bookingId}`);
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
