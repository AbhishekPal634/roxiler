# Store Rating Platform - Frontend

A clean, minimal frontend for a role-based store rating platform built with React, Tailwind CSS v4.1, and Chakra UI.

## Tech Stack

- **React** (Vite)
- **React Router v6**
- **Tailwind CSS v4.1** (layout + styling)
- **Chakra UI** (modals, inputs, buttons, toasts)
- **Axios** (API requests)
- **Context API** (authentication)

## Features

- JWT-based authentication
- Role-based routing (Admin, User, Store Owner)
- Clean, minimal UI design
- Responsive layout
- Input validation
- Toast notifications
- Protected routes

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The frontend is configured to connect to the backend at `http://localhost:5000/api`.

If your backend runs on a different URL, update the `API_BASE_URL` in `src/utils/api.js`.

### 3. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or another available port).

### 4. Build for Production

```bash
npm run build
```

## User Roles & Features

### Admin

- Dashboard: View total users, stores, and ratings
- Manage Users: Add, filter, search, and view users
- Manage Stores: Add stores, assign owners, view ratings
- Profile: Update password

### Normal User

- Browse Stores: Search by name or address
- Rate Stores: Submit 1-5 star ratings
- Update Ratings: Modify existing ratings
- Profile: Update password

### Store Owner

- Dashboard: View store info and average rating
- View Ratings: See all users who rated the store
- Profile: Update password

## Default Credentials

After backend setup, you can login with:

**Admin:**

- Email: `admin@roxiler.com`
- Password: `Admin@123`

**Create User Account:**

- Use the signup page to create a normal user account

## Notes

- Ensure the backend server is running before starting the frontend
- The frontend expects the backend to be at `http://localhost:5000`
- All passwords must meet validation requirements (8-16 chars, uppercase, special char)
- User names must be 20-60 characters
- Addresses have a 400 character limit
