'use client';

import { useState } from 'react';
import { BookingTask } from '@/hooks/useBookingManagement';
import { useTranslations } from 'next-intl';
import {
  X,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Home,
  Globe,
  FileText,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface BookingDetailModalProps {
  booking: BookingTask;
  onClose: () => void;
  onUpdate: (
    bookingId: string,
    updates: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      assigned_to?: string;
      admin_notes?: string;
    }
  ) => Promise<void>;
  onDelete: (bookingId: string) => Promise<void>;
}

export function BookingDetailModal({
  booking,
  onClose,
  onUpdate,
  onDelete,
}: BookingDetailModalProps) {
  const t = useTranslations();
  const [status, setStatus] = useState(booking.status);
  const [priority, setPriority] = useState(booking.priority || 'medium');
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(booking.id, {
        status,
        priority,
        admin_notes: adminNotes,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    setStatus(newStatus);
    setIsSaving(true);
    try {
      await onUpdate(booking.id, { status: newStatus });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(t('bookings.confirmDelete'))) {
      await onDelete(booking.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('bookings.bookingDetails')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              ID: {booking.id.substring(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Status and Priority Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => handleStatusChange('pending')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                status === 'pending'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-yellow-300'
              }`}
            >
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">{t('bookings.status.pending')}</span>
            </button>

            <button
              onClick={() => handleStatusChange('confirmed')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                status === 'confirmed'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{t('bookings.status.confirmed')}</span>
            </button>

            <button
              onClick={() => handleStatusChange('completed')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">{t('bookings.status.completed')}</span>
            </button>

            <button
              onClick={() => handleStatusChange('cancelled')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                status === 'cancelled'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">{t('bookings.status.cancelled')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('bookings.guestInformation')}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">
                      {t('bookings.guestName')}
                    </label>
                    <p className="font-medium text-gray-900">
                      {booking.guest_first_name} {booking.guest_last_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.email')}
                      </label>
                      <p className="text-gray-900">{booking.contact_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.phone')}
                      </label>
                      <p className="text-gray-900">{booking.contact_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.country')}
                      </label>
                      <p className="text-gray-900">{booking.guest_country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.address')}
                      </label>
                      <p className="text-gray-900">
                        {booking.guest_address}, {booking.guest_city},{' '}
                        {booking.guest_zip_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('bookings.bookingDetails')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.destination')}
                      </label>
                      <p className="font-medium text-gray-900">
                        {booking.destination?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.destination?.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.checkIn')}
                      </label>
                      <p className="text-gray-900">
                        {formatDate(booking.check_in_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.checkOut')}
                      </label>
                      <p className="text-gray-900">
                        {formatDate(booking.check_out_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600 block">
                        {t('bookings.guests')}
                      </label>
                      <p className="text-gray-900">
                        {booking.number_of_guests}{' '}
                        {booking.number_of_guests === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block">
                      {t('bookings.totalPrice')}
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      €{Number(booking.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {booking.special_requests && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">
                      {t('bookings.specialRequests')}
                    </h3>
                  </div>
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Task Management */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('bookings.taskManagement')}
                </h3>
                <div className="space-y-4">
                  {/* Priority */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">
                      {t('bookings.priority.label')}
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">{t('bookings.priority.low')}</option>
                      <option value="medium">{t('bookings.priority.medium')}</option>
                      <option value="high">{t('bookings.priority.high')}</option>
                      <option value="urgent">{t('bookings.priority.urgent')}</option>
                    </select>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">
                      {t('bookings.adminNotes')}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={6}
                      placeholder={t('bookings.adminNotesPlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? t('common.saving') : t('common.save')}
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('bookings.metadata')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">{t('bookings.createdAt')}:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(booking.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('bookings.updatedAt')}:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(booking.updated_at).toLocaleString()}
                    </span>
                  </div>
                  {booking.last_status_change_at && (
                    <div>
                      <span className="text-gray-600">
                        {t('bookings.lastStatusChange')}:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {new Date(booking.last_status_change_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('bookings.deleteBooking')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
