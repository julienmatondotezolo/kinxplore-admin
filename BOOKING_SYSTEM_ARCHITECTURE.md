# Booking Management System - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER FRONTEND                            │
│                     (kinxplore - Next.js)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Booking Form                                             │  │
│  │  • Guest Information                                      │  │
│  │  • Destination Selection                                  │  │
│  │  • Date Selection                                         │  │
│  │  • Special Requests                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓ POST /bookings                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│                  (kinxplore-backend - NestJS)                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BookingController                                        │  │
│  │  ├─ POST /bookings (create)                              │  │
│  │  ├─ GET /bookings/admin/all (list all)                   │  │
│  │  ├─ GET /bookings/admin/statistics (stats)               │  │
│  │  ├─ PUT /bookings/admin/:id (update)                     │  │
│  │  ├─ PUT /bookings/admin/:id/status (status)              │  │
│  │  └─ DELETE /bookings/admin/:id (delete)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BookingService                                           │  │
│  │  ├─ createBooking()                                       │  │
│  │  ├─ getAllBookings()                                      │  │
│  │  ├─ getBookingStatistics()                                │  │
│  │  ├─ updateBookingAdmin()                                  │  │
│  │  ├─ updateBookingStatus()                                 │  │
│  │  └─ deleteBooking()                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                             │
│                      (PostgreSQL)                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  bookings TABLE                                           │  │
│  │  ├─ id (uuid, PK)                                         │  │
│  │  ├─ user_id (uuid, FK → profiles)                        │  │
│  │  ├─ destination_id (uuid, FK → destinations)             │  │
│  │  ├─ status (enum: pending/confirmed/cancelled/completed) │  │
│  │  ├─ priority (enum: low/medium/high/urgent) ✨ NEW       │  │
│  │  ├─ assigned_to (uuid, FK → profiles) ✨ NEW             │  │
│  │  ├─ admin_notes (text) ✨ NEW                            │  │
│  │  ├─ last_status_change_at (timestamptz) ✨ NEW           │  │
│  │  ├─ last_status_change_by (uuid, FK → profiles) ✨ NEW   │  │
│  │  ├─ check_in_date, check_out_date                        │  │
│  │  ├─ number_of_guests, total_price                        │  │
│  │  ├─ guest_first_name, guest_last_name                    │  │
│  │  ├─ contact_email, contact_phone                         │  │
│  │  ├─ guest_country, guest_address, guest_city             │  │
│  │  ├─ special_requests                                      │  │
│  │  ├─ created_at, updated_at                               │  │
│  │  └─ cancelled_at, cancellation_reason                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REAL-TIME TRIGGERS                                       │  │
│  │  ├─ ON INSERT → Notify subscribers                       │  │
│  │  ├─ ON UPDATE → Notify subscribers                       │  │
│  │  └─ ON UPDATE status → Update last_status_change_at      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Real-time Subscription
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN PANEL                                 │
│                (kinxplore-admin - Next.js)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Header                                                   │  │
│  │  ├─ 🔔 Notification Badge (new bookings count)           │  │
│  │  └─ [Bookings] Button                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Bookings Page (/bookings)                               │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Statistics Dashboard                               │  │  │
│  │  │  [Total: 1,429] [Pending: 23] [Confirmed: 156]     │  │  │
│  │  │  [Revenue: €38,420]                                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Search & Filter Bar                                │  │  │
│  │  │  [🔍 Search...] [Priority Filter ▼] [Board/List]   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ PENDING  │  │CONFIRMED │  │COMPLETED │              │  │
│  │  │   (23)   │  │  (156)   │  │  (1,250) │              │  │
│  │  ├──────────┤  ├──────────┤  ├──────────┤              │  │
│  │  │ 🟡 Card  │  │ 🔵 Card  │  │ 🟢 Card  │              │  │
│  │  │ 🟡 Card  │  │ 🔵 Card  │  │ 🟢 Card  │              │  │
│  │  │ 🟡 Card  │  │ 🔵 Card  │  │ 🟢 Card  │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  │       ↓ Click                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Booking Detail Modal                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ [Pending] [Confirmed] [Completed] [Cancelled]      │  │  │
│  │  │                                                     │  │  │
│  │  │ Guest Info     │  Task Management                  │  │  │
│  │  │ • Name         │  Priority: [High ▼]               │  │  │
│  │  │ • Email        │  Admin Notes:                     │  │  │
│  │  │ • Phone        │  [________________]               │  │  │
│  │  │                │  [Save Changes]                   │  │  │
│  │  │ Booking Info   │                                   │  │  │
│  │  │ • Destination  │  [Delete Booking]                 │  │  │
│  │  │ • Dates        │                                   │  │  │
│  │  │ • Price        │                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useBookingManagement Hook                                │  │
│  │  ├─ bookings (state)                                      │  │
│  │  ├─ statistics (state)                                    │  │
│  │  ├─ newBookingCount (state)                               │  │
│  │  ├─ loadBookings()                                        │  │
│  │  ├─ loadStatistics()                                      │  │
│  │  ├─ updateBooking()                                       │  │
│  │  ├─ deleteBooking()                                       │  │
│  │  └─ Real-time Subscription (Supabase)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
BookingsPage
├── BookingStatsDashboard
│   └── Statistics Cards (x4)
├── Search & Filter Bar
│   ├── Search Input
│   ├── Priority Filter Dropdown
│   └── View Toggle (Board/List)
└── Task Board
    ├── Pending Column
    │   └── BookingTaskCard (multiple)
    ├── Confirmed Column
    │   └── BookingTaskCard (multiple)
    └── Completed Column
        └── BookingTaskCard (multiple)

BookingDetailModal (overlay)
├── Status Action Buttons (x4)
├── Guest Information Panel
├── Booking Details Panel
├── Task Management Panel
│   ├── Priority Selector
│   ├── Admin Notes Textarea
│   └── Save Button
├── Metadata Panel
└── Delete Button
```

## Data Flow Diagram

### Creating a Booking

```
User (Frontend)
    ↓ Fill form
    ↓ Submit
Frontend API Call
    ↓ POST /bookings
Backend Controller
    ↓ Validate DTO
Backend Service
    ↓ Business logic
Supabase Database
    ↓ INSERT booking
    ↓ Trigger: ON INSERT
Real-time Channel
    ↓ Broadcast event
Admin Panel Subscription
    ↓ Receive event
    ↓ Update state
UI Updates
    ↓ Show notification 🔔
    ↓ Add to Pending column
Admin sees new booking
```

### Updating Booking Status

```
Admin clicks status button
    ↓
BookingDetailModal
    ↓ handleStatusChange()
useBookingManagement hook
    ↓ updateBooking()
Supabase Client
    ↓ UPDATE bookings
Database Trigger
    ↓ Update last_status_change_at
    ↓ Broadcast UPDATE event
Real-time Subscription
    ↓ Receive event
    ↓ loadBookings()
UI Updates
    ↓ Move card to new column
    ↓ Update statistics
    ↓ Close modal (optional)
```

## State Management

```
useBookingManagement Hook
├── bookings: BookingTask[]
├── statistics: BookingStatistics
├── loading: boolean
├── error: string | null
├── newBookingCount: number
└── Real-time Subscription

BookingsPage Component
├── selectedBooking: BookingTask | null
├── searchQuery: string
├── priorityFilter: string
└── view: 'board' | 'list'

BookingDetailModal Component
├── status: BookingStatus
├── priority: Priority
├── adminNotes: string
└── isSaving: boolean
```

## Real-time Subscription Flow

```
Component Mount
    ↓
useEffect with isAdmin check
    ↓
Create Supabase channel
    ↓
Subscribe to 'bookings-changes'
    ↓
Listen for INSERT events
    ↓ On INSERT
    ├─ Increment newBookingCount
    ├─ loadBookings()
    └─ loadStatistics()
    ↓
Listen for UPDATE events
    ↓ On UPDATE
    ├─ loadBookings()
    └─ loadStatistics()
    ↓
Component Unmount
    ↓
Remove channel subscription
```

## Security Architecture

```
User Request
    ↓
Frontend (Next.js)
    ↓ Include JWT token
    ↓ Authorization: Bearer <token>
Backend (NestJS)
    ↓ AuthGuard validates token
    ↓ AdminGuard checks role
    ↓ If authorized ✓
Backend Service
    ↓ Execute operation
Supabase
    ↓ RLS policies check
    ↓ If authorized ✓
Database Operation
    ↓ Success
Return Response
```

## Database Relationships

```
profiles (users)
    ↓ id
    ├─→ bookings.user_id (who made booking)
    ├─→ bookings.assigned_to (admin assigned)
    └─→ bookings.last_status_change_by (who changed status)

destinations
    ↓ id
    └─→ bookings.destination_id (what was booked)

bookings
    ├─ user_id → profiles
    ├─ destination_id → destinations
    ├─ assigned_to → profiles
    └─ last_status_change_by → profiles
```

## API Endpoints Map

```
PUBLIC ENDPOINTS (User Frontend)
POST   /bookings                    Create booking
GET    /bookings/my-bookings        Get user's bookings
GET    /bookings/my-bookings/stats  Get user's stats
PUT    /bookings/my-bookings/:id    Update user's booking
POST   /bookings/my-bookings/:id/cancel  Cancel user's booking

ADMIN ENDPOINTS (Admin Panel)
GET    /bookings/admin/all          Get all bookings (paginated)
GET    /bookings/admin/statistics   Get booking statistics
PUT    /bookings/admin/:id          Update booking (full)
PUT    /bookings/admin/:id/status   Update booking status
DELETE /bookings/admin/:id          Delete booking
```

## Technology Stack Summary

```
┌─────────────────────────────────────┐
│ FRONTEND (Admin Panel)              │
│ • Next.js 14 (App Router)           │
│ • React 18                           │
│ • TypeScript                         │
│ • Tailwind CSS                       │
│ • Lucide Icons                       │
│ • next-intl (i18n)                   │
│ • Supabase Client (real-time)       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ BACKEND (API)                        │
│ • NestJS 10                          │
│ • TypeScript                         │
│ • Class Validator                    │
│ • Supabase Client                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ DATABASE                             │
│ • Supabase (PostgreSQL 17)           │
│ • Real-time subscriptions            │
│ • Row Level Security (RLS)           │
│ • Triggers & Functions               │
└─────────────────────────────────────┘
```

## Performance Considerations

### Database Indexes
```sql
-- For fast filtering by status and sorting by date
CREATE INDEX idx_bookings_status_created 
ON bookings(status, created_at DESC);

-- For fast filtering by priority
CREATE INDEX idx_bookings_priority 
ON bookings(priority);

-- For fast lookup of assigned bookings
CREATE INDEX idx_bookings_assigned_to 
ON bookings(assigned_to);
```

### Query Optimization
- Use `select()` with specific fields instead of `select('*')`
- Join related tables in single query (destination, user, assigned_admin)
- Implement pagination for large datasets
- Client-side filtering for instant results

### Real-time Optimization
- Single channel for all booking changes
- Debounce rapid updates
- Only subscribe when admin panel is active
- Clean up subscriptions on unmount

## Scalability Considerations

### Current Capacity
- Handles 1000+ bookings efficiently
- Real-time updates for multiple admins
- Fast search and filtering

### Future Scaling
- Add Redis cache for statistics
- Implement virtual scrolling for large lists
- Add database read replicas
- Implement WebSocket fallback
- Add CDN for static assets

---

**Architecture Version**: 1.0.0
**Last Updated**: February 1, 2026
