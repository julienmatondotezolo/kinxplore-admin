import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Facility {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  category_id?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

// Get all facilities
export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const { data } = await api.get<Facility[]>('/facilities');
      return data;
    },
  });
};

// Get facilities by category
export const useFacilitiesByCategory = (categoryId?: string) => {
  return useQuery({
    queryKey: ['facilities', 'category', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data } = await api.get<Facility[]>(`/facilities/category/${categoryId}`);
      return data;
    },
    enabled: !!categoryId,
  });
};

// Create facility
export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (facility: Omit<Facility, 'id' | 'created_at' | 'updated_at'>) => {
      const { data } = await api.post<Facility>('/facilities', facility);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create facility');
    },
  });
};

// Update facility
export const useUpdateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...facility }: Partial<Facility> & { id: string }) => {
      const { data } = await api.patch<Facility>(`/facilities/${id}`, facility);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update facility');
    },
  });
};

// Delete facility
export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/facilities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete facility');
    },
  });
};

// Toggle facility status (enable/disable)
export const useToggleFacilityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const { data } = await api.patch<Facility>(`/facilities/${id}`, { status });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      const statusText = data.status === 'active' ? 'enabled' : 'disabled';
      toast.success(`Facility ${statusText} successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update facility status');
    },
  });
};
