"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllHistory, useDestinationHistory } from "@/hooks/useDestinations";
import { Destination, ArchiveEntry } from "@/lib/api";
import { Loader2, Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";

interface ArchiveHistoryProps {
  open: boolean;
  onClose: () => void;
  destination?: Destination | null;
}

export function ArchiveHistory({
  open,
  onClose,
  destination,
}: ArchiveHistoryProps) {
  const [activeTab, setActiveTab] = useState<"specific" | "all">(
    destination ? "specific" : "all"
  );

  const { data: specificHistory, isLoading: specificLoading } =
    useDestinationHistory(destination?.id || "");
  const { data: allHistoryData, isLoading: allLoading } = useAllHistory(50, 0);

  const isLoading = activeTab === "specific" ? specificLoading : allLoading;
  const historyData =
    activeTab === "specific" ? specificHistory : allHistoryData?.data;

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch {
      return dateString;
    }
  };

  const renderHistoryEntry = (entry: ArchiveEntry) => (
    <div
      key={entry.id}
      className="p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getOperationColor(entry.operation_type)}>
              {entry.operation_type}
            </Badge>
            <span className="text-sm font-medium">
              {entry.destination_data?.name || "Unknown Destination"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {entry.modified_by || "Unknown"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(entry.modified_at)}
            </div>
          </div>

          {entry.change_description && (
            <div className="flex items-start gap-1 text-sm">
              <FileText className="h-3 w-3 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {entry.change_description}
              </span>
            </div>
          )}

          {/* Show key changes */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View details
            </summary>
            <div className="mt-2 p-3 rounded bg-muted/50 overflow-auto max-h-40">
              <pre className="text-xs">
                {JSON.stringify(entry.destination_data, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Archive History</DialogTitle>
          <DialogDescription>
            {destination
              ? `View modification history for ${destination.name}`
              : "View all destination modifications"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "specific" | "all")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            {destination && (
              <TabsTrigger value="specific">This Destination</TabsTrigger>
            )}
            <TabsTrigger value="all">All Changes</TabsTrigger>
          </TabsList>

          <TabsContent
            value="specific"
            className="flex-1 overflow-y-auto mt-4 space-y-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : historyData && historyData.length > 0 ? (
              historyData.map(renderHistoryEntry)
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No history found
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="all"
            className="flex-1 overflow-y-auto mt-4 space-y-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : historyData && historyData.length > 0 ? (
              <>
                {historyData.map(renderHistoryEntry)}
                {allHistoryData && allHistoryData.total > historyData.length && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Showing {historyData.length} of {allHistoryData.total} entries
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No history found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
