import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  location: string;
  ratings: number;
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
}

export interface UpdateDestinationDto {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  location?: string;
  ratings?: number;
  category_ids?: CategoryAssignment[];
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
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parent_category_id: string;
  created_at: string;
  updated_at: string;
}

// API Functions

// Destinations
export const getDestinations = async (): Promise<Destination[]> => {
  const { data } = await api.get('/destinations');
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
  const { data } = await api.get('/categories/parent');
  return data;
};

export const getSubcategories = async (parentId?: string): Promise<Subcategory[]> => {
  const { data } = await api.get('/categories/subcategories', {
    params: parentId ? { parent_id: parentId } : {},
  });
  return data;
};
