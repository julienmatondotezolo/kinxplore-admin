# Soft Delete Implementation Summary

## Overview
Implemented a soft delete feature for destinations using an `active`/`inactive` status system instead of permanently deleting records from the database.

## Database Changes

### Migration: `add_status_column_to_destinations`
- Added `status` column to `destinations` table
  - Type: `VARCHAR(20)`
  - Values: `'active'` or `'inactive'`
  - Default: `'active'`
  - Constraint: CHECK constraint ensures only valid values
- Added index `idx_destinations_status` for query performance
- All existing destinations set to `'active'` status

## Backend Changes

### 1. Admin Service (`admin.service.ts`)
- **`createDestination()`**: Explicitly sets `status: 'active'` when creating new destinations
- **`deleteDestination()`**: Changed from hard delete to soft delete
  - Now updates `status` to `'inactive'` instead of deleting the row
  - Archives the action as "Destination marked as inactive (soft delete)"
  - Categories remain intact (no longer deleted)
- **`getAllDestinations()`**: New method for admin panel
  - Returns ALL destinations including inactive ones
  - Used by admin panel to show full list with visual indicators

### 2. Destination Service (`destination.service.ts`)
- **`findAll()`**: Now filters to only return active destinations (`.eq('status', 'active')`)
- **`findOne()`**: Only returns destination if status is active
- Public API endpoints now only show active destinations to users

### 3. Admin Controller (`admin.controller.ts`)
- Added `GET /admin/destinations` endpoint
- Returns all destinations (active + inactive) for admin management

## Frontend Changes

### 1. API Types (`lib/api.ts`)
- Updated `Destination` interface to include `status: 'active' | 'inactive'`
- Changed `getDestinations()` to use `/admin/destinations` endpoint
  - Admin panel now sees all destinations regardless of status

### 2. Destinations Table (`DestinationsTable.tsx`)
- **Visual Indicators for Inactive Destinations:**
  - Row: 50% opacity + muted background
  - Image: Grayscale filter applied
  - Name: Line-through text decoration + muted color
  - Badge: "Inactive" badge displayed next to name
- **Button States:**
  - All action buttons (Edit, History, Delete) disabled for inactive destinations
  - Delete button shows "Already Inactive" tooltip when disabled
  - Active destinations show "Deactivate" tooltip

### 3. Main Page (`page.tsx`)
- **Dialog Changes:**
  - Title: "Delete Destination" → "Deactivate Destination"
  - Description: Explains it's a soft delete that can be restored
  - Button: "Delete" → "Deactivate"
- **Stats Updates:**
  - "Total Destinations" → "Active Destinations"
  - Shows count of inactive destinations below active count
  - Stats (avg price, avg rating) calculated only from active destinations

## Benefits

1. **Data Preservation**: No data loss - all destinations remain in database
2. **Audit Trail**: Complete history maintained in archive table
3. **Reversibility**: Destinations can be reactivated if needed (future feature)
4. **User Experience**: Public users only see active destinations
5. **Admin Visibility**: Admins can see full list with clear visual indicators

## API Behavior

### Public Endpoints
- `GET /api/destinations` - Returns only active destinations
- `GET /api/destinations/:id` - Returns destination only if active

### Admin Endpoints
- `GET /api/admin/destinations` - Returns all destinations (active + inactive)
- `DELETE /api/admin/destinations/:id` - Soft deletes (sets status to inactive)
- `POST /api/admin/destinations` - Creates with status 'active'
- `PUT /api/admin/destinations/:id` - Updates destination (status unchanged unless explicitly set)

## RLS Policies
All RLS policies remain functional:
- `Allow public insert access to destinations`
- `Allow public update access to destinations`
- `Allow public delete access to destinations` (now performs soft delete)
- `Allow public read access to destinations`

## Future Enhancements
- Add "Restore" button to reactivate inactive destinations
- Add filter toggle to show/hide inactive destinations in admin panel
- Add bulk operations (activate/deactivate multiple destinations)
- Add automatic cleanup of old inactive destinations (e.g., after 90 days)
