"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  Search,
  Plus,
  RotateCcw,
  FolderTree,
  Tag,
  Layers,
} from "lucide-react";

interface ParentCategory {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  parent_category_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  parent_categories?: ParentCategory;
}

interface CategoriesTableProps {
  parentCategories: ParentCategory[];
  subcategories: Subcategory[];
  onEditParent: (category: ParentCategory) => void;
  onDeleteParent: (category: ParentCategory) => void;
  onReactivateParent: (category: ParentCategory) => void;
  onEditSub: (subcategory: Subcategory) => void;
  onDeleteSub: (subcategory: Subcategory) => void;
  onReactivateSub: (subcategory: Subcategory) => void;
  onCreateParent: () => void;
  onCreateSub: () => void;
  isReactivating?: boolean;
}

export function CategoriesTable({
  parentCategories,
  subcategories,
  onEditParent,
  onDeleteParent,
  onReactivateParent,
  onEditSub,
  onDeleteSub,
  onReactivateSub,
  onCreateParent,
  onCreateSub,
  isReactivating = false,
}: CategoriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("parents");

  const filteredParents = parentCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubs = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.parent_categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeParents = filteredParents.filter(c => c.status === 'active').length;
  const inactiveParents = filteredParents.filter(c => c.status === 'inactive').length;
  const activeSubs = filteredSubs.filter(c => c.status === 'active').length;
  const inactiveSubs = filteredSubs.filter(c => c.status === 'inactive').length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with search and stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 sm:h-10"
          />
        </div>
        
        <Button
          onClick={activeTab === "parents" ? onCreateParent : onCreateSub}
          className="gap-2 h-9 sm:h-10 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Create</span> {activeTab === "parents" ? "Parent" : "Sub"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Parents</p>
              <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{activeParents}</p>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FolderTree className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Inactive Parents</p>
              <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{inactiveParents}</p>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/30">
              <FolderTree className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Subs</p>
              <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{activeSubs}</p>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Inactive Subs</p>
              <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{inactiveSubs}</p>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/30">
              <Tag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="parents" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <FolderTree className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Parent Categories</span>
            <span className="xs:hidden">Parents</span> ({filteredParents.length})
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Subcategories</span>
            <span className="xs:hidden">Subs</span> ({filteredSubs.length})
          </TabsTrigger>
        </TabsList>

        {/* Parent Categories Table */}
        <TabsContent value="parents" className="mt-3 sm:mt-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-sm font-semibold">Subcategories</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold">Created</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredParents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        {searchTerm
                          ? "No parent categories found matching your search."
                          : "No parent categories yet. Create your first one!"}
                      </td>
                    </tr>
                  ) : (
                    filteredParents.map((category) => {
                      const isInactive = category.status === 'inactive';
                      const subCount = category.subcategories?.length || 0;
                      return (
                        <tr
                          key={category.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isInactive ? 'opacity-50 bg-muted/20' : ''
                          }`}
                        >
                          <td className="px-2 sm:px-4 py-3 sm:py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <div className="flex items-center gap-2">
                                <FolderTree className={`h-3 w-3 sm:h-4 sm:w-4 ${isInactive ? 'text-muted-foreground' : 'text-blue-600'}`} />
                                <span className={`font-medium text-sm sm:text-base ${isInactive ? 'line-through text-muted-foreground' : ''}`}>
                                  {category.name}
                                </span>
                              </div>
                              {isInactive && (
                                <Badge variant="outline" className="text-xs w-fit">
                                  Inactive
                                </Badge>
                              )}
                              <div className="sm:hidden flex items-center gap-2 text-xs text-muted-foreground">
                                <Layers className="h-3 w-3" />
                                {subCount} subs
                              </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4">
                            <div className="flex items-center gap-1">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{subCount}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-4 py-4">
                            <Badge variant={isInactive ? "outline" : "default"} className="text-xs">
                              {category.status}
                            </Badge>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-4">
                            <span className="text-sm text-muted-foreground">
                              {new Date(category.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              {isInactive ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onReactivateParent(category)}
                                  className="gap-1 sm:gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 text-xs sm:text-sm h-8 px-2 sm:px-3"
                                  disabled={isReactivating}
                                >
                                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Reactivate</span>
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditParent(category)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteParent(category)}
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
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
          </div>
        </TabsContent>

        {/* Subcategories Table */}
        <TabsContent value="subcategories" className="mt-3 sm:mt-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-sm font-semibold">Parent Category</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold">Created</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSubs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        {searchTerm
                          ? "No subcategories found matching your search."
                          : "No subcategories yet. Create your first one!"}
                      </td>
                    </tr>
                  ) : (
                    filteredSubs.map((subcategory) => {
                      const isInactive = subcategory.status === 'inactive';
                      return (
                        <tr
                          key={subcategory.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isInactive ? 'opacity-50 bg-muted/20' : ''
                          }`}
                        >
                          <td className="px-2 sm:px-4 py-3 sm:py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <div className="flex items-center gap-2">
                                <Tag className={`h-3 w-3 sm:h-4 sm:w-4 ${isInactive ? 'text-muted-foreground' : 'text-purple-600'}`} />
                                <span className={`font-medium text-sm sm:text-base ${isInactive ? 'line-through text-muted-foreground' : ''}`}>
                                  {subcategory.name}
                                </span>
                              </div>
                              {isInactive && (
                                <Badge variant="outline" className="text-xs w-fit">
                                  Inactive
                                </Badge>
                              )}
                              <div className="sm:hidden">
                                <Badge variant="secondary" className="text-xs">
                                  {subcategory.parent_categories?.name || 'N/A'}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4">
                            <Badge variant="secondary" className="text-xs">
                              {subcategory.parent_categories?.name || 'N/A'}
                            </Badge>
                          </td>
                          <td className="hidden md:table-cell px-4 py-4">
                            <Badge variant={isInactive ? "outline" : "default"} className="text-xs">
                              {subcategory.status}
                            </Badge>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-4">
                            <span className="text-sm text-muted-foreground">
                              {new Date(subcategory.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              {isInactive ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onReactivateSub(subcategory)}
                                  className="gap-1 sm:gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 text-xs sm:text-sm h-8 px-2 sm:px-3"
                                  disabled={isReactivating}
                                >
                                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Reactivate</span>
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditSub(subcategory)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteSub(subcategory)}
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
