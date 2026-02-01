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
import { Loader2, FolderTree, Tag, Layers, ArrowLeft, Home } from "lucide-react";
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
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* Page Title Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize and classify your destinations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateParent} variant="outline" className="rounded-xl gap-2">
            <FolderTree className="h-4 w-4" />
            New Parent
          </Button>
          <Button onClick={handleCreateSub} variant="default" className="rounded-xl gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Add Subcategory
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Total Categories
              </p>
              <p className="text-4xl font-bold tracking-tight">{totalCategories}</p>
              <p className="text-xs font-medium text-muted-foreground">Active classification</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <Layers className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">
                Parent Categories
              </p>
              <p className="text-4xl font-bold tracking-tight">{activeParents}</p>
              <p className="text-xs font-medium text-muted-foreground">Main groupings</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FolderTree className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">
                Subcategories
              </p>
              <p className="text-4xl font-bold tracking-tight">{activeSubs}</p>
              <p className="text-xs font-medium text-muted-foreground">Specific tags</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 transition-transform duration-300 group-hover:scale-110">
              <Tag className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 px-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <Layers className="h-8 w-8 text-destructive" />
            </div>
            <div className="max-w-md">
              <p className="text-xl font-bold">Connection Error</p>
              <p className="text-muted-foreground mt-2">
                We couldn't fetch the categories. Please ensure your backend service is running.
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="p-1">
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
          </div>
        )}
      </div>

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
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Deactivate {deleteType === "parent" ? "Parent Category" : "Subcategory"}</DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to deactivate <span className="font-semibold text-foreground">"{deleteType === "parent" ? selectedParent?.name : selectedSub?.name}"</span>?
              {deleteType === "parent" && " All subcategories under this category will also be deactivated."}
              {" "}This action can be reversed later.
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
              disabled={deleteParentMutation.isPending || deleteSubMutation.isPending}
              className="rounded-xl shadow-lg shadow-destructive/20"
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
