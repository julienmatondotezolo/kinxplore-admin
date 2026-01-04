# Category Management - Quick Start Guide

## 🚀 Getting Started

### Access the Category Management Page

1. **From Main Dashboard:**
   - Click the "Categories" button in the top-right header
   - Or navigate directly to `/categories`

2. **What You'll See:**
   - 3 stat cards showing category counts
   - Tabbed interface (Parent Categories / Subcategories)
   - Search bar and create button
   - Table with all categories

## 📝 Common Tasks

### Create a Parent Category

1. Make sure you're on the "Parent Categories" tab
2. Click "Create Parent" button
3. Enter category name (e.g., "Adventure", "Culture", "Food & Drink")
4. Click "Create Parent Category"
5. ✅ Done! Category appears in table

### Create a Subcategory

1. Switch to "Subcategories" tab
2. Click "Create Subcategory" button
3. Select parent category from dropdown
4. Enter subcategory name (e.g., "Hiking", "Museums", "Local Cuisine")
5. Click "Create Subcategory"
6. ✅ Done! Subcategory appears in table

### Edit a Category

1. Find the category in the table
2. Click the edit icon (pencil)
3. Modify the name
4. Click "Update"
5. ✅ Done! Changes saved

### Deactivate a Category

1. Find the active category
2. Click the trash icon
3. Confirm in the dialog
4. ✅ Done! Category is now inactive (greyed out)

**Note:** Deactivating a parent category will also deactivate all its subcategories!

### Reactivate a Category

1. Find the inactive category (greyed out with "Inactive" badge)
2. Click the green "Reactivate" button
3. ✅ Done! Category is active again

**Note:** You can only reactivate a subcategory if its parent is active.

## 🔍 Search and Filter

### Search Categories
- Type in the search bar at the top
- Searches across category names
- Works on both tabs
- Real-time filtering

## 📊 Understanding the Stats

### Total Categories
- Sum of active parent categories + active subcategories
- Only counts active items

### Parent Categories
- Number of active parent categories
- Inactive parents not counted

### Subcategories
- Number of active subcategories
- Inactive subs not counted

## 🎨 Visual Indicators

### Active Category
- ✅ Full color
- ✅ Normal opacity
- ✅ No special badge
- 🔧 Actions: Edit, Delete

### Inactive Category
- ⚫ Greyed out (50% opacity)
- ~~Strikethrough text~~
- 🏷️ "Inactive" badge
- 🔄 Actions: Reactivate only

### Parent Category
- 🔵 Blue icon (FolderTree)
- Shows subcategory count

### Subcategory
- 🟣 Purple icon (Tag)
- Shows parent category badge

## ⚠️ Important Rules

### Deactivation
- ✅ Can deactivate any active category
- ⚠️ Deactivating a parent deactivates ALL its subcategories
- ✅ Action is reversible (can reactivate later)
- ✅ Inactive categories hidden from public API

### Reactivation
- ✅ Can reactivate any inactive parent category
- ❌ Cannot reactivate subcategory if parent is inactive
- ✅ Must reactivate parent first, then subcategories

### Creation
- ✅ Parent categories can be created anytime
- ✅ Subcategories need an active parent
- ❌ Cannot create subcategory under inactive parent

## 🔔 Notifications

All actions show toast notifications:
- ✅ Green toast = Success
- ❌ Red toast = Error
- ℹ️ Message explains what happened

## 🐛 Troubleshooting

### "Failed to load categories"
- Check if backend server is running
- Verify API URL in environment variables
- Click "Retry" button

### "Parent category not found or is inactive"
- Parent was deactivated
- Reactivate parent first
- Then try again

### "Cannot reactivate subcategory: parent category is inactive"
- Parent must be active first
- Go to Parent Categories tab
- Reactivate the parent
- Then reactivate subcategory

### Search not working
- Clear search term and try again
- Check spelling
- Try searching in both tabs

## 💡 Tips & Tricks

### Organizing Categories
1. **Start with broad parent categories**
   - Adventure, Culture, Food & Drink, Nature, etc.

2. **Add specific subcategories**
   - Under Adventure: Hiking, Water Sports, Extreme Sports
   - Under Culture: Museums, Historical Sites, Art Galleries
   - Under Food & Drink: Local Cuisine, Fine Dining, Street Food

3. **Keep names clear and concise**
   - Use title case
   - Avoid abbreviations
   - Be consistent

### Managing Large Lists
1. **Use search** to find specific categories quickly
2. **Check stats** to see how many categories you have
3. **Deactivate unused** categories instead of deleting
4. **Reactivate seasonal** categories when needed

### Before Deactivating
1. **Check subcategory count** on parent categories
2. **Consider impact** on destinations using this category
3. **Use confirmation dialog** carefully
4. **Remember:** You can always reactivate!

## 🎯 Best Practices

### Naming Conventions
- ✅ Use clear, descriptive names
- ✅ Use title case (e.g., "Water Sports")
- ✅ Keep it concise (2-3 words max)
- ❌ Avoid special characters
- ❌ Don't use abbreviations

### Category Structure
- ✅ Create logical parent-child relationships
- ✅ Keep hierarchy shallow (1 level)
- ✅ Group related subcategories under same parent
- ❌ Don't create too many parent categories
- ❌ Don't duplicate subcategories across parents

### Maintenance
- ✅ Review categories regularly
- ✅ Deactivate unused categories
- ✅ Consolidate similar categories
- ✅ Keep naming consistent
- ✅ Update as needed

## 📱 Keyboard Shortcuts

Currently not implemented, but planned:
- `Ctrl/Cmd + K` - Focus search
- `Ctrl/Cmd + N` - New category
- `Escape` - Close dialogs

## 🔗 Related Pages

- **Main Dashboard** - `/` - Manage destinations
- **Categories** - `/categories` - You are here!

## 📞 Need Help?

If you encounter issues:
1. Check this guide first
2. Review error messages
3. Check backend logs
4. Verify database connection
5. Contact system administrator

## 🎉 Quick Reference

| Action | Steps | Result |
|--------|-------|--------|
| Create Parent | Click "Create Parent" → Enter name → Submit | New parent category |
| Create Sub | Click "Create Subcategory" → Select parent → Enter name → Submit | New subcategory |
| Edit | Click edit icon → Modify → Submit | Updated category |
| Deactivate | Click trash → Confirm | Inactive category |
| Reactivate | Click "Reactivate" | Active category |
| Search | Type in search bar | Filtered results |

## ✨ Pro Tips

1. **Create parent categories first** before adding subcategories
2. **Use the search** when you have many categories
3. **Check the stats** to monitor your category count
4. **Deactivate instead of delete** to preserve data
5. **Plan your structure** before creating many categories
6. **Use consistent naming** for better organization
7. **Review inactive categories** periodically
8. **Reactivate seasonal categories** as needed

---

**Happy Organizing! 🎉**
