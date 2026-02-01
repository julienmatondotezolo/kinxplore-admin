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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

type ParentSortColumn = "name" | "subcategories" | "created" | null;
type SubSortColumn = "name" | "parent" | "created" | null;
type SortDirection = "asc" | "desc";

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
  const [parentSortColumn, setParentSortColumn] = useState<ParentSortColumn>(null);
  const [subSortColumn, setSubSortColumn] = useState<SubSortColumn>(null);
  const [parentSortDirection, setParentSortDirection] = useState<SortDirection>("asc");
  const [subSortDirection, setSubSortDirection] = useState<SortDirection>("asc");

  // Filter
  const filteredParents = parentCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubs = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.parent_categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort parents
  const sortedParents = [...filteredParents].sort((a, b) => {
    if (!parentSortColumn) return 0;
    let compareResult = 0;

    switch (parentSortColumn) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "subcategories":
        compareResult = (a.subcategories?.length || 0) - (b.subcategories?.length || 0);
        break;
      case "created":
        compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return parentSortDirection === "asc" ? compareResult : -compareResult;
  });

  // Sort subcategories
  const sortedSubs = [...filteredSubs].sort((a, b) => {
    if (!subSortColumn) return 0;
    let compareResult = 0;

    switch (subSortColumn) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "parent":
        compareResult = (a.parent_categories?.name || "").localeCompare(b.parent_categories?.name || "");
        break;
      case "created":
        compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return subSortDirection === "asc" ? compareResult : -compareResult;
  });

  // Handle sort for parents
  const handleParentSort = (column: ParentSortColumn) => {
    if (parentSortColumn === column) {
      if (parentSortDirection === "asc") {
        setParentSortDirection("desc");
      } else {
        setParentSortColumn(null);
        setParentSortDirection("asc");
      }
    } else {
      setParentSortColumn(column);
      setParentSortDirection("asc");
    }
  };

  // Handle sort for subcategories
  const handleSubSort = (column: SubSortColumn) => {
    if (subSortColumn === column) {
      if (subSortDirection === "asc") {
        setSubSortDirection("desc");
      } else {
        setSubSortColumn(null);
        setSubSortDirection("asc");
      }
    } else {
      setSubSortColumn(column);
      setSubSortDirection("asc");
    }
  };

  // Sort icons
  const ParentSortIcon = ({ column }: { column: ParentSortColumn }) => {
    if (parentSortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />;
    }
    return parentSortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
    ) : (
      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
    );
  };

  const SubSortIcon = ({ column }: { column: SubSortColumn }) => {
    if (subSortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />;
    }
    return subSortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
    ) : (
      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
    );
  };

  const activeParents = sortedParents.filter(c => c.status === 'active').length;
  const inactiveParents = sortedParents.filter(c => c.status === 'inactive').length;
  const activeSubs = sortedSubs.filter(c => c.status === 'active').length;
  const inactiveSubs = sortedSubs.filter(c => c.status === 'inactive').length;

  return (
    <div className="flex flex-col">
      {/* Header with search and tabs */}
      <div className="flex flex-col border-b border-border bg-card/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 rounded-2xl border-border bg-background/50 focus:bg-background transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span className="hidden sm:inline">Total</span>
            <span className="text-foreground font-bold">{activeTab === "parents" ? sortedParents.length : sortedSubs.length}</span>
            <span className="hidden sm:inline">items</span>
          </div>
        </div>

        <div className="px-6 pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto bg-transparent border-b border-transparent h-auto p-0 gap-8">
              <TabsTrigger 
                value="parents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold transition-all"
              >
                Parent Categories
              </TabsTrigger>
              <TabsTrigger 
                value="subcategories" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold transition-all"
              >
                Subcategories
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Parent Categories Table */}
        <TabsContent value="parents" className="m-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[40%]">
                    <button
                      onClick={() => handleParentSort("name")}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Name
                      <ParentSortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell w-[25%]">
                    <button
                      onClick={() => handleParentSort("subcategories")}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Subcategories
                      <ParentSortIcon column="subcategories" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell w-[20%]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[15%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedParents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="rounded-full bg-muted p-3">
                          <FolderTree className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium">No parent categories found</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? `No matches for "${searchTerm}"` : "Create your first parent category."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedParents.map((category) => {
                    const isInactive = category.status === 'inactive';
                    return (
                      <tr
                        key={category.id}
                        className={cn(
                          "group hover:bg-muted/50 transition-all",
                          isInactive && "opacity-60 grayscale-[0.5]"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                              <FolderTree className="h-5 w-5" />
                            </div>
                            <div>
                              <p className={cn(
                                "font-bold text-foreground group-hover:text-primary transition-colors",
                                isInactive && "text-muted-foreground line-through"
                              )}>
                                {category.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                ID: {category.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-xs font-bold bg-muted text-foreground border-none">
                              {category.subcategories?.length || 0} subcategories
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Badge 
                            variant={isInactive ? "outline" : "default"} 
                            className={cn(
                              "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              !isInactive && "bg-green-500/10 text-green-600 border-none",
                              isInactive && "bg-muted text-muted-foreground"
                            )}
                          >
                            {category.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isInactive ? (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onReactivateParent(category)}
                                className="h-9 w-9 rounded-xl text-green-600 border-green-200 hover:bg-green-50"
                                disabled={isReactivating}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEditParent(category)}
                                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDeleteParent(category)}
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
        </TabsContent>

        {/* Subcategories Table */}
        <TabsContent value="subcategories" className="m-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[40%]">
                    <button
                      onClick={() => handleSubSort("name")}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Name
                      <SubSortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell w-[25%]">
                    <button
                      onClick={() => handleSubSort("parent")}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Parent Category
                      <SubSortIcon column="parent" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell w-[20%]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[15%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedSubs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="rounded-full bg-muted p-3">
                          <Tag className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium">No subcategories found</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? `No matches for "${searchTerm}"` : "Create your first subcategory."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedSubs.map((subcategory) => {
                    const isInactive = subcategory.status === 'inactive';
                    return (
                      <tr
                        key={subcategory.id}
                        className={cn(
                          "group hover:bg-muted/50 transition-all",
                          isInactive && "opacity-60 grayscale-[0.5]"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                              <Tag className="h-5 w-5" />
                            </div>
                            <div>
                              <p className={cn(
                                "font-bold text-foreground group-hover:text-primary transition-colors",
                                isInactive && "text-muted-foreground line-through"
                              )}>
                                {subcategory.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                ID: {subcategory.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-xs font-bold bg-primary/5 text-primary border-none">
                            {subcategory.parent_categories?.name || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Badge 
                            variant={isInactive ? "outline" : "default"} 
                            className={cn(
                              "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              !isInactive && "bg-green-500/10 text-green-600 border-none",
                              isInactive && "bg-muted text-muted-foreground"
                            )}
                          >
                            {subcategory.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isInactive ? (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onReactivateSub(subcategory)}
                                className="h-9 w-9 rounded-xl text-green-600 border-green-200 hover:bg-green-50"
                                disabled={isReactivating}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEditSub(subcategory)}
                                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDeleteSub(subcategory)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
  );
}
