# Category Management System

## 🎯 Overview

A complete category management system for the Kinxplore Admin panel with modern UI/UX inspired by the Vento dashboard. The system allows administrators to create, update, soft delete, and reactivate both parent categories and subcategories.

## ✨ Features

### 🎨 Modern UI/UX
- **Vento-inspired design** with glassmorphism effects
- **Dual-tab interface** for parent categories and subcategories
- **Real-time statistics** cards showing active/inactive counts
- **Visual status indicators** with badges and color coding
- **Responsive design** that works on all screen sizes
- **Search functionality** across all categories
- **Smooth animations** and transitions

### 🔧 Functionality
- ✅ Create parent categories
- ✅ Create subcategories (linked to parent)
- ✅ Update category names
- ✅ Soft delete (deactivate) categories
- ✅ Reactivate inactive categories
- ✅ Automatic cascade deactivation (parent → subcategories)
- ✅ Validation to prevent orphaned subcategories
- ✅ Real-time updates with React Query
- ✅ Toast notifications for all actions

## 🏗️ Architecture

### Backend Structure

```
kinxplore-backend/src/category/
├── category.controller.ts          # Public API endpoints
├── category.service.ts             # Public service (active only)
├── admin-category.controller.ts    # Admin API endpoints
├── admin-category.service.ts       # Admin service (all categories)
├── category.module.ts              # Module configuration
└── dto/
    ├── create-category.dto.ts      # DTOs for creation
    └── update-category.dto.ts      # DTOs for updates
```

### Frontend Structure

```
kinxplore-admin/src/
├── app/[locale]/(pages)/
│   ├── page.tsx                    # Main destinations page (updated)
│   └── categories/
│       └── page.tsx                # Category management page
├── components/admin/
│   ├── CategoryForm.tsx            # Form for create/edit
│   └── CategoriesTable.tsx         # Table with tabs
├── hooks/
│   └── useCategoryManagement.ts    # React Query hooks
└── lib/
    └── api.ts                      # API client functions
```

## 📊 Database Schema

### Parent Categories Table
```sql
CREATE TABLE parent_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parent_categories_status ON parent_categories(status);
```

### Subcategories Table
```sql
CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  parent_category_id UUID REFERENCES parent_categories(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subcategories_status ON subcategories(status);
```

## 🔌 API Endpoints

### Public Endpoints (Active Only)
```
GET  /api/categories              # Get all active parent categories with subcategories
GET  /api/categories/:id          # Get specific active parent category
```

### Admin Endpoints (All Categories)

#### Parent Categories
```
GET    /api/admin/categories/parents              # Get all parent categories
POST   /api/admin/categories/parents              # Create parent category
PUT    /api/admin/categories/parents/:id          # Update parent category
DELETE /api/admin/categories/parents/:id          # Deactivate parent (+ all subs)
PUT    /api/admin/categories/parents/:id/reactivate  # Reactivate parent
```

#### Subcategories
```
GET    /api/admin/categories/subcategories        # Get all subcategories
POST   /api/admin/categories/subcategories        # Create subcategory
PUT    /api/admin/categories/subcategories/:id    # Update subcategory
DELETE /api/admin/categories/subcategories/:id    # Deactivate subcategory
PUT    /api/admin/categories/subcategories/:id/reactivate  # Reactivate subcategory
```

## 🎨 UI Components

### 1. Category Management Page (`/categories`)

**Header Section:**
- Logo and title
- Theme toggle
- Language switcher
- Back to destinations link

**Stats Cards:**
- Total Categories (active parents + active subs)
- Active Parent Categories
- Active Subcategories

**Main Content:**
- Search bar
- Create button (context-aware based on active tab)
- Tabbed interface (Parents / Subcategories)
- Data tables with actions

### 2. CategoryForm Component

**Features:**
- Dual-tab form (Parent / Subcategory)
- Parent tab: Simple name input
- Subcategory tab: Parent selector + name input
- Auto-switches to correct tab based on edit mode
- Validation and loading states
- Clear helper text

**Props:**
```typescript
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
```

### 3. CategoriesTable Component

**Features:**
- Tabbed interface (Parents / Subcategories)
- Search across all fields
- Real-time stats cards
- Status badges
- Contextual actions based on status
- Greyed out inactive items
- Reactivate button for inactive items

**Visual States:**

**Active Category:**
- Full color
- Normal opacity
- Actions: Edit, Delete

**Inactive Category:**
- Greyed out (50% opacity)
- Line-through text
- "Inactive" badge
- Actions: Reactivate only

## 🔄 User Flows

### Creating a Parent Category
1. Navigate to `/categories`
2. Ensure "Parent Categories" tab is active
3. Click "Create Parent" button
4. Enter category name
5. Click "Create Parent Category"
6. Success toast appears
7. Table updates automatically

### Creating a Subcategory
1. Navigate to `/categories`
2. Switch to "Subcategories" tab
3. Click "Create Subcategory" button
4. Select parent category from dropdown
5. Enter subcategory name
6. Click "Create Subcategory"
7. Success toast appears
8. Table updates automatically

### Deactivating a Parent Category
1. Find active parent category
2. Click trash icon
3. Confirmation dialog appears
4. Warning: "All subcategories will also be deactivated"
5. Click "Deactivate"
6. Parent and all its subcategories become inactive
7. Success toast appears

### Reactivating a Category
1. Find inactive category (greyed out)
2. Click green "Reactivate" button
3. Category becomes active immediately
4. Success toast appears
5. Visual state returns to normal

## 🎯 Business Logic

### Cascade Deactivation
When a parent category is deactivated:
1. Parent status → 'inactive'
2. All subcategories under that parent → 'inactive'
3. Both changes happen atomically

### Reactivation Rules
**Parent Category:**
- Can be reactivated at any time
- Subcategories remain inactive (manual reactivation needed)

**Subcategory:**
- Can only be reactivated if parent is active
- Error if parent is inactive: "Cannot reactivate subcategory: parent category is inactive"

### Validation Rules
**Creating Subcategory:**
- Parent must exist
- Parent must be active
- Name is required

**Updating Subcategory:**
- If changing parent, new parent must exist and be active

## 🎨 Design System

### Color Scheme
```css
/* Parent Categories */
Primary: Blue (#3B82F6)
Icon: FolderTree
Background: bg-blue-100 dark:bg-blue-900/30

/* Subcategories */
Primary: Purple (#9333EA)
Icon: Tag
Background: bg-purple-100 dark:bg-purple-900/30

/* Inactive */
Text: text-muted-foreground
Background: bg-gray-100 dark:bg-gray-900/30
Opacity: 50%

/* Reactivate Button */
Border: border-green-600
Text: text-green-600
Hover: hover:bg-green-50 dark:hover:bg-green-950
```

### Icons
- **Parent Category:** `FolderTree` (Lucide)
- **Subcategory:** `Tag` (Lucide)
- **Total Categories:** `Layers` (Lucide)
- **Reactivate:** `RotateCcw` (Lucide)
- **Edit:** `Edit` (Lucide)
- **Delete:** `Trash2` (Lucide)
- **Search:** `Search` (Lucide)
- **Create:** `Plus` (Lucide)

### Typography
- **Page Title:** text-xl font-bold
- **Stat Numbers:** text-2xl / text-3xl font-bold
- **Table Headers:** text-sm font-semibold
- **Category Names:** font-medium
- **Helper Text:** text-xs text-muted-foreground

## 📱 Responsive Design

### Desktop (≥768px)
- Stats: 4 columns
- Full table with all columns
- Side-by-side form fields

### Tablet (640px-767px)
- Stats: 2 columns
- Scrollable table
- Stacked form fields

### Mobile (<640px)
- Stats: 1 column
- Scrollable table
- Stacked form fields
- Compact buttons

## 🔔 Notifications

### Success Messages
- "Parent category created successfully"
- "Parent category updated successfully"
- "Parent category deactivated successfully"
- "Parent category reactivated successfully"
- "Subcategory created successfully"
- "Subcategory updated successfully"
- "Subcategory deactivated successfully"
- "Subcategory reactivated successfully"

### Error Messages
- "Failed to create parent category"
- "Failed to update parent category"
- "Parent category not found or is inactive"
- "Cannot reactivate subcategory: parent category is inactive"
- "Failed to load categories"

## 🚀 Performance Optimizations

### React Query Caching
- Categories cached with key: `['admin-parent-categories']`
- Subcategories cached with key: `['admin-subcategories']`
- Automatic invalidation on mutations
- Stale time: default (0ms)

### Database Indexes
- `idx_parent_categories_status` for filtering
- `idx_subcategories_status` for filtering
- Improves query performance significantly

### Optimistic Updates
- Not implemented (data consistency prioritized)
- Automatic refetch after mutations

## 🧪 Testing Checklist

### Backend Tests
- [ ] Create parent category
- [ ] Update parent category
- [ ] Deactivate parent category
- [ ] Reactivate parent category
- [ ] Create subcategory
- [ ] Update subcategory
- [ ] Deactivate subcategory
- [ ] Reactivate subcategory
- [ ] Cascade deactivation works
- [ ] Cannot reactivate sub with inactive parent
- [ ] Public API only returns active categories

### Frontend Tests
- [ ] Navigate to categories page
- [ ] View parent categories tab
- [ ] View subcategories tab
- [ ] Search categories
- [ ] Create parent category
- [ ] Edit parent category
- [ ] Deactivate parent category
- [ ] Reactivate parent category
- [ ] Create subcategory
- [ ] Edit subcategory
- [ ] Deactivate subcategory
- [ ] Reactivate subcategory
- [ ] Stats update correctly
- [ ] Toast notifications appear
- [ ] Loading states work
- [ ] Error states work
- [ ] Responsive design works

## 📚 Related Documentation

- `SOFT_DELETE_IMPLEMENTATION.md` - Soft delete pattern for destinations
- `REACTIVATE_FEATURE.md` - Reactivation feature details
- `STATUS_FLOW_DIAGRAM.md` - Visual flow diagrams

## 🎓 Best Practices Applied

### UI/UX
✅ Visual hierarchy with clear information architecture
✅ Consistent color coding for different entity types
✅ Contextual actions based on item state
✅ Clear feedback for all user actions
✅ Confirmation dialogs for destructive actions
✅ Loading states for async operations
✅ Empty states with helpful messages
✅ Responsive design for all screen sizes

### Code Quality
✅ TypeScript for type safety
✅ Component composition
✅ Custom hooks for business logic
✅ Separation of concerns
✅ Error handling at all levels
✅ Consistent naming conventions
✅ Comprehensive documentation

### Performance
✅ React Query for efficient data fetching
✅ Database indexes for fast queries
✅ Lazy loading of components
✅ Optimized re-renders
✅ Efficient state management

## 🔮 Future Enhancements

1. **Drag & Drop Reordering**
   - Reorder categories by dragging
   - Save custom sort order

2. **Bulk Operations**
   - Select multiple categories
   - Bulk activate/deactivate

3. **Category Icons**
   - Custom icons for each category
   - Icon picker in form

4. **Category Descriptions**
   - Add description field
   - Show in tooltips

5. **Usage Statistics**
   - Show destination count per category
   - Most/least used categories

6. **Import/Export**
   - Export categories to JSON/CSV
   - Import from file

7. **Category Hierarchy Visualization**
   - Tree view of categories
   - Visual parent-child relationships

8. **Search Filters**
   - Filter by status
   - Filter by parent
   - Date range filters

## 🎉 Summary

The Category Management System is a complete, production-ready feature that follows modern UI/UX best practices and provides a seamless experience for managing destination categories. The system is fully integrated with the existing admin panel and maintains consistency with the overall design language.
