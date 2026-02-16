'use client';

import { useState, useEffect } from 'react';
import { Trip, api } from '@/lib/api';
import { useDestinations } from '@/hooks/useDestinations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, Upload } from 'lucide-react';

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
    }
  }, [trip, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const { data } = await api.post('/admin/trips/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {trip ? 'Edit Trip' : 'Create New Trip'}
          </DialogTitle>
        </DialogHeader>

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
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

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

          {/* Linked Destinations */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Linked Destinations</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {activeDestinations.map(dest => (
                <label
                  key={dest.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    formData.destination_ids.includes(dest.id)
                      ? 'border-black bg-black/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.destination_ids.includes(dest.id)}
                    onChange={() => toggleDestination(dest.id)}
                    className="rounded"
                  />
                  <span className="text-sm truncate">{dest.name}</span>
                </label>
              ))}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
