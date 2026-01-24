# Table Sorting Feature

## Overview

Added comprehensive sorting functionality to all sortable columns in both the Destinations and Categories tables. Users can now sort data by clicking on column headers, with visual indicators showing the current sort state.

## Features

### 1. **Destinations Table Sorting**

Sortable columns:
- **Name**: Alphabetical sorting (A-Z or Z-A)
- **Location**: Alphabetical sorting by location
- **Price**: Numerical sorting (low to high or high to low)
- **Rating**: Numerical sorting (low to high or high to low)

Non-sortable columns:
- **Categories**: Not sortable (too complex for meaningful sorting)
- **Actions**: Not sortable (contains buttons)

### 2. **Categories Table Sorting**

#### Parent Categories Tab
Sortable columns:
- **Name**: Alphabetical sorting (A-Z or Z-A)
- **Subcategories**: Numerical sorting by count
- **Created**: Date sorting (oldest to newest or newest to oldest)

Non-sortable columns:
- **Status**: Not sortable
- **Actions**: Not sortable

#### Subcategories Tab
Sortable columns:
- **Name**: Alphabetical sorting (A-Z or Z-A)
- **Parent Category**: Alphabetical sorting by parent name
- **Created**: Date sorting (oldest to newest or newest to oldest)

Non-sortable columns:
- **Status**: Not sortable
- **Actions**: Not sortable

## User Experience

### Sort Behavior
1. **First Click**: Sorts in ascending order (A-Z, low to high, oldest to newest)
2. **Second Click**: Sorts in descending order (Z-A, high to low, newest to oldest)
3. **Third Click**: Resets to default order (no sorting)

### Visual Indicators
- **Unsorted Column**: Shows `ArrowUpDown` icon (faded)
- **Ascending Sort**: Shows `ArrowUp` icon (active)
- **Descending Sort**: Shows `ArrowDown` icon (active)
- **Active Column**: Icon is fully visible
- **Inactive Column**: Icon is at 50% opacity

### Interactive Elements
- Column headers with sorting are clickable buttons
- Hover effect on sortable headers (text color changes to primary)
- Sort status displayed in stats footer (e.g., "• Sorted by name (asc)")

## Implementation Details

### State Management

#### Destinations Table
```typescript
const [sortColumn, setSortColumn] = useState<SortColumn>(null);
const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

type SortColumn = "name" | "location" | "price" | "rating" | null;
type SortDirection = "asc" | "desc";
```

#### Categories Table
```typescript
// Separate state for parent and subcategory tables
const [parentSortColumn, setParentSortColumn] = useState<ParentSortColumn>(null);
const [subSortColumn, setSubSortColumn] = useState<SubSortColumn>(null);
const [parentSortDirection, setParentSortDirection] = useState<SortDirection>("asc");
const [subSortDirection, setSubSortDirection] = useState<SortDirection>("asc");

type ParentSortColumn = "name" | "subcategories" | "created" | null;
type SubSortColumn = "name" | "parent" | "created" | null;
```

### Sorting Logic

#### String Comparison
```typescript
compareResult = a.name.localeCompare(b.name);
```
Uses `localeCompare` for proper alphabetical sorting with internationalization support.

#### Numerical Comparison
```typescript
compareResult = (a.price || 0) - (b.price || 0);
```
Handles missing values by defaulting to 0.

#### Date Comparison
```typescript
compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
```
Converts dates to timestamps for accurate comparison.

#### Direction Handling
```typescript
return sortDirection === "asc" ? compareResult : -compareResult;
```
Negates the result for descending order.

### Data Flow

1. **Filter**: Search term filters the data
2. **Sort**: Filtered data is sorted based on active column and direction
3. **Render**: Sorted data is displayed in the table

```typescript
// Filter destinations
const filteredDestinations = destinations.filter(/* ... */);

// Sort destinations
const sortedDestinations = [...filteredDestinations].sort(/* ... */);

// Render
sortedDestinations.map((destination) => /* ... */);
```

### Sort Handler

```typescript
const handleSort = (column: SortColumn) => {
  if (sortColumn === column) {
    // Toggle direction or reset
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortColumn(null);
      setSortDirection("asc");
    }
  } else {
    setSortColumn(column);
    setSortDirection("asc");
  }
};
```

### Sort Icon Component

```typescript
const SortIcon = ({ column }: { column: SortColumn }) => {
  if (sortColumn !== column) {
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  }
  return sortDirection === "asc" ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  );
};
```

## Technical Specifications

### Icons Used
- `ArrowUpDown`: Default state (lucide-react)
- `ArrowUp`: Ascending sort
- `ArrowDown`: Descending sort

### Styling
- Button styling: `flex items-center gap-2 hover:text-primary transition-colors`
- Icon sizing: `h-4 w-4` (responsive: `h-3 w-3 sm:h-4 sm:w-4` for mobile)
- Opacity: `opacity-50` for inactive state

### Accessibility
- Semantic HTML: Uses `<button>` elements for clickable headers
- Clear visual feedback: Icon changes on hover and when active
- Keyboard navigable: All sort buttons are focusable

## Performance Considerations

### Array Copying
```typescript
const sortedDestinations = [...filteredDestinations].sort(/* ... */);
```
Creates a new array before sorting to avoid mutating the original filtered array.

### Memoization Opportunity
For very large datasets, consider using `useMemo` to prevent unnecessary re-sorting:
```typescript
const sortedDestinations = useMemo(() => {
  return [...filteredDestinations].sort(/* ... */);
}, [filteredDestinations, sortColumn, sortDirection]);
```

## File Changes

### Modified Files

1. **`/src/components/admin/DestinationsTable.tsx`**
   - Added sort state management
   - Added sort icons import
   - Implemented `handleSort` function
   - Created `SortIcon` component
   - Updated table headers with sort buttons
   - Updated data rendering to use `sortedDestinations`
   - Added sort status to stats footer

2. **`/src/components/admin/CategoriesTable.tsx`**
   - Added sort state management (separate for parent and subcategories)
   - Added sort icons import
   - Implemented `handleParentSort` and `handleSubSort` functions
   - Created `ParentSortIcon` and `SubSortIcon` components
   - Updated both table headers with sort buttons
   - Updated data rendering to use `sortedParents` and `sortedSubs`
   - Updated stats counters to use sorted data

## User Benefits

### For Administrators
1. **Quick Data Analysis**: Sort by any metric to identify patterns
2. **Efficient Navigation**: Find specific entries more easily
3. **Data Validation**: Verify data ranges and outliers
4. **Better Decision Making**: Compare values across entries

### Common Use Cases
- **Find cheapest/most expensive destinations**: Sort by price
- **Identify highest/lowest rated destinations**: Sort by rating
- **Organize alphabetically**: Sort by name or location
- **Review recent additions**: Sort by created date (descending)
- **Check subcategory distribution**: Sort parent categories by subcategory count

## Future Enhancements

Potential improvements for future iterations:

1. **Persist Sort State**: Save sort preferences in localStorage
2. **Multi-Column Sorting**: Hold Shift to sort by multiple columns
3. **Custom Sort Orders**: Allow users to define custom sort priorities
4. **Sort Indicators in Stats**: Show sort statistics (e.g., "showing highest to lowest")
5. **Keyboard Shortcuts**: Add keyboard shortcuts for sorting (e.g., Alt+N for name sort)
6. **Export Sorted Data**: Export data in the current sort order
7. **Sort Presets**: Save and load commonly used sort configurations

## Testing Checklist

### Destinations Table
- [ ] Click "Name" header sorts alphabetically
- [ ] Click "Location" header sorts by location
- [ ] Click "Price" header sorts numerically
- [ ] Click "Rating" header sorts numerically
- [ ] Second click reverses sort order
- [ ] Third click resets to default order
- [ ] Sort icons update correctly
- [ ] Stats footer shows current sort
- [ ] Sorting works with search filter
- [ ] Empty values are handled correctly

### Categories Table
- [ ] Parent categories sort by name
- [ ] Parent categories sort by subcategory count
- [ ] Parent categories sort by created date
- [ ] Subcategories sort by name
- [ ] Subcategories sort by parent category
- [ ] Subcategories sort by created date
- [ ] Sort state is independent between tabs
- [ ] Sort icons update correctly in both tabs
- [ ] Stats cards reflect sorted data
- [ ] Sorting works with search filter

### General
- [ ] No console errors
- [ ] Performance is acceptable with large datasets
- [ ] Hover effects work on all sortable headers
- [ ] Icons are responsive on mobile devices
- [ ] Sorting preserves inactive/active status display

## Conclusion

The table sorting feature significantly enhances the admin panel's usability by allowing administrators to organize and analyze data according to their needs. The implementation is consistent across all tables, uses clear visual indicators, and follows UX best practices for sorting interactions.

The three-state sorting system (ascending → descending → unsorted) provides flexibility while keeping the interface clean and predictable.
