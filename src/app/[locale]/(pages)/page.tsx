"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { DestinationsTable } from "@/components/admin/DestinationsTable";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { DestinationDetails } from "@/components/admin/DestinationDetails";
import { ArchiveHistory } from "@/components/admin/ArchiveHistory";
import {
  useDestinations,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
  useReactivateDestination,
} from "@/hooks/useDestinations";
import { Destination } from "@/lib/api";
import { Loader2, Database, TrendingUp, MapPin, DollarSign, Plus } from "lucide-react";
import { Link } from "@/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const queryClient = new QueryClient();

function AdminContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const { data: destinations, isLoading, error } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();
  const reactivateMutation = useReactivateDestination();

  const handleCreate = () => {
    setSelectedDestination(null);
    setFormOpen(true);
  };

  const handleView = (destination: Destination) => {
    setSelectedDestination(destination);
    setDetailsOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setDetailsOpen(false); // Close details if open
    setFormOpen(true);
  };

  const handleDelete = (destination: Destination) => {
    setSelectedDestination(destination);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDestination) {
      deleteMutation.mutate(
        { id: selectedDestination.id, modifiedBy: "admin" },
        {
          onSuccess: () => {
            setDeleteDialogOpen(false);
            setSelectedDestination(null);
          },
        }
      );
    }
  };

  const handleViewHistory = (destination: Destination) => {
    setSelectedDestination(destination);
    setHistoryOpen(true);
  };

  const handleReactivate = (destination: Destination) => {
    reactivateMutation.mutate({ id: destination.id, modifiedBy: "admin" });
  };

  const handleSubmit = (data: any) => {
    if (selectedDestination) {
      updateMutation.mutate(
        {
          id: selectedDestination.id,
          destination: data,
          modifiedBy: "admin",
        },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedDestination(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        { destination: data, modifiedBy: "admin" },
        {
          onSuccess: () => {
            setFormOpen(false);
          },
        }
      );
    }
  };

  // Calculate stats - with safe defaults (only count active destinations)
  const safeDestinations = destinations || [];
  const activeDestinations = safeDestinations.filter(d => d.status === 'active');
  const totalDestinations = activeDestinations.length;
  const avgPrice =
    totalDestinations > 0
      ? activeDestinations.reduce((sum, d) => sum + (d.price || 0), 0) / totalDestinations
      : 0;
  const avgRating =
    totalDestinations > 0
      ? activeDestinations.reduce((sum, d) => sum + (d.ratings || 0), 0) / totalDestinations
      : 0;

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* Page Title Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
          <p className="text-muted-foreground">Manage your travel destinations and their details.</p>
        </div>
        <Button onClick={handleCreate} variant="default" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Active Destinations
              </p>
              <p className="text-4xl font-bold tracking-tight">{totalDestinations}</p>
              <p className="text-xs font-medium text-muted-foreground">
                <span className="text-accent">{safeDestinations.length - totalDestinations}</span> archived
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <MapPin className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors">
                Average Price
              </p>
              <p className="text-4xl font-bold tracking-tight">${avgPrice.toFixed(0)}</p>
              <p className="text-xs font-medium text-muted-foreground">Across all regions</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110">
              <DollarSign className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-yellow-600 transition-colors">
                Average Rating
              </p>
              <p className="text-4xl font-bold tracking-tight">{avgRating.toFixed(1)}</p>
              <p className="text-xs font-medium text-muted-foreground">Based on user reviews</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-600 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 px-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <Database className="h-8 w-8 text-destructive" />
            </div>
            <div className="max-w-md">
              <p className="text-xl font-bold">Connection Error</p>
              <p className="text-muted-foreground mt-2">
                We couldn't fetch the destinations. Please ensure your backend service is running.
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="p-1">
            <DestinationsTable
              destinations={safeDestinations}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onViewHistory={handleViewHistory}
              onReactivate={handleReactivate}
              isReactivating={reactivateMutation.isPending}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <DestinationDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDestination(null);
        }}
        destination={selectedDestination}
        onEdit={handleEdit}
        onReactivate={handleReactivate}
        isReactivating={reactivateMutation.isPending}
      />

      <DestinationForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedDestination(null);
        }}
        onSubmit={handleSubmit}
        destination={selectedDestination}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ArchiveHistory
        open={historyOpen}
        onClose={() => {
          setHistoryOpen(false);
          setSelectedDestination(null);
        }}
        destination={selectedDestination}
      />

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Deactivate Destination</DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to deactivate <span className="font-semibold text-foreground">"{selectedDestination?.name}"</span>? 
              It will be hidden from users but can be restored later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl shadow-lg shadow-destructive/20"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Deactivate Destination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminContent />
    </QueryClientProvider>
  );
}
