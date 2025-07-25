// Client-side database simulation
// Note: This is a mock implementation for frontend-only use

interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

class DatabaseClient {
  private config: DatabaseConfig;
  private users: User[] = []; // In-memory storage for demo

  constructor() {
    // Use hardcoded config for client-side demo
    this.config = {
      host: 'localhost',
      port: 5432,
      database: 'demo_database',
      username: 'demo_user',
      password: 'demo_password'
    };

    // Load existing users from localStorage if available
    const savedUsers = localStorage.getItem('demo_users');
    if (savedUsers) {
      try {
        this.users = JSON.parse(savedUsers);
      } catch (error) {
        console.warn('Failed to parse saved users:', error);
        this.users = [];
      }
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem('demo_users', JSON.stringify(this.users));
    } catch (error) {
      console.warn('Failed to save users to localStorage:', error);
    }
  }

  async connect() {
    console.log('🔗 Connected to demo database');
    return true;
  }

  async createUser(email: string, passwordHash: string): Promise<User> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.users.push(user);
    this.saveUsers();

    console.log('✅ User created:', { email, id: user.id });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('🔍 Finding user by email:', email, user ? 'Found' : 'Not found');
    return user || null;
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isValid = await comparePassword(password, user.password_hash);
    console.log('🔐 Validating credentials for:', email, isValid ? 'Valid' : 'Invalid');
    return isValid ? user : null;
  }

  // Debug method to view all users
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  // Debug method to clear all users
  async clearAllUsers(): Promise<void> {
    this.users = [];
    this.saveUsers();
    console.log('🗑️ All users cleared');
  }
}

export const db = new DatabaseClient();

// Password hashing utilities (simplified for demo)
export const hashPassword = async (password: string): Promise<string> => {
  // Simple hash simulation - in real app use bcrypt
  const timestamp = Date.now().toString();
  const hash = btoa(`${password}_salt_${timestamp}`);
  console.log('🔒 Password hashed');
  return hash;
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const decoded = atob(hash);
    const isValid = decoded.startsWith(password + '_salt_');
    console.log('🔓 Password comparison:', isValid ? 'Match' : 'No match');
    return isValid;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

// JWT utilities (simplified for demo)
export const generateToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  const token = btoa(JSON.stringify(payload));
  console.log('🎫 Token generated for user:', userId);
  return token;
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      console.warn('⚠️ Token expired');
      return null;
    }
    console.log('✅ Token verified for user:', payload.userId);
    return { userId: payload.userId };
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
};

// Debug utilities for development
export const debugUtils = {
  listUsers: () => db.getAllUsers(),
  clearUsers: () => db.clearAllUsers(),
  getStoredUsers: () => {
    const stored = localStorage.getItem('demo_users');
    return stored ? JSON.parse(stored) : [];
  }
};

// Make debug utils available globally for development
if (typeof window !== 'undefined') {
  (window as any).dbDebug = debugUtils;
  console.log('🛠️ Debug utilities available at window.dbDebug');
}