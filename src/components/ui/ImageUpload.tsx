"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | string | null) => void;
  onUrlUpload?: (url: string) => Promise<void>;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const t = useTranslations('imageUpload');
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    if (value && uploadMode === "file") {
      setPreviewUrl(value);
    }
  }, [value, uploadMode]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPEG or PNG image only.");
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert("File size must be less than 50MB.");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onChange(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    // Pass URL string to parent for validation
    onChange(url || null);
  };

  const handleModeChange = (mode: "file" | "url") => {
    setUploadMode(mode);
    // Clear states when switching modes
    if (mode === "file") {
      setUrlInput("");
      onChange(null);
    } else {
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onChange(null);
    }
  };

  const handleClearFile = () => {
    setPreviewUrl("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{t('image')}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("file")}
            disabled={disabled}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            {t('uploadFile')}
          </Button>
          <Button
            type="button"
            variant={uploadMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("url")}
            disabled={disabled}
            className="text-xs"
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            {t('fromURL')}
          </Button>
        </div>
      </div>

      {/* File Upload Mode */}
      {uploadMode === "file" && (
        <>
          {/* Preview for File Upload */}
          {previewUrl && (
            <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleClearFile}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* File Upload Area */}
          {!previewUrl && (
            <div
              className={`
                relative rounded-lg border-2 border-dashed transition-colors
                ${isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-pink-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {t('chooseFileOrDrag')}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {t('imageFormats')}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6 border-gray-300 hover:bg-gray-100"
                  disabled={disabled}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {t('browseFile')}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* URL Upload Mode - NO PREVIEW */}
      {uploadMode === "url" && (
        <div className="space-y-3">
          <Input
            type="url"
            placeholder={t('imageUrlPlaceholder')}
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={disabled}
            required
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        {t('imageUploadHint')}
      </p>
    </div>
  );
}
