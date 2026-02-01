'use client';

import { useState, useMemo } from 'react';
import { useParentCategories, useCreateParentCategory, useDeleteParentCategory, useSubcategories } from '@/hooks/useCategoryManagement';
import { useFacilities } from '@/hooks/useFacilities';
import { Plus, Edit, Trash2, Loader2, Layers, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryEditModal } from './CategoryEditModal';
import { ParentCategory } from '@/lib/api';

export function CategoriesView() {
  const { data: categories, isLoading: loading } = useParentCategories();
  const { data: allSubcategories, isLoading: subcategoriesLoading } = useSubcategories();
  const { data: allFacilities, isLoading: facilitiesLoading } = useFacilities();
  const createMutation = useCreateParentCategory();
  const deleteMutation = useDeleteParentCategory();
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<ParentCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    if (!categories) return {};
    
    const counts: Record<string, { subcategories: number; facilities: number }> = {};
    
    categories.forEach(category => {
      const subcategoryCount = allSubcategories ? allSubcategories.filter(
        sub => sub.parent_category_id === category.id
      ).length : 0;
      
      const facilityCount = allFacilities ? allFacilities.filter(
        facility => facility.category_id === category.id
      ).length : 0;
      
      counts[category.id] = {
        subcategories: subcategoryCount,
        facilities: facilityCount
      };
    });
    
    return counts;
  }, [categories, allSubcategories, allFacilities]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await createMutation.mutateAsync(newCategoryName);
      setNewCategoryName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to deactivate this category?')) {
      try {
        await deleteMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleEdit = (category: ParentCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <CategoryEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-600 mt-2 text-lg">Organize your destinations by categories</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">New Category</span>
        </Button>
      </div>

      {/* Create Category Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Category</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button 
              onClick={handleCreate}
              className="bg-black hover:bg-gray-800 text-white px-6 rounded-full"
            >
              Create
            </Button>
            <Button 
              onClick={() => {
                setIsCreating(false);
                setNewCategoryName('');
              }}
              variant="outline"
              className="px-6 rounded-full border-gray-200 text-gray-900"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
          </div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => {
            const counts = categoryCounts[category.id] || { subcategories: 0, facilities: 0 };
            
            return (
              <div 
                key={category.id} 
                className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all group cursor-pointer"
                onClick={() => handleEdit(category)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-50 rounded-[20px] flex items-center justify-center text-purple-600">
                    <Layers className="w-7 h-7" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(category);
                      }}
                      className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-900" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                      className="p-2.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    category.status === 'active' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Counts Section */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-900 font-medium">Subcategories</p>
                      <p className="text-lg font-bold text-gray-900">
                        {subcategoriesLoading ? '...' : counts.subcategories}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-900 font-medium">Facilities</p>
                      <p className="text-lg font-bold text-gray-900">
                        {facilitiesLoading ? '...' : counts.facilities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Layers className="w-12 h-12 text-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">No categories yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
