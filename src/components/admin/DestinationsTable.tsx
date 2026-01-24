"use client";

import { useState } from "react";
import { Destination } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Search,
  Plus,
  History,
  MapPin,
  DollarSign,
  Star,
  RotateCcw,
} from "lucide-react";

interface DestinationsTableProps {
  destinations: Destination[];
  onView: (destination: Destination) => void;
  onEdit: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
  onCreate: () => void;
  onViewHistory: (destination: Destination) => void;
  onReactivate: (destination: Destination) => void;
  isReactivating?: boolean;
}

export function DestinationsTable({
  destinations,
  onView,
  onEdit,
  onDelete,
  onCreate,
  onViewHistory,
  onReactivate,
  isReactivating = false,
}: DestinationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header with search and create */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Destination
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Categories
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Rating
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {searchTerm
                      ? "No destinations found matching your search."
                      : "No destinations yet. Create your first one!"}
                  </td>
                </tr>
              ) : (
                filteredDestinations.map((destination) => {
                  const isInactive = destination.status === 'inactive';
                  return (
                  <tr
                    key={destination.id}
                    onClick={() => onView(destination)}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${isInactive ? 'opacity-50 bg-muted/20' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {destination.image && (
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className={`w-12 h-12 rounded-lg object-cover ${isInactive ? 'grayscale' : ''}`}
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isInactive ? 'line-through text-muted-foreground' : ''}`}>
                              {destination.name}
                            </p>
                            {isInactive && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {destination.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {destination.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {destination.location || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {destination.categories.map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat.parent.name}
                            {cat.subcategory && ` / ${cat.subcategory.name}`}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        {destination.price?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {destination.ratings?.toFixed(1) || "0.0"}
                      </div>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {isInactive ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReactivate(destination);
                              }}
                              className="gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                              title="Reactivate this destination"
                              disabled={isReactivating}
                            >
                              <RotateCcw className="h-4 w-4" />
                              Reactivate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewHistory(destination);
                              }}
                              title="View History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewHistory(destination);
                              }}
                              title="View History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(destination);
                              }}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(destination);
                              }}
                              className="text-destructive hover:text-destructive"
                              title="Deactivate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredDestinations.length} of {destinations.length}{" "}
          destinations
        </p>
      </div>
    </div>
  );
}
