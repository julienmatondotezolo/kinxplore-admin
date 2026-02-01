import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface CategoryInfo {
  parent: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  location: string;
  ratings: number;
  status: 'active' | 'inactive';
  opening_hours?: OpeningHours | null;
  created_at: string;
  updated_at: string;
  categories: CategoryInfo[];
}

export interface CategoryAssignment {
  parent_category_id: string;
  subcategory_id?: string;
}

export interface CreateDestinationDto {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  location?: string;
  ratings?: number;
  category_ids?: CategoryAssignment[];
  opening_hours?: OpeningHours;
}

export interface UpdateDestinationDto {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  location?: string;
  ratings?: number;
  category_ids?: CategoryAssignment[];
  opening_hours?: OpeningHours;
}

export interface ArchiveEntry {
  id: string;
  destination_id: string;
  operation_type: 'CREATE' | 'UPDATE' | 'DELETE';
  destination_data: any;
  categories_data: any;
  modified_by: string;
  modified_at: string;
  change_description: string;
  created_at: string;
}

export interface ArchiveResponse {
  data: ArchiveEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface ParentCategory {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  parent_category_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  parent_categories?: ParentCategory;
}

// API Functions

// Destinations
export const getDestinations = async (): Promise<Destination[]> => {
  // Use admin endpoint to get ALL destinations (including inactive)
  const { data } = await api.get('/admin/destinations');
  return data;
};

export const getDestination = async (id: string): Promise<Destination> => {
  const { data } = await api.get(`/destinations/${id}`);
  return data;
};

export const createDestination = async (
  destination: CreateDestinationDto,
  modifiedBy?: string,
): Promise<Destination> => {
  const { data } = await api.post('/admin/destinations', destination, {
    params: { modified_by: modifiedBy },
  });
  return data;
};

export const updateDestination = async (
  id: string,
  destination: UpdateDestinationDto,
  modifiedBy?: string,
): Promise<Destination> => {
  const { data } = await api.put(`/admin/destinations/${id}`, destination, {
    params: { modified_by: modifiedBy },
  });
  return data;
};

export const deleteDestination = async (
  id: string,
  modifiedBy?: string,
): Promise<void> => {
  await api.delete(`/admin/destinations/${id}`, {
    params: { modified_by: modifiedBy },
  });
};

export const reactivateDestination = async (
  id: string,
  modifiedBy?: string,
): Promise<Destination> => {
  const { data } = await api.put(`/admin/destinations/${id}/reactivate`, {}, {
    params: { modified_by: modifiedBy },
  });
  return data;
};

export const getDestinationHistory = async (id: string): Promise<ArchiveEntry[]> => {
  const { data } = await api.get(`/admin/destinations/history/${id}`);
  return data;
};

export const getAllHistory = async (
  limit = 50,
  offset = 0,
): Promise<ArchiveResponse> => {
  const { data } = await api.get('/admin/destinations/history', {
    params: { limit, offset },
  });
  return data;
};

// Categories
export const getParentCategories = async (): Promise<ParentCategory[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const getSubcategories = async (parentId?: string): Promise<Subcategory[]> => {
  if (!parentId) {
    return [];
  }
  const { data } = await api.get(`/categories/${parentId}`);
  return data.subcategories || [];
};

// Admin Category Management
export const getAllParentCategories = async (): Promise<ParentCategory[]> => {
  const { data } = await api.get('/admin/categories/parents');
  return data;
};

export const getAllSubcategories = async (): Promise<Subcategory[]> => {
  const { data } = await api.get('/admin/categories/subcategories');
  return data;
};

export const createParentCategory = async (name: string): Promise<ParentCategory> => {
  const { data } = await api.post('/admin/categories/parents', { name });
  return data;
};

export const updateParentCategory = async (id: string, name: string): Promise<ParentCategory> => {
  const { data } = await api.put(`/admin/categories/parents/${id}`, { name });
  return data;
};

export const deleteParentCategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/parents/${id}`);
};

export const reactivateParentCategory = async (id: string): Promise<ParentCategory> => {
  const { data } = await api.put(`/admin/categories/parents/${id}/reactivate`);
  return data;
};

export const createSubcategory = async (
  name: string,
  parent_category_id: string
): Promise<Subcategory> => {
  const { data } = await api.post('/admin/categories/subcategories', { name, parent_category_id });
  return data;
};

export const updateSubcategory = async (
  id: string,
  name: string,
  parent_category_id?: string
): Promise<Subcategory> => {
  const { data } = await api.put(`/admin/categories/subcategories/${id}`, {
    name,
    parent_category_id,
  });
  return data;
};

export const deleteSubcategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/subcategories/${id}`);
};

export const reactivateSubcategory = async (id: string): Promise<Subcategory> => {
  const { data } = await api.put(`/admin/categories/subcategories/${id}/reactivate`);
  return data;
};
