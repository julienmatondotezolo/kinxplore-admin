'use client';

import { useState } from 'react';
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility, Facility } from '@/hooks/useFacilities';
import { useParentCategories } from '@/hooks/useCategoryManagement';
import { Plus, Edit, Trash2, Loader2, Sparkles, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FacilitiesView() {
  const { data: facilities, isLoading: loading } = useFacilities();
  const { data: categories } = useParentCategories();
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    category_id: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      description: '',
      category_id: ''
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    
    try {
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        icon: formData.icon.trim() || undefined,
        description: formData.description.trim() || undefined,
        category_id: formData.category_id || undefined
      });
      resetForm();
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating facility:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingFacility || !formData.name.trim()) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingFacility.id,
        name: formData.name.trim(),
        icon: formData.icon.trim() || undefined,
        description: formData.description.trim() || undefined,
        category_id: formData.category_id || undefined
      });
      resetForm();
      setIsEditModalOpen(false);
      setEditingFacility(null);
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const handleDelete = async (facilityId: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      try {
        await deleteMutation.mutateAsync(facilityId);
      } catch (error) {
        console.error('Error deleting facility:', error);
      }
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      icon: facility.icon || '',
      description: facility.description || '',
      category_id: facility.category_id || ''
    });
    setIsEditModalOpen(true);
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId || !categories) return 'No category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <>
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[24px] shadow-2xl shadow-black/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-[20px] flex items-center justify-center text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              Edit Facility
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Facility Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Facility name..."
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="✨ Add an emoji..."
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={3}
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-[24px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              >
                <option value="">No category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingFacility(null);
                resetForm();
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
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Facilities</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage facilities for your destinations</p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">New Facility</span>
          </Button>
        </div>

        {/* Create Facility Form */}
        {isCreating && (
          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Facility</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Facility name..."
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              />
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Icon (emoji)..."
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
              />
            </div>

            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description (optional)..."
              rows={3}
              className="w-full px-6 py-3 bg-white border border-gray-200 rounded-[24px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm resize-none"
            />

            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
            >
              <option value="">No category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <Button 
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create
              </Button>
              <Button 
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}
                variant="outline"
                className="px-8 py-3 rounded-full border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
            </div>
          ) : facilities && facilities.length > 0 ? (
            facilities.map((facility) => (
              <div 
                key={facility.id} 
                className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-50 rounded-[20px] flex items-center justify-center text-3xl">
                    {facility.icon || '✨'}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(facility)}
                      className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-900" />
                    </button>
                    <button 
                      onClick={() => handleDelete(facility.id)}
                      className="p-2.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{facility.name}</h3>
                
                {facility.description && (
                  <p className="text-sm text-gray-900 mb-3 line-clamp-2">{facility.description}</p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                    {getCategoryName(facility.category_id)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-900 mx-auto mb-4" />
              <p className="text-gray-600">No facilities yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
