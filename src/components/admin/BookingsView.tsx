'use client';

import { useState } from 'react';
import { useBookingManagement, BookingTask } from '@/hooks/useBookingManagement';
import { BookingTaskCard } from '@/components/admin/BookingTaskCard';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { BookingStatsDashboard } from '@/components/admin/BookingStatsDashboard';
import { Bell, Filter, Search, RefreshCw, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BookingsView() {
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
    if (confirm('Are you sure you want to delete this booking?')) {
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Bookings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and track all destination bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* New Booking Notification */}
          {newBookingCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-5 py-3 rounded-full border border-amber-100">
              <Bell className="w-5 h-5 animate-bounce" />
              <span className="font-bold text-sm">
                {newBookingCount} new booking(s)
              </span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={refreshBookings}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-gray-900"
          >
            <RefreshCw className="w-4 h-4 text-gray-900" />
            <span className="font-medium text-sm text-gray-900">Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statistics && <BookingStatsDashboard statistics={statistics} />}

      {/* Filters */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by guest name, email, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-900" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-5 py-3 border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-amber-50 rounded-t-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <h3 className="font-bold text-gray-900">Pending</h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                {pendingBookings.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[calc(100vh-500px)] overflow-y-auto">
            {pendingBookings.map((booking) => (
              <BookingTaskCard
                key={booking.id}
                booking={booking}
                onClick={() => handleBookingClick(booking)}
              />
            ))}
            {pendingBookings.length === 0 && (
              <p className="text-gray-600 text-center py-8 text-sm">No pending bookings</p>
            )}
          </div>
        </div>

        {/* Confirmed Column */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-blue-50 rounded-t-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-bold text-gray-900">Confirmed</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                {confirmedBookings.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[calc(100vh-500px)] overflow-y-auto">
            {confirmedBookings.map((booking) => (
              <BookingTaskCard
                key={booking.id}
                booking={booking}
                onClick={() => handleBookingClick(booking)}
              />
            ))}
            {confirmedBookings.length === 0 && (
              <p className="text-gray-600 text-center py-8 text-sm">No confirmed bookings</p>
            )}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-emerald-50 rounded-t-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <h3 className="font-bold text-gray-900">Completed</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                {completedBookings.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[calc(100vh-500px)] overflow-y-auto">
            {completedBookings.map((booking) => (
              <BookingTaskCard
                key={booking.id}
                booking={booking}
                onClick={() => handleBookingClick(booking)}
              />
            ))}
            {completedBookings.length === 0 && (
              <p className="text-gray-600 text-center py-8 text-sm">No completed bookings</p>
            )}
          </div>
        </div>
      </div>

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
