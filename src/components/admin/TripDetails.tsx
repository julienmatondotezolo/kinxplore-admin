'use client';

import { Trip } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Clock,
  DollarSign,
  MapPin,
  Globe,
  Pencil,
  RotateCcw,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface TripDetailsProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onEdit?: (trip: Trip) => void;
  onReactivate?: (trip: Trip) => void;
  isReactivating?: boolean;
}

export function TripDetails({ open, onClose, trip, onEdit, onReactivate, isReactivating }: TripDetailsProps) {
  if (!trip) return null;

  const isInactive = trip.status === 'inactive';
  const formatRegion = (region: string) => region === 'kinshasa' ? 'Kinshasa' : 'Kongo Central';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold text-gray-900">{trip.name}</DialogTitle>
              {isInactive && (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isInactive && onReactivate ? (
                <Button
                  onClick={() => onReactivate(trip)}
                  disabled={isReactivating}
                  variant="outline"
                  className="rounded-full text-green-600 border-green-200 hover:bg-green-50"
                  size="sm"
                >
                  {isReactivating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RotateCcw className="w-4 h-4 mr-1" />}
                  Reactivate
                </Button>
              ) : onEdit ? (
                <Button
                  onClick={() => onEdit(trip)}
                  variant="outline"
                  className="rounded-full"
                  size="sm"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image */}
          {trip.image && (
            <div className={`w-full aspect-video rounded-xl overflow-hidden ${isInactive ? 'grayscale' : ''}`}>
              <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Subtitle */}
          {trip.subtitle && (
            <p className="text-gray-600 italic">{trip.subtitle}</p>
          )}

          {/* Description */}
          {trip.description && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{trip.description}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">Region</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatRegion(trip.region)}</p>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold">Duration</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{trip.duration}</p>
            </div>
            <div className="bg-green-50/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold">International</span>
              </div>
              <p className="text-sm font-bold text-gray-900">${trip.price_international}</p>
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold">Local</span>
              </div>
              <p className="text-sm font-bold text-gray-900">${trip.price_local}</p>
            </div>
          </div>

          {/* Included Items */}
          {trip.included_items && trip.included_items.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What's Included</h3>
              <div className="space-y-1">
                {trip.included_items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{item.fr || item.en || (typeof item === 'string' ? item : JSON.stringify(item))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Program */}
          {trip.program && trip.program.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Program</h3>
              <div className="space-y-2">
                {trip.program.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <span className="font-bold text-gray-500 w-28 shrink-0">{item.time}</span>
                    <span className="text-gray-700">{item.fr || item.en || (typeof item === 'string' ? item : JSON.stringify(item))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Destinations */}
          {trip.destinations && trip.destinations.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Linked Destinations</h3>
              <div className="grid grid-cols-2 gap-2">
                {trip.destinations.map((dest: any) => (
                  <div key={dest.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    {dest.image && (
                      <img src={dest.image} alt={dest.name} className="w-8 h-8 rounded-md object-cover" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{dest.name}</p>
                      <p className="text-xs text-gray-500 truncate">{dest.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <span className="font-medium">ID:</span> {trip.id}
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={trip.status === 'active' ? 'text-green-600' : 'text-gray-500'}>
                  {trip.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(trip.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(trip.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
