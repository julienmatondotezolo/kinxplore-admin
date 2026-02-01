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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

type SortColumn = "name" | "location" | "price" | "rating" | null;
type SortDirection = "asc" | "desc";

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
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Filter destinations
  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (!sortColumn) return 0;

    let compareResult = 0;

    switch (sortColumn) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "location":
        compareResult = (a.location || "").localeCompare(b.location || "");
        break;
      case "price":
        compareResult = (a.price || 0) - (b.price || 0);
        break;
      case "rating":
        compareResult = (a.ratings || 0) - (b.ratings || 0);
        break;
    }

    return sortDirection === "asc" ? compareResult : -compareResult;
  });

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Render sort icon
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

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
        <table className="w-full table-fixed">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="w-[30%] px-4 py-3 text-left text-sm font-semibold">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Destination
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="w-[25%] px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">
                <button
                  onClick={() => handleSort("location")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Location
                  <SortIcon column="location" />
                </button>
              </th>
              <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">
                Categories
              </th>
              <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Price
                  <SortIcon column="price" />
                </button>
              </th>
              <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold hidden sm:table-cell">
                <button
                  onClick={() => handleSort("rating")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Rating
                  <SortIcon column="rating" />
                </button>
              </th>
              <th className="w-[5%] px-4 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
            <tbody className="divide-y">
              {sortedDestinations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {searchTerm
                      ? "No destinations found matching your search."
                      : "No destinations yet. Create your first one!"}
                  </td>
                </tr>
              ) : (
                sortedDestinations.map((destination) => {
                  const isInactive = destination.status === 'inactive';
                  return (
                  <tr
                    key={destination.id}
                    onClick={() => onView(destination)}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${isInactive ? 'opacity-50 bg-muted/20' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {destination.image && (
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0 ${isInactive ? 'grayscale' : ''}`}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-medium text-sm truncate ${isInactive ? 'line-through text-muted-foreground' : ''}`}>
                              {destination.name}
                            </p>
                            {isInactive && (
                              <Badge variant="outline" className="text-xs text-muted-foreground flex-shrink-0">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {destination.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                              {destination.description}
                            </p>
                          )}
                          {/* Show location on mobile */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 lg:hidden truncate">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{destination.location || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-start gap-1 text-sm min-w-0">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{destination.location || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {destination.categories.slice(0, 2).map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat.parent.name}
                          </Badge>
                        ))}
                        {destination.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{destination.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-medium whitespace-nowrap">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        {destination.price?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {destination.ratings?.toFixed(1) || "0.0"}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {isInactive ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReactivate(destination);
                              }}
                              className="gap-1 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 h-8 px-2"
                              title="Reactivate this destination"
                              disabled={isReactivating}
                            >
                              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden xl:inline">Reactivate</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewHistory(destination);
                              }}
                              title="View History"
                              className="h-8 w-8 p-0"
                            >
                              <History className="h-3 w-3 sm:h-4 sm:w-4" />
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
                              className="h-8 w-8 p-0 hidden md:flex"
                            >
                              <History className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(destination);
                              }}
                              title="Edit"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(destination);
                              }}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                              title="Deactivate"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {sortedDestinations.length} of {destinations.length}{" "}
          destinations
          {sortColumn && (
            <span className="ml-2 text-primary">
              • Sorted by {sortColumn} ({sortDirection})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
