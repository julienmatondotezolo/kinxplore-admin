'use client';

import { useState } from 'react';
import { useDestinations } from '@/hooks/useDestinations';
import { useBookingManagement } from '@/hooks/useBookingManagement';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function QuickTabs() {
  const t = useTranslations();
  const { data: destinations } = useDestinations();
  const { bookings } = useBookingManagement();
  const [activeTab, setActiveTab] = useState<'destinations' | 'bookings'>('destinations');

  const lastUpdatedDestinations = destinations
    ? [...destinations].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5)
    : [];

  const lastAddedBookings = bookings
    ? [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'destinations' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Last Updated Destinations
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'bookings' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Last Added Bookings
          </button>
        </div>
        <button className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1">
          View all <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'destinations' ? (
          <div className="space-y-4">
            {lastUpdatedDestinations.map((dest) => (
              <div key={dest.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  {dest.image ? (
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{dest.name}</h4>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">${dest.price}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{dest.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(dest.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {lastAddedBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm border border-blue-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {booking.guest_first_name} {booking.guest_last_name}
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      booking.status === 'confirmed' ? 'text-blue-600 bg-blue-50' : 
                      booking.status === 'pending' ? 'text-yellow-600 bg-yellow-50' : 
                      'text-gray-600 bg-gray-50'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{booking.number_of_guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
