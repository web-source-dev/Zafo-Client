import api, { ApiResponse } from '../api/api';

// User data for admin management
export interface AdminUser extends User {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Base User interface (similar to auth-service)
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'organizer' | 'guest';
}

// Form data interface for user creation/update
export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  password?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  pendingApprovals: number;
}

// System status interface
export interface SystemStatus {
  api: boolean;
  database: boolean;
  authService: boolean;
  storageService: boolean;
}

// User management params
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// Enhanced search params interface with isActive property
export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

// Admin service class
class AdminService {
  /**
   * Get dashboard statistics
   * @returns Promise with dashboard stats
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get<DashboardStats>('/admin/stats');
  }

  /**
   * Get system status
   * @returns Promise with system status
   */
  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    return api.get<SystemStatus>('/admin/system-status');
  }

  /**
   * Get users list with pagination and filters
   * @param params Query parameters (page, limit, search, role, status)
   * @returns Promise with users list
   */
  async getUsers(params: UserQueryParams | UserSearchParams = {}): Promise<ApiResponse<{ users: AdminUser[], total: number, totalPages?: number }>> {
    const queryString = Object.entries(params)
      .filter(([value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return api.get<{ users: AdminUser[], total: number, totalPages?: number }>(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get a specific user by ID
   * @param userId User ID
   * @returns Promise with user data
   */
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return api.get<AdminUser>(`/admin/users/${userId}`);
  }

  /**
   * Create a new user (admin function)
   * @param userData User data
   * @returns Promise with created user
   */
  async createUser(userData: UserFormData & { password: string }): Promise<ApiResponse<AdminUser>> {
    return api.post<AdminUser>('/admin/users', userData);
  }

  /**
   * Update a user
   * @param userId User ID
   * @param userData User data to update
   * @returns Promise with updated user
   */
  async updateUser(userId: string, userData: Partial<UserFormData>): Promise<ApiResponse<AdminUser>> {
    return api.put<AdminUser>(`/admin/users/${userId}`, userData);
  }

  /**
   * Delete a user
   * @param userId User ID
   * @returns Promise with success status
   */
  async deleteUser(userId: string): Promise<ApiResponse> {
    return api.delete(`/admin/users/${userId}`);
  }

  /**
   * Change user password (admin function)
   * @param userId User ID
   * @param password New password
   * @returns Promise with success status
   */
  async changeUserPassword(userId: string, password: string): Promise<ApiResponse> {
    return api.put(`/admin/users/${userId}/password`, { password });
  }

  /**
   * Get recent activities/audit logs
   * @param params Query parameters (page, limit)
   * @returns Promise with activities list
   */
  async getActivities(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<unknown>> {
    const queryString = Object.entries(params)
      .filter(([value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return api.get(`/admin/activities${queryString ? `?${queryString}` : ''}`);
  }
}

// Export as singleton instance
const adminService = new AdminService();
export default adminService; 