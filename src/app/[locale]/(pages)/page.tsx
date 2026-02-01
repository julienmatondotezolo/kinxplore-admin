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
import { 
  Loader2, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Plus,
  ArrowUpRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { UsersSidebar } from "@/components/admin/UsersSidebar";
import { QuickTabs } from "@/components/admin/QuickTabs";

const queryClient = new QueryClient();

function AdminContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

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
    setDetailsOpen(false);
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

  const safeDestinations = destinations || [];
  const activeDestinations = safeDestinations.filter(d => d.status === 'active');
  const totalDestinations = activeDestinations.length;
  const avgPrice = totalDestinations > 0
      ? activeDestinations.reduce((sum, d) => sum + (d.price || 0), 0) / totalDestinations
      : 0;
  const avgRating = totalDestinations > 0
      ? activeDestinations.reduce((sum, d) => sum + (d.ratings || 0), 0) / totalDestinations
      : 0;

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      <Toaster position="top-right" richColors />
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Dashboard Header */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 mt-2 text-lg">Welcome back! Here's what's happening with your store today.</p>
              </div>
              <Button 
                onClick={handleCreate}
                className="bg-black hover:bg-gray-800 text-white px-6 py-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">New Destination</span>
              </Button>
            </div>

            {/* Quick Action Banner Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Create Discount Code', color: 'bg-blue-50', text: 'text-blue-600' },
                { title: 'Email Campaign', color: 'bg-yellow-50', text: 'text-yellow-600' },
                { title: 'Announcement Banner', color: 'bg-green-50', text: 'text-green-600' },
                { title: 'Bundle Offers', color: 'bg-purple-50', text: 'text-purple-600' }
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-4 rounded-2xl border border-transparent hover:border-gray-200 transition-all cursor-pointer group`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${item.text}`}>{item.title}</h3>
                    <ArrowUpRight className={`w-4 h-4 ${item.text} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Set up percentage or fixed amount discounts</p>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Destinations</p>
                    <p className="text-5xl font-bold text-gray-900 mt-4">{totalDestinations}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin className="w-7 h-7" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-green-500 font-bold flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" /> +12.5%
                  </span>
                  <span className="text-gray-400 text-sm font-medium">This month</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Average Price</p>
                    <p className="text-5xl font-bold text-gray-900 mt-4">${avgPrice.toFixed(0)}</p>
                  </div>
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <DollarSign className="w-7 h-7" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-green-500 font-bold flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" /> +8.2%
                  </span>
                  <span className="text-gray-400 text-sm font-medium">This month</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Average Rating</p>
                    <p className="text-5xl font-bold text-gray-900 mt-4">{avgRating.toFixed(1)}</p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-green-500 font-bold flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" /> +3.1%
                  </span>
                  <span className="text-gray-400 text-sm font-medium">This month</span>
                </div>
              </div>
            </div>

            {/* Quick Tabs & Data Table Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-[500px]">
                  <QuickTabs />
                </div>
                
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Destinations</h3>
                    <Button variant="ghost" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all</Button>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <DestinationsTable
                      destinations={safeDestinations.slice(0, 5)}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCreate={handleCreate}
                      onViewHistory={handleViewHistory}
                      onReactivate={handleReactivate}
                      isReactivating={reactivateMutation.isPending}
                    />
                  )}
                </div>
              </div>

              {/* Right Column - Users Sidebar is integrated here or as a separate fixed sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm h-full overflow-hidden">
                  <UsersSidebar />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Deactivate Destination</DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to deactivate "{selectedDestination?.name}"? 
              The destination will be hidden from users but can be restored later. 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl px-6 bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Deactivate
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
