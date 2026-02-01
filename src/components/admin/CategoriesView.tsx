'use client';

import { useState } from 'react';
import { useParentCategories, useCreateParentCategory, useDeleteParentCategory } from '@/hooks/useCategoryManagement';
import { Plus, Edit, Trash2, Loader2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoriesView() {
  const { data: categories, isLoading: loading } = useParentCategories();
  const createMutation = useCreateParentCategory();
  const deleteMutation = useDeleteParentCategory();
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  return (
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
              className="px-6 rounded-full border-gray-200"
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
          categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-[20px] flex items-center justify-center text-purple-600">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Edit className="w-4 h-4 text-gray-900" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.status === 'active' ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Layers className="w-12 h-12 text-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">No categories yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
