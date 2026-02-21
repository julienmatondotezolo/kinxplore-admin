'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface TripInquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  destination: string;
  date_from: string | null;
  date_to: string | null;
  travelers: number;
  trip_style: string | null;
  budget: string | null;
  message: string | null;
  created_at: string;
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('trip_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInquiries(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();

    const channel = supabase
      .channel('trip_inquiries_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'trip_inquiries' },
        () => {
          fetchInquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInquiries]);

  return {
    inquiries,
    loading,
    error,
    refreshInquiries: fetchInquiries,
  };
}
