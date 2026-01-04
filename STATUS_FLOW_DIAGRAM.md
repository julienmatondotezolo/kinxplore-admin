# Destination Status Flow Diagram

## Visual State Representation

```
┌─────────────────────────────────────────────────────────────────┐
│                     DESTINATION LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   CREATED    │
                    │ status:      │
                    │  'active'    │
                    └──────┬───────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │         ACTIVE STATE                 │
        │  ✓ Visible to public users          │
        │  ✓ Appears in search results        │
        │  ✓ Can be edited                    │
        │  ✓ Can be deactivated               │
        │  ✓ Full opacity in admin panel      │
        │  ✓ Color images                     │
        │                                      │
        │  Actions: [History] [Edit] [Delete] │
        └──────┬───────────────────────────────┘
               │
               │ Admin clicks "Deactivate"
               │ (Soft Delete)
               ▼
        ┌──────────────────────────────────────┐
        │       INACTIVE STATE                 │
        │  ✗ Hidden from public users         │
        │  ✗ Not in search results            │
        │  ✗ Cannot be edited                 │
        │  ✓ Can be reactivated               │
        │  ⚫ 50% opacity in admin panel      │
        │  ⚫ Grayscale images                │
        │  ⚫ Line-through text               │
        │  🏷️  "Inactive" badge               │
        │                                      │
        │  Actions: [🔄 Reactivate] [History] │
        └──────┬───────────────────────────────┘
               │
               │ Admin clicks "Reactivate"
               │
               ▼
        ┌──────────────────────────────────────┐
        │         ACTIVE STATE                 │
        │  (Returns to normal state)           │
        │  All features restored               │
        └──────────────────────────────────────┘
```

## UI States Comparison

### Active Destination Row
```
┌────────────────────────────────────────────────────────────────┐
│ 🖼️  Eiffel Tower                                               │
│     Paris, France                                               │
│     [Adventure] [City]    $299.00    ⭐ 4.8                    │
│                                    [📜] [✏️] [🗑️]              │
└────────────────────────────────────────────────────────────────┘
     ↑ Full color, normal opacity
```

### Inactive Destination Row
```
┌────────────────────────────────────────────────────────────────┐
│ ⚫ Eiffel Tower [Inactive]                                     │
│     Paris, France                                               │
│     [Adventure] [City]    $299.00    ⭐ 4.8                    │
│                              [🔄 Reactivate] [📜]              │
└────────────────────────────────────────────────────────────────┘
     ↑ Grayscale, 50% opacity, line-through text
```

## Button States

### Active Destination Actions
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ History  │  │   Edit   │  │ Deactivate│
│    📜    │  │    ✏️    │  │    🗑️    │
└──────────┘  └──────────┘  └──────────┘
   Enabled      Enabled       Enabled
```

### Inactive Destination Actions
```
┌────────────────┐  ┌──────────┐
│  Reactivate    │  │ History  │
│  🔄 (Green)    │  │    📜    │
└────────────────┘  └──────────┘
     Enabled          Enabled
```

## API Flow

### Deactivation Flow
```
Frontend                Backend                  Database
   │                       │                         │
   │  DELETE /admin/      │                         │
   │  destinations/:id    │                         │
   ├──────────────────────>                         │
   │                       │  UPDATE destinations   │
   │                       │  SET status='inactive' │
   │                       ├────────────────────────>
   │                       │                         │
   │                       │  INSERT INTO           │
   │                       │  destinations_archive  │
   │                       ├────────────────────────>
   │                       │                         │
   │  204 No Content      │                         │
   <──────────────────────┤                         │
   │                       │                         │
   │  Toast: "Deactivated"│                         │
   │  Invalidate queries  │                         │
   │                       │                         │
```

### Reactivation Flow
```
Frontend                Backend                  Database
   │                       │                         │
   │  PUT /admin/         │                         │
   │  destinations/:id/   │                         │
   │  reactivate          │                         │
   ├──────────────────────>                         │
   │                       │  Check if exists       │
   │                       ├────────────────────────>
   │                       │                         │
   │                       │  Check if inactive     │
   │                       ├────────────────────────>
   │                       │                         │
   │                       │  UPDATE destinations   │
   │                       │  SET status='active'   │
   │                       ├────────────────────────>
   │                       │                         │
   │                       │  INSERT INTO           │
   │                       │  destinations_archive  │
   │                       ├────────────────────────>
   │                       │                         │
   │  200 OK + data       │                         │
   <──────────────────────┤                         │
   │                       │                         │
   │  Toast: "Reactivated"│                         │
   │  Invalidate queries  │                         │
   │                       │                         │
```

## Database Schema

### Destinations Table
```sql
CREATE TABLE destinations (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  image VARCHAR,
  price NUMERIC,
  location VARCHAR,
  ratings NUMERIC,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_destinations_status ON destinations(status);
```

### Archive Entry Example
```json
{
  "id": "uuid",
  "destination_id": "dest-uuid",
  "operation_type": "UPDATE",
  "destination_data": {
    "id": "dest-uuid",
    "name": "Eiffel Tower",
    "status": "active",
    ...
  },
  "categories_data": [...],
  "modified_by": "admin",
  "modified_at": "2026-01-04T10:30:00Z",
  "change_description": "Destination reactivated (status changed from inactive to active)"
}
```

## Color Scheme

### Active State
- Background: Normal card background
- Text: Primary text color
- Images: Full color
- Opacity: 100%

### Inactive State
- Background: Muted background (`bg-muted/20`)
- Text: Muted foreground with line-through
- Images: Grayscale filter
- Opacity: 50%
- Badge: Outline variant, muted colors

### Reactivate Button
- Border: Green (`border-green-600`)
- Text: Green (`text-green-600`)
- Hover Background: Light green (`hover:bg-green-50`)
- Dark Mode: Dark green (`dark:hover:bg-green-950`)
- Icon: RotateCcw (suggests restoration)

## User Experience Flow

1. **Initial State**: Admin sees list of all destinations
2. **Deactivation**: 
   - Click trash icon → Confirmation dialog → Confirm
   - Row fades to 50% opacity and turns grayscale
   - "Inactive" badge appears
   - Reactivate button replaces Edit/Delete buttons
3. **Reactivation**:
   - Click green "Reactivate" button
   - Button shows loading state
   - Success toast appears
   - Row returns to normal appearance
   - Edit/Delete buttons return

## Statistics Impact

### Dashboard Stats
```
┌─────────────────────┐
│ Active Destinations │
│        42           │
│   3 inactive        │
└─────────────────────┘
```

- Only active destinations count toward stats
- Inactive count shown as supplementary info
- Average price/rating calculated from active only
