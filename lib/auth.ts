import { db, hashPassword, comparePassword, generateToken } from './database';

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  };
  token?: string;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const { email, password, confirmPassword } = data;

    console.log('🚀 Starting sign-up process for:', email);

    // Validation
    if (!email || !password || !confirmPassword) {
      return { success: false, message: 'All fields are required' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (!email.includes('@') || !email.includes('.')) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Connect to database
    await db.connect();

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await db.createUser(email, passwordHash);

    // Generate authentication token
    const token = generateToken(user.id);

    console.log('✅ Sign-up successful for:', email);

    return {
      success: true,
      message: 'Account created successfully! Welcome aboard!',
      user: {
        id: user.id,
        email: user.email
      },
      token
    };

  } catch (error) {
    console.error('❌ Sign up error:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred during sign up. Please try again.' 
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('🔐 Starting sign-in process for:', email);

    // Connect to database
    await db.connect();

    const user = await db.validateCredentials(email, password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const token = generateToken(user.id);

    console.log('✅ Sign-in successful for:', email);

    return {
      success: true,
      message: 'Welcome back! Signed in successfully.',
      user: {
        id: user.id,
        email: user.email
      },
      token
    };

  } catch (error) {
    console.error('❌ Sign in error:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred during sign in. Please try again.' 
    };
  }
};

export const signOut = (): void => {
  try {
    localStorage.removeItem('auth_token');
    console.log('👋 User signed out successfully');
  } catch (error) {
    console.error('❌ Sign out error:', error);
  }
};

export const getCurrentUser = async (): Promise<{ id: string; email: string } | null> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      localStorage.removeItem('auth_token');
      return null;
    }

    // In a real app, you'd fetch the user from the database
    // For demo purposes, we'll return the user ID from the token
    return { id: payload.userId, email: 'demo@example.com' };

  } catch (error) {
    console.error('❌ Get current user error:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();

  } catch (error) {
    return false;
  }
};