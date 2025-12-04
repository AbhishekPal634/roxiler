# Roxiler Backend API

A role-based rating platform backend built with Node.js, Express.js, and PostgreSQL.

## Features

- **JWT Authentication** with role-based access control
- **Three User Roles**: Admin, Normal User, Store Owner
- **Secure Password Handling**: bcrypt hashing with validation
- **Database Best Practices**: Indexing, foreign keys, normalization
- **Input Validation**: Comprehensive validation for all inputs
- **Token Invalidation**: Logout functionality with token blacklisting

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs
- express-validator

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roxiler_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h
```

### 4. Database Setup

First, create the database in PostgreSQL:

```sql
CREATE DATABASE roxiler_db;
```

Then initialize the database tables and seed default admin:

```bash
npm run init-db
```

**Default Admin Credentials:**

- Email: `admin@roxiler.com`
- Password: `Admin@123`

### 5. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication

All API endpoints (except signup and login) require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Common Login Endpoint

**POST** `/api/auth/login`

Login for all user types (Admin, User, Store Owner)

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

**Request Body:**

```json
{
  "name": "My Awesome Store",
  "email": "store@example.com",
  "address": "456 Store Avenue, City, State, ZIP",
  "owner_id": 2
}
```

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

**Request Body:**

```json
{
  "currentPassword": "Password@123",
  "newPassword": "NewPassword@456"
}
```

### 3. Dashboard

**GET** `/api/store-owner/dashboard`

Get store information and list of users who rated the store.

**Response:**

```json
{
  "success": true,
  "data": {
    "store": {
      "id": 1,
      "name": "My Store",
      "email": "store@example.com",
      "address": "Store Address",
      "averageRating": "4.50",
      "totalRatings": 10
    },
    "ratingsFromUsers": [
      {
        "ratingId": 1,
        "userId": 5,
        "userName": "User Name",
        "userEmail": "user@example.com",
        "rating": 5,
        "submittedAt": "2025-12-01T10:00:00Z",
        "lastUpdated": "2025-12-01T10:00:00Z"
      }
    ]
  }
}
```

### 4. Logout

**POST** `/api/store-owner/logout`

---

## Database Schema

### Users Table

- `id` (Primary Key)
- `name` (20-60 chars)
- `email` (unique)
- `password` (hashed)
- `address` (max 400 chars)
- `role` (admin | user | store_owner)
- `created_at`, `updated_at`

**Indexes:** email, role

### Stores Table

- `id` (Primary Key)
- `name`
- `email`
- `address`
- `owner_id` (Foreign Key → users.id)
- `created_at`, `updated_at`

**Indexes:** name, address, owner_id

### Ratings Table

- `id` (Primary Key)
- `user_id` (Foreign Key → users.id)
- `store_id` (Foreign Key → stores.id)
- `rating` (1-5)
- `created_at`, `updated_at`

**Unique Constraint:** (user_id, store_id)
**Indexes:** store_id, user_id

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Comprehensive validation using express-validator
4. **SQL Injection Prevention**: Parameterized queries with pg library
5. **Role-Based Access Control**: Middleware-based authorization
6. **Token Blacklisting**: Logout functionality with invalidated tokens

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
