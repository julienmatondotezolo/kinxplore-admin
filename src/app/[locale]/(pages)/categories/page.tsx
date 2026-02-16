"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  useParentCategories,
  useSubcategories,
  useCreateParentCategory,
  useUpdateParentCategory,
  useDeleteParentCategory,
  useReactivateParentCategory,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
  useReactivateSubcategory,
} from "@/hooks/useCategoryManagement";
import { ParentCategory } from "@/lib/api";
import { Loader2, FolderTree, Tag, Layers, ArrowLeft, Home, Plus } from "lucide-react";
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

function CategoriesContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"parent" | "subcategory">("parent");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"parent" | "sub">("parent");
  const [selectedParent, setSelectedParent] = useState<ParentCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);

  const { data: parentCategories, isLoading: loadingParents, error: errorParents } = useParentCategories();
  const { data: subcategories, isLoading: loadingSubs, error: errorSubs } = useSubcategories();

  const createParentMutation = useCreateParentCategory();
  const updateParentMutation = useUpdateParentCategory();
  const deleteParentMutation = useDeleteParentCategory();
  const reactivateParentMutation = useReactivateParentCategory();

  const createSubMutation = useCreateSubcategory();
  const updateSubMutation = useUpdateSubcategory();
  const deleteSubMutation = useDeleteSubcategory();
  const reactivateSubMutation = useReactivateSubcategory();

  const handleCreateParent = () => {
    setSelectedParent(null);
    setSelectedSub(null);
    setFormMode("parent");
    setFormOpen(true);
  };

  const handleCreateSub = () => {
    setSelectedParent(null);
    setSelectedSub(null);
    setFormMode("subcategory");
    setFormOpen(true);
  };

  const handleEditParent = (category: ParentCategory) => {
    setSelectedParent(category);
    setSelectedSub(null);
    setFormMode("parent");
    setFormOpen(true);
  };

  const handleEditSub = (subcategory: any) => {
    setSelectedSub(subcategory);
    setSelectedParent(null);
    setFormMode("subcategory");
    setFormOpen(true);
  };

  const handleDeleteParent = (category: ParentCategory) => {
    setSelectedParent(category);
    setDeleteType("parent");
    setDeleteDialogOpen(true);
  };

  const handleDeleteSub = (subcategory: any) => {
    setSelectedSub(subcategory);
    setDeleteType("sub");
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === "parent" && selectedParent) {
      deleteParentMutation.mutate(selectedParent.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedParent(null);
        },
      });
    } else if (deleteType === "sub" && selectedSub) {
      deleteSubMutation.mutate(selectedSub.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedSub(null);
        },
      });
    }
  };

  const handleReactivateParent = (category: ParentCategory) => {
    reactivateParentMutation.mutate(category.id);
  };

  const handleReactivateSub = (subcategory: any) => {
    reactivateSubMutation.mutate(subcategory.id);
  };

  const handleSubmitParent = (data: { name: string }) => {
    if (selectedParent) {
      updateParentMutation.mutate(
        { id: selectedParent.id, name: data.name },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedParent(null);
          },
        }
      );
    } else {
      createParentMutation.mutate(data.name, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleSubmitSub = (data: { name: string; parent_category_id: string }) => {
    if (selectedSub) {
      updateSubMutation.mutate(
        { id: selectedSub.id, name: data.name, parent_category_id: data.parent_category_id },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedSub(null);
          },
        }
      );
    } else {
      createSubMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  // Calculate stats
  const safeParents = parentCategories || [];
  const safeSubs = subcategories || [];
  const activeParents = safeParents.filter(c => c.status === 'active').length;
  const activeSubs = safeSubs.filter(c => c.status === 'active').length;
  const totalCategories = activeParents + activeSubs;

  const isLoading = loadingParents || loadingSubs;
  const error = errorParents || errorSubs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 sm:gap-2 hover:bg-muted/50 h-8 sm:h-9"
                aria-label="Back to home"
              >
                <Home className="h-3 w-3 sm:hidden" />
                <ArrowLeft className="hidden sm:block h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                Category Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Organize your destinations
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold tracking-tight">
                Categories
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="sm:hidden">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-6 grid-cols-3 sm:grid-cols-3">
          <div className="rounded-lg sm:rounded-xl border border-border/40 bg-card/50 p-3 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{totalCategories}</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-border/40 bg-card/50 p-3 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Parents
                </p>
                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{activeParents}</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FolderTree className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-border/40 bg-card/50 p-3 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Subs
                </p>
                <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{activeSubs}</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="rounded-lg sm:rounded-xl border border-border/40 bg-card/50 p-3 sm:p-6 shadow-xl backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-destructive text-center">
                <p className="text-lg font-semibold">Failed to load categories</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure the backend server is running
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <CategoriesTable
              parentCategories={safeParents}
              subcategories={safeSubs}
              onEditParent={handleEditParent}
              onDeleteParent={handleDeleteParent}
              onReactivateParent={handleReactivateParent}
              onEditSub={handleEditSub}
              onDeleteSub={handleDeleteSub}
              onReactivateSub={handleReactivateSub}
              onCreateParent={handleCreateParent}
              onCreateSub={handleCreateSub}
              isReactivating={reactivateParentMutation.isPending || reactivateSubMutation.isPending}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <CategoryForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedParent(null);
          setSelectedSub(null);
        }}
        onSubmitParent={handleSubmitParent}
        onSubmitSub={handleSubmitSub}
        parentCategories={safeParents}
        editingParent={selectedParent}
        editingSub={selectedSub}
        isLoading={
          createParentMutation.isPending ||
          updateParentMutation.isPending ||
          createSubMutation.isPending ||
          updateSubMutation.isPending
        }
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate {deleteType === "parent" ? "Parent Category" : "Subcategory"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "
              {deleteType === "parent" ? selectedParent?.name : selectedSub?.name}"?
              {deleteType === "parent" && " All subcategories under this category will also be deactivated."}
              {" "}This action can be reversed later.
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
              disabled={deleteParentMutation.isPending || deleteSubMutation.isPending}
            >
              {(deleteParentMutation.isPending || deleteSubMutation.isPending) && (
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

export default function CategoriesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesContent />
    </QueryClientProvider>
  );
}
