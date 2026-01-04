import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  reactivateDestination,
  getDestinationHistory,
  getAllHistory,
  CreateDestinationDto,
  UpdateDestinationDto,
} from '@/lib/api';
import { toast } from 'sonner';

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });
};

export const useDestination = (id: string) => {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: () => getDestination(id),
    enabled: !!id,
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      destination,
      modifiedBy,
    }: {
      destination: CreateDestinationDto;
      modifiedBy?: string;
    }) => createDestination(destination, modifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      toast.success('Destination created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create destination');
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      destination,
      modifiedBy,
    }: {
      id: string;
      destination: UpdateDestinationDto;
      modifiedBy?: string;
    }) => updateDestination(id, destination, modifiedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['destination', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      toast.success('Destination updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update destination');
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, modifiedBy }: { id: string; modifiedBy?: string }) =>
      deleteDestination(id, modifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      toast.success('Destination deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate destination');
    },
  });
};

export const useReactivateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, modifiedBy }: { id: string; modifiedBy?: string }) =>
      reactivateDestination(id, modifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      toast.success('Destination reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reactivate destination');
    },
  });
};

export const useDestinationHistory = (id: string) => {
  return useQuery({
    queryKey: ['destination-history', id],
    queryFn: () => getDestinationHistory(id),
    enabled: !!id,
  });
};

export const useAllHistory = (limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ['archive', limit, offset],
    queryFn: () => getAllHistory(limit, offset),
  });
};
