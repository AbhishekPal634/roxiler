# Store Rating Platform

A full-stack web application that enables users to submit and manage ratings for registered stores. The platform features role-based access control with three distinct user types: System Administrator, Normal User, and Store Owner.

## Project Overview

This application implements a comprehensive store rating system with:

- **Unified Authentication**: Single login system for all user roles
- **Role-Based Access**: Customized dashboards and functionalities based on user type
- **Rating System**: 1-5 star ratings with average calculations
- **Advanced Filtering**: Search and sort capabilities across all data tables
- **Secure Architecture**: JWT authentication, password hashing, and input validation
- **Cloud Ready**: AWS RDS PostgreSQL support with SSL/TLS

## Architecture

```
roxiler/
├── client/          # React 19 + Material UI v7.3.6 frontend
├── server/          # Node.js + Express.js + PostgreSQL backend
└── README.md        # This file
```

**For detailed setup and API documentation, see:**

- [Client README](./client/README.md) - Frontend setup, features, and project structure
- [Server README](./server/README.md) - Backend API, database schema, and deployment

## 👥 User Roles & Features

### System Administrator

- Add new stores with automatic owner account creation
- Add normal users and admin users
- Dashboard with statistics (total users, stores, ratings)
- View and filter all stores (Name, Email, Address, Rating)
- View and filter all users (Name, Email, Address, Role)
- View detailed user information including store ratings for owners
- Sortable tables with ascending/descending order
- Update account password
- Secure logout

### Normal User

- Self-registration with signup form
- Browse all registered stores
- Search stores by Name and Address
- View store details (Name, Address, Overall Rating)
- Submit ratings (1-5 stars) for stores
- Update previously submitted ratings
- View personal rating history
- Update account password
- Secure logout

### Store Owner

- Dedicated dashboard with store statistics
- View average rating and total rating count
- See list of users who rated the store
- View individual ratings with user details
- Update account password
- Secure logout

## Form Validations

All forms implement strict validation rules:

- **Name**: 20-60 characters
- **Email**: Standard email format validation
- **Password**: 8-16 characters with at least one uppercase letter and one special character
- **Address**: Maximum 400 characters
- **Rating**: Integer value between 1-5

## Technology Stack

### Frontend

- React 19 with Vite
- Material UI v7.3.6
- Tailwind CSS v4.1
- React Router v6
- Axios
- Context API

### Backend

- Node.js
- Express.js
- PostgreSQL (AWS RDS support)
- JWT Authentication
- bcryptjs
- express-validator

### Database

- PostgreSQL 12+
- Connection pooling with pg
- SSL/TLS for remote connections
- Indexed queries for performance
- Foreign key constraints

## Quick Start

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+) or AWS RDS instance
- npm or yarn

### 1. Clone Repository

```bash
git clone https://github.com/AbhishekPal634/roxiler.git
cd roxiler
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

Initialize database:

```bash
node src/database/init.js
```

Start server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Database Schema

### Users Table

- Stores admin, normal users, and store owners
- Indexed on email and role
- Password hashing with bcryptjs

### Stores Table

- Store information with owner reference
- Foreign key to users table
- Indexed on name and address

### Ratings Table

- User ratings for stores (1-5)
- Unique constraint: one rating per user per store
- Indexed on user_id and store_id

### Database View

- `stores_with_ratings`: Aggregated view with average ratings

## Key Features Implemented

- Single unified login endpoint for all roles
- Role-based dashboard customization
- Self-service user registration
- Advanced search and filtering on all tables
- Sortable columns (ascending/descending)
- Real-time rating updates
- Comprehensive form validation
- JWT token blacklisting on logout
- Password update functionality for all roles
- Responsive Material UI design
- Consistent loading states and error handling
- AWS RDS PostgreSQL support

## Security Features

- JWT-based authentication
- bcrypt password hashing
- Input validation on all endpoints
- SQL injection prevention
- Role-based authorization middleware
- Token blacklisting for logout
- SSL/TLS database connections
- CORS configuration
- Environment variable protection

## 📖 Best Practices Followed

### Backend

- MVC architecture pattern
- Separation of concerns (routes, controllers, models)
- Database connection pooling
- Parameterized queries
- Comprehensive error handling
- RESTful API design
- Middleware-based authentication
- Database indexing for performance

### Frontend

- Component-based architecture
- Protected route implementation
- Centralized API configuration
- Context API for state management
- Material UI theming
- Responsive design patterns
- Consistent error handling
- Loading state management

### Database

- Normalized schema design
- Foreign key constraints
- Check constraints on fields
- Indexed columns for performance
- Database views for complex queries
- Cascade deletes for referential integrity

## License

ISC

## Author

**Abhishek Pal**

- GitHub: [@AbhishekPal634](https://github.com/AbhishekPal634)

## Documentation

For detailed information:

- **Frontend**: See [client/README.md](./client/README.md)
- **Backend**: See [server/README.md](./server/README.md)

---

**Note**: This project was built following all specified requirements including form validations, role-based access control, and database best practices.
