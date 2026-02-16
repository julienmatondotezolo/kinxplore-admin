'use client';

import { useState } from 'react';
import { Trip } from '@/lib/api';
import {
  Search,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Clock,
  DollarSign,
  MapPin
} from 'lucide-react';

interface TripsTableProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  onReactivate: (trip: Trip) => void;
  isReactivating?: boolean;
}

export function TripsTable({ trips, onView, onEdit, onDelete, onReactivate, isReactivating }: TripsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<'name' | 'region' | 'price' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'region' | 'price') => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredTrips = trips
    .filter(trip =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.region.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const dir = sortDirection === 'asc' ? 1 : -1;
      switch (sortColumn) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'region':
          return a.region.localeCompare(b.region) * dir;
        case 'price':
          return (a.price_international - b.price_international) * dir;
        default:
          return 0;
      }
    });

  const formatRegion = (region: string) => {
    return region === 'kinshasa' ? 'Kinshasa' : 'Kongo Central';
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-900">
                  Name <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">
                <button onClick={() => handleSort('region')} className="flex items-center gap-1 hover:text-gray-900">
                  Region <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[12%]">
                Duration
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[18%]">
                <button onClick={() => handleSort('price')} className="flex items-center gap-1 hover:text-gray-900">
                  Prices <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[10%]">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => {
              const isInactive = trip.status === 'inactive';
              return (
                <tr
                  key={trip.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    isInactive ? 'opacity-50' : ''
                  }`}
                  onClick={() => onView(trip)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {trip.image ? (
                        <img
                          src={trip.image}
                          alt={trip.name}
                          className={`w-10 h-10 rounded-lg object-cover ${isInactive ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{trip.name}</p>
                        {trip.subtitle && (
                          <p className="text-xs text-gray-500 truncate">{trip.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      trip.region === 'kinshasa'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {formatRegion(trip.region)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      {trip.duration}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900 font-medium">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" />
                        {trip.price_international} <span className="text-xs text-gray-400">int.</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ${trip.price_local} local
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {isInactive ? (
                        <button
                          onClick={() => onReactivate(trip)}
                          disabled={isReactivating}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          title="Reactivate"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onView(trip)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(trip)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(trip)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Deactivate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No trips found</p>
          <p className="text-sm mt-1">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
