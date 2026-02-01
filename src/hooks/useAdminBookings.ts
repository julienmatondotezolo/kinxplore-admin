'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface Booking {
  id: string;
  user_id: string;
  destination_id: string;
  booking_date: string;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  contact_email: string;
  contact_phone?: string;
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
}

export function useAdminBookings() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [isAdmin]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          destination:destinations(id, name, image, location),
          user:profiles(id, email, full_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  ) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Reload bookings
      await loadBookings();

      return data as Booking;
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

      // Reload bookings
      await loadBookings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getBookingStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      totalRevenue: bookings
        .filter((b) => b.status !== 'cancelled')
        .reduce((sum, b) => sum + Number(b.total_price), 0),
    };
  };

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    deleteBooking,
    getBookingStats,
    refreshBookings: loadBookings,
  };
}
