"use client";

import { Destination } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Tag,
  Image as ImageIcon,
  Edit,
  Clock,
  RotateCcw,
} from "lucide-react";

interface DestinationDetailsProps {
  open: boolean;
  onClose: () => void;
  destination: Destination | null;
  onEdit?: (destination: Destination) => void;
  onReactivate?: (destination: Destination) => void;
  isReactivating?: boolean;
}

export function DestinationDetails({
  open,
  onClose,
  destination,
  onEdit,
  onReactivate,
  isReactivating = false,
}: DestinationDetailsProps) {
  if (!destination) return null;

  const isInactive = destination.status === "inactive";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                {destination.name}
                {isInactive && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Inactive
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Complete destination information
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {isInactive && onReactivate ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReactivate(destination)}
                  className="gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                  disabled={isReactivating}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reactivate
                </Button>
              ) : (
                onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(destination)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image */}
          {destination.image && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                Image
              </div>
              <div className={`relative aspect-video rounded-lg overflow-hidden border ${isInactive ? 'grayscale opacity-50' : ''}`}>
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {destination.image}
              </p>
            </div>
          )}

          {/* Description */}
          {destination.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-sm leading-relaxed">{destination.description}</p>
            </div>
          )}

          {/* Location, Price, Rating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <p className="text-sm">{destination.location || "N/A"}</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Price
              </div>
              <p className="text-lg font-semibold text-green-600">
                ${destination.price?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Star className="h-4 w-4" />
                Rating
              </div>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {destination.ratings?.toFixed(1) || "0.0"}
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          {destination.opening_hours && Object.keys(destination.opening_hours).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Opening Hours
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(destination.opening_hours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <span className="text-sm font-medium capitalize">{day}</span>
                    <span className="text-sm text-muted-foreground">{hours || "Closed"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {destination.categories && destination.categories.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.categories.map((cat, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                    {cat.parent.name}
                    {cat.subcategory && (
                      <span className="ml-1 text-muted-foreground">
                        / {cat.subcategory.name}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              Metadata
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono">{destination.id}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">Status:</span>
                <span className={isInactive ? "text-red-600" : "text-green-600"}>
                  {destination.status}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(destination.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/30">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(destination.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
