# Personal Finance Advisor Frontend

A modern, responsive frontend for the Personal Finance Advisor application built with React, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Dashboard**: Beautiful, responsive dashboard that works on all devices
- **Financial Overview**: Summary cards showing key financial metrics
- **Recent Transactions**: List of recent financial transactions with filtering
- **Spending Analysis**: Visual breakdown of spending by category
- **Trend Analysis**: Monthly income vs expenses and savings rate trends
- **Smooth Animations**: Engaging animations powered by Framer Motion
- **Data Visualization**: Interactive charts using Recharts

## Tech Stack

- **React 19**: Latest version of React for building the UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **Recharts**: Composable charting library for data visualization
- **React Query**: Data fetching and state management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   └── ui/           # Generic UI components
│   ├── features/         # Feature-specific code
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── routes/           # Routing configuration
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── public/               # Public assets
└── package.json          # Dependencies and scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Dashboard Components

- **SummarySection**: Displays financial overview with key metrics
- **RecentTransactions**: Shows recent financial transactions
- **SpendingByCategory**: Visualizes spending breakdown by category
- **MonthlyTrend**: Displays monthly income vs expenses and savings rate trends

## API Integration

The frontend integrates with the following API endpoints:

- `/api/dashboard/summary`: Get financial summary
- `/api/dashboard/recent`: Get recent transactions
- `/api/dashboard/spending-by-category`: Get spending by category
- `/api/dashboard/monthly-trend`: Get monthly financial trends

## Responsive Design

The dashboard is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktops
- Large screens

## Animations

The application uses Framer Motion for smooth animations:
- Page transitions
- Component mounting/unmounting
- Data updates
- Interactive elements
