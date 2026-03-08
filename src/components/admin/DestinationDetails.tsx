"use client";

import { Destination } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Tag,
  Image as ImageIcon,
  Edit,
  Clock,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Globe,
  Instagram,
  Facebook,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DestinationDetailsProps {
  open: boolean;
  onClose: () => void;
  destination: Destination | null;
  onEdit?: (destination: Destination) => void;
  onReactivate?: (destination: Destination) => void;
  isReactivating?: boolean;
}

export function DestinationDetails({
  open,
  onClose,
  destination,
  onEdit,
  onReactivate,
  isReactivating = false,
}: DestinationDetailsProps) {
  const t = useTranslations("destinations");
  const tc = useTranslations("common");

  if (!destination) return null;

  const isInactive = destination.status === "inactive";
  const hasGallery = destination.images && destination.images.length > 0;
  const hasSocial = (destination as any).instagram_url || (destination as any).facebook_url || (destination as any).website_url;
  const hasOpeningHours = destination.opening_hours && Object.values(destination.opening_hours).some((v) => v && v.trim());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <div className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg flex items-center gap-2">
                  <span className="truncate">{destination.name}</span>
                  {isInactive && (
                    <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">
                      {t("inactive")}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {t("destinationInfo")}
                </DialogDescription>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {isInactive && onReactivate ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReactivate(destination)}
                    className="gap-1.5 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                    disabled={isReactivating}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t("reactivate")}
                  </Button>
                ) : (
                  onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(destination)}
                      className="gap-1.5"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      {tc("edit")}
                    </Button>
                  )
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0">
          <div className="px-6 pt-3 shrink-0">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">{t("tabs.general")}</TabsTrigger>
              <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
              <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">

            {/* TAB: Overview */}
            <TabsContent value="overview" className="mt-0 space-y-5">
              {/* Image */}
              {destination.image && (
                <div className={`relative aspect-[21/9] rounded-xl overflow-hidden border ${isInactive ? 'grayscale opacity-50' : ''}`}>
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Gallery thumbnails */}
              {hasGallery && (
                <div className="grid grid-cols-5 gap-2">
                  {destination.images!.slice(0, 5).map((img) => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden border">
                      <img src={img.url} alt={img.alt_text || ""} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {destination.description && (
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("description")}</h3>
                  <p className="text-sm leading-relaxed">{destination.description}</p>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border bg-muted/30 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("location")}
                  </div>
                  <p className="text-sm font-medium truncate">{destination.location || "N/A"}</p>
                </div>
                <div className="p-3 rounded-xl border bg-muted/30 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {t("price")}
                  </div>
                  <p className="text-sm font-semibold text-green-600">${destination.price?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="p-3 rounded-xl border bg-muted/30 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Star className="h-3.5 w-3.5" />
                    {t("rating")}
                  </div>
                  <p className="text-sm font-semibold flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    {destination.ratings?.toFixed(1) || "0.0"}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {hasSocial && (
                <div className="flex flex-wrap gap-2">
                  {(destination as any).instagram_url && (
                    <a href={(destination as any).instagram_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                      <Instagram className="h-3.5 w-3.5" /> Instagram
                    </a>
                  )}
                  {(destination as any).facebook_url && (
                    <a href={(destination as any).facebook_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Facebook className="h-3.5 w-3.5" /> Facebook
                    </a>
                  )}
                  {(destination as any).website_url && (
                    <a href={(destination as any).website_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                </div>
              )}
            </TabsContent>

            {/* TAB: Details */}
            <TabsContent value="details" className="mt-0 space-y-5">
              {/* Opening Hours */}
              {hasOpeningHours && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t("openingHours")}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(destination.opening_hours!).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-muted/30">
                        <span className="text-xs font-medium capitalize">{day}</span>
                        <span className="text-xs text-muted-foreground">{hours || t("closed")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    {t("highlights")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {destination.highlights.map((highlight, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <CheckCircle2 className="h-3 w-3 text-blue-500" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal For */}
              {destination.ideal_for && destination.ideal_for.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    {t("idealFor")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {destination.ideal_for.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Choose */}
              {destination.why_choose && destination.why_choose.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t("whyChoose")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {destination.why_choose.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!hasOpeningHours && (!destination.highlights || destination.highlights.length === 0) &&
                (!destination.ideal_for || destination.ideal_for.length === 0) &&
                (!destination.why_choose || destination.why_choose.length === 0) && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No details added yet.
                </div>
              )}
            </TabsContent>

            {/* TAB: Settings */}
            <TabsContent value="settings" className="mt-0 space-y-5">
              {/* Categories */}
              {destination.categories && destination.categories.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    {t("categories")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {destination.categories.map((cat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-1">
                        {cat.parent.name}
                        {cat.subcategory && (
                          <span className="ml-1 text-muted-foreground">/ {cat.subcategory.name}</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {t("metadata")}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{t("id")}:</span>
                    <span className="font-mono truncate ml-2">{destination.id}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{t("status")}:</span>
                    <span className={isInactive ? "text-red-600" : "text-green-600"}>
                      {isInactive ? t("inactive") : t("active")}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{t("createdAt")}:</span>
                    <span>{new Date(destination.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{t("updatedAt")}:</span>
                    <span>{new Date(destination.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex justify-end bg-white">
          <Button variant="outline" onClick={onClose}>
            {tc("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
