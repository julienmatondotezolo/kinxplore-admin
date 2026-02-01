"use client";

import { useState } from "react";
import { Destination } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col">
      {/* Header with search and create */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 border-b border-border bg-card/50">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-2xl border-border bg-background/50 focus:bg-background transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="hidden sm:inline">Showing</span>
          <span className="text-foreground font-bold">{sortedDestinations.length}</span>
          <span className="hidden sm:inline">of {destinations.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[35%]">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Destination
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell w-[25%]">
                <button
                  onClick={() => handleSort("location")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Location
                  <SortIcon column="location" />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell w-[15%]">
                Categories
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[12%]">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Price
                  <SortIcon column="price" />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell w-[10%] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedDestinations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="rounded-full bg-muted p-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? `No destinations match "${searchTerm}"` : "Start by adding your first destination."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedDestinations.map((destination) => {
                const isInactive = destination.status === 'inactive';
                return (
                  <tr
                    key={destination.id}
                    onClick={() => onView(destination)}
                    className={cn(
                      "group hover:bg-muted/50 transition-all cursor-pointer",
                      isInactive && "opacity-60 grayscale-[0.5]"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                          {destination.image ? (
                            <img
                              src={destination.image}
                              alt={destination.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                              <MapPin className="h-5 w-5" />
                            </div>
                          )}
                          {isInactive && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold px-1 h-4 bg-background">Archived</Badge>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "font-bold text-foreground group-hover:text-primary transition-colors truncate",
                            isInactive && "text-muted-foreground"
                          )}>
                            {destination.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 lg:hidden">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{destination.location || "No location"}</span>
                          </div>
                          <p className="hidden lg:block text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {destination.description || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate max-w-[200px]">{destination.location || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {destination.categories.slice(0, 1).map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-none">
                            {cat.parent.name}
                          </Badge>
                        ))}
                        {destination.categories.length > 1 && (
                          <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-bold border-border">
                            +{destination.categories.length - 1}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">${destination.price?.toFixed(0) || "0"}</span>
                        <div className="flex items-center gap-1 text-[10px] text-yellow-600 font-bold">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          {destination.ratings?.toFixed(1) || "0.0"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isInactive ? (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReactivate(destination);
                            }}
                            className="h-9 w-9 rounded-xl text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                            disabled={isReactivating}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(destination);
                              }}
                              className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(destination);
                              }}
                              className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
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
  );
}
