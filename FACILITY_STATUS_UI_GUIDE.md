# Facility Status Management - UI Guide

## 🎨 Visual Overview

This guide shows you what the new facility status management interface looks like and how to use it.

## 📱 Main Interface

### Header Section
```
┌────────────────────────────────────────────────────────────────────────────┐
│  Facilities                                                                 │
│  Manage facilities for your destinations                                   │
│                                                                             │
│                    [All] [Active] [Inactive]    [+ New Facility]          │
└────────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Title**: "Facilities" in large, bold text
- **Subtitle**: "Manage facilities for your destinations"
- **Status Filters**: Three pill-shaped buttons
- **New Facility Button**: Black rounded button with plus icon

### Status Filter Tabs

#### All Facilities Selected
```
┌──────┐ ┌────────┐ ┌──────────┐
│ All  │ │ Active │ │ Inactive │
└──────┘ └────────┘ └──────────┘
  ▲ Black background
```

#### Active Facilities Selected
```
┌──────┐ ┌────────┐ ┌──────────┐
│ All  │ │ Active │ │ Inactive │
└──────┘ └────────┘ └──────────┘
           ▲ Emerald background
```

#### Inactive Facilities Selected
```
┌──────┐ ┌────────┐ ┌──────────┐
│ All  │ │ Active │ │ Inactive │
└──────┘ └────────┘ └──────────┘
                      ▲ Gray background
```

## 🎴 Facility Cards

### Active Facility Card
```
┌─────────────────────────────────────────┐
│                          [Active] ←─────┼─ Green badge
│  ┌────┐                                 │
│  │ ✨ │ ← Purple background             │
│  └────┘                                 │
│                                         │
│  WiFi                                   │
│  High-speed wireless internet           │
│                                         │
│  ┌─────────────┐                        │
│  │ Restaurant  │ ← Category badge       │
│  └─────────────┘                        │
│  ─────────────────────────────────────  │
│  [Disable] [✏️] [🗑️]                     │
│   ▲ Gray   Edit Delete                  │
└─────────────────────────────────────────┘
```

**Visual Properties:**
- Full opacity (100%)
- Purple icon background (#F3E8FF)
- Green "Active" badge
- Gray "Disable" button
- Smooth hover effects

### Inactive Facility Card
```
┌─────────────────────────────────────────┐
│                        [Inactive] ←─────┼─ Gray badge
│  ┌────┐                                 │
│  │ 🏊 │ ← Gray background               │
│  └────┘                                 │
│                                         │
│  Swimming Pool                          │
│  Olympic-size outdoor pool              │
│                                         │
│  ┌─────────────┐                        │
│  │ Hotel       │ ← Category badge       │
│  └─────────────┘                        │
│  ─────────────────────────────────────  │
│  [Enable] [✏️] [🗑️]                      │
│   ▲ Green  Edit Delete                  │
└─────────────────────────────────────────┘
```

**Visual Properties:**
- Reduced opacity (60%)
- Gray icon background (#F3F4F6)
- Gray "Inactive" badge
- Green "Enable" button
- Dimmed appearance

## 🎯 Interactive Elements

### Status Toggle Button States

#### Disable Button (for Active Facilities)
```
┌─────────────────────┐
│  ⏻  Disable         │ ← PowerOff icon
└─────────────────────┘
  Gray background (#F3F4F6)
  Hover: Darker gray (#E5E7EB)
```

#### Enable Button (for Inactive Facilities)
```
┌─────────────────────┐
│  ⚡  Enable          │ ← Power icon
└─────────────────────┘
  Green background (#ECFDF5)
  Hover: Darker green (#D1FAE5)
```

#### Loading State
```
┌─────────────────────┐
│  ⟳  Processing...   │ ← Spinning loader
└─────────────────────┘
  Disabled state
```

### Edit Button
```
┌────┐
│ ✏️ │ Blue hover background
└────┘
```

### Delete Button
```
┌────┐
│ 🗑️ │ Red hover background
└────┘
```

## 📊 Grid Layout

### Desktop View (3 columns)
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Facility │  │ Facility │  │ Facility │
│   Card   │  │   Card   │  │   Card   │
└──────────┘  └──────────┘  └──────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ Facility │  │ Facility │  │ Facility │
│   Card   │  │   Card   │  │   Card   │
└──────────┘  └──────────┘  └──────────┘
```

### Tablet View (2 columns)
```
┌──────────┐  ┌──────────┐
│ Facility │  │ Facility │
│   Card   │  │   Card   │
└──────────┘  └──────────┘

┌──────────┐  ┌──────────┐
│ Facility │  │ Facility │
│   Card   │  │   Card   │
└──────────┘  └──────────┘
```

### Mobile View (1 column)
```
┌──────────┐
│ Facility │
│   Card   │
└──────────┘

┌──────────┐
│ Facility │
│   Card   │
└──────────┘
```

## 🎨 Color Scheme

### Status Colors
- **Active Badge**: `bg-emerald-50 text-emerald-700`
- **Inactive Badge**: `bg-gray-100 text-gray-600`

### Button Colors
- **Disable Button**: `bg-gray-100 hover:bg-gray-200 text-gray-700`
- **Enable Button**: `bg-emerald-50 hover:bg-emerald-100 text-emerald-700`
- **Edit Button**: `hover:bg-blue-50` with blue icon
- **Delete Button**: `hover:bg-red-50` with red icon

### Icon Backgrounds
- **Active Facility**: `bg-purple-50` (light purple)
- **Inactive Facility**: `bg-gray-100` (light gray)

### Filter Tabs
- **All (selected)**: `bg-black text-white`
- **Active (selected)**: `bg-emerald-500 text-white`
- **Inactive (selected)**: `bg-gray-500 text-white`
- **Unselected**: `text-gray-600 hover:text-gray-900`

## 🔄 Interaction Flow

### Disabling a Facility
```
1. User sees active facility
   ┌─────────────┐
   │   [Active]  │
   │   Facility  │
   │  [Disable]  │
   └─────────────┘

2. User clicks "Disable"
   ┌─────────────┐
   │   [Active]  │
   │   Facility  │
   │ [⟳ Loading] │
   └─────────────┘

3. Status updates
   ┌─────────────┐
   │ [Inactive]  │
   │   Facility  │
   │  [Enable]   │
   └─────────────┘

4. Toast notification appears
   ✅ Facility disabled successfully
```

### Enabling a Facility
```
1. User filters to "Inactive"
   [All] [Active] [Inactive] ← Click

2. User sees inactive facility
   ┌─────────────┐
   │ [Inactive]  │
   │   Facility  │
   │  [Enable]   │
   └─────────────┘

3. User clicks "Enable"
   ┌─────────────┐
   │ [Inactive]  │
   │   Facility  │
   │ [⟳ Loading] │
   └─────────────┘

4. Status updates
   ┌─────────────┐
   │   [Active]  │
   │   Facility  │
   │  [Disable]  │
   └─────────────┘

5. Toast notification appears
   ✅ Facility enabled successfully
```

## 📱 Responsive Behavior

### Desktop (≥1024px)
- 3-column grid
- Full button labels
- Hover effects enabled
- All features visible

### Tablet (768px - 1023px)
- 2-column grid
- Full button labels
- Touch-friendly targets
- Optimized spacing

### Mobile (<768px)
- 1-column grid
- Stacked layout
- Touch-optimized buttons
- Larger tap targets

## 🎭 Animation & Transitions

### Hover Effects
- **Cards**: `hover:shadow-xl` (shadow increases)
- **Buttons**: `hover:scale-105` (slight scale up)
- **Icons**: Smooth color transitions

### Status Change
- Opacity transition (300ms)
- Background color transition (300ms)
- Badge color transition (300ms)

### Loading State
- Spinner rotation animation
- Button disabled state
- Cursor changes to "not-allowed"

## 💡 Visual Feedback

### Success States
```
┌────────────────────────────────┐
│ ✅ Facility enabled successfully │
└────────────────────────────────┘
  Green toast notification
  Top-right corner
  Auto-dismiss after 3 seconds
```

### Error States
```
┌────────────────────────────────┐
│ ❌ Failed to update facility    │
└────────────────────────────────┘
  Red toast notification
  Top-right corner
  Auto-dismiss after 5 seconds
```

### Loading States
```
┌─────────────────────┐
│  ⟳  Processing...   │
└─────────────────────┘
  Button disabled
  Spinner animation
  Prevents double-clicks
```

## 🎯 Accessibility

- **Keyboard Navigation**: All buttons are keyboard accessible
- **Focus States**: Clear focus indicators
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44x44px

## 📐 Spacing & Layout

### Card Spacing
- **Padding**: 24px (1.5rem)
- **Gap**: 24px between cards
- **Border Radius**: 24px
- **Border**: 1px solid gray-200

### Button Spacing
- **Padding**: 10px 16px
- **Gap**: 8px between buttons
- **Border Radius**: 9999px (fully rounded)

### Text Spacing
- **Title**: 24px font size, bold
- **Description**: 14px font size
- **Badge**: 12px font size, bold

## 🎨 Design Tokens

```css
/* Colors */
--active-badge: #ECFDF5 (bg), #047857 (text)
--inactive-badge: #F3F4F6 (bg), #4B5563 (text)
--disable-button: #F3F4F6 (bg), #374151 (text)
--enable-button: #ECFDF5 (bg), #047857 (text)

/* Spacing */
--card-padding: 24px
--card-gap: 24px
--button-padding: 10px 16px

/* Border Radius */
--card-radius: 24px
--button-radius: 9999px
--badge-radius: 9999px

/* Shadows */
--card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05)
--card-hover-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

/* Transitions */
--transition-duration: 300ms
--transition-timing: ease-in-out
```

## 🎉 Summary

The facility status management UI provides:
- ✅ Clear visual hierarchy
- ✅ Intuitive interactions
- ✅ Consistent design language
- ✅ Responsive layout
- ✅ Accessible components
- ✅ Smooth animations
- ✅ Professional appearance

The interface seamlessly integrates with the existing admin panel design while adding powerful new functionality for managing facility visibility.
