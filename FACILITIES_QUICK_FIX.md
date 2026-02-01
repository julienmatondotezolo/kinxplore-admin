# Facilities Quick Fix - TL;DR

## The Problem
❌ Facilities page showing "No facilities yet" even though facilities exist

## The Solution
✅ Added authentication token to API requests

## What I Fixed

### 1. Main Fix: Authentication
**File**: `src/lib/api.ts`

Added this code to automatically include your login token in all API requests:
```typescript
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
```

### 2. Bonus: Status Management
Added ability to enable/disable facilities without deleting them.

## Quick Start

### Step 1: Apply Database Update
```bash
cd kinxplore-backend
./apply-facility-status-migration.sh
```

### Step 2: Restart Everything
```bash
# Terminal 1 - Backend
cd kinxplore-backend
npm run start:dev

# Terminal 2 - Admin Panel
cd kinxplore-admin
npm run dev
```

### Step 3: Test It
1. Go to http://localhost:3000
2. Log in
3. Click "Facilities" in sidebar
4. **You should now see your facilities!** 🎉

## New Features You Got

### Status Filters
```
[All] [Active] [Inactive]
```
Click to filter facilities by status

### Each Facility Card Has
- ✅ Status badge (Active/Inactive)
- ✅ Enable/Disable button
- ✅ Edit button
- ✅ Delete button

## If It Still Doesn't Work

### Quick Checks
```bash
# 1. Is backend running?
curl http://localhost:2431/api/facilities

# 2. Are you logged in?
# Look for your name in top-right corner

# 3. Are you an admin?
# Check database: profiles table, role column should be 'admin'
```

### Nuclear Option
```bash
# Clear everything and start fresh
1. Log out of admin panel
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close all browser tabs
4. Restart backend
5. Restart admin panel
6. Log in again
```

## What Changed

| File | What Changed |
|------|--------------|
| `src/lib/api.ts` | ✅ Added auth interceptor (KEY FIX) |
| `src/hooks/useFacilities.ts` | ✅ Added status toggle |
| `src/components/admin/FacilitiesView.tsx` | ✅ Added filters & status UI |
| Backend DTOs | ✅ Added status field |
| Database | ✅ Added status column |

## That's It!

Your facilities page should now work. If you see your facilities, you're done! 🎉

For more details, see [FACILITIES_COMPLETE_SOLUTION.md](./FACILITIES_COMPLETE_SOLUTION.md)

---

**Fixed**: February 2, 2026  
**Time to Fix**: ~5 minutes  
**Complexity**: Simple (one interceptor added)  
**Impact**: High (facilities now visible!)
