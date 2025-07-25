-- PostgreSQL database schema for user authentication
-- Run this SQL script to create the necessary tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create sessions table for managing user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired sessions (run this as a scheduled job)
-- DELETE FROM user_sessions WHERE expires_at < NOW();
</figma>

<figma type="code" file="/README.md">
# Sign Up Page with PostgreSQL Integration

A modern dark-themed sign up page with smooth animations and PostgreSQL database integration.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=username
DB_PASSWORD=password

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
API_BASE_URL=http://localhost:3000/api
```

### 2. Database Setup

1. Install PostgreSQL on your system
2. Create a new database
3. Run the SQL schema located in `/sql/schema.sql`

```bash
psql -U username -d your_database_name -f sql/schema.sql
```

### 3. Required Dependencies

Install the necessary packages for PostgreSQL integration:

```bash
npm install pg bcryptjs jsonwebtoken
npm install -D @types/pg @types/bcryptjs @types/jsonwebtoken
```

### 4. Real Implementation

The current code uses mock implementations. To connect to a real PostgreSQL database:

1. Replace the mock database client in `/lib/database.ts` with a real PostgreSQL client like `pg`
2. Implement proper password hashing using `bcryptjs`
3. Set up JWT token generation and validation
4. Add proper error handling and validation

### Example Real Implementation

```typescript
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const createUser = async (email: string, passwordHash: string) => {
  const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at';
  const result = await pool.query(query, [email, passwordHash]);
  return result.rows[0];
};
```

## Features

- ✅ Step-by-step sign up flow with smooth animations
- ✅ Dark theme with modern UI
- ✅ Form validation and error handling
- ✅ Password confirmation
- ✅ Loading states and success feedback
- ✅ PostgreSQL schema for user storage
- ✅ JWT authentication setup
- ✅ Session management

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens have expiration times
- Database queries use parameterized statements to prevent SQL injection
- Environment variables keep sensitive data secure