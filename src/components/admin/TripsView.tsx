'use client';

import { useState } from 'react';
import { TripsTable } from './TripsTable';
import { TripForm } from './TripForm';
import { TripDetails } from './TripDetails';
import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip, useReactivateTrip } from '@/hooks/useTrips';
import { Trip } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';

export function TripsView() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const { data: trips, isLoading } = useTrips();
  const createMutation = useCreateTrip();
  const updateMutation = useUpdateTrip();
  const deleteMutation = useDeleteTrip();
  const reactivateMutation = useReactivateTrip();

  const handleCreate = () => {
    setSelectedTrip(null);
    setFormOpen(true);
  };

  const handleView = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailsOpen(true);
  };

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailsOpen(false);
    setFormOpen(true);
  };

  const handleDelete = (trip: Trip) => {
    setSelectedTrip(trip);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTrip) {
      deleteMutation.mutate(selectedTrip.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedTrip(null);
        },
      });
    }
  };

  const handleReactivate = (trip: Trip) => {
    reactivateMutation.mutate(trip.id);
  };

  const handleSubmit = (data: any) => {
    if (selectedTrip) {
      updateMutation.mutate(
        { id: selectedTrip.id, trip: data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedTrip(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Trips</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage curated multi-destination tours</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">New Trip</span>
          </Button>
        </div>

        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <TripsTable
              trips={trips || []}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReactivate={handleReactivate}
              isReactivating={reactivateMutation.isPending}
            />
          )}
        </div>
      </div>

      <TripDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedTrip(null);
        }}
        trip={selectedTrip}
        onEdit={handleEdit}
        onReactivate={handleReactivate}
        isReactivating={reactivateMutation.isPending}
      />

      <TripForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedTrip(null);
        }}
        onSubmit={handleSubmit}
        trip={selectedTrip}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[20px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Deactivate Trip</DialogTitle>
            <DialogDescription className="text-gray-500 text-base">
              Are you sure you want to deactivate &quot;{selectedTrip?.name}&quot;?
              The trip will be hidden from users but can be restored later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-full px-6 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-full px-6 bg-black hover:bg-gray-800 text-white"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
