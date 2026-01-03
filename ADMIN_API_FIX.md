# Admin API Integration Fix

## Issues Fixed

### Backend Issues
1. **Double `/api` prefix**: The admin controller was using `@Controller('api/admin/destinations')` which resulted in routes like `/api/api/admin/destinations` because the global prefix was already adding `/api`
   - **Fixed**: Changed to `@Controller('admin/destinations')` 
   - **Result**: Routes are now correctly at `/api/admin/destinations`

### Frontend Issues
1. **Wrong API base URL**: Was pointing to `http://localhost:3000` (frontend port) instead of `http://localhost:5001` (backend port)
   - **Fixed**: Updated default to `http://localhost:5001`

2. **Missing `/api` prefix**: The axios client wasn't including the `/api` prefix in the base URL
   - **Fixed**: Changed baseURL from `API_BASE_URL` to `${API_BASE_URL}/api`

3. **Wrong API endpoints**: Admin endpoints were using `/api/admin/destinations` but should use `/admin/destinations` (since `/api` is already in the base URL)
   - **Fixed**: Removed `/api` prefix from all admin endpoint calls

4. **Data handling error**: The code was trying to call `.reduce()` on potentially undefined data
   - **Fixed**: Added `safeDestinations` variable that defaults to empty array
   - **Fixed**: Added proper error state handling with user-friendly error message

## Current API Structure

### Backend Routes (with global `/api` prefix)
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/:id` - Get single destination
- `POST /api/admin/destinations` - Create destination
- `PUT /api/admin/destinations/:id` - Update destination
- `DELETE /api/admin/destinations/:id` - Delete destination
- `GET /api/admin/destinations/history/:id` - Get destination history
- `GET /api/admin/destinations/history` - Get all history

### Frontend API Client
- Base URL: `http://localhost:5001/api` (configurable via `NEXT_PUBLIC_API_URL`)
- Endpoints called without `/api` prefix (e.g., `/destinations`, `/admin/destinations`)

## Environment Setup

### Backend
```env
PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend (Admin)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Testing

1. Start backend: `cd kinxplore-backend && npm run start:dev`
2. Start admin frontend: `cd kinxplore-admin && yarn dev`
3. Open http://localhost:3000
4. Should see destinations loaded without errors

## Files Modified

### Backend
- `src/destination/admin.controller.ts` - Fixed controller route prefix

### Frontend
- `src/lib/api.ts` - Fixed base URL and endpoint paths
- `src/app/[locale]/(pages)/page.tsx` - Fixed data handling and error display
- `README.md` - Updated documentation with correct ports and URLs
