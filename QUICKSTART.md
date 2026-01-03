# Kinxplore Admin - Quick Start Guide

Get your admin panel up and running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed
✅ Backend API running on port 3001
✅ Supabase database configured

## Step 1: Install Dependencies

```bash
cd kinxplore-admin
yarn install
```

## Step 2: Configure Environment

The `.env.local` file should already be created. If not:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

## Step 3: Start the Admin Panel

```bash
yarn dev
```

The admin panel will open at: **http://localhost:3000**

It will automatically redirect to the destinations management page.

## Step 4: Start Managing Destinations

### Create a Destination

1. Click the **"Create Destination"** button
2. Fill in the form:
   - **Name** (required)
   - Description
   - Image URL
   - Location
   - Price
   - Rating (0-5)
   - Categories (optional)
3. Click **"Create"**

### Edit a Destination

1. Find the destination in the table
2. Click the **Edit** icon (pencil)
3. Update the fields
4. Click **"Update"**

### Delete a Destination

1. Find the destination in the table
2. Click the **Delete** icon (trash)
3. Confirm the deletion

### View History

1. Find the destination in the table
2. Click the **History** icon (clock)
3. View all changes made to that destination

## Features at a Glance

### Dashboard Statistics
- Total Destinations
- Average Price
- Average Rating

### Search & Filter
- Real-time search across all fields
- Instant results

### Archive History
- Complete audit trail
- View changes by destination or globally
- See who made changes and when

## Troubleshooting

### "Failed to fetch destinations"

**Problem**: Cannot connect to backend API

**Solution**:
1. Make sure backend is running: `cd kinxplore-backend && npm run start:dev`
2. Check backend is on port 3001: `curl http://localhost:3001/destinations`
3. Verify `.env.local` has correct API URL

### "Network Error"

**Problem**: CORS or network issues

**Solution**:
1. Backend should allow CORS from `http://localhost:3000`
2. Check backend console for CORS errors
3. Restart both frontend and backend

### Categories not loading

**Problem**: Category endpoints not working

**Solution**:
1. Verify backend has category endpoints:
   - `GET /categories/parent`
   - `GET /categories/subcategories`
2. Check Supabase has `parent_categories` and `subcategories` tables

## Next Steps

- 🎨 Customize the UI theme in `tailwind.config.ts`
- 🌐 Add more languages in `messages/` folder
- 🔐 Add authentication (recommended for production)
- 📊 Add more analytics and charts
- 🖼️ Integrate image upload service

## Need Help?

Check the full README.md for detailed documentation.

## Production Deployment

### Build for Production

```bash
yarn build
yarn start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deploy to Vercel

```bash
vercel
```

That's it! You're ready to manage destinations! 🚀
