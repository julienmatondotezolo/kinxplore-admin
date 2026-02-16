import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  reactivateTrip,
  CreateTripDto,
  UpdateTripDto,
} from '@/lib/api';
import { toast } from 'sonner';

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id),
    enabled: !!id,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trip: CreateTripDto) => createTrip(trip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create trip');
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, trip }: { id: string; trip: UpdateTripDto }) =>
      updateTrip(id, trip),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', variables.id] });
      toast.success('Trip updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update trip');
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate trip');
    },
  });
};

export const useReactivateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivateTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reactivate trip');
    },
  });
};
