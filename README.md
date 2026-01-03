# Kinxplore Admin Panel

A modern SaaS admin panel for managing Kinxplore destinations with full CRUD operations and archive history.

## Features

- 🎨 **Modern UI/UX**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- ✨ **Full CRUD Operations**: Create, Read, Update, and Delete destinations
- 📊 **Real-time Statistics**: Dashboard with key metrics
- 🔍 **Advanced Search & Filters**: Quickly find destinations
- 📝 **Archive History**: Complete audit trail of all modifications
- 🌐 **Multi-language Support**: English, French, and Dutch
- 🌓 **Dark Mode**: Automatic theme switching
- 🔄 **Real-time Updates**: Powered by React Query

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **API Client**: Axios
- **Internationalization**: next-intl
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ or Yarn
- Backend API running (kinxplore-backend)

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       └── (pages)/
│           ├── destinations/     # Main admin page
│           └── page.tsx          # Home (redirects to destinations)
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── DestinationsTable.tsx # Table with search & filters
│   │   ├── DestinationForm.tsx   # Create/Edit form
│   │   └── ArchiveHistory.tsx    # History viewer
│   └── ui/                       # Reusable UI components
├── hooks/
│   ├── useDestinations.ts        # Destination API hooks
│   └── useCategories.ts          # Category API hooks
├── lib/
│   ├── api.ts                    # API client & types
│   └── utils.ts                  # Utility functions
└── messages/                     # Translations (en, fr, nl)
```

## Features Overview

### Dashboard

- **Statistics Cards**: Total destinations, average price, average rating
- **Quick Actions**: Create new destinations
- **Search & Filter**: Real-time search across all fields

### Destinations Management

- **Table View**: Comprehensive list with images, categories, prices, and ratings
- **CRUD Operations**:
  - Create: Add new destinations with categories
  - Read: View all destination details
  - Update: Edit existing destinations
  - Delete: Remove destinations (with confirmation)

### Archive History

- **Complete Audit Trail**: Track all CREATE, UPDATE, and DELETE operations
- **Detailed Information**: Who made changes, when, and what changed
- **Per-Destination History**: View history for specific destinations
- **Global History**: See all changes across all destinations

### Categories

- **Parent Categories**: Main destination types
- **Subcategories**: Detailed classification
- **Multi-Category Support**: Assign multiple categories per destination

## API Integration

The admin panel connects to the backend API:

- `GET /api/destinations` - List all destinations
- `POST /api/admin/destinations` - Create destination
- `PUT /api/admin/destinations/:id` - Update destination
- `DELETE /api/admin/destinations/:id` - Delete destination
- `GET /api/admin/destinations/history/:id` - Get destination history
- `GET /api/admin/destinations/history` - Get all history

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5001` |

## Development

### Code Quality

```bash
# Lint code
yarn lint

# Format code
yarn format
```

### Build

```bash
# Production build
yarn build

# Start production server
yarn start
```

## UI/UX Best Practices

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Clear feedback during API operations
- **Error Handling**: User-friendly error messages with toast notifications
- **Confirmation Dialogs**: Prevent accidental deletions
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Visual Feedback**: Hover states, transitions, and animations
- **Consistent Design**: Unified color scheme and spacing

## License

MIT

## Author

Julien Matondo
