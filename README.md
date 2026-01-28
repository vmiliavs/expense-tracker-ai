# Expense Tracker

A modern, full-featured expense tracking application built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

## Features

### Expense Management
- Add, edit, and delete expenses
- Track date, amount, category, and description
- Form validation with inline error messages
- localStorage persistence (data survives page refreshes)

### Dashboard Analytics
- Total spending overview
- Current month spending summary
- Top spending category
- Interactive line chart showing spending over time
- Pie chart for category breakdown
- Recent expenses list with quick access

### Advanced Filtering
- Filter by category (Food, Transportation, Entertainment, Shopping, Bills, Other)
- Date range filtering
- Search by description (with 300ms debounce)
- Clear all filters with one click

### Data Export
- Export expenses to CSV format
- Includes all expense details
- Timestamped filename

### User Experience
- Responsive design (mobile, tablet, desktop)
- Professional, clean interface
- Modal dialogs for forms
- Color-coded categories
- Loading states and error handling
- Empty states with helpful messages

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks + localStorage
- **Font**: Inter (Google Fonts)

## Project Structure

```
src/
├── app/                      # Next.js pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard page
│   ├── expenses/page.tsx    # Expenses list page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Header and Navigation
│   ├── expenses/            # Expense-specific components
│   ├── dashboard/           # Dashboard components
│   └── export/              # Export functionality
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and helpers
├── types/                   # TypeScript type definitions
└── constants/               # App constants
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Adding an Expense

1. Click "Add Expense" button in the header
2. Fill in the form:
   - **Date**: Required (YYYY-MM-DD format)
   - **Amount**: Required (must be > 0)
   - **Category**: Required (select from dropdown)
   - **Description**: Required (1-200 characters)
3. Click "Add Expense" to save

### Editing an Expense

1. Go to Expenses page
2. Click "Edit" button on any expense
3. Modify fields as needed
4. Click "Update Expense"

### Deleting an Expense

1. Go to Expenses page
2. Click "Delete" button on any expense
3. Confirm deletion in the dialog

### Filtering Expenses

1. Go to Expenses page
2. Use the filter controls:
   - Select a category from the dropdown
   - Set start and end dates for date range
   - Type in the search box to filter by description
3. Click "Clear Filters" to reset

### Exporting Data

1. Click "Export to CSV" button on Dashboard or Expenses page
2. CSV file will download automatically with format:
   ```
   Date,Category,Amount,Description
   ```

## Data Storage

The app uses browser localStorage to persist data:
- **Key**: `expenses`
- **Format**: JSON array of expense objects
- **Location**: Browser localStorage (survives page refreshes)
- **Limitation**: Subject to browser storage quota (~5-10MB)

## Categories

Six predefined categories with distinct colors:
- **Food** - Green
- **Transportation** - Blue
- **Entertainment** - Purple
- **Shopping** - Pink
- **Bills** - Red
- **Other** - Gray

## Responsive Breakpoints

- **Mobile**: < 640px - Single column layout
- **Tablet**: 640px - 1024px - Two column grids
- **Desktop**: > 1024px - Three column grids

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires JavaScript and localStorage support.

## License

MIT

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use.
