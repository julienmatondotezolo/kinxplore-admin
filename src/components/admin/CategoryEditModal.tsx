'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Save,
  Layers,
  Tag,
  Sparkles
} from 'lucide-react';
import { ParentCategory, Subcategory } from '@/lib/api';
import { 
  useUpdateParentCategory, 
  useCreateSubcategory,
  useDeleteSubcategory,
  useSubcategories
} from '@/hooks/useCategoryManagement';
import {
  useFacilitiesByCategory,
  useCreateFacility,
  useDeleteFacility,
  Facility
} from '@/hooks/useFacilities';
import { toast } from 'sonner';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ParentCategory | null;
}

export function CategoryEditModal({ isOpen, onClose, category }: CategoryEditModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Subcategory state
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  
  // Facility state
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityIcon, setNewFacilityIcon] = useState('');
  const [newFacilityDescription, setNewFacilityDescription] = useState('');
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  
  const updateCategoryMutation = useUpdateParentCategory();
  const createSubcategoryMutation = useCreateSubcategory();
  const deleteSubcategoryMutation = useDeleteSubcategory();
  const { data: allSubcategories } = useSubcategories();
  
  const { data: facilities } = useFacilitiesByCategory(category?.id);
  const createFacilityMutation = useCreateFacility();
  const deleteFacilityMutation = useDeleteFacility();

  // Get subcategories for this category
  const categorySubcategories = allSubcategories?.filter(
    sub => sub.parent_category_id === category?.id
  ) || [];

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleUpdateCategoryName = async () => {
    if (!category || !categoryName.trim()) return;
    
    try {
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        name: categoryName.trim()
      });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAddSubcategory = async () => {
    if (!category || !newSubcategoryName.trim()) return;
    
    try {
      await createSubcategoryMutation.mutateAsync({
        name: newSubcategoryName.trim(),
        parent_category_id: category.id
      });
      setNewSubcategoryName('');
      setIsAddingSubcategory(false);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      await deleteSubcategoryMutation.mutateAsync(subcategoryId);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleAddFacility = async () => {
    if (!category || !newFacilityName.trim()) return;
    
    try {
      await createFacilityMutation.mutateAsync({
        name: newFacilityName.trim(),
        icon: newFacilityIcon.trim() || undefined,
        description: newFacilityDescription.trim() || undefined,
        category_id: category.id
      });
      setNewFacilityName('');
      setNewFacilityIcon('');
      setNewFacilityDescription('');
      setIsAddingFacility(false);
    } catch (error) {
      console.error('Error creating facility:', error);
    }
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    
    try {
      await deleteFacilityMutation.mutateAsync(facilityId);
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl shadow-black/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-[20px] flex items-center justify-center text-purple-600">
              <Layers className="w-5 h-5" />
            </div>
            Edit Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Category Name Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Category Name
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onFocus={() => setIsEditingName(true)}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
                placeholder="Category name..."
              />
              {isEditingName && (
                <Button 
                  onClick={handleUpdateCategoryName}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
                  disabled={updateCategoryMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>

          {/* Subcategories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Subcategories ({categorySubcategories.length})
              </h3>
              <Button
                onClick={() => setIsAddingSubcategory(true)}
                variant="outline"
                className="rounded-full border-gray-200 hover:bg-gray-50 text-gray-900 px-6 py-2"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
              </Button>
            </div>

            {/* Add Subcategory Form */}
            {isAddingSubcategory && (
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Subcategory name..."
                    className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                  />
                  <Button 
                    onClick={handleAddSubcategory}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
                    disabled={createSubcategoryMutation.isPending}
                  >
                    Add
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsAddingSubcategory(false);
                      setNewSubcategoryName('');
                    }}
                    variant="outline"
                    className="px-8 py-3 rounded-full border-gray-200 hover:bg-gray-50 text-gray-900"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Subcategories List */}
            <div className="space-y-3">
              {categorySubcategories.length > 0 ? (
                categorySubcategories.map((sub) => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-[24px] hover:shadow-lg hover:shadow-black/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Tag className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">{sub.name}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        sub.status === 'active' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubcategory(sub.id)}
                      className="p-2.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-900 text-center py-8 font-medium">No subcategories yet</p>
              )}
            </div>
          </div>

          {/* Facilities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Facilities ({facilities?.length || 0})
              </h3>
              <Button
                onClick={() => setIsAddingFacility(true)}
                variant="outline"
                className="rounded-full border-gray-200 hover:bg-gray-50 text-gray-900 px-6 py-2"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </div>

            {/* Add Facility Form */}
            {isAddingFacility && (
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg shadow-black/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newFacilityName}
                    onChange={(e) => setNewFacilityName(e.target.value)}
                    placeholder="Facility name..."
                    className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    value={newFacilityIcon}
                    onChange={(e) => setNewFacilityIcon(e.target.value)}
                    placeholder="Icon (emoji)..."
                    className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm"
                  />
                </div>
                <textarea
                  value={newFacilityDescription}
                  onChange={(e) => setNewFacilityDescription(e.target.value)}
                  placeholder="Description (optional)..."
                  rows={3}
                  className="w-full px-6 py-3 bg-white border border-gray-200 rounded-[24px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 shadow-sm resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleAddFacility}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
                    disabled={createFacilityMutation.isPending}
                  >
                    Add Facility
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsAddingFacility(false);
                      setNewFacilityName('');
                      setNewFacilityIcon('');
                      setNewFacilityDescription('');
                    }}
                    variant="outline"
                    className="px-8 py-3 rounded-full border-gray-200 hover:bg-gray-50 text-gray-900"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Facilities List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities && facilities.length > 0 ? (
                facilities.map((facility) => (
                  <div 
                    key={facility.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-[24px] hover:shadow-lg hover:shadow-black/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">
                        {facility.icon || '✨'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{facility.name}</p>
                        {facility.description && (
                          <p className="text-xs text-gray-900 line-clamp-1 mt-0.5">{facility.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFacility(facility.id)}
                      className="p-2.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-gray-900 text-center py-8 font-medium">No facilities yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 font-bold"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
