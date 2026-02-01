'use client';

import { BookingTask } from '@/hooks/useBookingManagement';
import { Calendar, Users, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BookingTaskCardProps {
  booking: BookingTask;
  onClick: () => void;
}

export function BookingTaskCard({ booking, onClick }: BookingTaskCardProps) {
  const t = useTranslations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(booking.priority || 'medium')}`}
        >
          {t(`bookings.priority.${booking.priority || 'medium'}`)}
        </span>
        <span className="text-xs text-gray-500">
          {getTimeAgo(booking.created_at)}
        </span>
      </div>

      {/* Guest Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {booking.guest_first_name} {booking.guest_last_name}
        </h4>
        <p className="text-sm text-gray-600">{booking.contact_email}</p>
      </div>

      {/* Destination */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="truncate">{booking.destination?.name || 'N/A'}</span>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>
          {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
        </span>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
        <Users className="w-4 h-4 text-gray-400" />
        <span>
          {booking.number_of_guests} {booking.number_of_guests === 1 ? 'guest' : 'guests'}
        </span>
      </div>

      {/* Special Requests Indicator */}
      {booking.special_requests && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          <AlertCircle className="w-3 h-3" />
          <span>Has special requests</span>
        </div>
      )}

      {/* Assigned Admin */}
      {booking.assigned_admin && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">
                {booking.assigned_admin.full_name?.charAt(0) || booking.assigned_admin.email.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              {booking.assigned_admin.full_name || booking.assigned_admin.email}
            </span>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-lg font-bold text-gray-900">
          €{Number(booking.total_price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
