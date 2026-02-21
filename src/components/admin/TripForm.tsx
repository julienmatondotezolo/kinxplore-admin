'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trip, TripImage, api, addTripImages, removeTripImage } from '@/lib/api';
import { useDestinations } from '@/hooks/useDestinations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, Upload, Search, MapPin, Trash2 } from 'lucide-react';

interface TripFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  trip?: Trip | null;
  isLoading?: boolean;
}

export function TripForm({ open, onClose, onSubmit, trip, isLoading }: TripFormProps) {
  const { data: destinations } = useDestinations();
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'destinations'>('form');
  const [destSearch, setDestSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    description: '',
    duration: '',
    price_international: 0,
    price_local: 0,
    region: 'kinshasa' as 'kinshasa' | 'kongo_central',
    image: '',
    sort_order: 0,
    included_items: [] as any[],
    program: [] as any[],
    destination_ids: [] as string[],
  });

  const [newIncludedItem, setNewIncludedItem] = useState('');
  const [newProgramTime, setNewProgramTime] = useState('');
  const [newProgramDesc, setNewProgramDesc] = useState('');

  // Additional images state
  const [additionalImages, setAdditionalImages] = useState<TripImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [additionalImageUploading, setAdditionalImageUploading] = useState(false);

  useEffect(() => {
    if (trip) {
      setFormData({
        name: trip.name || '',
        subtitle: trip.subtitle || '',
        description: trip.description || '',
        duration: trip.duration || '',
        price_international: trip.price_international || 0,
        price_local: trip.price_local || 0,
        region: trip.region || 'kinshasa',
        image: trip.image || '',
        sort_order: trip.sort_order || 0,
        included_items: trip.included_items || [],
        program: trip.program || [],
        destination_ids: trip.destinations?.map(d => d.id) || [],
      });
      setAdditionalImages(trip.images?.sort((a, b) => a.sort_order - b.sort_order) || []);
    } else {
      setFormData({
        name: '',
        subtitle: '',
        description: '',
        duration: '',
        price_international: 0,
        price_local: 0,
        region: 'kinshasa',
        image: '',
        sort_order: 0,
        included_items: [],
        program: [],
        destination_ids: [],
      });
      setAdditionalImages([]);
      setNewImageUrl('');
    }
    setActiveTab('form');
    setDestSearch('');
  }, [trip, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed.');
      e.target.value = '';
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB.');
      e.target.value = '';
      return;
    }

    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const { data } = await api.post('/admin/trips/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      const message = error?.response?.data?.message || 'Failed to upload image. Please try again.';
      toast.error(message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddAdditionalImage = async () => {
    if (!newImageUrl.trim() || !trip?.id) return;
    setIsAddingImage(true);
    try {
      const result = await addTripImages(trip.id, [{ url: newImageUrl.trim() }]);
      setAdditionalImages((prev) => [...prev, ...result]);
      setNewImageUrl('');
      toast.success('Image added successfully!');
    } catch (error) {
      console.error('Failed to add image:', error);
      toast.error('Failed to add image.');
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleRemoveAdditionalImage = async (imageId: string) => {
    if (!trip?.id) return;
    setRemovingImageId(imageId);
    try {
      await removeTripImage(trip.id, imageId);
      setAdditionalImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image removed.');
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image.');
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !trip?.id) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed.');
      e.target.value = '';
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB.');
      e.target.value = '';
      return;
    }

    setAdditionalImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const { data } = await api.post('/admin/trips/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await addTripImages(trip.id, [{ url: data.url }]);
      setAdditionalImages((prev) => [...prev, ...result]);
      toast.success('Image uploaded and added!');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image.');
    } finally {
      setAdditionalImageUploading(false);
      e.target.value = '';
    }
  };

  const addIncludedItem = () => {
    if (!newIncludedItem.trim()) return;
    setFormData(prev => ({
      ...prev,
      included_items: [...prev.included_items, { fr: newIncludedItem, en: newIncludedItem, nl: newIncludedItem }],
    }));
    setNewIncludedItem('');
  };

  const removeIncludedItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      included_items: prev.included_items.filter((_, i) => i !== index),
    }));
  };

  const addProgramItem = () => {
    if (!newProgramTime.trim() || !newProgramDesc.trim()) return;
    setFormData(prev => ({
      ...prev,
      program: [...prev.program, { time: newProgramTime, fr: newProgramDesc, en: newProgramDesc, nl: newProgramDesc }],
    }));
    setNewProgramTime('');
    setNewProgramDesc('');
  };

  const removeProgramItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      program: prev.program.filter((_, i) => i !== index),
    }));
  };

  const toggleDestination = (destId: string) => {
    setFormData(prev => ({
      ...prev,
      destination_ids: prev.destination_ids.includes(destId)
        ? prev.destination_ids.filter(id => id !== destId)
        : [...prev.destination_ids, destId],
    }));
  };

  const removeDestination = (destId: string) => {
    setFormData(prev => ({
      ...prev,
      destination_ids: prev.destination_ids.filter(id => id !== destId),
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a trip name');
      return;
    }
    if (!formData.duration.trim()) {
      toast.error('Please enter a duration');
      return;
    }
    if (formData.price_international <= 0) {
      toast.error('Please enter an international price');
      return;
    }
    onSubmit(formData);
  };

  const activeDestinations = (destinations || []).filter(d => d.status === 'active');

  const filteredDestinations = useMemo(() => {
    if (!destSearch.trim()) return activeDestinations;
    const q = destSearch.toLowerCase();
    return activeDestinations.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q)
    );
  }, [activeDestinations, destSearch]);

  const linkedDestinations = useMemo(() => {
    return activeDestinations.filter(d => formData.destination_ids.includes(d.id));
  }, [activeDestinations, formData.destination_ids]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {trip ? 'Edit Trip' : 'Create New Trip'}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mt-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Trip Details
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'destinations' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Destinations ({formData.destination_ids.length})
          </button>
        </div>

        {activeTab === 'form' ? (
          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                />
              </div>
            </div>

            {/* Duration, Region, Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Duration *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 10h, 2 jours"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Region *</label>
                <select
                  value={formData.region}
                  onChange={e => setFormData(prev => ({ ...prev, region: e.target.value as any }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="kinshasa">Kinshasa</option>
                  <option value="kongo_central">Kongo Central</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price International ($) *</label>
                <input
                  type="number"
                  value={formData.price_international}
                  onChange={e => setFormData(prev => ({ ...prev, price_international: Number(e.target.value) }))}
                  min={0}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price Local ($) *</label>
                <input
                  type="number"
                  value={formData.price_local}
                  onChange={e => setFormData(prev => ({ ...prev, price_local: Number(e.target.value) }))}
                  min={0}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
              {formData.image && (
                <div className="mb-2 relative w-full aspect-video rounded-xl overflow-hidden">
                  <img src={formData.image} alt="Trip" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                {imageUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-500">Upload image</span>
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Additional Images (only when editing) */}
            {trip && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Additional Images</label>

                {/* Existing images */}
                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {additionalImages.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={img.url}
                          alt={img.alt_text || 'Additional image'}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(img.id)}
                          disabled={removingImageId === img.id}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          {removingImageId === img.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload additional image */}
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors mb-2">
                  {additionalImageUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">Upload additional image</span>
                  <input type="file" accept="image/jpeg,image/png" onChange={handleAdditionalImageUpload} className="hidden" />
                </label>

                {/* Add by URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAdditionalImage())}
                  />
                  <Button
                    onClick={handleAddAdditionalImage}
                    disabled={!newImageUrl.trim() || isAddingImage}
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                  >
                    {isAddingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  These appear in the trip detail page gallery.
                </p>
              </div>
            )}

            {/* Included Items */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What's Included</label>
              <div className="space-y-2 mb-2">
                {formData.included_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="flex-1 text-sm">{item.fr || item.en || (typeof item === 'string' ? item : JSON.stringify(item))}</span>
                    <button onClick={() => removeIncludedItem(index)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIncludedItem}
                  onChange={e => setNewIncludedItem(e.target.value)}
                  placeholder="Add included item..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
                />
                <Button onClick={addIncludedItem} size="sm" variant="outline" className="rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Program/Schedule */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Program / Schedule</label>
              <div className="space-y-2 mb-2">
                {formData.program.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-xs font-bold text-gray-500 w-24 shrink-0">{item.time}</span>
                    <span className="flex-1 text-sm">{item.fr || item.en || (typeof item === 'string' ? item : JSON.stringify(item))}</span>
                    <button onClick={() => removeProgramItem(index)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProgramTime}
                  onChange={e => setNewProgramTime(e.target.value)}
                  placeholder="Time"
                  className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                <input
                  type="text"
                  value={newProgramDesc}
                  onChange={e => setNewProgramDesc(e.target.value)}
                  placeholder="Description..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addProgramItem())}
                />
                <Button onClick={addProgramItem} size="sm" variant="outline" className="rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={e => setFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                min={0}
                className="w-24 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>
        ) : (
          /* Destinations Tab */
          <div className="space-y-4 mt-4">
            {/* Currently Linked Destinations */}
            {linkedDestinations.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Linked Destinations ({linkedDestinations.length})
                </label>
                <div className="space-y-2">
                  {linkedDestinations.map(dest => (
                    <div
                      key={dest.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl border border-black bg-black/5"
                    >
                      {dest.image && (
                        <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{dest.name}</p>
                        {dest.location && (
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {dest.location}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeDestination(dest.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors shrink-0"
                        title="Remove destination"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {linkedDestinations.length > 0 && (
              <div className="border-t border-gray-100" />
            )}

            {/* Search & Add Destinations */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Add Destinations</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={destSearch}
                  onChange={e => setDestSearch(e.target.value)}
                  placeholder="Search destinations by name or location..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {filteredDestinations.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No destinations found</p>
                ) : (
                  filteredDestinations.map(dest => {
                    const isLinked = formData.destination_ids.includes(dest.id);
                    return (
                      <button
                        key={dest.id}
                        onClick={() => toggleDestination(dest.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-colors ${
                          isLinked
                            ? 'border-black bg-black/5'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {dest.image && (
                          <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{dest.name}</p>
                          {dest.location && (
                            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {dest.location}
                            </p>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                          isLinked ? 'bg-black border-black' : 'border-gray-300'
                        }`}>
                          {isLinked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="rounded-full px-6">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-full px-6 bg-black hover:bg-gray-800 text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {trip ? 'Update Trip' : 'Create Trip'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
