'use client';

import { useState } from 'react';
import { 
  useSubcategories, 
  useParentCategories,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
  useReactivateSubcategory 
} from '@/hooks/useCategoryManagement';
import { Plus, Trash2, Loader2, Tag, RotateCcw, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Subcategory } from '@/lib/api';

export function SubcategoriesView() {
  const { data: subcategories, isLoading: loading } = useSubcategories();
  const { data: parentCategories } = useParentCategories();
  const createMutation = useCreateSubcategory();
  const updateMutation = useUpdateSubcategory();
  const deleteMutation = useDeleteSubcategory();
  const reactivateMutation = useReactivateSubcategory();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    parent_category_id: ''
  });

  const handleCreate = async () => {
    if (!newSubcategoryName.trim() || !selectedParentId) return;
    
    try {
      await createMutation.mutateAsync({
        name: newSubcategoryName,
        parent_category_id: selectedParentId
      });
      setNewSubcategoryName('');
      setSelectedParentId('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleDelete = async (subcategoryId: string) => {
    if (confirm('Are you sure you want to deactivate this subcategory?')) {
      try {
        await deleteMutation.mutateAsync(subcategoryId);
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleReactivate = async (subcategoryId: string) => {
    try {
      await reactivateMutation.mutateAsync(subcategoryId);
    } catch (error) {
      console.error('Error reactivating subcategory:', error);
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setEditFormData({
      name: subcategory.name,
      parent_category_id: subcategory.parent_category_id
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSubcategory || !editFormData.name.trim() || !editFormData.parent_category_id) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingSubcategory.id,
        name: editFormData.name.trim(),
        parent_category_id: editFormData.parent_category_id
      });
      setIsEditModalOpen(false);
      setEditingSubcategory(null);
      setEditFormData({ name: '', parent_category_id: '' });
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const getParentCategoryName = (parentId: string) => {
    const parent = parentCategories?.find(p => p.id === parentId);
    return parent?.name || 'Unknown';
  };

  return (
    <>
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[24px] shadow-2xl shadow-black/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600">
                <Tag className="w-5 h-5" />
              </div>
              Edit Subcategory
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Subcategory Name</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Subcategory name..."
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Parent Category</label>
              <select
                value={editFormData.parent_category_id}
                onChange={(e) => setEditFormData({ ...editFormData, parent_category_id: e.target.value })}
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              >
                <option value="">Select parent category...</option>
                {parentCategories?.filter(p => p.status === 'active').map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingSubcategory(null);
                setEditFormData({ name: '', parent_category_id: '' });
              }}
              variant="outline"
              className="px-8 py-3 rounded-full border-gray-200 hover:bg-gray-50 text-gray-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 font-bold"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Subcategories</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage subcategories for your parent categories</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">New Subcategory</span>
        </Button>
      </div>

      {/* Create Subcategory Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Subcategory</h3>
          <div className="space-y-3">
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
            >
              <option value="">Select parent category...</option>
              {parentCategories?.filter(p => p.status === 'active').map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Subcategory name..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button 
                onClick={handleCreate}
                className="bg-black hover:bg-gray-800 text-white px-6 rounded-full"
                disabled={!selectedParentId}
              >
                Create
              </Button>
              <Button 
                onClick={() => {
                  setIsCreating(false);
                  setNewSubcategoryName('');
                  setSelectedParentId('');
                }}
                variant="outline"
                className="px-6 rounded-full border-gray-200 text-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
          </div>
        ) : subcategories && subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div 
              key={subcategory.id} 
              className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600">
                  <Tag className="w-7 h-7" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {subcategory.status === 'active' && (
                    <button 
                      onClick={() => handleEdit(subcategory)}
                      className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-900" />
                    </button>
                  )}
                  {subcategory.status === 'inactive' ? (
                    <button 
                      onClick={() => handleReactivate(subcategory.id)}
                      className="p-2.5 hover:bg-green-50 rounded-full transition-colors"
                      title="Reactivate"
                    >
                      <RotateCcw className="w-4 h-4 text-green-600" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDelete(subcategory.id)}
                      className="p-2.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{subcategory.name}</h3>
              <p className="text-sm text-gray-900 mb-3 font-medium">
                Parent: {getParentCategoryName(subcategory.parent_category_id)}
              </p>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                subcategory.status === 'active' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {subcategory.status}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Tag className="w-12 h-12 text-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">No subcategories yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
