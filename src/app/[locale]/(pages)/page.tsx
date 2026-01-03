"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { DestinationsTable } from "@/components/admin/DestinationsTable";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { ArchiveHistory } from "@/components/admin/ArchiveHistory";
import {
  useDestinations,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
} from "@/hooks/useDestinations";
import { Destination } from "@/lib/api";
import { Loader2, Database, TrendingUp, MapPin, DollarSign } from "lucide-react";
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const { data: destinations, isLoading, error } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();

  const handleCreate = () => {
    setSelectedDestination(null);
    setFormOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
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

  // Calculate stats - with safe defaults
  const safeDestinations = destinations || [];
  const totalDestinations = safeDestinations.length;
  const avgPrice =
    totalDestinations > 0
      ? safeDestinations.reduce((sum, d) => sum + (d.price || 0), 0) / totalDestinations
      : 0;
  const avgRating =
    totalDestinations > 0
      ? safeDestinations.reduce((sum, d) => sum + (d.ratings || 0), 0) / totalDestinations
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Kinxplore Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Destination Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/40 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Destinations
                </p>
                <p className="text-3xl font-bold mt-2">{totalDestinations}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Price
                </p>
                <p className="text-3xl font-bold mt-2">${avgPrice.toFixed(2)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <p className="text-3xl font-bold mt-2">{avgRating.toFixed(1)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Table */}
        <div className="rounded-xl border border-border/40 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-destructive text-center">
                <p className="text-lg font-semibold">Failed to load destinations</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <DestinationsTable
              destinations={safeDestinations}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onViewHistory={handleViewHistory}
            />
          )}
        </div>
      </main>

      {/* Modals */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDestination?.name}"? This
              action cannot be undone, but the deletion will be archived.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
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
