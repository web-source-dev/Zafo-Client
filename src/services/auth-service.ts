import axios, { AxiosError } from 'axios';

// API base URL from environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Error response interface
export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// User interface
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'organizer';
  createdAt?: string;
  updatedAt?: string;
}

// Register request interface
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin' | 'organizer';
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

// Update profile request interface
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

// Auth service class
class AuthService {
  private authHeader(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  /**
   * Register a new user
   * @param userData RegisterRequest
   * @returns Promise<AuthResponse>
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Registration failed',
        error: axiosError.response?.data?.error || axiosError.message
      };
    }
  }

  /**
   * Login user
   * @param credentials LoginRequest
   * @returns Promise<AuthResponse>
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed',
        error: axiosError.response?.data?.error || axiosError.message
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from localStorage
   * @returns User | null
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Get authentication token from localStorage
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verify if token is still valid
   * @returns Promise<boolean>
   */
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const response = await axios.get(
        `${API_URL}/auth/verify`, 
        this.authHeader(token)
      );
      
      // Update user data in localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data.success || false;
    } catch {
      // If token verification fails, clean up localStorage
      this.logout();
      return false;
    }
  }

  /**
   * Get user profile
   * @returns Promise<User | null>
   */
  async getProfile(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const response = await axios.get(
        `${API_URL}/auth/me`, 
        this.authHeader(token)
      );
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Update user profile
   * @param data UpdateProfileRequest
   * @returns Promise<AuthResponse>
   */
  async updateProfile(data: UpdateProfileRequest): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }
    
    try {
      const response = await axios.put(
        `${API_URL}/auth/me`, 
        data,
        this.authHeader(token)
      );
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Profile update failed',
        error: axiosError.response?.data?.error || axiosError.message
      };
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has admin role
   * @returns boolean
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'admin';
  }

  /**
   * Check if user has organizer role
   * @returns boolean
   */
  isOrganizer(): boolean {
    const user = this.getCurrentUser();
    return !!user && (user.role === 'organizer' || user.role === 'admin');
  }
}

// Export as singleton instance
export const authService = new AuthService();
export default authService;
