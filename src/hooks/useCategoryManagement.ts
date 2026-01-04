import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllParentCategories,
  getAllSubcategories,
  createParentCategory,
  updateParentCategory,
  deleteParentCategory,
  reactivateParentCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reactivateSubcategory,
} from '@/lib/api';
import { toast } from 'sonner';

// Parent Categories
export const useParentCategories = () => {
  return useQuery({
    queryKey: ['admin-parent-categories'],
    queryFn: getAllParentCategories,
  });
};

export const useCreateParentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createParentCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Parent category created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create parent category');
    },
  });
};

export const useUpdateParentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateParentCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Parent category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update parent category');
    },
  });
};

export const useDeleteParentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteParentCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Parent category deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate parent category');
    },
  });
};

export const useReactivateParentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivateParentCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Parent category reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reactivate parent category');
    },
  });
};

// Subcategories
export const useSubcategories = () => {
  return useQuery({
    queryKey: ['admin-subcategories'],
    queryFn: getAllSubcategories,
  });
};

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parent_category_id }: { name: string; parent_category_id: string }) =>
      createSubcategory(name, parent_category_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create subcategory');
    },
  });
};

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, parent_category_id }: { id: string; name: string; parent_category_id?: string }) =>
      updateSubcategory(id, name, parent_category_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update subcategory');
    },
  });
};

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate subcategory');
    },
  });
};

export const useReactivateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivateSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reactivate subcategory');
    },
  });
};
