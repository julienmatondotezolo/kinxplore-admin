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
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === 'destinations' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            Last Updated Destinations
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === 'bookings' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            Last Added Bookings
          </button>
        </div>
        <button className="text-sm font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-1 px-3 py-2 rounded-full transition-colors">
          View all <ArrowUpRight className="w-4 h-4 text-gray-900" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'destinations' ? (
          <div className="space-y-3">
            {lastUpdatedDestinations.map((dest) => (
              <div key={dest.id} className="flex items-center gap-4 p-3 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 cursor-pointer">
                <div className="w-14 h-14 rounded-[20px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  {dest.image ? (
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-900">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black transition-colors">{dest.name}</h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">${dest.price}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-gray-900" />
                      <span className="truncate max-w-[120px]">{dest.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3 text-gray-900" />
                      <span>{new Date(dest.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {lastAddedBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 cursor-pointer">
                <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm border border-blue-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black transition-colors">
                      {booking.guest_first_name} {booking.guest_last_name}
                    </h4>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'text-blue-600 bg-blue-50' : 
                      booking.status === 'pending' ? 'text-amber-600 bg-amber-50' : 
                      'text-gray-600 bg-gray-50'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Users className="w-3 h-3 text-gray-900" />
                      <span>{booking.number_of_guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3 text-gray-900" />
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
