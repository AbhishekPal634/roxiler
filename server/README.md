# Store Rating Platform - Backend API

A robust, role-based store rating platform backend built with Node.js, Express.js, and PostgreSQL with AWS RDS support.

## Features

- **JWT Authentication** with role-based access control
- **Three User Roles**: Admin, Normal User, Store Owner
- **Secure Password Handling**: bcrypt hashing with comprehensive validation
- **Input Validation**: Express-validator for all endpoints
- **Token Invalidation**: Secure logout with token blacklisting
- **Advanced Querying**: Filtering, sorting, and search across all resources
- **Cloud Ready**: AWS RDS PostgreSQL support with SSL configuration

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database (local or AWS RDS)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation middleware
- **pg** - PostgreSQL client with connection pooling

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher) - Local or AWS RDS instance

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory:

```env
PORT=3000

# Database Configuration (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password

# Database Configuration (AWS RDS - Alternative)
# DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
# DB_PORT=5432
# DB_NAME=store_rating_db
# DB_USER=postgres
# DB_PASSWORD=your_rds_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
```

**Important Notes:**

- Change `JWT_SECRET` to a secure random string in production
- For AWS RDS, ensure Security Group allows inbound connections on port 5432
- SSL is automatically configured for remote database connections

### 4. Database Setup

Initialize the database tables and create default admin user:

```bash
node src/database/init.js
```

This will:

- Create all necessary tables (users, stores, ratings)
- Set up indexes and foreign key constraints
- Create a default admin account
- Create a database view for stores with ratings

### 5. Start the Server

Development mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

**Health Check:**

```
GET http://localhost:3000/health
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Unified Login Endpoint

**POST** `/api/auth/login`

Universal login endpoint for all user types (Admin, User, Store Owner)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

---

## Admin APIs

Base URL: `/api/admin`

### 1. Add User

**POST** `/api/admin/users`

Add a new user (admin/user/store_owner)

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "name": "This is a long name that meets the minimum requirement",
  "email": "newuser@example.com",
  "password": "Password@123",
  "address": "123 Main Street, City, State, ZIP Code",
  "role": "user"
}
```

### 2. Add Store

**POST** `/api/admin/stores`

Creates a new store and automatically generates a store owner account.

**Request Body:**

```json
{
  "storeName": "My Awesome Store",
  "storeEmail": "store@example.com",
  "storeAddress": "456 Store Avenue, City, State, ZIP",
  "ownerName": "Store Owner Full Name Here",
  "ownerEmail": "owner@example.com",
  "ownerPassword": "Password@123",
  "ownerAddress": "789 Owner Street, City, State, ZIP"
}
```

**Notes:**

- Automatically creates a store owner user account
- Owner name is padded to minimum 20 characters if needed
- Owner account credentials should be shared with the store owner

### 3. Dashboard Statistics

**GET** `/api/admin/dashboard/stats`

Returns total users, stores, and ratings.

### 4. List All Stores

**GET** `/api/admin/stores?name=search&sortBy=rating&sortOrder=DESC`

**Query Parameters:**

- `name` (optional): Search by store name
- `address` (optional): Search by address
- `sortBy` (optional): Sort field (name, email, address, average_rating, created_at)
- `sortOrder` (optional): ASC or DESC

### 5. List All Users

**GET** `/api/admin/users?role=user&sortBy=name&sortOrder=ASC`

**Query Parameters:**

- `name` (optional): Search by name
- `email` (optional): Search by email
- `address` (optional): Search by address
- `role` (optional): Filter by role (admin, user, store_owner)
- `sortBy` (optional): Sort field
- `sortOrder` (optional): ASC or DESC

### 6. View User Details

**GET** `/api/admin/users/:id`

Get detailed information about a specific user.

### 7. Logout

**POST** `/api/admin/logout`

Invalidates the current token.

---

## Normal User APIs

Base URL: `/api/user`

### 1. Signup

**POST** `/api/user/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "This is a long enough name for validation to pass",
  "email": "newuser@example.com",
  "password": "Password@123",
  "address": "123 User Street, User City, User State, 12345"
}
```

**Validation Rules:**

- Name: 20-60 characters
- Email: Valid email format
- Password: 8-16 characters, 1 uppercase, 1 special character
- Address: Max 400 characters

### 2. Login

**POST** `/api/user/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

### 3. Update Password

**PUT** `/api/user/password`

**Headers:**

```
Authorization: Bearer <user_token>
```

**Request Body:**

```json
{
  "currentPassword": "Password@123",
  "newPassword": "NewPassword@456"
}
```

### 4. List All Stores

**GET** `/api/user/stores?name=search&address=location`

**Query Parameters:**

- `name` (optional): Search by store name
- `address` (optional): Search by address

### 5. Submit Rating

**POST** `/api/user/ratings`

**Request Body:**

```json
{
  "store_id": 1,
  "rating": 5
}
```

**Validation:**

- Rating must be between 1-5
- User can only rate a store once

### 6. Update Rating

**PUT** `/api/user/ratings`

**Request Body:**

```json
{
  "store_id": 1,
  "rating": 4
}
```

### 7. Logout

**POST** `/api/user/logout`

---

## Store Owner APIs

Base URL: `/api/store-owner`

### 1. Login

**POST** `/api/store-owner/login`

**Request Body:**

```json
{
  "email": "owner@example.com",
  "password": "Password@123"
}
```

### 2. Update Password

**PUT** `/api/store-owner/password`

**Headers:**

```
Authorization: Bearer <owner_token>
```

### 3. Dashboard

**GET** `/api/store-owner/dashboard`

Get store information, statistics, and list of users who rated the store.

**Response:**

````json
{
  "success": true,
  "data": {
    "store": {
      "id": 1,
      "name": "My Store",
      "email": "store@example.com",
      "address": "Store Address",
      "averageRating": "4.5",
      "totalRatings": 10,
      "createdAt": "2025-12-01T10:00:00Z"
    },
    "ratingsFromUsers": [
      {
        "ratingId": 1,
        "userName": "John Doe Long Name",
        "userEmail": "user@example.com",
        "rating": 5,
        "submittedAt": "2025-12-01T10:00:00Z"
      }
    ]
  }
}
```     "userId": 5,
        "userName": "User Name",
        "userEmail": "user@example.com",
        "rating": 5,
        "submittedAt": "2025-12-01T10:00:00Z",
        "lastUpdated": "2025-12-01T10:00:00Z"
      }
    ]
  }
}
````

### 4. Logout

**POST** `/api/store-owner/logout`

---

## Database Schema

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL CHECK (length(name) >= 20 AND length(name) <= 60),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Constraints:**

- Name: 20-60 characters
- Email: Unique, valid format
- Role: admin | user | store_owner

**Indexes:** email, role

### Stores Table

```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based authentication with configurable expiration
3. **Input Validation**: Comprehensive validation using express-validator
   - Name: 20-60 characters
   - Password: 8-16 characters with uppercase and special character
   - Email: Valid format validation
   - Address: Maximum 400 characters
4. **SQL Injection Prevention**: Parameterized queries with pg library
5. **Role-Based Access Control**: Middleware-based authorization for all protected routes
6. **Token Blacklisting**: Secure logout functionality with invalidated tokens
7. **SSL/TLS Support**: Automatic SSL configuration for remote database connections
8. **Database Constraints**: CHECK constraints on ratings (1-5) and roles
9. **Foreign Key Cascades**: Proper cleanup on user/store deletion
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id)
);
```

**Constraints:**

- Rating: 1-5 (integer)
- One rating per user per store

**Indexes:** store_id, user_id

## Project Structure

```
src/
├── server.js              # Express app configuration and startup
├── controllers/           # Business logic for each domain
│   ├── adminController.js
│   ├── authController.js
│   ├── storeOwnerController.js
│   └── userController.js
├── database/
│   ├── config.js         # PostgreSQL connection pool with SSL
│   └── init.js           # Database initialization script
├── middleware/
│   ├── auth.js           # JWT authentication and authorization
│   └── validation.js     # Input validation rules
├── models/               # Database models and queries
│   ├── Rating.js
│   ├── Store.js
│   └── User.js
├── routes/               # API route definitions
│   ├── admin.js
│   ├── auth.js
│   ├── storeOwner.js
│   └── user.js
└── utils/
    ├── jwt.js            # JWT token generation
    └── tokenBlacklist.js # Token invalidation tracking
```

## Architecture

- **MVC Pattern**: Separation of routes, controllers, and models
- **Middleware Chain**: Authentication → Authorization → Validation → Controller
- **Connection Pooling**: Efficient database connection management
- **Error Handling**: Consistent error responses across all endpoints
- **Modular Design**: Easy to extend with new features

## AWS RDS Deployment Notes

When using AWS RDS PostgreSQL:

1. **Security Group**: Configure inbound rule for PostgreSQL (port 5432)
2. **SSL/TLS**: Automatically enabled in `config.js` for remote connections
3. **Connection String**: Use RDS endpoint as `DB_HOST` in `.env`
4. **Publicly Accessible**: Enable if connecting from local development
5. **Parameter Groups**: Default settings work well for this application

## Testing

Test the API using:

- **Postman** - Full-featured API testing
- **Thunder Client** - VS Code extension
- **cURL** - Command-line testing

Example cURL request:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `.env` credentials are correct
- For AWS RDS, verify Security Group allows your IP
- Check SSL configuration for remote databases

### Authentication Errors

- Ensure JWT_SECRET is set in `.env`
- Verify token format: `Bearer <token>`
- Check token hasn't been blacklisted after logout

### Validation Errors

- Name must be 20-60 characters
- Password must be 8-16 chars with uppercase + special character
- Address maximum 400 characters
- Rating must be 1-5

## License

ISC**JWT Authentication**: Secure token-based authentication 3. **Input Validation**: Comprehensive validation using express-validator 4. **SQL Injection Prevention**: Parameterized queries with pg library 5. **Role-Based Access Control**: Middleware-based authorization 6. **Token Blacklisting**: Logout functionality with invalidated tokens

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

You can test the API using tools like:

- Postman
- Thunder Client (VS Code extension)
- cURL

Example cURL request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@roxiler.com","password":"Admin@123"}'
```

## License

ISC
