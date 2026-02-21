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
  ArrowUpRight,
  Calendar
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
import { CategoriesView } from "@/components/admin/CategoriesView";
import { SubcategoriesView } from "@/components/admin/SubcategoriesView";
import { BookingsView } from "@/components/admin/BookingsView";
import { FacilitiesView } from "@/components/admin/FacilitiesView";
import { TripsView } from "@/components/admin/TripsView";
import { InquiriesView } from "@/components/admin/InquiriesView";
import { useBookingManagement } from "@/hooks/useBookingManagement";

const queryClient = new QueryClient();

type ViewType = 'dashboard' | 'destinations' | 'categories' | 'bookings' | 'subcategories' | 'facilities' | 'trips' | 'inquiries';

function AdminContent() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
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
  const { statistics: bookingStats } = useBookingManagement();

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

  const renderContent = () => {
    switch (currentView) {
      case 'destinations':
        return (
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Destinations</h1>
                <p className="text-gray-600 mt-2 text-lg">Manage all your travel destinations</p>
              </div>
              <Button 
                onClick={handleCreate}
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">New Destination</span>
              </Button>
            </div>

            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        );

      case 'categories':
        return <CategoriesView />;

      case 'subcategories':
        return <SubcategoriesView />;

      case 'facilities':
        return <FacilitiesView />;

      case 'trips':
        return <TripsView />;

      case 'bookings':
        return <BookingsView />;

      case 'inquiries':
        return <InquiriesView />;

      default:
        return (
          <>
            {/* Dashboard Header */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening with your store today.</p>
              </div>
              <Button 
                onClick={handleCreate}
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">New Destination</span>
              </Button>
            </div>

            {/* Quick Action Banner Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Create Discount Code', subtitle: 'Set up percentage or fixed amount discounts', color: 'bg-blue-50', text: 'text-blue-600' },
                { title: 'Email Campaign', subtitle: 'Send newsletters and promotional emails', color: 'bg-amber-50', text: 'text-amber-600' },
                { title: 'Announcement Banner', subtitle: 'Display site-wide promotional messages', color: 'bg-emerald-50', text: 'text-emerald-600' },
                { title: 'Bundle Offers', subtitle: 'Create product bundles with special pricing', color: 'bg-purple-50', text: 'text-purple-600' }
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-5 rounded-[20px] border border-transparent hover:border-gray-200 transition-all cursor-pointer group hover:shadow-md`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-sm ${item.text}`}>{item.title}</h3>
                    <ArrowUpRight className={`w-4 h-4 ${item.text} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{item.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Active Destinations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalDestinations}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-[14px] flex items-center justify-center text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-green-600 font-bold flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                  </span>
                  <span className="text-gray-600 text-xs font-medium">This month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{bookingStats?.total || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-[14px] flex items-center justify-center text-emerald-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-green-600 font-bold flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3" /> +{bookingStats?.newThisMonth || 0}
                  </span>
                  <span className="text-gray-600 text-xs font-medium">This month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{avgRating.toFixed(1)}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-[14px] flex items-center justify-center text-amber-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-green-600 font-bold flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3" /> +3.1%
                  </span>
                  <span className="text-gray-600 text-xs font-medium">This month</span>
                </div>
              </div>
            </div>

            {/* Quick Tabs & Data Table Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-[500px]">
                  <QuickTabs />
                </div>
                
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Destinations</h3>
                    <Button 
                      onClick={() => setCurrentView('destinations')}
                      variant="ghost" 
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4"
                    >
                      View all
                    </Button>
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

              {/* Right Column - Users Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm h-full overflow-hidden">
                  <UsersSidebar />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* Left Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {renderContent()}
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
        <DialogContent className="rounded-[20px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Deactivate Destination</DialogTitle>
            <DialogDescription className="text-gray-500 text-base">
              Are you sure you want to deactivate "{selectedDestination?.name}"? 
              The destination will be hidden from users but can be restored later. 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-full px-6 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-full px-6 bg-black hover:bg-gray-800 text-white"
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
