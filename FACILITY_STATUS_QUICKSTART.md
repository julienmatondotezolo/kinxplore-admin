# Facility Status Management - Quick Start Guide

## 🚀 What's New?

The Facilities page now supports **enabling and disabling facilities** without deleting them!

## ✨ Key Features

### 1. **Status Toggle**
- Click "Disable" to hide a facility from users
- Click "Enable" to make it visible again
- Changes take effect immediately

### 2. **Status Filters**
Three filter options at the top of the page:
- **All**: View all facilities
- **Active**: View only enabled facilities
- **Inactive**: View only disabled facilities

### 3. **Visual Indicators**
- **Active facilities**: Green "Active" badge, full opacity
- **Inactive facilities**: Gray "Inactive" badge, dimmed appearance

## 📋 How to Use

### Disable a Facility
1. Go to the Facilities page (click "Facilities" in the sidebar)
2. Find the facility you want to disable
3. Click the **"Disable"** button (gray button with power icon)
4. The facility is now hidden from users but still exists in your database

### Enable a Facility
1. Click the **"Inactive"** filter tab
2. Find the disabled facility
3. Click the **"Enable"** button (green button with power icon)
4. The facility is now visible to users again

### Filter Facilities
- Click **"All"** to see everything
- Click **"Active"** to see only enabled facilities
- Click **"Inactive"** to see only disabled facilities

## 🎯 Common Use Cases

### Seasonal Facilities
Disable facilities that aren't currently available:
```
Example: Disable "Outdoor Pool" during winter months
```

### Maintenance
Temporarily hide facilities under maintenance:
```
Example: Disable "Gym" while renovating
```

### Testing
Create facilities in disabled state before making them public:
```
Example: Create "New VIP Lounge" as inactive, test it, then enable
```

## 🔧 Setup Required

### Backend Setup (One-time)
```bash
cd kinxplore-backend
./apply-facility-status-migration.sh
npm run start:dev
```

### Frontend Setup (One-time)
```bash
cd kinxplore-admin
npm install
npm run dev
```

## 💡 Tips

1. **Don't Delete, Disable**: Instead of deleting facilities, disable them to preserve history
2. **Use Filters**: Use the status filters to quickly find what you need
3. **Batch Operations**: Filter by status to perform operations on multiple facilities
4. **Visual Feedback**: Watch for the status badge to confirm changes

## 🎨 UI Overview

```
┌─────────────────────────────────────────────────────────┐
│  Facilities                          [All][Active][Inactive] [+ New Facility]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ ✨ WiFi      │  │ 🍽️ Restaurant│  │ 🏊 Pool      │ │
│  │ [Active]     │  │ [Active]     │  │ [Inactive]   │ │
│  │              │  │              │  │              │ │
│  │ [Disable][✏️][🗑️]│ [Disable][✏️][🗑️]│ [Enable][✏️][🗑️] │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## ❓ FAQ

**Q: What happens to destinations using a disabled facility?**
A: The facility remains associated with the destination but won't be displayed to users.

**Q: Can I edit a disabled facility?**
A: Yes! Click the edit icon (✏️) on any facility, regardless of status.

**Q: Can I delete a disabled facility?**
A: Yes, the delete button (🗑️) works for both active and inactive facilities.

**Q: Do disabled facilities count toward my total?**
A: Yes, they still exist in your database, just hidden from users.

**Q: Can users see inactive facilities?**
A: No, only administrators can see and manage inactive facilities.

## 🎉 That's It!

You now have full control over facility visibility. Enable and disable facilities as needed without losing any data!

For more details, see [FACILITY_STATUS_FEATURE.md](../kinxplore-backend/FACILITY_STATUS_FEATURE.md)
