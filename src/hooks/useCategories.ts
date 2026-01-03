import { useQuery } from '@tanstack/react-query';
import { getParentCategories, getSubcategories } from '@/lib/api';

export const useParentCategories = () => {
  return useQuery({
    queryKey: ['parent-categories'],
    queryFn: getParentCategories,
  });
};

export const useSubcategories = (parentId?: string) => {
  return useQuery({
    queryKey: ['subcategories', parentId],
    queryFn: () => getSubcategories(parentId),
    enabled: !!parentId,
  });
};
