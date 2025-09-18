# Insights Flow - Dashboard Prototype

A modern, responsive dashboard interface built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Dashboard Interface**: Clean and intuitive design inspired by popular analytics platforms
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Dark Sidebar Navigation**: Professional sidebar with navigation items and organization selector
- **Dashboard Templates**: Pre-built dashboard templates for various use cases:
  - Sales Pipeline
  - Payroll Dashboard
  - E-commerce Analytics
  - Marketing KPIs
  - Executive Overview
- **Advanced Dashboard Builder**: Interactive dashboard creation with:
  - Floating +Add button for easy chart addition
  - Modern chart selection modal with categorized chart types
  - Drag & drop grid layout with auto-resize
  - 18+ chart types including Bar, Line, Pie, Area, Scatter, KPI, Combo, Box, Sankey, Funnel, Gauge, Waterfall, and Maps
  - Blank chart state until data sources are configured
  - Real-time property panel for chart configuration
- **Search Functionality**: Global search bar for finding dashboards
- **User Profile**: Admin profile section with notifications

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Responsive Design**: Mobile-first approach

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
└── components/            # Reusable components
    ├── Sidebar.tsx        # Navigation sidebar
    ├── Header.tsx         # Top header with search
    ├── DashboardGrid.tsx  # Dashboard templates grid
    └── DashboardCard.tsx  # Individual template cards
```

## Key Components

### Sidebar
- Navigation menu with icons
- Active state management
- Organization selector
- Responsive collapse on mobile

### Header
- Welcome message
- Global search functionality
- Notifications bell
- User profile section
- Mobile menu button

### Dashboard Grid
- Responsive grid layout
- Template cards with hover effects
- "Create Dashboard" action card
- Template categories with appropriate icons

### Dashboard Cards
- Consistent design pattern
- Template labels
- Icon integration
- Click handlers for future functionality

## Responsive Design

The dashboard is built with a mobile-first approach:
- **Mobile**: Single column layout, collapsible sidebar
- **Tablet**: Two-column grid, condensed sidebar
- **Desktop**: Three-column grid, full sidebar

## Future Enhancements

- Mobile sidebar toggle functionality
- Dashboard creation workflow
- Template selection and customization
- User authentication and profiles
- Real dashboard data integration
- Advanced search and filtering

## Build

To build the project for production:

```bash
npm run build
```

The build is optimized and ready for deployment.