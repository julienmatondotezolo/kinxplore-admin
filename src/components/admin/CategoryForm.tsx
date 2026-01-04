"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FolderTree, Tag } from "lucide-react";
import { ParentCategory } from "@/lib/api";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitParent: (data: { name: string }) => void;
  onSubmitSub: (data: { name: string; parent_category_id: string }) => void;
  parentCategories: ParentCategory[];
  editingParent?: ParentCategory | null;
  editingSub?: any | null;
  isLoading: boolean;
  mode?: "parent" | "subcategory";
}

export function CategoryForm({
  open,
  onClose,
  onSubmitParent,
  onSubmitSub,
  parentCategories,
  editingParent,
  editingSub,
  isLoading,
  mode = "parent",
}: CategoryFormProps) {
  const [activeTab, setActiveTab] = useState<string>(mode);
  const [parentName, setParentName] = useState("");
  const [subName, setSubName] = useState("");
  const [selectedParent, setSelectedParent] = useState("");

  useEffect(() => {
    if (editingParent) {
      setParentName(editingParent.name);
      setActiveTab("parent");
    } else if (editingSub) {
      setSubName(editingSub.name);
      setSelectedParent(editingSub.parent_category_id || "");
      setActiveTab("subcategory");
    } else {
      setParentName("");
      setSubName("");
      setSelectedParent("");
      setActiveTab(mode);
    }
  }, [editingParent, editingSub, mode, open]);

  const handleSubmitParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentName.trim()) {
      onSubmitParent({ name: parentName.trim() });
    }
  };

  const handleSubmitSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (subName.trim() && selectedParent) {
      onSubmitSub({ name: subName.trim(), parent_category_id: selectedParent });
    }
  };

  const handleClose = () => {
    setParentName("");
    setSubName("");
    setSelectedParent("");
    onClose();
  };

  const activeParentCategories = parentCategories.filter(p => p.status === 'active');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {editingParent || editingSub ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parent" className="gap-2">
              <FolderTree className="h-4 w-4" />
              Parent Category
            </TabsTrigger>
            <TabsTrigger value="subcategory" className="gap-2">
              <Tag className="h-4 w-4" />
              Subcategory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parent" className="space-y-4 mt-4">
            <form onSubmit={handleSubmitParent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parent-name">Category Name</Label>
                <Input
                  id="parent-name"
                  placeholder="e.g., Adventure, Culture, Food & Drink"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Main category that will contain subcategories
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !parentName.trim()}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingParent ? "Update" : "Create"} Parent Category
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="subcategory" className="space-y-4 mt-4">
            <form onSubmit={handleSubmitSub} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parent-select">Parent Category</Label>
                <select
                  id="parent-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select a parent category</option>
                  {activeParentCategories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-name">Subcategory Name</Label>
                <Input
                  id="sub-name"
                  placeholder="e.g., Hiking, Museums, Local Cuisine"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Specific category under the parent
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !subName.trim() || !selectedParent}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSub ? "Update" : "Create"} Subcategory
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
