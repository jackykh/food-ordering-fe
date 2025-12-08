# Food Ordering System - Frontend

A modern food ordering web application built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vitest** - Unit testing

## Prerequisites

- Node.js 18+ and npm

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd food-ordering-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://food-service-v1.vercel.app/api
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── api/              # API service functions
│   └── mock/        # Mock API for development
├── components/       # Reusable UI components
├── pages/           # Page components
├── stores/          # Zustand stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── lib/             # Third-party library configurations
```

## Test Accounts

For testing purposes, you can use these pre-configured accounts:

- Username: `TestUser1`
- Username: `TestUser2`

Or register a new account through the signup page.

## API Integration

The app supports both mock API (for development) and real backend API. To switch between them:

- **Mock API**: Default mode, no backend required
- **Real API**: Set `VITE_API_BASE_URL` to your backend URL

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
