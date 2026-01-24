# Clickable Rows & Opening Hours - Quick Guide

## 🎯 What's New

### 1. **Clickable Destination Rows** 
Click anywhere on a destination row to quickly open the edit form!

### 2. **Opening Hours Management**
Add business hours for each day of the week.

## 🖱️ How to Use Clickable Rows

### Quick Edit
```
┌─────────────────────────────────────────────────────────┐
│ 🖼️  Eiffel Tower                                  👆 CLICK HERE    │
│     Paris, France                                        │
│     [Adventure] [City]    $299.00    ⭐ 4.8            │
│                                    [📜] [✏️] [🗑️]      │
└─────────────────────────────────────────────────────────┘
```

**What Happens:**
1. Click anywhere on the row
2. Edit form opens instantly
3. All data is pre-filled
4. Make your changes
5. Save!

### Action Buttons Still Work
```
Click Row → Opens Edit Form
Click [📜] → View History
Click [✏️] → Edit (same as row click)
Click [🗑️] → Deactivate
```

## 🕐 Opening Hours Feature

### In the Edit Form

Scroll down to see the new "Opening Hours" section:

```
┌─────────────────────────────────────────┐
│ 🕐 Opening Hours                        │
│ Format: "9:00-18:00" or "Closed"        │
├─────────────────────────────────────────┤
│ Monday     [____________]               │
│ Tuesday    [____________]               │
│ Wednesday  [____________]               │
│ Thursday   [____________]               │
│ Friday     [____________]               │
│ Saturday   [____________]               │
│ Sunday     [____________]               │
└─────────────────────────────────────────┘
```

### Format Examples

**Standard Hours:**
```
9:00-18:00
```

**Split Shift (Lunch Break):**
```
9:00-12:00, 14:00-18:00
```

**Closed:**
```
Closed
(or leave empty)
```

**24/7:**
```
24/7
Open 24 hours
Always open
```

**Custom:**
```
By appointment
Call for hours
Seasonal hours
```

## 📱 Mobile Experience

### On Mobile Devices

**Clickable Rows:**
- ✅ Large touch targets
- ✅ Clear hover state
- ✅ No accidental clicks
- ✅ Smooth animations

**Opening Hours Form:**
- ✅ Stacked layout (1 column)
- ✅ Easy to scroll
- ✅ Touch-friendly inputs
- ✅ Clear labels

## 💡 Pro Tips

### Quick Editing
1. **Click the row** instead of finding the edit button
2. Much faster for frequent edits!
3. Works on both mobile and desktop

### Opening Hours
1. **Leave empty** if closed that day
2. **Copy/paste** for days with same hours
3. **Be consistent** with format (9:00-18:00)
4. **Use text** for special cases ("Closed", "24/7")

### Bulk Updates
1. Click row → Edit
2. Update opening hours
3. Save
4. Click next row → Repeat

## 🎨 Visual Indicators

### Clickable Row
```
Normal:  [Background: default]
Hover:   [Background: muted] + [Cursor: pointer]
Click:   → Opens edit form
```

### Inactive Row
```
Appearance: Greyed out (50% opacity)
Click:      Still opens edit form
Actions:    Only "Reactivate" button available
```

## 🔧 Technical Implementation

### Row Click Handler
```typescript
<tr
  onClick={() => onEdit(destination)}
  className="cursor-pointer hover:bg-muted/30"
>
```

### Button Click Handler
```typescript
<Button
  onClick={(e) => {
    e.stopPropagation(); // Prevents row click
    onDelete(destination);
  }}
>
```

### Opening Hours State
```typescript
const [openingHours, setOpeningHours] = useState<OpeningHours>({
  monday: "",
  tuesday: "",
  // ... etc
});
```

## ⚠️ Important Notes

### Before Using
1. **Apply database migration first!**
   - Go to Supabase SQL Editor
   - Run the migration SQL
   - Verify column exists

2. **Restart backend server**
   - Stop current server
   - Run `npm run dev` or `yarn dev`
   - Wait for server to start

### Behavior
- **Row click:** Opens edit form (not view mode)
- **Empty hours:** Automatically filtered out
- **Invalid format:** No validation yet (future enhancement)
- **Time zones:** Not supported yet (future enhancement)

## 🎯 Common Use Cases

### Restaurant
```
Monday-Thursday:  11:30-14:00, 18:00-22:00
Friday:           11:30-14:00, 18:00-23:00
Saturday:         12:00-23:00
Sunday:           12:00-22:00
```

### Museum
```
Tuesday-Sunday:   10:00-18:00
Monday:           Closed
```

### Hotel (24/7)
```
All days:         24/7
```

### Shop
```
Monday-Friday:    9:00-19:00
Saturday:         9:00-17:00
Sunday:           Closed
```

### Seasonal Business
```
All days:         Summer: 8:00-20:00, Winter: 9:00-17:00
```

## 🐛 Troubleshooting

### "Opening hours not appearing in form"
- Migration not applied → Apply SQL migration
- Backend not updated → Restart server
- Cache issue → Hard refresh browser (Ctrl+Shift+R)

### "Row click not working"
- JavaScript error → Check browser console
- Event handler missing → Verify code updated
- Button click interfering → Check stopPropagation

### "Hours not saving"
- Backend error → Check server logs
- Validation error → Check data format
- Database error → Verify migration applied

## 📞 Quick Reference

| Action | How To |
|--------|--------|
| Quick edit | Click destination row |
| Add hours | Fill in opening hours fields |
| Closed day | Leave field empty |
| 24/7 | Type "24/7" |
| Split shift | Use comma: "9:00-12:00, 14:00-18:00" |
| View history | Click history button (📜) |
| Deactivate | Click trash button (🗑️) |

## ✨ Summary

**Two Major Improvements:**

1. **Clickable Rows** 
   - Click anywhere on row to edit
   - Faster workflow
   - Better UX

2. **Opening Hours**
   - 7 input fields (one per day)
   - Flexible format
   - Optional fields
   - Mobile-friendly

**Result:** More efficient destination management with better user experience!

---

**🎊 Ready to use! Apply the migration and start adding opening hours!**
