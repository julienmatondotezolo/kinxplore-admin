"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Destination, CategoryAssignment, OpeningHours } from "@/lib/api";
import { useParentCategories, useSubcategories } from "@/hooks/useCategories";
import { Loader2, Plus, X, Clock } from "lucide-react";

// Subcategory selector component that loads subcategories for a specific parent
function SubcategorySelector({
  parentCategoryId,
  subcategoryId,
  onChange,
}: {
  parentCategoryId: string;
  subcategoryId?: string;
  onChange: (value: string) => void;
}) {
  const { data: subcategories, isLoading } = useSubcategories(parentCategoryId);

  if (isLoading) {
    return (
      <div className="mt-2 text-xs text-muted-foreground">Loading subcategories...</div>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <select
      value={subcategoryId || ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 text-xs w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <option value="">No subcategory</option>
      {subcategories
        .filter((s) => s.parent_category_id === parentCategoryId)
        .map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
    </select>
  );
}

interface DestinationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  destination?: Destination | null;
  isLoading?: boolean;
}

export function DestinationForm({
  open,
  onClose,
  onSubmit,
  destination,
  isLoading,
}: DestinationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: 0,
    location: "",
    ratings: 0,
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  const [categories, setCategories] = useState<CategoryAssignment[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("");

  const { data: parentCategories } = useParentCategories();

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name,
        description: destination.description || "",
        image: destination.image || "",
        price: destination.price || 0,
        location: destination.location || "",
        ratings: destination.ratings || 0,
      });

      // Set opening hours
      if (destination.opening_hours) {
        setOpeningHours(destination.opening_hours);
      } else {
        setOpeningHours({
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        });
      }

      // Convert categories to CategoryAssignment format
      const cats: CategoryAssignment[] = destination.categories.map((cat) => ({
        parent_category_id: cat.parent.id,
        subcategory_id: cat.subcategory?.id,
      }));
      setCategories(cats);
    } else {
      // Reset form
      setFormData({
        name: "",
        description: "",
        image: "",
        price: 0,
        location: "",
        ratings: 0,
      });
      setOpeningHours({
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      });
      setCategories([]);
    }
  }, [destination, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one category is selected
    if (categories.length === 0) {
      alert("Please add at least one category to the destination.");
      return;
    }
    
    // Filter out empty opening hours
    const filteredOpeningHours: OpeningHours = {};
    Object.entries(openingHours).forEach(([day, hours]) => {
      if (hours && hours.trim()) {
        filteredOpeningHours[day as keyof OpeningHours] = hours.trim();
      }
    });

    onSubmit({
      ...formData,
      category_ids: categories,
      opening_hours: Object.keys(filteredOpeningHours).length > 0 ? filteredOpeningHours : undefined,
    });
  };

  const addCategory = () => {
    if (selectedParent) {
      setCategories([
        ...categories,
        {
          parent_category_id: selectedParent,
        },
      ]);
      setSelectedParent("");
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategorySubcategory = (index: number, subcategoryId: string) => {
    const updated = [...categories];
    updated[index].subcategory_id = subcategoryId || undefined;
    setCategories(updated);
  };

  const setAllDays24Hours = () => {
    setOpeningHours({
      monday: "00:00-23:59",
      tuesday: "00:00-23:59",
      wednesday: "00:00-23:59",
      thursday: "00:00-23:59",
      friday: "00:00-23:59",
      saturday: "00:00-23:59",
      sunday: "00:00-23:59",
    });
  };

  const clearAllHours = () => {
    setOpeningHours({
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {destination ? "Edit Destination" : "Create New Destination"}
          </DialogTitle>
          <DialogDescription>
            {destination
              ? "Update the destination information below."
              : "Fill in the details to create a new destination."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter destination name"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter destination description"
                rows={4}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>

            {/* Price and Ratings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratings">Ratings (0-5)</Label>
                <Input
                  id="ratings"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.ratings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratings: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label>Opening Hours</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={setAllDays24Hours}
                    className="text-xs"
                  >
                    24/7
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllHours}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter opening hours in format: "9:00-18:00" or "9:00-12:00, 14:00-18:00" (leave empty for closed)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map((day) => (
                  <div key={day} className="space-y-1">
                    <Label htmlFor={day} className="text-xs capitalize">
                      {day}
                    </Label>
                    <Input
                      id={day}
                      value={openingHours[day] || ""}
                      onChange={(e) =>
                        setOpeningHours({ ...openingHours, [day]: e.target.value })
                      }
                      placeholder="9:00-18:00"
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label>
                Categories <span className="text-red-500">*</span>
              </Label>
              {categories.length === 0 && (
                <p className="text-xs text-red-500">
                  At least one category is required
                </p>
              )}

              {/* Existing categories */}
              <div className="space-y-2">
                {categories.map((cat, index) => {
                  const parent = parentCategories?.find(
                    (p) => p.id === cat.parent_category_id
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-gray-100 dark:bg-gray-800/50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{parent?.name}</p>
                        <SubcategorySelector
                          parentCategoryId={cat.parent_category_id}
                          subcategoryId={cat.subcategory_id}
                          onChange={(value) => updateCategorySubcategory(index, value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Add new category */}
              <div className="flex gap-2">
                <select
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  className="flex-1 h-11 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a category...</option>
                  {parentCategories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCategory}
                  disabled={!selectedParent}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {destination ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
