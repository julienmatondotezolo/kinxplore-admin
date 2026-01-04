# Reactivate Feature - Quick Reference

## 🎯 What Was Implemented

A complete soft-delete system with reactivation capability for destinations.

## 🔧 Backend Changes

### New Route
```
PUT /api/admin/destinations/:id/reactivate?modified_by=admin
```

### Files Modified
- `src/destination/admin.controller.ts` - Added reactivate endpoint
- `src/destination/admin.service.ts` - Added `reactivateDestination()` method

## 💻 Frontend Changes

### Files Modified
1. `src/lib/api.ts` - Added `reactivateDestination()` function
2. `src/hooks/useDestinations.ts` - Added `useReactivateDestination()` hook
3. `src/app/[locale]/(pages)/page.tsx` - Integrated reactivate functionality
4. `src/components/admin/DestinationsTable.tsx` - Added reactivate button UI

## 🎨 UI/UX Features

### Inactive Destination Visual Indicators
- ⚫ 50% opacity on entire row
- 🎨 Grayscale filter on images
- ~~Text~~ Line-through on destination name
- 🏷️ "Inactive" badge next to name

### Button Layout

**Active Destination:**
```
[History] [Edit] [Deactivate]
```

**Inactive Destination:**
```
[🔄 Reactivate] [History]
```

### Reactivate Button Styling
- ✅ Green color scheme (positive action)
- ✅ Outline variant (stands out)
- ✅ RotateCcw icon (restoration metaphor)
- ✅ "Reactivate" text label (clear intent)
- ✅ Disabled during loading

## 📊 How It Works

### Deactivation (Soft Delete)
1. User clicks "Deactivate" button
2. Confirmation dialog appears
3. Status changes from `'active'` → `'inactive'`
4. Destination hidden from public API
5. Row appears greyed out in admin panel
6. Action archived with description

### Reactivation
1. User clicks green "Reactivate" button
2. Status changes from `'inactive'` → `'active'`
3. Destination visible in public API again
4. Row returns to normal appearance
5. Action archived with description

## 🔍 Testing

### Test Deactivation
1. Go to admin panel
2. Find an active destination
3. Click trash icon → Confirm
4. ✅ Row should grey out
5. ✅ "Inactive" badge should appear
6. ✅ Reactivate button should show

### Test Reactivation
1. Find an inactive destination (greyed out)
2. Click green "Reactivate" button
3. ✅ Success toast should appear
4. ✅ Row should return to normal
5. ✅ Edit/Delete buttons should return

### Test Public API
1. Deactivate a destination in admin
2. Check public API: `GET /api/destinations`
3. ✅ Deactivated destination should NOT appear
4. Reactivate the destination
5. Check public API again
6. ✅ Reactivated destination SHOULD appear

## 📝 Archive Tracking

Every status change creates an archive entry:

**Deactivation:**
```
Operation: DELETE
Description: "Destination marked as inactive (soft delete)"
```

**Reactivation:**
```
Operation: UPDATE
Description: "Destination reactivated (status changed from inactive to active)"
```

## 🚀 Benefits

### For Admins
- ✅ Undo accidental deletions
- ✅ No data loss
- ✅ Complete audit trail
- ✅ One-click restoration

### For System
- ✅ Data integrity maintained
- ✅ All relationships preserved
- ✅ Consistent state management

### For Users
- ✅ Only see active destinations
- ✅ No broken references
- ✅ Seamless experience

## 🎯 Key Metrics

### Stats Dashboard
- Shows count of **active** destinations
- Shows count of inactive destinations below
- Calculates averages from active only

## 🔐 Security

- ✅ RLS policies remain active
- ✅ Admin-only endpoints
- ✅ Validation prevents invalid operations
- ✅ Archive tracks all changes

## 📚 Documentation Created

1. `SOFT_DELETE_IMPLEMENTATION.md` - Initial soft delete feature
2. `REACTIVATE_FEATURE.md` - Reactivation feature details
3. `STATUS_FLOW_DIAGRAM.md` - Visual flow diagrams
4. `REACTIVATE_QUICK_REFERENCE.md` - This file

## 🎨 Color Reference

```css
/* Active State */
opacity: 100%
filter: none
text-decoration: none

/* Inactive State */
opacity: 50%
filter: grayscale(100%)
text-decoration: line-through
background: bg-muted/20

/* Reactivate Button */
border-color: green-600
text-color: green-600
hover-bg: green-50 (light) / green-950 (dark)
```

## 🔄 API Endpoints Summary

| Endpoint | Method | Purpose | Status Change |
|----------|--------|---------|---------------|
| `/api/destinations` | GET | Public list | Returns active only |
| `/api/admin/destinations` | GET | Admin list | Returns all |
| `/api/admin/destinations` | POST | Create | Sets to active |
| `/api/admin/destinations/:id` | PUT | Update | No change |
| `/api/admin/destinations/:id` | DELETE | Deactivate | active → inactive |
| `/api/admin/destinations/:id/reactivate` | PUT | Reactivate | inactive → active |

## 💡 Tips

1. **Always check the status** before performing operations
2. **Use the archive** to track who made changes and when
3. **Test both flows** (deactivate → reactivate) regularly
4. **Monitor inactive count** to identify patterns

## 🐛 Troubleshooting

### Button not appearing?
- Check if destination status is 'inactive'
- Verify `onReactivate` prop is passed to table

### Reactivation not working?
- Check backend logs for errors
- Verify destination exists and is inactive
- Check RLS policies are correct

### UI not updating?
- Check React Query cache invalidation
- Verify mutation success callback fires
- Check browser console for errors
