'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBookingManagement, BookingTask } from '@/hooks/useBookingManagement';
import { BookingTaskCard } from '@/components/admin/BookingTaskCard';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { BookingStatsDashboard } from '@/components/admin/BookingStatsDashboard';
import { Bell, Filter, Search, RefreshCw } from 'lucide-react';

export default function BookingsPage() {
  const t = useTranslations();
  const {
    bookings,
    statistics,
    loading,
    newBookingCount,
    updateBooking,
    deleteBooking,
    refreshBookings,
    clearNewBookingNotification,
    getBookingsByStatus,
  } = useBookingManagement();

  const [selectedBooking, setSelectedBooking] = useState<BookingTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [view, setView] = useState<'board' | 'list'>('board');

  const handleBookingClick = (booking: BookingTask) => {
    setSelectedBooking(booking);
    if (booking.status === 'pending' && newBookingCount > 0) {
      clearNewBookingNotification();
    }
  };

  const handleUpdateBooking = async (
    bookingId: string,
    updates: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assigned_to?: string;
      admin_notes?: string;
    }
  ) => {
    try {
      await updateBooking(bookingId, updates);
      if (selectedBooking?.id === bookingId) {
        const updatedBooking = bookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setSelectedBooking(updatedBooking);
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm(t('bookings.confirmDelete'))) {
      try {
        await deleteBooking(bookingId);
        setSelectedBooking(null);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const filterBookings = (bookingsList: BookingTask[]) => {
    return bookingsList.filter(booking => {
      const matchesSearch = 
        booking.guest_first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.guest_last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || booking.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  };

  const pendingBookings = filterBookings(getBookingsByStatus('pending'));
  const confirmedBookings = filterBookings(getBookingsByStatus('confirmed'));
  const completedBookings = filterBookings(getBookingsByStatus('completed'));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('bookings.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('bookings.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* New Booking Notification */}
            {newBookingCount > 0 && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                <Bell className="w-5 h-5 animate-bounce" />
                <span className="font-semibold">
                  {newBookingCount} {t('bookings.newBookings')}
                </span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={refreshBookings}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t('common.refresh')}
            </button>

            {/* View Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('board')}
                className={`px-4 py-2 ${view === 'board' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {t('bookings.boardView')}
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {t('bookings.listView')}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {statistics && <BookingStatsDashboard statistics={statistics} />}

        {/* Filters */}
        <div className="flex gap-4 mt-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('bookings.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('bookings.allPriorities')}</option>
              <option value="urgent">{t('bookings.priority.urgent')}</option>
              <option value="high">{t('bookings.priority.high')}</option>
              <option value="medium">{t('bookings.priority.medium')}</option>
              <option value="low">{t('bookings.priority.low')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column (Pending) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">
                    {t('bookings.status.pending')}
                  </h3>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {pendingBookings.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {pendingBookings.map((booking) => (
                <BookingTaskCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => handleBookingClick(booking)}
                />
              ))}
              {pendingBookings.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {t('bookings.noPendingBookings')}
                </p>
              )}
            </div>
          </div>

          {/* In Progress Column (Confirmed) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">
                    {t('bookings.status.confirmed')}
                  </h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {confirmedBookings.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {confirmedBookings.map((booking) => (
                <BookingTaskCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => handleBookingClick(booking)}
                />
              ))}
              {confirmedBookings.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {t('bookings.noConfirmedBookings')}
                </p>
              )}
            </div>
          </div>

          {/* Done Column (Completed) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">
                    {t('bookings.status.completed')}
                  </h3>
                </div>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {completedBookings.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {completedBookings.map((booking) => (
                <BookingTaskCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => handleBookingClick(booking)}
                />
              ))}
              {completedBookings.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {t('bookings.noCompletedBookings')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
          onDelete={handleDeleteBooking}
        />
      )}
    </div>
  );
}
