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

// Organizer payment stats interface
export interface OrganizerPaymentStats {
  totalTickets: number;
  totalRevenue: number;
  platformFees: number;
  organizerPayments: number;
  pendingTransfers: number;
  completedTransfers: number;
  failedTransfers: number;
  totalSent: number;
  totalRemaining: number;
  hasStripeAccount: boolean;
  transferStatus: 'none' | 'available' | 'blocked' | 'no_stripe';
}

// Organizer interface with payment stats
export interface Organizer extends User {
  isActive: boolean;
  isPaymentBlocked: boolean;
  paymentBlockReason?: string;
  paymentBlockedAt?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  paymentStats: OrganizerPaymentStats;
}

// Organizer query params
export interface OrganizerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// Payment block request interface
export interface PaymentBlockRequest {
  isBlocked: boolean;
  reason?: string;
}

// Transfer result interface
export interface TransferResult {
  ticketId: string;
  status: string;
  transferId?: string;
  amount?: number;
  error?: string;
  code?: string;
  message?: string;
  reason?: string;
}

// Transfer response interface
export interface TransferResponse {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  totalAmount: string;
  results: TransferResult[];
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

  /**
   * Get all organizers with payment stats
   * @param params Query parameters (page, limit, search, status)
   * @returns Promise with organizers list
   */
  async getOrganizers(params: OrganizerQueryParams = {}): Promise<ApiResponse<{ organizers: Organizer[], total: number, page: number, pages: number }>> {
    const queryString = Object.entries(params)
      .filter(([value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return api.get<{ organizers: Organizer[], total: number, page: number, pages: number }>(`/admin/organizers${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get organizer payment stats
   * @param organizerId Organizer ID
   * @returns Promise with organizer stats
   */
  async getOrganizerStats(organizerId: string): Promise<ApiResponse<{ organizer: Organizer, stats: OrganizerPaymentStats & { recentTickets: unknown[] } }>> {
    return api.get<{ organizer: Organizer, stats: OrganizerPaymentStats & { recentTickets: unknown[] } }>(`/admin/organizers/${organizerId}/stats`);
  }

  /**
   * Block/unblock organizer payments
   * @param organizerId Organizer ID
   * @param data Payment block data
   * @returns Promise with success status
   */
  async toggleOrganizerPaymentBlock(organizerId: string, data: PaymentBlockRequest): Promise<ApiResponse<Organizer>> {
    return api.put<Organizer>(`/admin/organizers/${organizerId}/payment-block`, data);
  }

  /**
   * Manually transfer payment to organizer
   * @param organizerId Organizer ID
   * @returns Promise with transfer results
   */
  async transferToOrganizer(organizerId: string): Promise<ApiResponse<TransferResponse>> {
    return api.post<TransferResponse>(`/admin/organizers/${organizerId}/transfer`);
  }
}

// Export as singleton instance
const adminService = new AdminService();
export default adminService; 