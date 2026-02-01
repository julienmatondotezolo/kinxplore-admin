'use client';

import { BookingStatistics } from '@/hooks/useBookingManagement';
import { useTranslations } from 'next-intl';
import { TrendingUp, Calendar, DollarSign, Clock } from 'lucide-react';

interface BookingStatsDashboardProps {
  statistics: BookingStatistics;
}

export function BookingStatsDashboard({ statistics }: BookingStatsDashboardProps) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('bookings.stats.total')}</p>
            <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-green-600 font-medium">
            +{statistics.newToday}
          </span>
          <span className="text-gray-600">{t('bookings.stats.today')}</span>
        </div>
      </div>

      {/* Pending Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('bookings.stats.pending')}</p>
            <p className="text-3xl font-bold text-yellow-600">{statistics.byStatus.pending}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            {t('bookings.stats.requiresAction')}
          </span>
        </div>
      </div>

      {/* Confirmed Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('bookings.stats.confirmed')}</p>
            <p className="text-3xl font-bold text-blue-600">{statistics.byStatus.confirmed}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-green-600 font-medium">
            +{statistics.newThisWeek}
          </span>
          <span className="text-gray-600">{t('bookings.stats.thisWeek')}</span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('bookings.stats.revenue')}</p>
            <p className="text-3xl font-bold text-green-600">
              €{statistics.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            {statistics.byStatus.completed} {t('bookings.stats.completed')}
          </span>
        </div>
      </div>
    </div>
  );
}
