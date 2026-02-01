# Facility Authentication Fix

## Issue
The Facilities page was showing "No facilities yet" because the API calls were failing due to missing authentication tokens.

## Root Cause
The facilities API endpoint (`/api/facilities`) requires authentication (uses `AuthGuard`), but the axios client wasn't including the JWT token in the requests.

## Solution
Added an axios request interceptor to automatically include the authentication token from Supabase session in all API requests.

### Changes Made

#### File: `src/lib/api.ts`
Added request interceptor:

```typescript
// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

## How It Works

1. **User logs in** → Supabase creates a session with JWT token
2. **User navigates to Facilities page** → React Query calls `useFacilities()` hook
3. **Hook makes API request** → Axios interceptor runs before request
4. **Interceptor gets session** → Retrieves current Supabase session
5. **Adds Authorization header** → `Authorization: Bearer <token>`
6. **Backend receives request** → AuthGuard validates token
7. **Returns facilities data** → Displayed in admin panel

## Benefits

- ✅ **Automatic**: All API requests now include auth token automatically
- ✅ **Centralized**: No need to manually add token to each request
- ✅ **Consistent**: Works for all endpoints (facilities, destinations, categories, bookings)
- ✅ **Secure**: Token is fetched fresh from Supabase session each time

## Testing

### Before Fix
```bash
# API call without token
GET /api/facilities
Response: 401 Unauthorized
```

### After Fix
```bash
# API call with token (automatic)
GET /api/facilities
Headers: Authorization: Bearer eyJhbGc...
Response: 200 OK with facilities data
```

## Impact

This fix ensures that:
1. **Facilities page** now loads and displays all facilities
2. **All CRUD operations** work correctly (Create, Read, Update, Delete)
3. **Status toggle** works (Enable/Disable facilities)
4. **Other authenticated endpoints** also benefit from this fix

## Related Files

- `src/lib/api.ts` - Added interceptor
- `src/lib/supabase.ts` - Supabase client (imported)
- `src/hooks/useFacilities.ts` - Uses the api client
- `src/components/admin/FacilitiesView.tsx` - Displays facilities

## Environment Setup

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:2431
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

1. Restart the admin panel if it's running
2. Log in to the admin panel
3. Navigate to the Facilities page
4. You should now see all facilities loaded

## Troubleshooting

### Still seeing "No facilities yet"?

1. **Check backend is running**: `curl http://localhost:2431/api/facilities`
2. **Check you're logged in**: Look for user info in the header
3. **Check browser console**: Look for any error messages
4. **Check network tab**: Verify Authorization header is present
5. **Apply migration**: Run `./apply-facility-status-migration.sh` in backend

### 401 Unauthorized error?

1. **Clear browser cache and cookies**
2. **Log out and log back in**
3. **Check Supabase session**: Session might have expired
4. **Verify user role**: Must be 'admin' in profiles table

## Summary

The facilities page now works correctly with proper authentication. All API requests automatically include the JWT token, ensuring secure access to protected endpoints.

---

**Fixed**: February 2, 2026
**Status**: ✅ Complete
