'use client';

import { useState } from 'react';
import { useInquiries, TripInquiry } from '@/hooks/useInquiries';
import {
  Search,
  RefreshCw,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  X,
  Loader2,
} from 'lucide-react';

export function InquiriesView() {
  const { inquiries, loading, refreshInquiries } = useInquiries();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<TripInquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    return (
      inq.first_name?.toLowerCase().includes(q) ||
      inq.last_name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.includes(q) ||
      inq.destination?.toLowerCase().includes(q)
    );
  });

  const totalInquiries = inquiries.length;
  const thisMonth = inquiries.filter((inq) => {
    const d = new Date(inq.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Inquiries</h1>
          <p className="text-gray-600 mt-2 text-lg">Trip planning submissions from the website</p>
        </div>
        <button
          onClick={refreshInquiries}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-gray-900"
        >
          <RefreshCw className="w-4 h-4 text-gray-900" />
          <span className="font-medium text-sm text-gray-900">Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalInquiries}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-[14px] flex items-center justify-center text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{thisMonth}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-[14px] flex items-center justify-center text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Avg. Travelers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalInquiries > 0
                  ? (inquiries.reduce((sum, inq) => sum + (inq.travelers || 0), 0) / totalInquiries).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-[14px] flex items-center justify-center text-amber-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Phone</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Destination</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Dates</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Travelers</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{inq.first_name} {inq.last_name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{inq.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{inq.phone}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                      {inq.destination === 'both' ? 'Kinshasa & KC' : inq.destination === 'kongo_central' ? 'Kongo Central' : inq.destination}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {inq.date_from && inq.date_to
                      ? `${new Date(inq.date_from).toLocaleDateString()} - ${new Date(inq.date_to).toLocaleDateString()}`
                      : inq.date_from
                        ? new Date(inq.date_from).toLocaleDateString()
                        : '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm text-center">{inq.travelers}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.first_name} {selectedInquiry.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Travel Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedInquiry.destination === 'both' ? 'Kinshasa & Kongo Central' : selectedInquiry.destination === 'kongo_central' ? 'Kongo Central' : selectedInquiry.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Travelers</p>
                      <p className="font-medium text-gray-900">{selectedInquiry.travelers}</p>
                    </div>
                  </div>
                  {selectedInquiry.date_from && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dates</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedInquiry.date_from).toLocaleDateString()}
                          {selectedInquiry.date_to && ` - ${new Date(selectedInquiry.date_to).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.trip_style && (
                    <div>
                      <p className="text-xs text-gray-500">Trip Style</p>
                      <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                        {selectedInquiry.trip_style}
                      </span>
                    </div>
                  )}
                  {selectedInquiry.budget && (
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                        {selectedInquiry.budget}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Message</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
