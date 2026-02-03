# Image Upload Quick Start Guide

## For Administrators

### Uploading a Destination Image

#### Method 1: File Upload (Drag & Drop)

1. Open the **Edit Destination** modal
2. Locate the **Image** section
3. Click **Upload File** button (should be selected by default)
4. Either:
   - Click **"Browse File"** to select an image from your computer
   - Drag and drop an image directly onto the upload area
5. See instant preview of your image
6. Click **"Update"** or **"Create"** to save

#### Method 2: Upload from URL

1. Open the **Edit Destination** modal
2. Locate the **Image** section
3. Click **From URL** button
4. Paste the image URL in the input field (e.g., `https://example.com/image.jpg`)
5. Click **Upload** button
6. Wait for the image to be uploaded and see the preview
7. Click **"Update"** or **"Create"** to save

### Supported Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **Maximum Size**: 50MB

### Tips

✅ **Do:**
- Use high-quality images for better user experience
- Ensure images are properly sized (recommended: at least 1200x800px)
- Use descriptive filenames before uploading

❌ **Don't:**
- Upload GIF, WebP, or other formats (not supported yet)
- Upload files larger than 50MB
- Use images with sensitive or copyrighted content

### Troubleshooting

**Image won't upload:**
- Check file size (must be under 50MB)
- Ensure format is JPEG or PNG
- Check your internet connection

**URL upload fails:**
- Verify the URL is accessible
- Ensure URL points directly to an image file
- Check if the image is JPEG or PNG format

**Image doesn't show after saving:**
- Refresh the page
- Check if the image URL is valid
- Contact technical support if issue persists

## For Developers

### Quick Integration

```typescript
import { ImageUpload } from "@/components/ui/ImageUpload";
import { api } from "@/lib/api";

function MyForm() {
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  
  const handleImageChange = (file: File | string | null) => {
    setImageFile(file);
  };
  
  const handleUrlUpload = async (url: string) => {
    const { data } = await api.post('/admin/destinations/upload-image-url', { url });
    return data.url;
  };
  
  const handleSubmit = async () => {
    let imageUrl = '';
    
    // If file is selected, upload it
    if (imageFile instanceof File) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const { data } = await api.post('/admin/destinations/upload-image', formData);
      imageUrl = data.url;
    }
    
    // Use imageUrl in your form submission
  };
  
  return (
    <ImageUpload
      value={imageUrl}
      onChange={handleImageChange}
      onUrlUpload={handleUrlUpload}
    />
  );
}
```

### API Endpoints

#### Upload File
```bash
POST /api/admin/destinations/upload-image
Content-Type: multipart/form-data

# Form field: file (image/jpeg or image/png)

Response:
{
  "url": "https://[project].supabase.co/storage/v1/object/public/destination-images/destinations/[uuid].jpg"
}
```

#### Upload from URL
```bash
POST /api/admin/destinations/upload-image-url
Content-Type: application/json

{
  "url": "https://example.com/image.jpg"
}

Response:
{
  "url": "https://[project].supabase.co/storage/v1/object/public/destination-images/destinations/[uuid].jpg"
}
```

### Testing Commands

```bash
# Test file upload
curl -X POST http://localhost:5001/api/admin/destinations/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"

# Test URL upload
curl -X POST http://localhost:5001/api/admin/destinations/upload-image-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}'
```

### Component Props

```typescript
interface ImageUploadProps {
  value?: string;                                    // Current image URL
  onChange: (file: File | string | null) => void;   // File/URL change callback
  onUrlUpload?: (url: string) => Promise<void>;     // Async URL upload handler
  disabled?: boolean;                               // Disable interactions
}
```

### Storage Location

- **Bucket**: `destination-images`
- **Path**: `destinations/[uuid].[ext]`
- **Access**: Public read, authenticated write
- **URL Format**: `https://[project-id].supabase.co/storage/v1/object/public/destination-images/destinations/[uuid].jpg`

---

**Need Help?** See [IMAGE_UPLOAD_SYSTEM.md](../kinxplore-backend/IMAGE_UPLOAD_SYSTEM.md) for detailed documentation.
