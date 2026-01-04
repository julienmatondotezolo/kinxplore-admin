# Reactivate Feature Implementation

## Overview
Added a reactivate feature that allows admins to restore inactive (soft-deleted) destinations back to active status with a single click.

## UI/UX Design Principles Applied

### 1. **Visual Hierarchy**
- Inactive destinations are clearly distinguished with:
  - 50% opacity on the entire row
  - Grayscale filter on images
  - Line-through text on destination names
  - "Inactive" badge for clear status indication

### 2. **Contextual Actions**
- **Active destinations** show: History, Edit, Deactivate buttons
- **Inactive destinations** show: Reactivate (prominent), History buttons
- Actions are contextual to the destination's current state

### 3. **Visual Affordance**
- Reactivate button uses:
  - Green color scheme (positive action)
  - RotateCcw icon (suggests restoration/undo)
  - "Reactivate" text label (clear intent)
  - Outline variant (stands out against greyed background)

### 4. **Feedback & State Management**
- Loading state during reactivation (button disabled)
- Success toast notification on completion
- Error toast if operation fails
- Automatic UI refresh after successful reactivation

### 5. **Accessibility**
- Clear button labels and tooltips
- Proper disabled states
- Color contrast maintained even in inactive state
- Icon + text for better comprehension

## Backend Implementation

### New Endpoint
```
PUT /api/admin/destinations/:id/reactivate
```

**Query Parameters:**
- `modified_by` (optional): String identifying who performed the action

**Response:**
- Returns the reactivated destination with full details
- Status code: 200 OK

**Error Cases:**
- 404: Destination not found
- 400: Destination is already active
- 400: Failed to reactivate (database error)

### Service Method: `reactivateDestination()`
1. Validates destination exists
2. Checks if already active (prevents redundant operations)
3. Updates status from 'inactive' to 'active'
4. Updates `updated_at` timestamp
5. Archives the reactivation action
6. Returns full destination with categories

### Archive Entry
Reactivation creates an archive entry with:
- `operation_type`: 'UPDATE'
- `change_description`: "Destination reactivated (status changed from inactive to active)"
- Complete destination and category data snapshot
- Modified by user tracking

## Frontend Implementation

### 1. API Client (`lib/api.ts`)
```typescript
export const reactivateDestination = async (
  id: string,
  modifiedBy?: string,
): Promise<Destination> => {
  const { data } = await api.put(`/admin/destinations/${id}/reactivate`, {}, {
    params: { modified_by: modifiedBy },
  });
  return data;
};
```

### 2. React Hook (`hooks/useDestinations.ts`)
```typescript
export const useReactivateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, modifiedBy }) => reactivateDestination(id, modifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      toast.success('Destination reactivated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to reactivate destination');
    },
  });
};
```

### 3. Component Updates

#### DestinationsTable Component
- Added `onReactivate` prop for callback
- Added `isReactivating` prop for loading state
- Conditional rendering based on `destination.status`
- Reactivate button with green styling and icon

#### Main Page Component
- Integrated `useReactivateDestination` hook
- Added `handleReactivate` function
- Passes reactivate handler and loading state to table

## User Flow

### Deactivating a Destination
1. Admin clicks "Deactivate" (trash icon) on active destination
2. Confirmation dialog appears
3. Admin confirms deactivation
4. Destination status changes to 'inactive'
5. Row becomes greyed out
6. Action buttons change to show "Reactivate"

### Reactivating a Destination
1. Admin sees greyed-out inactive destination
2. Green "Reactivate" button is prominently displayed
3. Admin clicks "Reactivate"
4. Button shows loading state
5. Success toast appears
6. Destination returns to normal appearance
7. Action buttons revert to Edit/Deactivate

## Benefits

### For Admins
- ✅ Quick recovery from accidental deactivations
- ✅ No need to recreate destinations
- ✅ Maintains all relationships and history
- ✅ Clear visual feedback of current state
- ✅ One-click restoration

### For System
- ✅ Complete audit trail of all state changes
- ✅ Data integrity maintained
- ✅ No orphaned records
- ✅ Consistent state management

### For Users
- ✅ Seamless experience (don't see inactive destinations)
- ✅ No broken links or references
- ✅ Consistent data availability

## Technical Details

### State Management
- React Query handles caching and invalidation
- Optimistic updates not used (ensures data consistency)
- Automatic refetch after mutation success

### Error Handling
- Backend validation prevents invalid operations
- Frontend displays user-friendly error messages
- Network errors caught and displayed

### Performance
- Single API call for reactivation
- Efficient query invalidation
- Minimal re-renders with React Query

## Future Enhancements

1. **Bulk Operations**
   - Select multiple inactive destinations
   - Reactivate all at once

2. **Confirmation Dialog**
   - Optional confirmation for reactivation
   - Show preview of what will be restored

3. **Scheduled Reactivation**
   - Set future date/time for automatic reactivation
   - Useful for seasonal destinations

4. **Reactivation History**
   - View how many times a destination was reactivated
   - Track patterns of deactivation/reactivation

5. **Filters**
   - Toggle to show/hide inactive destinations
   - Separate view for inactive items only

## Testing Checklist

- [x] Backend route created and functional
- [x] Frontend API client updated
- [x] React hook created with proper error handling
- [x] UI button added with proper styling
- [x] Loading states working correctly
- [x] Toast notifications appearing
- [x] Archive entries created correctly
- [x] No linter errors
- [x] Proper TypeScript types throughout
