# Store Rating Platform - Frontend

A modern, responsive frontend for a role-based store rating platform built with React and Material UI.

## Tech Stack

- **React 19** with Vite
- **Material UI v7.3.6** - Complete UI component library
- **Tailwind CSS v4.1** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **Context API** - State management and authentication

## Features

- JWT-based authentication with token management
- Role-based access control (Admin, User, Store Owner)
- Clean, minimal Material UI design with monotone gray theme
- Fully responsive layout
- Form validation with helpful error messages
- Toast notifications for user feedback
- Protected routes by user role
- Consistent loading states with CircularProgress

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend expects the backend server to run on port 3000 by default.

### 3. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` directory.

## User Roles & Features

### Admin

- **Dashboard**: View total users, stores, and average ratings
- **Manage Users**: Add users, search/filter by name or email, sort by any column
- **Manage Stores**: Create stores with auto-generated owner accounts, view ratings
- **User Details**: View detailed information including store ratings for owners
- **Profile**: Update account password

### Normal User

- **Browse Stores**: View all available stores with ratings
- **Search & Filter**: Find stores by name or address
- **Rate Stores**: Submit ratings from 1-5 stars
- **Update Ratings**: Modify previously submitted ratings
- **Profile**: Update account password

### Store Owner

- **Dashboard**: View store details, average rating, and total ratings
- **Recent Ratings**: See all user ratings with names, emails, and submission dates
- **Profile**: Update account password

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── context/         # AuthContext for authentication state
├── pages/           # Page components organized by role
│   ├── admin/       # Admin dashboard, users, stores
│   ├── owner/       # Owner dashboard
│   ├── user/        # User stores page
│   └── Profile.jsx  # Shared profile page
├── utils/           # API configuration and helpers
└── theme.js         # Material UI theme configuration
```

## Authentication Flow

1. User logs in via `/login` or signs up via `/signup`
2. JWT token is stored in localStorage
3. Token is included in all API requests via Axios interceptor
4. Protected routes check user role before rendering
5. Unauthorized access redirects to appropriate pages

## Design System

- **Theme**: Monotone gray palette with subtle accents
- **Typography**: Roboto font family
- **Components**: Material UI v7.3.6 with custom styling
- **Layout**: Tailwind CSS for spacing and responsive design
- **Loading States**: Consistent CircularProgress indicators

## Notes

- Ensure the backend server is running before starting the frontend
- Backend must be accessible at the URL specified in `.env`
- All form validations match backend requirements:
  - Names: 20-60 characters
  - Passwords: 8-16 characters with uppercase and special character
  - Addresses: Maximum 400 characters
- Tables support sorting by clicking column headers
- Search filters work across all list views
